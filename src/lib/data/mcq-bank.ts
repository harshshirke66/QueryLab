import { MCQQuestion } from '../types';

export interface MCQCategoryConfig {
  id: string;
  name: string;
  shortLabel: string;
  icon: string;
  description: string;
  badgeColor: string;
}

export const MCQ_CATEGORIES: MCQCategoryConfig[] = [
  {
    id: 'SQL_INTERNALS',
    name: 'SQL Execution & Query Optimization',
    shortLabel: 'SQL Internals',
    icon: '⚡',
    description: 'Execution lifecycle, index usage, join algorithms (Nested Loop, Hash, Merge), sargability, and cost plans.',
    badgeColor: 'border-lime-500/40 text-lime-400 bg-lime-950/20',
  },
  {
    id: 'PRODUCT_ANALYTICS',
    name: 'Product Analytics & Retention Curves',
    shortLabel: 'Product Analytics',
    icon: '📊',
    description: 'Cohort analysis, DAU/WAU/MAU stickiness, activation milestones, churn metrics, and customer LTV/CAC.',
    badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-950/20',
  },
  {
    id: 'AB_TESTING',
    name: 'A/B Testing & Experimentation',
    shortLabel: 'A/B Testing',
    icon: '🧪',
    description: 'P-values, statistical power, Type I & II errors, Sample Ratio Mismatch (SRM), MDE, and variance reduction.',
    badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-950/20',
  },
  {
    id: 'STATISTICS_PROBABILITY',
    name: 'Statistics & Probability for Analysts',
    shortLabel: 'Statistics',
    icon: '📈',
    description: 'Distributions, Central Limit Theorem, correlation vs causation, Simpson’s Paradox, and outlier handling.',
    badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-950/20',
  },
  {
    id: 'DATA_WAREHOUSING',
    name: 'Data Warehousing & Dimensional Modeling',
    shortLabel: 'Data Warehousing',
    icon: '🏛️',
    description: 'Star vs Snowflake schemas, Kimball fact/dimension tables, SCD Types 1/2/3, surrogate keys, and grain definition.',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
  },
  {
    id: 'BUSINESS_INTELLIGENCE',
    name: 'Metrics Design & Executive Dashboards',
    shortLabel: 'Metrics & BI',
    icon: '🎯',
    description: 'North Star metrics, leading vs lagging indicators, KPI hierarchy trees, and dashboard stakeholder communication.',
    badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-950/20',
  },
  {
    id: 'PYTHON_PANDAS',
    name: 'Python & Pandas Data Wrangling',
    shortLabel: 'Python & Pandas',
    icon: '🐍',
    description: 'Vectorization vs iterrows, groupby aggregations, merge vs join, datetime manipulation, and memory optimization.',
    badgeColor: 'border-sky-500/40 text-sky-400 bg-sky-950/20',
  },
  {
    id: 'ROOT_CAUSE_ANALYSIS',
    name: 'Root-Cause & Anomaly Decomposition',
    shortLabel: 'Root-Cause Diagnosis',
    icon: '🔍',
    description: '"Why did checkout conversion drop 12%?", cannibalization, platform mix shifts, and step-by-step diagnostic trees.',
    badgeColor: 'border-indigo-500/40 text-indigo-400 bg-indigo-950/20',
  },
];

export const INITIAL_MCQ_BANK: MCQQuestion[] = [
  // -------------------------------------------------------------
  // 1. SQL INTERNALS & OPTIMIZATION
  // -------------------------------------------------------------
  {
    id: 'mcq_sql_01',
    category: 'SQL_INTERNALS',
    categoryLabel: 'SQL Execution & Query Optimization',
    categoryIcon: '⚡',
    difficulty: 'MEDIUM',
    question: 'In PostgreSQL, why does wrapping an indexed column in a function like `WHERE DATE(created_at) = \'2026-03-01\'` cause a slow Sequential Scan instead of an Index Scan?',
    scenario: `-- Inefficient Query
SELECT user_id, amount 
FROM payments 
WHERE DATE(created_at) = '2026-03-01';`,
    options: [
      { id: 'A', text: 'PostgreSQL does not allow B-Tree indexes on timestamp columns under any circumstances.' },
      { id: 'B', text: 'Applying a function to an indexed column makes the predicate non-sargable, preventing the optimizer from traversing the B-Tree index bounds.' },
      { id: 'C', text: 'The DATE() function converts data to an in-memory temporary heap table before executing.' },
      { id: 'D', text: 'Index scans in PostgreSQL only work with equality operators on string VARCHAR columns.' },
    ],
    correctOptionId: 'B',
    explanation: {
      overview: 'Sargability (Search Argument Able) is the single most critical concept in SQL index optimization.',
      whyCorrect: 'When you apply a scalar function `DATE(created_at)` to an indexed column, PostgreSQL cannot look up values directly in the pre-sorted B-Tree without evaluating the function for every row. Rewriting to a range query `WHERE created_at >= \'2026-03-01\' AND created_at < \'2026-03-02\'` preserves sargability and uses the index.',
      whyOthersIncorrect: {
        A: 'B-Tree indexes are standard and widely used on TIMESTAMP and TIMESTAMPTZ columns in PostgreSQL.',
        B: 'This is the accurate technical reason.',
        C: 'PostgreSQL does not create heap tables for scalar functions in the WHERE clause.',
        D: 'Index scans work across all data types including timestamps, numbers, and UUIDs.',
      },
      interviewTip: 'Whenever asked how to optimize a slow date filter in an interview, immediately mention rewriting function calls into half-open interval ranges [start, end) to preserve sargability.',
    },
    tags: ['Sargability', 'B-Tree', 'PostgreSQL', 'Index Optimization'],
  },
  {
    id: 'mcq_sql_02',
    category: 'SQL_INTERNALS',
    categoryLabel: 'SQL Execution & Query Optimization',
    categoryIcon: '⚡',
    difficulty: 'HARD',
    question: 'Which join algorithm will the PostgreSQL query planner most likely select when joining a 50-row dimension table to a 50,000,000-row partitioned transaction table with an index on the foreign key?',
    options: [
      { id: 'A', text: 'Nested Loop Join with Index Scan' },
      { id: 'B', text: 'Merge Join without Sorting' },
      { id: 'C', text: 'Full Cartesian Cross Join' },
      { id: 'D', text: 'Broadcast Hash Aggregation Join' },
    ],
    correctOptionId: 'A',
    explanation: {
      overview: 'PostgreSQL evaluates three primary join algorithms: Nested Loop, Hash Join, and Merge Join.',
      whyCorrect: 'When the outer table is very small (50 rows) and the inner table has an index on the join key, the cost of scanning 50 rows and performing 50 fast B-Tree index probes is drastically lower ($O(M \\log N)$) than building an in-memory hash table of 50 million rows or sorting both datasets.',
      whyOthersIncorrect: {
        A: 'Correct. For tiny outer tables with indexed inner tables, Nested Loop with Index Probe is optimal.',
        B: 'Merge Join requires both sides to be sorted. Sorting 50 million rows would be extremely expensive in I/O.',
        C: 'Cartesian Cross Join is only chosen when there is no join condition (unintentional or test).',
        D: 'Broadcast is a distributed MPP engine concept (like Spark/Presto/Redshift), not native PostgreSQL single-node.',
      },
      interviewTip: 'Remember: Small + Indexed Large = Nested Loop. Medium + Medium Unsorted = Hash Join. Pre-sorted Large + Large = Merge Join.',
    },
    tags: ['Join Algorithms', 'Query Planner', 'Nested Loop', 'EXPLAIN ANALYZE'],
  },

  // -------------------------------------------------------------
  // 2. PRODUCT ANALYTICS & RETENTION
  // -------------------------------------------------------------
  {
    id: 'mcq_prod_01',
    category: 'PRODUCT_ANALYTICS',
    categoryLabel: 'Product Analytics & Retention Curves',
    categoryIcon: '📊',
    difficulty: 'MEDIUM',
    question: 'A SaaS product has a DAU of 150,000 and an MAU of 300,000. What is its DAU/MAU ratio, and what does this metric fundamentally measure?',
    options: [
      { id: 'A', text: '2.0; It measures how many new accounts are created per existing subscriber.' },
      { id: 'B', text: '50%; It measures user stickiness and engagement frequency—indicating an average active user engages 15 out of 30 days a month.' },
      { id: 'C', text: '33%; It measures month-over-month viral expansion coefficient.' },
      { id: 'D', text: '50%; It measures the net paid revenue conversion percentage.' },
    ],
    correctOptionId: 'B',
    explanation: {
      overview: 'The DAU/MAU ratio (popularized by Facebook/Meta) is the gold standard benchmark for product stickiness.',
      whyCorrect: '150,000 / 300,000 = 0.50 or 50%. A 50% DAU/MAU ratio means that on any given day, half of the monthly user base returns. It translates to an active user logging in ~15 days out of a 30-day month (world-class for social and communication products).',
      whyOthersIncorrect: {
        A: 'DAU/MAU cannot exceed 1.0 (100%) because DAU is a subset of monthly active users.',
        B: 'Correct calculation and correct product definition.',
        C: 'Viral expansion is measured by the K-factor ($K = \\text{invites} \\times \\text{conversion}$), not DAU/MAU.',
        D: 'Paid conversion is paid users divided by total free signups, unrelated to daily engagement.',
      },
      interviewTip: 'In product analytics rounds, cite typical benchmarks: >50% is elite (WhatsApp, Instagram), 20-30% is standard SaaS (Slack, Notion), <10% requires urgent retention interventions.',
    },
    tags: ['DAU/MAU', 'Stickiness', 'User Engagement', 'Metrics'],
  },
  {
    id: 'mcq_prod_02',
    category: 'PRODUCT_ANALYTICS',
    categoryLabel: 'Product Analytics & Retention Curves',
    categoryIcon: '📊',
    difficulty: 'HARD',
    question: 'When analyzing a cohort retention curve, you observe that after Day 28, the curve flattens into a horizontal parallel line at 18% through Day 180. What does this indicate about product health?',
    options: [
      { id: 'A', text: 'The product is experiencing catastrophic churn and will hit 0 users by Day 360.' },
      { id: 'B', text: 'The product has achieved Product-Market Fit (PMF) for a core 18% segment of users who retain indefinitely.' },
      { id: 'C', text: 'The tracking telemetry was corrupted on Day 28 and stopped recording events.' },
      { id: 'D', text: 'The acquisition channel is low-quality and all paid marketing spend should be halted immediately.' },
    ],
    correctOptionId: 'B',
    explanation: {
      overview: 'Brian Balfour and Casey Winters (Reforge) define retention flattening as the definitive empirical signature of Product-Market Fit.',
      whyCorrect: 'If a retention curve decays to zero, a product is a "leaky bucket" where no growth can be sustained. When the curve asymptotes and flattens horizontally (even at 15-20%), you have established a stable recurring core user base with virtually zero incremental churn beyond that threshold.',
      whyOthersIncorrect: {
        A: 'A horizontal curve means retention has stabilized, not that it is decaying to zero.',
        B: 'Correct. A flattening retention curve is the empirical hallmark of Product-Market Fit.',
        C: 'Flat retention is the expected healthy cohort trajectory, not telemetry failure.',
        D: 'Acquiring users into an asymptotic retention curve allows profitable compounding growth.',
      },
      interviewTip: 'Always sketch or describe retention curves with an asymptotic tail when interviewing at consumer or B2B SaaS companies.',
    },
    tags: ['Cohort Analysis', 'Product-Market Fit', 'Retention Curve', 'Churn'],
  },

  // -------------------------------------------------------------
  // 3. A/B TESTING & EXPERIMENTATION
  // -------------------------------------------------------------
  {
    id: 'mcq_ab_01',
    category: 'AB_TESTING',
    categoryLabel: 'A/B Testing & Experimentation',
    categoryIcon: '🧪',
    difficulty: 'HARD',
    question: 'In an A/B test with a planned 50/50 traffic split, you observe 52,400 users in Control and 47,600 users in Treatment. The Chi-Square test yields $p < 0.0001$. What should you do next?',
    options: [
      { id: 'A', text: 'Declare the winning variant based on the treatment conversion rate since statistical significance was reached.' },
      { id: 'B', text: 'Invalidate the experiment results immediately due to Sample Ratio Mismatch (SRM) and investigate instrumentation or redirection bugs.' },
      { id: 'C', text: 'Re-weight the treatment conversion rate by 1.10x to mathematically compensate for the missing 4,800 users.' },
      { id: 'D', text: 'Run the experiment for another 48 hours until the sample counts balance out.' },
    ],
    correctOptionId: 'B',
    explanation: {
      overview: 'Sample Ratio Mismatch (SRM) is a critical experimental hygiene check in top-tier experimentation platforms (Meta, Microsoft, Netflix).',
      whyCorrect: 'A statistically significant deviation from the expected 50/50 allocation ($p < 0.0001$) indicates that the assignment mechanism itself is fundamentally broken—for example, the Treatment variant may be crashing the browser before the telemetry tracking event fires. Any conversion metrics derived from an SRM experiment are completely invalid and untrustworthy.',
      whyOthersIncorrect: {
        A: 'Never evaluate metric results when an SRM is detected. It is a critical false-positive trap.',
        B: 'Correct. SRM requires immediate invalidation and root-cause engineering investigation.',
        C: 'Post-hoc mathematical re-weighting cannot fix survival or crash bias.',
        D: 'SRM is almost never solved by waiting; continuing to expose users to a broken variant causes user harm.',
      },
      interviewTip: 'Mentioning "SRM check before looking at metric p-values" immediately signals to an interviewer that you have real-world production experimentation experience.',
    },
    tags: ['Sample Ratio Mismatch', 'SRM', 'Hypothesis Testing', 'Data Quality'],
  },
  {
    id: 'mcq_ab_02',
    category: 'AB_TESTING',
    categoryLabel: 'A/B Testing & Experimentation',
    categoryIcon: '🧪',
    difficulty: 'MEDIUM',
    question: 'What is the risk of checking an A/B test’s p-value every single day and stopping the experiment as soon as $p < 0.05$ is observed?',
    options: [
      { id: 'A', text: 'It drastically inflates the False Positive (Type I Error) rate from 5% to 20-30% or higher due to optional stopping.' },
      { id: 'B', text: 'It causes the Minimum Detectable Effect (MDE) to decrease to zero.' },
      { id: 'C', text: 'It violates the Central Limit Theorem and invalidates normal approximations.' },
      { id: 'D', text: 'It converts the test into a non-parametric Bayesian estimation.' },
    ],
    correctOptionId: 'A',
    explanation: {
      overview: 'The "peeking problem" (repeated significance testing) is one of the most common statistical pitfalls in experimentation.',
      whyCorrect: 'Fixed-horizon hypothesis tests assume data is only evaluated once at the predetermined sample size. Continuous peeking tests multiple random fluctuations. If you test 10 times, the chance of observing at least one random $p < 0.05$ spike under the null hypothesis exceeds 30%.',
      whyOthersIncorrect: {
        A: 'Correct. Peeking without sequential corrections (e.g. mSPRT) severely inflates Type I errors.',
        B: 'MDE is determined by sample size and variance, not peeking frequency.',
        C: 'CLT still holds; the issue is multiple comparisons across time.',
        D: 'Bayesian tests are naturally immune to optional stopping, but frequentist tests are broken by it.',
      },
      interviewTip: 'Explain how sequential testing frameworks (like Wald’s SPRT or Spotify/Optimizely sequential testing) allow safe continuous monitoring.',
    },
    tags: ['Type I Error', 'Peeking Problem', 'Sequential Testing', 'Statistical Power'],
  },

  // -------------------------------------------------------------
  // 4. STATISTICS & PROBABILITY
  // -------------------------------------------------------------
  {
    id: 'mcq_stat_01',
    category: 'STATISTICS_PROBABILITY',
    categoryLabel: 'Statistics & Probability for Analysts',
    categoryIcon: '📈',
    difficulty: 'HARD',
    question: 'Treatment A has a higher conversion rate than Treatment B on Desktop (20% vs 18%) AND on Mobile (10% vs 8%). Yet overall, Treatment B has a higher combined conversion rate than Treatment A. What statistical paradox is occurring?',
    options: [
      { id: 'A', text: 'Berkson\'s Paradox' },
      { id: 'B', text: 'Simpson\'s Paradox' },
      { id: 'C', text: 'Monty Hall Dilemma' },
      { id: 'D', text: 'Survivorship Bias' },
    ],
    correctOptionId: 'B',
    explanation: {
      overview: 'Simpson\'s Paradox occurs when a trend appears in different groups of data but disappears or reverses when these groups are combined.',
      whyCorrect: 'Simpson\'s Paradox is caused by a confounding variable (here, the platform traffic distribution). If Treatment B received 90% of its traffic from the high-converting Desktop channel while Treatment A received 90% from low-converting Mobile, the aggregate average will flip in favor of Treatment B despite Treatment A winning within every sub-segment.',
      whyOthersIncorrect: {
        A: 'Berkson\'s paradox occurs in observational studies with selection conditioning on two independent events.',
        B: 'Correct. The reversal of subgroup rankings upon aggregation is Simpson\'s Paradox.',
        C: 'Monty Hall is a conditional probability puzzle regarding switching doors.',
        D: 'Survivorship bias is selecting only successful entities that survived a filter.',
      },
      interviewTip: 'In case studies, whenever aggregated data contradicts segmented breakdown, always cite Simpson\'s Paradox and check for disproportionate cohort mix shifts.',
    },
    tags: ['Simpson\'s Paradox', 'Confounding Variables', 'Probability', 'Segmentation'],
  },

  // -------------------------------------------------------------
  // 5. DATA WAREHOUSING & MODELING
  // -------------------------------------------------------------
  {
    id: 'mcq_dw_01',
    category: 'DATA_WAREHOUSING',
    categoryLabel: 'Data Warehousing & Dimensional Modeling',
    categoryIcon: '🏛️',
    difficulty: 'MEDIUM',
    question: 'In Kimball Dimensional Modeling, a customer moves from "New York" to "San Francisco". You need to preserve historical attribution for past orders in NY while routing new orders to SF. Which Slowly Changing Dimension (SCD) technique must be applied?',
    options: [
      { id: 'A', text: 'SCD Type 1 (In-place overwrite of the city column)' },
      { id: 'B', text: 'SCD Type 2 (Insert a new row with new surrogate key, valid_from, valid_to, and is_current flags)' },
      { id: 'C', text: 'SCD Type 0 (Make the dimension immutable and reject all address changes)' },
      { id: 'D', text: 'SCD Type 4 (Store all changes in a NoSQL key-value store)' },
    ],
    correctOptionId: 'B',
    explanation: {
      overview: 'SCD Type 2 is the industry standard mechanism for historical tracking in data warehouses.',
      whyCorrect: 'SCD Type 2 preserves historical context by creating a new version record for the entity. Past orders retain foreign key references to the original surrogate key (associated with NY), while new transactions link to the new active surrogate key (associated with SF).',
      whyOthersIncorrect: {
        A: 'SCD Type 1 overwrites old values, destroying historical reporting for past transactions.',
        B: 'Correct. SCD Type 2 creates a new row with versioning dates to preserve history.',
        C: 'SCD Type 0 treats attributes as immutable (e.g. original date of birth).',
        D: 'SCD Type 4 uses historical mini-dimensions, not NoSQL.',
      },
      interviewTip: 'Always emphasize surrogate keys: natural keys (e.g. user_id) remain the same across versions, but surrogate keys (e.g. dim_customer_key) change with each SCD Type 2 record.',
    },
    tags: ['SCD Type 2', 'Kimball', 'Dimensional Modeling', 'Surrogate Keys'],
  },

  // -------------------------------------------------------------
  // 6. BUSINESS INTELLIGENCE & METRICS
  // -------------------------------------------------------------
  {
    id: 'mcq_bi_01',
    category: 'BUSINESS_INTELLIGENCE',
    categoryLabel: 'Metrics Design & Executive Dashboards',
    categoryIcon: '🎯',
    difficulty: 'MEDIUM',
    question: 'Why do data leaders prefer "Days with >= 3 Active Minutes" (a leading indicator) over "Quarterly Churn Rate" (a lagging indicator) when optimizing a customer success team’s operations?',
    options: [
      { id: 'A', text: 'Lagging indicators cannot be computed using SQL aggregation functions.' },
      { id: 'B', text: 'Leading indicators provide actionable, timely signals that teams can intervene on before the undesirable outcome (churn) actually materializes.' },
      { id: 'C', text: 'Leading indicators always have zero standard deviation and no noise.' },
      { id: 'D', text: 'Executive boards only review leading indicators during earnings reports.' },
    ],
    correctOptionId: 'B',
    explanation: {
      overview: 'Leading indicators predict future outcomes; lagging indicators measure what has already happened.',
      whyCorrect: 'By the time a quarterly churn rate reports that a customer canceled, it is too late to intervene. A leading behavioral indicator (e.g. dropped weekly active minutes) triggers early warning alerts 45 days prior to cancellation, giving customer success teams time to take action.',
      whyOthersIncorrect: {
        A: 'Lagging indicators are easily computed with SQL.',
        B: 'Correct. Leading indicators give teams input leverage before the lagging outcome occurs.',
        C: 'Leading indicators often have higher variance and require noise filtering.',
        D: 'Boards typically care deeply about lagging outputs (GAAP Revenue, Net Churn).',
      },
      interviewTip: 'Structure metrics questions using an Input / Output hierarchy: Operational Inputs (Leading) -> Proxy Milestones -> Business Outputs (Lagging).',
    },
    tags: ['Metrics Design', 'Leading vs Lagging', 'KPIs', 'Stakeholder Management'],
  },

  // -------------------------------------------------------------
  // 7. PYTHON & PANDAS
  // -------------------------------------------------------------
  {
    id: 'mcq_py_01',
    category: 'PYTHON_PANDAS',
    categoryLabel: 'Python & Pandas Data Wrangling',
    categoryIcon: '🐍',
    difficulty: 'MEDIUM',
    question: 'You have a 5-million-row Pandas DataFrame `df`. Which approach calculates `df[\'discounted\'] = df[\'price\'] * (1 - df[\'discount\'])` with the highest execution speed and lowest memory overhead?',
    scenario: `# Option Comparisons
# 1. df.iterrows()
# 2. df.apply(lambda row: ...)
# 3. df['price'] * (1 - df['discount'])
# 4. [row[1] * ... for row in df.itertuples()]`,
    options: [
      { id: 'A', text: 'for index, row in df.iterrows(): row[\'discounted\'] = ...' },
      { id: 'B', text: 'Vectorized NumPy/Pandas columnar expression: df[\'price\'] * (1 - df[\'discount\'])' },
      { id: 'C', text: 'df.apply(lambda r: r[\'price\'] * (1 - r[\'discount\']), axis=1)' },
      { id: 'D', text: 'df.to_dict(\'records\') passed into a recursive Python function' },
    ],
    correctOptionId: 'B',
    explanation: {
      overview: 'Vectorization leverages compiled C SIMD instructions under the hood in NumPy and Pandas.',
      whyCorrect: 'Vectorized columnar operations run directly in optimized C/C++ memory buffers without Python object overhead or GIL locking. On 5M rows, vectorization takes ~15ms, whereas `df.apply(axis=1)` takes ~12 seconds and `iterrows()` takes ~120 seconds (800x slower).',
      whyOthersIncorrect: {
        A: '`iterrows()` is notoriously the slowest possible operation in Pandas because it packs each row into a new Series object.',
        B: 'Correct. Columnar vectorization is orders of magnitude faster.',
        C: '`apply(axis=1)` is simply a slow Python for-loop with heavy overhead.',
        D: 'Converting 5M rows to Python dicts will exhaust memory and trigger massive Garbage Collection overhead.',
      },
      interviewTip: 'When asked how to speed up Pandas pipelines, rank in order: 1. Vectorization, 2. NumPy arrays, 3. itertuples(), 4. Avoid apply/iterrows.',
    },
    tags: ['Vectorization', 'Pandas Performance', 'Memory Optimization', 'Python'],
  },

  // -------------------------------------------------------------
  // 8. ROOT-CAUSE DIAGNOSIS
  // -------------------------------------------------------------
  {
    id: 'mcq_rca_01',
    category: 'ROOT_CAUSE_ANALYSIS',
    categoryLabel: 'Root-Cause & Anomaly Decomposition',
    categoryIcon: '🔍',
    difficulty: 'HARD',
    question: 'A ride-hailing company notes that overall driver ride acceptance rate dropped from 82% to 74% week-over-week. What is the very first diagnostic decomposition you should perform before blaming driver behavior?',
    options: [
      { id: 'A', text: 'Survey 5,000 drivers asking why they are rejecting more rides.' },
      { id: 'B', text: 'Segment the metric by City/Region and Channel/Product to isolate whether it is a localized outage or an aggregate mix shift.' },
      { id: 'C', text: 'Immediately increase driver surge bonuses across all markets.' },
      { id: 'D', text: 'Rewrite the data pipeline queries in PySpark to verify calculation speed.' },
    ],
    correctOptionId: 'B',
    explanation: {
      overview: 'Decomposition trees are the core framework for analytical problem-solving in top-tier tech firms.',
      whyCorrect: 'Before leaping to behavioral or business conclusions, an analyst must rule out data/pipeline errors and decompose the top-level metric across its primary structural dimensions (Geo, Device, Rider tier, Product). A new market launch (e.g. expanding into a suburban low-density city with naturally low acceptance) often pulls down the global weighted average without any change in existing core markets.',
      whyOthersIncorrect: {
        A: 'Surveys are slow, subjective, and premature before identifying where the drop occurred.',
        B: 'Correct. Systematic dimensional decomposition isolates the epicenter of the anomaly.',
        C: 'Increasing spend without diagnosis burns capital and could worsen supply imbalances.',
        D: 'Execution speed has nothing to do with aggregate metric values.',
      },
      interviewTip: 'In product sense / diagnostic interviews, always follow: 1. Clarify & Validate (Data check), 2. Time & Trend (Sudden vs Gradual), 3. Dimensional Decomposition (Geo, Platform, Segment), 4. External vs Internal factors.',
    },
    tags: ['Root-Cause Analysis', 'Metric Trees', 'Anomaly Detection', 'Product Sense'],
  },
];

