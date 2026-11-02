import { PGlite } from '@electric-sql/pglite';
import { QueryExecutionResult, ValidationResult } from './types';

// Helper to normalize objects for comparison
function normalizeValue(val: any): any {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') {
    // Round floats to 4 decimal places for floating-point tolerance
    return Math.round(val * 10000) / 10000;
  }
  if (val instanceof Date) {
    return val.toISOString().split('T')[0];
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    // If it's an ISO timestamp that is midnight, normalize to YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}(T00:00:00(\.000)?Z?)?$/.test(trimmed)) {
      return trimmed.slice(0, 10);
    }
    // Check if numeric string
    const num = Number(trimmed);
    if (!isNaN(num) && trimmed !== '' && !trimmed.includes('-') && !trimmed.includes(':')) {
      return Math.round(num * 10000) / 10000;
    }
    return trimmed;
  }
  return String(val);
}

function normalizeRow(row: Record<string, any>): Record<string, any> {
  const normalized: Record<string, any> = {};
  for (const [key, val] of Object.entries(row)) {
    normalized[key.toLowerCase()] = normalizeValue(val);
  }
  return normalized;
}

export async function executeUserQuery(
  schemaSql: string,
  seedSql: string,
  userSql: string,
  timeoutMs: number = 8000
): Promise<QueryExecutionResult> {
  const startTime = performance.now();
  let db: PGlite | null = null;

  try {
    // Check for empty query
    const trimmedQuery = userSql.trim();
    if (!trimmedQuery) {
      return {
        success: false,
        errorMessage: 'Query is empty. Please enter a valid SQL query.',
        executionTimeMs: 0,
      };
    }

    // Guard against dangerous destructive commands
    const lower = trimmedQuery.toLowerCase();
    if (lower.includes('drop database') || lower.includes('truncate pg_') || lower.includes('alter system')) {
      return {
        success: false,
        errorMessage: 'System modification statements are prohibited in the sandboxed workspace.',
        executionTimeMs: 0,
      };
    }

    // Initialize fresh in-memory isolated PostgreSQL database
    db = new PGlite();
    await db.waitReady;

    // Seed the challenge tables
    if (schemaSql) {
      await db.exec(schemaSql);
    }
    if (seedSql) {
      await db.exec(seedSql);
    }

    // Execute user query with timeout race
    const queryPromise = db.query(trimmedQuery);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Query execution timed out after ${timeoutMs}ms.`)), timeoutMs)
    );

    const result = (await Promise.race([queryPromise, timeoutPromise])) as any;
    const executionTimeMs = Math.round((performance.now() - startTime) * 10) / 10;

    const rows = result.rows || [];
    const fields = result.fields ? result.fields.map((f: any) => f.name) : Object.keys(rows[0] || {});

    return {
      success: true,
      rows,
      fields,
      rowCount: rows.length,
      executionTimeMs,
    };
  } catch (error: any) {
    const executionTimeMs = Math.round((performance.now() - startTime) * 10) / 10;
    return {
      success: false,
      errorMessage: error.message || 'An error occurred during SQL execution.',
      executionTimeMs,
    };
  } finally {
    if (db) {
      try {
        await db.close();
      } catch {
        // Ignore close errors
      }
    }
  }
}

export async function validateUserSubmission(
  schemaSql: string,
  seedSql: string,
  userSql: string,
  expectedOutputJson: string
): Promise<ValidationResult> {
  const execResult = await executeUserQuery(schemaSql, seedSql, userSql);

  if (!execResult.success || !execResult.rows) {
    return {
      passed: false,
      executionTimeMs: execResult.executionTimeMs,
      errorMessage: execResult.errorMessage || 'Execution failed',
      userRows: [],
      expectedRows: [],
      mismatchReason: execResult.errorMessage,
    };
  }

  let expectedRows: Record<string, any>[] = [];
  try {
    expectedRows = JSON.parse(expectedOutputJson);
  } catch {
    expectedRows = [];
  }

  const userRows = execResult.rows;
  const userFields = execResult.fields || [];
  const expectedFields = Object.keys(expectedRows[0] || {});

  // 1. Check Row Count
  if (userRows.length !== expectedRows.length) {
    return {
      passed: false,
      executionTimeMs: execResult.executionTimeMs,
      userRows,
      expectedRows,
      fields: userFields,
      expectedFields,
      mismatchReason: `Row count mismatch: Your query returned ${userRows.length} row(s), but the expected solution has ${expectedRows.length} row(s).`,
      diffSummary: `Expected ${expectedRows.length} rows, received ${userRows.length} rows.`,
    };
  }

  // 2. Check Column Names (case-insensitive)
  const normUserFields = userFields.map(f => f.toLowerCase());
  const normExpectedFields = expectedFields.map(f => f.toLowerCase());

  for (const expField of normExpectedFields) {
    if (!normUserFields.includes(expField)) {
      return {
        passed: false,
        executionTimeMs: execResult.executionTimeMs,
        userRows,
        expectedRows,
        fields: userFields,
        expectedFields,
        mismatchReason: `Missing expected column: "${expField}". Your columns: [${userFields.join(', ')}].`,
        diffSummary: `Expected column "${expField}" not found in output.`,
      };
    }
  }

  // 3. Compare Row Content
  for (let i = 0; i < expectedRows.length; i++) {
    const expRowNorm = normalizeRow(expectedRows[i]);
    const userRowNorm = normalizeRow(userRows[i]);

    for (const expCol of normExpectedFields) {
      const expVal = expRowNorm[expCol];
      const userVal = userRowNorm[expCol];

      if (expVal !== userVal) {
        return {
          passed: false,
          executionTimeMs: execResult.executionTimeMs,
          userRows,
          expectedRows,
          fields: userFields,
          expectedFields,
          mismatchReason: `Value mismatch at row ${i + 1} for column "${expCol}": expected "${expVal}", received "${userVal}".`,
          diffSummary: `Row ${i + 1}, column "${expCol}": expected "${expVal}", but got "${userVal}".`,
        };
      }
    }
  }

  // All checks passed!
  return {
    passed: true,
    executionTimeMs: execResult.executionTimeMs,
    userRows,
    expectedRows,
    fields: userFields,
    expectedFields,
    diffSummary: 'All rows and columns match expected output perfectly!',
  };
}

export async function explainUserQuery(
  schemaSql: string,
  seedSql: string,
  userSql: string
): Promise<{ success: boolean; plan?: string; errorMessage?: string }> {
  let db: PGlite | null = null;
  try {
    db = new PGlite();
    await db.waitReady;
    if (schemaSql) await db.exec(schemaSql);
    if (seedSql) await db.exec(seedSql);

    const explainResult = await db.query(`EXPLAIN (VERBOSE, COSTS) ${userSql}`);
    const plan = explainResult.rows.map((r: any) => Object.values(r)[0]).join('\n');

    return { success: true, plan };
  } catch (error: any) {
    return { success: false, errorMessage: error.message };
  } finally {
    if (db) {
      try {
        await db.close();
      } catch {}
    }
  }
}

