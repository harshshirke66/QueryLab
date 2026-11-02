import { PrismaClient } from '@prisma/client';
import { hashPassword } from './auth';
import { COMPANIES, CONCEPTS, QUESTIONS, ACHIEVEMENTS } from './data/mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding QueryLab database on Neon PostgreSQL...');

  // 1. Seed Demo Users
  const candidateHash = hashPassword('candidate123');
  const adminHash = hashPassword('admin123');

  await prisma.user.upsert({
    where: { email: 'candidate@querylab.dev' },
    update: {},
    create: {
      id: 'user_candidate_demo',
      email: 'candidate@querylab.dev',
      name: 'Alex Rivera',
      role: 'CANDIDATE',
      targetRole: 'Data Analyst',
      xp: 850,
      passwordHash: candidateHash,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@querylab.dev' },
    update: {},
    create: {
      id: 'user_admin_demo',
      email: 'admin@querylab.dev',
      name: 'Sarah Chen (Admin)',
      role: 'ADMIN',
      targetRole: 'Lead Interview Architect',
      xp: 3200,
      passwordHash: adminHash,
    },
  });

  // 2. Seed Companies
  for (const co of COMPANIES) {
    await prisma.company.upsert({
      where: { slug: co.slug },
      update: {
        description: co.description,
        interviewFocus: co.interviewFocus,
      },
      create: {
        id: co.id,
        name: co.name,
        slug: co.slug,
        industry: co.industry,
        description: co.description,
        interviewFocus: co.interviewFocus,
      },
    });
  }

  // 3. Seed Concepts
  for (const c of CONCEPTS) {
    await prisma.concept.upsert({
      where: { slug: c.slug },
      update: {
        description: c.description,
        learningObjectives: c.learningObjectives,
        cheatSheet: c.cheatSheet,
      },
      create: {
        id: c.id,
        track: c.track,
        title: c.title,
        slug: c.slug,
        order: c.order,
        description: c.description,
        learningObjectives: c.learningObjectives,
        cheatSheet: c.cheatSheet,
      },
    });
  }

  // 4. Seed Questions
  for (const q of QUESTIONS) {
    await prisma.question.upsert({
      where: { slug: q.slug },
      update: {
        title: q.title,
        difficulty: q.difficulty,
        problemStatement: q.problemStatement,
        schemaSql: q.schemaSql,
        seedSql: q.seedSql,
        expectedOutputJson: q.expectedOutputJson,
        solutionSql: q.solutionSql,
        explanation: q.explanation,
        alternativeSql: q.alternativeSql,
        hints: q.hints,
        sourceUrl: q.sourceUrl,
        sourceType: q.sourceType,
      },
      create: {
        id: q.id,
        slug: q.slug,
        title: q.title,
        difficulty: q.difficulty,
        category: q.category,
        roleTarget: q.roleTarget,
        problemStatement: q.problemStatement,
        schemaSql: q.schemaSql,
        seedSql: q.seedSql,
        expectedOutputJson: q.expectedOutputJson,
        solutionSql: q.solutionSql,
        explanation: q.explanation,
        alternativeSql: q.alternativeSql,
        hints: q.hints,
        verificationStatus: q.verificationStatus,
        sourceUrl: q.sourceUrl,
        sourceType: q.sourceType,
        sourceNotes: q.sourceNotes,
        companyId: q.companyId,
        primaryConceptId: q.primaryConceptId,
        acceptanceRate: q.acceptanceRate,
        totalAttempts: q.totalAttempts,
        totalSolved: q.totalSolved,
      },
    });
  }

  console.log('QueryLab database successfully seeded with authentic interview datasets!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
