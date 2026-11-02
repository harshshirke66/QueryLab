function normalizeText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

export function calculateQuestionSimilarity(
  titleA: string,
  titleB: string,
  statementA: string,
  statementB: string
): {
  titleScore: number;
  statementScore: number;
  totalScore: number;
  isDuplicate: boolean;
} {
  const wordsTitleA = new Set(normalizeText(titleA));
  const wordsTitleB = new Set(normalizeText(titleB));

  const wordsStmtA = new Set(normalizeText(statementA || ''));
  const wordsStmtB = new Set(normalizeText(statementB || ''));

  // Jaccard similarity for titles
  const titleIntersection = new Set([...wordsTitleA].filter(x => wordsTitleB.has(x)));
  const titleUnion = new Set([...wordsTitleA, ...wordsTitleB]);
  const titleScore = titleUnion.size > 0 ? titleIntersection.size / titleUnion.size : 0;

  // Jaccard similarity for problem statements
  const stmtIntersection = new Set([...wordsStmtA].filter(x => wordsStmtB.has(x)));
  const stmtUnion = new Set([...wordsStmtA, ...wordsStmtB]);
  const statementScore = stmtUnion.size > 0 ? stmtIntersection.size / stmtUnion.size : 0;

  // Weighted total score
  const totalScore = Math.round((titleScore * 0.4 + statementScore * 0.6) * 100) / 100;
  const isDuplicate = totalScore >= 0.70;

  return { titleScore, statementScore, totalScore, isDuplicate };
}
