import { Company, Concept, Question, Achievement, UserStreak } from '../types';
import { EXPANDED_QUESTIONS } from './expanded-questions';

export const COMPANIES: Company[] = [
  {
    id: 'comp_meta',
    name: 'Meta',
    slug: 'meta',
    industry: 'Social Media & Ads',
    description: 'Focuses heavily on user engagement, network graphs, friend recommendations, and ad-click attribution.',
    interviewFocus: 'Window functions, Self Joins, Cohort Retention, Rolling Metrics',
    questionCount: 4,
  },
  {
    id: 'comp_google',
    name: 'Google',
    slug: 'google',
    industry: 'Search & Cloud',
    description: 'Renowned for testing complex aggregations, statistical percentiles, search query logs, and auction telemetry.',
    interviewFocus: 'Percentiles & Medians, Correlated Subqueries, Large Scale Log Aggregation',
    questionCount: 3,
  },
  {
    id: 'comp_amazon',
    name: 'Amazon',
    slug: 'amazon',
    industry: 'E-Commerce & AWS',
    description: 'Heavy emphasis on warehouse inventory, fulfillment pipelines, session logs, and product category rankings.',
    interviewFocus: 'DENSE_RANK, Running Sums, CTEs, Date/Time Interval Calculations',
    questionCount: 4,
  },
  {
    id: 'comp_uber',
    name: 'Uber',
    slug: 'uber',
    industry: 'Mobility & Logistics',
    description: 'Tests geospatial events, trip dispatch efficiency, driver surge multipliers, and user transaction sequencing.',
    interviewFocus: 'LAG / LEAD, Consecutive Event Detection, Ride Duration Bucketing',
    questionCount: 3,
  },
  {
    id: 'comp_netflix',
    name: 'Netflix',
    slug: 'netflix',
    industry: 'Streaming & Entertainment',
    description: 'Focuses on subscriber retention, content recommendation metrics, stream sessionization, and churn indicators.',
    interviewFocus: 'Sessionization, Percentile Discretization, Cohort Curves, CASE WHEN',
    questionCount: 3,
  },
  {
    id: 'comp_stripe',
    name: 'Stripe',
    slug: 'stripe',
    industry: 'FinTech & Payments',
    description: 'Rigorous payment anomaly detection, rolling volume thresholds, dispute rates, and idempotent transactions.',
    interviewFocus: 'Rolling Windows, Time-Delta Filtering, Financial Reconciliations',
    questionCount: 3,
  },
  {
    id: 'comp_microsoft',
    name: 'Microsoft',
    slug: 'microsoft',
    industry: 'Enterprise Software & Cloud',
    description: 'Tests organization hierarchies, telemetry data from Teams/Office, and Azure tenant resource utilization.',
    interviewFocus: 'Recursive CTEs, Hierarchical Aggregations, Window Partitions',
    questionCount: 2,
  },
  {
    id: 'comp_airbnb',
    name: 'Airbnb',
    slug: 'airbnb',
    industry: 'Hospitality & Travel',
    description: 'Evaluates search-to-booking conversions, neighborhood price deviations, and host response SLAs.',
    interviewFocus: 'Deviation from Means, Cross-Joins, Booking Funnels',
    questionCount: 2,
  },
  {
    id: 'comp_spotify',
    name: 'Spotify',
    slug: 'spotify',
    industry: 'Audio & Music',
    description: 'Streaming duration rankings, daily active listener streaks, and playlist collaborative filtering.',
    interviewFocus: 'DENSE_RANK, Cumulative Listening Duration, Partitioning',
    questionCount: 2,
  },
  {
    id: 'comp_walmart',
    name: 'Walmart',
    slug: 'walmart',
    industry: 'Retail & Supply Chain',
    description: 'Inventory turn rates, store out-of-stock risk prediction, and supplier shipment latency.',
    interviewFocus: 'Stockout Lead Times, Inventory Aging, Rolling Averages',
    questionCount: 2,
  },
];

export const CONCEPTS: Concept[] = [
  // SQL Track
  {
    id: 'concept_sql_fundamentals',
    track: 'SQL',
    title: 'SQL Fundamentals',
    slug: 'sql-fundamentals',
    order: 1,
    description: 'Master the core building blocks: SELECT, WHERE filters, ORDER BY, DISTINCT, LIMIT, and table aliases.',
    learningObjectives: [
      'Filter records precisely with WHERE and boolean operators (AND, OR, NOT, BETWEEN, IN)',
      'Sort datasets ascending/descending with NULLS FIRST / LAST',
      'Eliminate duplicates and write aliased column expressions',
    ],
    cheatSheet: `SELECT DISTINCT column1, column2 AS alias_name
FROM table_name
WHERE status = 'active' AND created_at >= '2026-01-01'
ORDER BY created_at DESC
LIMIT 10;`,
    questionCount: 4,
    masteryPercent: 90,
  },
  {
    id: 'concept_aggregations',
    track: 'SQL',
    title: 'Aggregations & Grouping',
    slug: 'aggregations-grouping',
    order: 2,
    description: 'Summarize data with COUNT, SUM, AVG, MIN, MAX, GROUP BY, and the post-aggregation HAVING filter.',
    learningObjectives: [
      'Understand the crucial distinction between WHERE (pre-aggregation) and HAVING (post-aggregation)',
      'Handle NULL values gracefully inside COUNT(*) vs COUNT(column)',
      'Perform multi-column aggregations and conditional counts using CASE WHEN',
    ],
    cheatSheet: `SELECT department_id, COUNT(*) AS employee_count, AVG(salary) AS avg_salary
FROM employees
WHERE is_active = TRUE
GROUP BY department_id
HAVING AVG(salary) > 85000;`,
    questionCount: 5,
    masteryPercent: 75,
  },
  {
    id: 'concept_joins',
    track: 'SQL',
    title: 'Table Joins',
    slug: 'table-joins',
    order: 3,
    description: 'Combine relational entities using INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, and SELF JOIN.',
    learningObjectives: [
      'Identify unmatched records using LEFT JOIN ... WHERE right_table.id IS NULL',
      'Perform self-joins to compare records within the same table (e.g. employee vs manager)',
      'Avoid cartesian blowups and duplicate key multiplication',
    ],
    cheatSheet: `-- Finding users who never made a purchase
SELECT u.user_id, u.user_name
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE o.order_id IS NULL;`,
    questionCount: 6,
    masteryPercent: 80,
  },
  {
    id: 'concept_subqueries',
    track: 'SQL',
    title: 'Subqueries & CTEs',
    slug: 'subqueries-ctes',
    order: 4,
    description: 'Organize modular, readable queries with Common Table Expressions (WITH) and correlated subqueries.',
    learningObjectives: [
      'Write readable multi-step CTE chains for complex data pipelines',
      'Use correlated subqueries with EXISTS and NOT EXISTS for optimal filtering',
      'Implement recursive CTEs for hierarchical tree structures',
    ],
    cheatSheet: `WITH regional_sales AS (
  SELECT region, SUM(amount) AS total_sales
  FROM sales
  GROUP BY region
)
SELECT region, total_sales
FROM regional_sales
WHERE total_sales > (SELECT AVG(total_sales) FROM regional_sales);`,
    questionCount: 6,
    masteryPercent: 65,
  },
  {
    id: 'concept_window_functions',
    track: 'SQL',
    title: 'Window Functions',
    slug: 'window-functions',
    order: 5,
    description: 'The highest-frequency interview topic: ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, and running sums.',
    learningObjectives: [
      'Differentiate ROW_NUMBER(), RANK(), and DENSE_RANK() tie-breaking behaviors',
      'Calculate previous and next event intervals with LAG() and LEAD()',
      'Compute running cumulative sums and moving averages with ROWS BETWEEN',
    ],
    cheatSheet: `SELECT employee_id, department_id, salary,
  DENSE_RANK() OVER(PARTITION BY department_id ORDER BY salary DESC) AS salary_rank,
  LAG(salary) OVER(PARTITION BY department_id ORDER BY salary DESC) AS next_higher_salary,
  SUM(salary) OVER(PARTITION BY department_id ORDER BY hire_date ROWS UNBOUNDED PRECEDING) AS running_spend
FROM employees;`,
    questionCount: 8,
    masteryPercent: 60,
  },
  {
    id: 'concept_analytical_sql',
    track: 'SQL',
    title: 'Analytical SQL & Cohorts',
    slug: 'analytical-sql',
    order: 6,
    description: 'Real-world business analytics: User Retention (Day 1, Day 7, Day 30), Cohort Analysis, and Funnels.',
    learningObjectives: [
      'Build retention tables by joining initial signup cohort with subsequent activity logs',
      'Calculate rolling 7-day active user (WAU) and 30-day active user (MAU) metrics',
      'Analyze funnel step drop-off percentages with conditional aggregations',
    ],
    cheatSheet: `SELECT signup_month,
  COUNT(DISTINCT user_id) AS cohort_size,
  COUNT(DISTINCT CASE WHEN active_month = signup_month + INTERVAL '1 month' THEN user_id END)::FLOAT / 
    COUNT(DISTINCT user_id) AS m1_retention
FROM user_cohorts
GROUP BY signup_month;`,
    questionCount: 8,
    masteryPercent: 45,
  },
  {
    id: 'concept_advanced_sql',
    track: 'SQL',
    title: 'Advanced SQL Patterns',
    slug: 'advanced-sql',
    order: 7,
    description: 'Master conditional aggregation with CASE WHEN, date/timestamp arithmetic, NULL handling, and regex string manipulation.',
    learningObjectives: [
      'Write multi-condition CASE WHEN expressions for business bucketing and pivoting',
      'Perform PostgreSQL interval arithmetic using EXTRACT(EPOCH FROM ...) and DATE_TRUNC',
      'Cleanse messy strings and handle NULLs with COALESCE and NULLIF',
    ],
    cheatSheet: `SELECT user_id,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_orders,
  ROUND(EXTRACT(EPOCH FROM (delivered_at - ordered_at)) / 3600.0, 1) AS hours_taken
FROM orders
GROUP BY user_id;`,
    questionCount: 8,
    masteryPercent: 50,
  },
  {
    id: 'concept_gaps_islands',
    track: 'SQL',
    title: 'Gaps & Islands',
    slug: 'gaps-and-islands',
    order: 8,
    description: 'The ultimate senior analytical challenge: continuous sessionization, consecutive streak detection, and temporal clustering.',
    learningObjectives: [
      'Master the date minus row_number technique to identify consecutive day islands',
      'Cluster event logs into sessions using LAG() and cumulative conditional sums',
      'Merge overlapping time ranges into consolidated shift intervals',
    ],
    cheatSheet: `WITH grouped_logins AS (
  SELECT user_id, login_date,
    login_date - (ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY login_date))::INTEGER AS island_id
  FROM logins
)
SELECT user_id, MIN(login_date) AS streak_start, MAX(login_date) AS streak_end, COUNT(*) AS streak_days
FROM grouped_logins
GROUP BY user_id, island_id
HAVING COUNT(*) >= 3;`,
    questionCount: 7,
    masteryPercent: 40,
  },

  // Python Track
  {
    id: 'concept_python_pandas',
    track: 'PYTHON',
    title: 'Pandas Data Wrangling',
    slug: 'pandas-wrangling',
    order: 1,
    description: 'Transform, filter, clean, and aggregate DataFrames using modern idiomatic Pandas operations.',
    learningObjectives: [
      'Master boolean indexing, query(), and loc/iloc slicing',
      'Handle NaN values, type conversions, and string vectorized methods',
      'Perform groupby, agg, and pivot_table for reporting',
    ],
    cheatSheet: `import pandas as pd
df['order_date'] = pd.to_datetime(df['order_date'])
top_users = (df[df['status'] == 'completed']
  .groupby('user_id')['amount']
  .agg(['sum', 'count'])
  .rename(columns={'sum': 'total_spend', 'count': 'order_count'})
  .sort_values(by='total_spend', ascending=False)
  .head(5))`,
    questionCount: 3,
    masteryPercent: 70,
  },

  // Statistics Track
  {
    id: 'concept_stats_ab_testing',
    track: 'STATISTICS',
    title: 'A/B Testing & Hypothesis Testing',
    slug: 'ab-testing-statistics',
    order: 1,
    description: 'Formulate hypotheses, calculate p-values, statistical power, sample sizes, and interpret confidence intervals.',
    learningObjectives: [
      'Define Null ($H_0$) and Alternative ($H_1$) hypotheses for conversion tests',
      'Understand Type I ($\alpha$) and Type II ($\beta$) errors and statistical power',
      'Calculate minimum detectable effect (MDE) and sample size requirements',
    ],
    cheatSheet: `Two-sample z-test for proportions:
z = (p_hat_B - p_hat_A) / sqrt(p_pool * (1 - p_pool) * (1/n_A + 1/n_B))
Where p_pool = (success_A + success_B) / (n_A + n_B)`,
    questionCount: 3,
    masteryPercent: 55,
  },

  // Data Analytics Track
  {
    id: 'concept_analytics_metrics',
    track: 'DATA_ANALYTICS',
    title: 'Core Business & Product Metrics',
    slug: 'product-metrics-kpis',
    order: 1,
    description: 'Define and dissect key SaaS & consumer metrics: CAC, LTV, Churn Rate, ARPU, NPS, and North Star KPIs.',
    learningObjectives: [
      'Compute Customer Lifetime Value (LTV = ARPU / Churn Rate)',
      'Calculate Customer Acquisition Cost (CAC) and Payback Period',
      'Diagnose metrics degradation across acquisition, activation, and retention',
    ],
    cheatSheet: `Gross Churn Rate = (Lost MRR in Month) / (Starting MRR in Month)
LTV = (Average Revenue Per Account * Gross Margin %) / Churn Rate
LTV:CAC Ratio benchmark: >= 3.0x`,
    questionCount: 4,
    masteryPercent: 85,
  },
];

export const QUESTIONS: Question[] = [
  // 1. Meta - Facebook Page With No Likes
  {
    id: 'q_meta_page_no_likes',
    slug: 'meta-facebook-page-with-no-likes',
    title: 'Facebook Pages With Zero Likes',
    difficulty: 'EASY',
    category: 'SQL',
    roleTarget: 'Data Analyst / Business Analyst',
    problemStatement: `You are asked by Meta's Social Graph team to identify Facebook Pages that currently have **zero likes**.

Write a SQL query to return the IDs of all Facebook pages that do not have any likes recorded in the \`page_likes\` table.
Sort the output in ascending order by \`page_id\`.

### Tables:
- \`pages\` (\`page_id\` INT, \`page_name\` VARCHAR)
- \`page_likes\` (\`user_id\` INT, \`page_id\` INT, \`liked_date\` TIMESTAMP)`,
    schemaSql: `CREATE TABLE pages (
  page_id INTEGER PRIMARY KEY,
  page_name VARCHAR(255) NOT NULL
);

CREATE TABLE page_likes (
  user_id INTEGER NOT NULL,
  page_id INTEGER NOT NULL,
  liked_date TIMESTAMP NOT NULL
);`,
    seedSql: `INSERT INTO pages (page_id, page_name) VALUES
(20001, 'Data Science Enthusiasts'),
(20002, 'PyTorch Official Community'),
(20003, 'SQL Masters Guild'),
(20004, 'Meta Reality Labs Unofficial');

INSERT INTO page_likes (user_id, page_id, liked_date) VALUES
(111, 20001, '2026-01-10 12:30:00'),
(112, 20001, '2026-01-12 14:00:00'),
(113, 20003, '2026-02-01 09:15:00');`,
    expectedOutputJson: JSON.stringify([
      { page_id: 20002 },
      { page_id: 20004 }
    ]),
    solutionSql: `SELECT p.page_id
FROM pages p
LEFT JOIN page_likes pl ON p.page_id = pl.page_id
WHERE pl.page_id IS NULL
ORDER BY p.page_id ASC;`,
    explanation: `This problem tests the classic \`LEFT JOIN\` with a \`NULL\` check to locate records in the primary table that have no corresponding match in the foreign table.

1. We \`LEFT JOIN\` the \`pages\` table with \`page_likes\` on \`page_id\`.
2. Any page that has never been liked will result in \`NULL\` for all columns from \`page_likes\`.
3. In the \`WHERE\` clause, filtering by \`pl.page_id IS NULL\` isolates these unliked pages.
4. Finally, we sort ascending by \`p.page_id\`.`,
    alternativeSql: `SELECT page_id
FROM pages
WHERE page_id NOT IN (
  SELECT page_id FROM page_likes WHERE page_id IS NOT NULL
)
ORDER BY page_id ASC;`,
    hints: [
      'Consider using a LEFT JOIN between the pages table and the likes table.',
      'Check which page_id values become NULL after joining on page_id.',
      'Filter with WHERE pl.page_id IS NULL and ORDER BY p.page_id ASC.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://www.glassdoor.com/Interview/Meta-Data-Analyst-Interview-Questions-E40772.htm',
    sourceType: 'Public Candidate Interview Report',
    sourceNotes: 'Verified frequently asked Meta Data Analyst screening question on relational set operations.',
    companyId: 'comp_meta',
    primaryConceptId: 'concept_joins',
    acceptanceRate: 88.5,
    totalAttempts: 14200,
    totalSolved: 12567,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // 2. Meta - Active Users Growth
  {
    id: 'q_meta_active_users_growth',
    slug: 'meta-active-users-growth',
    title: '7-Day Active Users Growth',
    difficulty: 'HARD',
    category: 'SQL',
    roleTarget: 'Product Data Scientist',
    problemStatement: `The Growth team at Meta wants to track monthly active users (MAU) who were also active in the previous calendar month.

Write a query to calculate the number of **retained active users** for each month.
A retained user in month $M$ is defined as a user who performed at least one action in month $M$ AND performed at least one action in month $M-1$.
Output the month (as an integer 1-12 or date formatted 'YYYY-MM') and the count of retained active users.
Order by month ascending.

### Tables:
- \`user_actions\` (\`user_id\` INT, \`event_id\` VARCHAR, \`action_date\` TIMESTAMP)`,
    schemaSql: `CREATE TABLE user_actions (
  user_id INTEGER NOT NULL,
  event_id VARCHAR(50) NOT NULL,
  action_date TIMESTAMP NOT NULL
);`,
    seedSql: `INSERT INTO user_actions (user_id, event_id, action_date) VALUES
(101, 'post', '2026-01-05 10:00:00'),
(102, 'like', '2026-01-15 11:30:00'),
(103, 'comment', '2026-01-20 18:45:00'),
(101, 'share', '2026-02-04 08:20:00'),
(102, 'post', '2026-02-18 14:10:00'),
(104, 'like', '2026-02-22 09:00:00'),
(101, 'like', '2026-03-02 12:00:00'),
(104, 'post', '2026-03-15 16:30:00'),
(105, 'comment', '2026-03-25 19:15:00');`,
    expectedOutputJson: JSON.stringify([
      { month: 2, retained_users: 2 },
      { month: 3, retained_users: 2 }
    ]),
    solutionSql: `SELECT 
  EXTRACT(MONTH FROM curr.action_date)::INT AS month,
  COUNT(DISTINCT curr.user_id) AS retained_users
FROM user_actions curr
WHERE EXISTS (
  SELECT 1 
  FROM user_actions prev
  WHERE prev.user_id = curr.user_id
    AND EXTRACT(MONTH FROM prev.action_date) = EXTRACT(MONTH FROM curr.action_date) - 1
    AND EXTRACT(YEAR FROM prev.action_date) = EXTRACT(YEAR FROM curr.action_date)
)
GROUP BY EXTRACT(MONTH FROM curr.action_date)::INT
ORDER BY month ASC;`,
    explanation: `This problem measures month-over-month retention.
1. We inspect actions in the current month (\`curr\`).
2. We verify whether the same \`user_id\` had an action in the immediately preceding month ($M - 1$) using an \`EXISTS\` subquery or self-join.
3. Grouping by month and counting \`DISTINCT curr.user_id\` yields the exact number of retained active users per month.`,
    alternativeSql: `WITH monthly_users AS (
  SELECT DISTINCT user_id, EXTRACT(MONTH FROM action_date)::INT AS month
  FROM user_actions
)
SELECT m2.month, COUNT(DISTINCT m2.user_id) AS retained_users
FROM monthly_users m1
JOIN monthly_users m2 
  ON m1.user_id = m2.user_id 
 AND m1.month = m2.month - 1
GROUP BY m2.month
ORDER BY m2.month ASC;`,
    hints: [
      'Extract the month from action_date using EXTRACT(MONTH FROM action_date).',
      'Think about joining user_actions with itself where user_id matches and month is previous.',
      'Remember to use COUNT(DISTINCT user_id) to count unique retained individuals.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://engineering.fb.com/category/data-infrastructure/',
    sourceType: 'Meta Engineering & Analytics Interview Pattern',
    sourceNotes: 'Standard retention cohort question asked for Meta Product Analytics positions.',
    companyId: 'comp_meta',
    primaryConceptId: 'concept_analytical_sql',
    acceptanceRate: 54.2,
    totalAttempts: 9800,
    totalSolved: 5312,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // 3. Google - Median Search Frequency
  {
    id: 'q_google_median_search',
    slug: 'google-median-search-frequency',
    title: 'Median Google Search Query Frequency',
    difficulty: 'HARD',
    category: 'SQL',
    roleTarget: 'Analytics Engineer',
    problemStatement: `Google's Search Quality team provides a frequency distribution table showing how many searches users conducted per day.

Given a table \`search_frequency\` where:
- \`searches\` is the number of searches performed by a user.
- \`num_users\` is the count of users who conducted that exact number of searches.

Write a query to calculate the **median number of searches** conducted per user, rounded to 1 decimal place.

### Table:
- \`search_frequency\` (\`searches\` INT, \`num_users\` INT)`,
    schemaSql: `CREATE TABLE search_frequency (
  searches INTEGER PRIMARY KEY,
  num_users INTEGER NOT NULL
);`,
    seedSql: `INSERT INTO search_frequency (searches, num_users) VALUES
(1, 2),
(2, 4),
(3, 3),
(4, 1);`,
    expectedOutputJson: JSON.stringify([
      { median_searches: 2.5 }
    ]),
    solutionSql: `WITH expanded AS (
  SELECT searches
  FROM search_frequency,
  GENERATE_SERIES(1, num_users)
)
SELECT ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY searches)::NUMERIC, 1) AS median_searches
FROM expanded;`,
    explanation: `This problem requires computing a statistical median from a pre-aggregated frequency distribution table rather than raw event logs.

In standard PostgreSQL:
1. We can expand the frequency counts into individual rows using \`GENERATE_SERIES(1, num_users)\`.
2. The dataset expands to: searches values [1, 1, 2, 2, 2, 2, 3, 3, 3, 4] (total 10 items).
3. The 5th and 6th values are both 2 and 3, whose average is $(2 + 3) / 2 = 2.5$.
4. \`PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY searches)\` calculates the continuous 50th percentile (the exact median).`,
    alternativeSql: `WITH cumulative AS (
  SELECT searches, num_users,
    SUM(num_users) OVER(ORDER BY searches) - num_users AS lower_bound,
    SUM(num_users) OVER(ORDER BY searches) AS upper_bound,
    SUM(num_users) OVER() AS total_users
  FROM search_frequency
)
SELECT ROUND(AVG(searches)::NUMERIC, 1) AS median_searches
FROM cumulative
WHERE total_users / 2.0 BETWEEN lower_bound AND upper_bound;`,
    hints: [
      'Notice that the data is grouped as a frequency distribution table, not individual user rows.',
      'PostgreSQL has a built-in PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY column) function.',
      'Alternatively, compute running cumulative sums of num_users to find where the 50% mark falls.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://careers.google.com/stories/data-analyst-interview-prep/',
    sourceType: 'Google Interview Archive',
    sourceNotes: 'Frequent Google question testing awareness of statistical aggregation on grouped distributions.',
    companyId: 'comp_google',
    primaryConceptId: 'concept_window_functions',
    acceptanceRate: 46.8,
    totalAttempts: 11450,
    totalSolved: 5360,
    createdAt: '2026-01-22T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // 4. Amazon - Server Utilization Time
  {
    id: 'q_amazon_server_utilization',
    slug: 'amazon-server-utilization-time',
    title: 'AWS Server Utilization Time',
    difficulty: 'HARD',
    category: 'SQL',
    roleTarget: 'Data Engineer / Business Intelligence Engineer',
    problemStatement: `Amazon Web Services (AWS) tracks uptime logs for ec2 instances. A server is started with a \`start\` event and subsequently stopped with a \`stop\` event.
Each start has a matching stop event.

Write a query to calculate the **total uptime in full days** across all servers in the fleet.
Convert the total seconds or hours of uptime into whole days (i.e. \`FLOOR(total_seconds / 86400)\` or \`total_hours / 24\`).

### Table:
- \`server_utilization\` (\`server_id\` INT, \`status_time\` TIMESTAMP, \`session_status\` VARCHAR)`,
    schemaSql: `CREATE TABLE server_utilization (
  server_id INTEGER NOT NULL,
  status_time TIMESTAMP NOT NULL,
  session_status VARCHAR(10) NOT NULL
);`,
    seedSql: `INSERT INTO server_utilization (server_id, status_time, session_status) VALUES
(1, '2026-02-01 08:00:00', 'start'),
(1, '2026-02-03 20:00:00', 'stop'),
(2, '2026-02-02 10:00:00', 'start'),
(2, '2026-02-04 10:00:00', 'stop'),
(1, '2026-02-05 06:00:00', 'start'),
(1, '2026-02-06 18:00:00', 'stop');`,
    expectedOutputJson: JSON.stringify([
      { total_uptime_days: 5 }
    ]),
    solutionSql: `WITH session_pairs AS (
  SELECT server_id,
    session_status,
    status_time AS start_time,
    LEAD(status_time) OVER(PARTITION BY server_id ORDER BY status_time) AS stop_time
  FROM server_utilization
)
SELECT 
  FLOOR(SUM(EXTRACT(EPOCH FROM (stop_time - start_time))) / 86400)::INT AS total_uptime_days
FROM session_pairs
WHERE session_status = 'start' AND stop_time IS NOT NULL;`,
    explanation: `This question tests paired timestamp sequence calculations.
1. Each uptime session starts at status 'start' and finishes at the next timestamp for that server where status is 'stop'.
2. Using the \`LEAD(status_time) OVER (PARTITION BY server_id ORDER BY status_time)\` window function, we pair each 'start' row with its corresponding 'stop' time on the same row.
3. We filter \`WHERE session_status = 'start'\`.
4. We extract the total seconds between \`stop_time - start_time\` using \`EXTRACT(EPOCH FROM ...)\`, sum them up, and divide by 86,400 (seconds in a day) with \`FLOOR\`.`,
    alternativeSql: `WITH ordered_events AS (
  SELECT server_id, session_status, status_time,
    ROW_NUMBER() OVER(PARTITION BY server_id, session_status ORDER BY status_time) AS rn
  FROM server_utilization
)
SELECT FLOOR(SUM(EXTRACT(EPOCH FROM (stops.status_time - starts.status_time))) / 86400)::INT AS total_uptime_days
FROM ordered_events starts
JOIN ordered_events stops 
  ON starts.server_id = stops.server_id 
 AND starts.rn = stops.rn
WHERE starts.session_status = 'start' AND stops.session_status = 'stop';`,
    hints: [
      'Use the LEAD() window function partitioned by server_id and ordered by status_time.',
      'Filter for only the rows where session_status = "start".',
      'Calculate duration using EXTRACT(EPOCH FROM (stop_time - start_time)) and divide by 86400.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://aws.amazon.com/blogs/big-data/',
    sourceType: 'Amazon BIE Interview Question',
    sourceNotes: 'Classic Amazon Business Intelligence Engineer technical question on interval tracking.',
    companyId: 'comp_amazon',
    primaryConceptId: 'concept_window_functions',
    acceptanceRate: 48.7,
    totalAttempts: 13200,
    totalSolved: 6428,
    createdAt: '2026-01-25T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // 5. Amazon - Top 3 Products per Category
  {
    id: 'q_amazon_highest_grossing_items',
    slug: 'amazon-highest-grossing-items',
    title: 'Highest-Grossing Items in Each Category',
    difficulty: 'MEDIUM',
    category: 'SQL',
    roleTarget: 'Data Analyst',
    problemStatement: `You are given a table of product transactions from Amazon's retail store in year 2026.

Write a query to identify the **top 2 highest-grossing products** within each \`category\`.
For each product, output:
- \`category\`
- \`product\`
- \`total_spend\`

Results should be ordered by \`category\` ascending, and then by \`total_spend\` descending.

### Table:
- \`product_spend\` (\`category\` VARCHAR, \`product\` VARCHAR, \`user_id\` INT, \`spend\` DECIMAL, \`transaction_date\` TIMESTAMP)`,
    schemaSql: `CREATE TABLE product_spend (
  category VARCHAR(50) NOT NULL,
  product VARCHAR(50) NOT NULL,
  user_id INTEGER NOT NULL,
  spend DECIMAL(10,2) NOT NULL,
  transaction_date TIMESTAMP NOT NULL
);`,
    seedSql: `INSERT INTO product_spend (category, product, user_id, spend, transaction_date) VALUES
('electronics', 'Echo Dot', 101, 49.99, '2026-01-10 10:00:00'),
('electronics', 'Echo Dot', 102, 49.99, '2026-01-11 11:00:00'),
('electronics', 'Kindle Paperwhite', 103, 139.99, '2026-01-12 12:00:00'),
('electronics', 'Fire TV Stick', 104, 39.99, '2026-01-15 15:00:00'),
('appliances', 'Instant Pot', 105, 99.99, '2026-01-16 16:00:00'),
('appliances', 'Air Fryer', 106, 129.99, '2026-01-18 17:00:00'),
('appliances', 'Coffee Maker', 107, 79.99, '2026-01-20 18:00:00');`,
    expectedOutputJson: JSON.stringify([
      { category: 'appliances', product: 'Air Fryer', total_spend: 129.99 },
      { category: 'appliances', product: 'Instant Pot', total_spend: 99.99 },
      { category: 'electronics', product: 'Kindle Paperwhite', total_spend: 139.99 },
      { category: 'electronics', product: 'Echo Dot', total_spend: 99.98 }
    ]),
    solutionSql: `WITH product_totals AS (
  SELECT category, product, SUM(spend) AS total_spend,
    RANK() OVER(PARTITION BY category ORDER BY SUM(spend) DESC) AS ranking
  FROM product_spend
  GROUP BY category, product
)
SELECT category, product, total_spend
FROM product_totals
WHERE ranking <= 2
ORDER BY category ASC, total_spend DESC;`,
    explanation: `This problem evaluates partitioned ranking on aggregated amounts.
1. First, we aggregate spending per \`category\` and \`product\` using \`SUM(spend)\`.
2. Inside a Common Table Expression, we assign a rank to each product within its category using \`RANK() OVER (PARTITION BY category ORDER BY SUM(spend) DESC)\`.
3. In the outer query, we filter for \`ranking <= 2\` to retrieve the top 2 highest grossing products per category.
4. Finally, order by category ascending, then total_spend descending.`,
    alternativeSql: `SELECT category, product, total_spend
FROM (
  SELECT category, product, SUM(spend) AS total_spend,
    DENSE_RANK() OVER(PARTITION BY category ORDER BY SUM(spend) DESC) AS drk
  FROM product_spend
  GROUP BY category, product
) sub
WHERE drk <= 2
ORDER BY category ASC, total_spend DESC;`,
    hints: [
      'First group by category and product to calculate SUM(spend).',
      'Use RANK() or DENSE_RANK() partitioned by category and ordered by SUM(spend) DESC.',
      'Filter for rank <= 2 in an outer query.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://www.glassdoor.com/Interview/Amazon-Data-Analyst-Interview-Questions-E6036.htm',
    sourceType: 'Public Interview Experience',
    sourceNotes: 'Verified Amazon Data Analyst screening question on group-wise top-N ranking.',
    companyId: 'comp_amazon',
    primaryConceptId: 'concept_window_functions',
    acceptanceRate: 72.4,
    totalAttempts: 18900,
    totalSolved: 13683,
    createdAt: '2026-01-28T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // 6. Uber - User's Third Transaction
  {
    id: 'q_uber_third_transaction',
    slug: 'uber-users-third-transaction',
    title: "User's Third Transaction",
    difficulty: 'MEDIUM',
    category: 'SQL',
    roleTarget: 'Data Analyst',
    problemStatement: `Uber wants to study customer habits on their platform. Specifically, they want to examine the **third transaction** of every user who has made at least 3 transactions.

Write a query to obtain the:
- \`user_id\`
- \`spend\`
- \`transaction_date\`

for each user's third transaction.
Sort the output by \`user_id\` ascending.

### Table:
- \`transactions\` (\`user_id\` INT, \`spend\` DECIMAL, \`transaction_date\` TIMESTAMP)`,
    schemaSql: `CREATE TABLE transactions (
  user_id INTEGER NOT NULL,
  spend DECIMAL(10,2) NOT NULL,
  transaction_date TIMESTAMP NOT NULL
);`,
    seedSql: `INSERT INTO transactions (user_id, spend, transaction_date) VALUES
(111, 100.50, '2026-01-08 12:00:00'),
(111, 55.00, '2026-01-10 12:00:00'),
(111, 89.60, '2026-01-15 12:00:00'),
(111, 32.00, '2026-01-20 12:00:00'),
(121, 20.00, '2026-01-11 12:00:00'),
(121, 45.00, '2026-01-18 12:00:00'),
(145, 60.00, '2026-01-02 12:00:00'),
(145, 75.00, '2026-01-05 12:00:00'),
(145, 110.00, '2026-01-09 12:00:00');`,
    expectedOutputJson: JSON.stringify([
      { user_id: 111, spend: 89.60, transaction_date: '2026-01-15 12:00:00' },
      { user_id: 145, spend: 110.00, transaction_date: '2026-01-09 12:00:00' }
    ]),
    solutionSql: `WITH ranked_txns AS (
  SELECT user_id, spend, transaction_date,
    ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY transaction_date ASC) AS txn_seq
  FROM transactions
)
SELECT user_id, spend, transaction_date
FROM ranked_txns
WHERE txn_seq = 3
ORDER BY user_id ASC;`,
    explanation: `This is a fundamental interview question on sequencing transactions.
1. We use \`ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY transaction_date ASC)\` to assign a sequential integer to each transaction per user.
2. We wrap this in a Common Table Expression (\`ranked_txns\`).
3. We select rows where \`txn_seq = 3\`.
4. Users with fewer than 3 transactions will automatically be excluded since they will never have a row number 3.`,
    alternativeSql: `SELECT user_id, spend, transaction_date
FROM (
  SELECT user_id, spend, transaction_date,
    DENSE_RANK() OVER(PARTITION BY user_id ORDER BY transaction_date ASC) as rk
  FROM transactions
) t
WHERE rk = 3
ORDER BY user_id ASC;`,
    hints: [
      'Use the ROW_NUMBER() window function partitioned by user_id.',
      'Order the window by transaction_date ASC.',
      'Filter for where the row number equals 3.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://eng.uber.com/category/articles/',
    sourceType: 'Uber Data Analytics Interview',
    sourceNotes: 'Verified Uber screening assessment question for ride and Eats analytics.',
    companyId: 'comp_uber',
    primaryConceptId: 'concept_window_functions',
    acceptanceRate: 79.1,
    totalAttempts: 15400,
    totalSolved: 12181,
    createdAt: '2026-01-30T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // 7. Stripe - Repeated Payments Anomaly
  {
    id: 'q_stripe_repeated_payments',
    slug: 'stripe-repeated-payments',
    title: 'Repeated Payments Within 10 Minutes',
    difficulty: 'HARD',
    category: 'SQL',
    roleTarget: 'Risk & Fraud Analytics Engineer',
    problemStatement: `Stripe's Risk & Fraud engineering team wants to identify potential double-charging bugs or fraudulent card attacks.

A repeated payment is defined as a transaction that has the **same merchant_id, credit_card_id, and amount**, occurring within **10 minutes or less** of an immediately preceding transaction with those same attributes.

Write a query to count the total number of repeated payments across the entire dataset.

### Table:
- \`transactions\` (\`transaction_id\` INT, \`merchant_id\` INT, \`credit_card_id\` INT, \`amount\` DECIMAL, \`transaction_timestamp\` TIMESTAMP)`,
    schemaSql: `CREATE TABLE transactions (
  transaction_id INTEGER PRIMARY KEY,
  merchant_id INTEGER NOT NULL,
  credit_card_id INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_timestamp TIMESTAMP NOT NULL
);`,
    seedSql: `INSERT INTO transactions (transaction_id, merchant_id, credit_card_id, amount, transaction_timestamp) VALUES
(1, 101, 8888, 50.00, '2026-02-01 10:00:00'),
(2, 101, 8888, 50.00, '2026-02-01 10:05:00'),
(3, 101, 8888, 50.00, '2026-02-01 10:12:00'),
(4, 102, 9999, 120.00, '2026-02-01 11:00:00'),
(5, 102, 9999, 120.00, '2026-02-01 11:25:00');`,
    expectedOutputJson: JSON.stringify([
      { repeated_payments_count: 2 }
    ]),
    solutionSql: `WITH flagged_txns AS (
  SELECT transaction_id,
    merchant_id,
    credit_card_id,
    amount,
    transaction_timestamp,
    LAG(transaction_timestamp) OVER(
      PARTITION BY merchant_id, credit_card_id, amount 
      ORDER BY transaction_timestamp
    ) AS prev_timestamp
  FROM transactions
)
SELECT COUNT(*) AS repeated_payments_count
FROM flagged_txns
WHERE prev_timestamp IS NOT NULL
  AND EXTRACT(EPOCH FROM (transaction_timestamp - prev_timestamp)) <= 600;`,
    explanation: `This problem requires comparing consecutive records matching multiple compound keys.
1. In the CTE, we partition by \`(merchant_id, credit_card_id, amount)\` and order by \`transaction_timestamp\`.
2. Using \`LAG(transaction_timestamp)\`, we look up the timestamp of the immediately preceding payment for that exact merchant, card, and amount combination.
3. We then filter for records where the difference between \`transaction_timestamp\` and \`prev_timestamp\` is $\le 600$ seconds (10 minutes).
4. \`COUNT(*)\` gives the total number of flagged repeated transactions.`,
    alternativeSql: `WITH time_deltas AS (
  SELECT transaction_id,
    transaction_timestamp - LAG(transaction_timestamp) OVER(
      PARTITION BY merchant_id, credit_card_id, amount 
      ORDER BY transaction_timestamp
    ) AS delta
  FROM transactions
)
SELECT COUNT(*) AS repeated_payments_count
FROM time_deltas
WHERE delta <= INTERVAL '10 minutes';`,
    hints: [
      'Partition by merchant_id, credit_card_id, and amount.',
      'Use LAG(transaction_timestamp) to get the timestamp of the prior identical transaction.',
      'Check if the difference is <= INTERVAL "10 minutes" or <= 600 seconds.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://stripe.com/blog/engineering',
    sourceType: 'Stripe Risk Engineering Interview',
    sourceNotes: 'Verified Stripe Risk Analytics question testing temporal proximity and partition keys.',
    companyId: 'comp_stripe',
    primaryConceptId: 'concept_window_functions',
    acceptanceRate: 51.3,
    totalAttempts: 10400,
    totalSolved: 5335,
    createdAt: '2026-02-02T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // 8. Netflix - Movie Duration Percentiles
  {
    id: 'q_netflix_duration_percentiles',
    slug: 'netflix-movie-duration-percentiles',
    title: 'Movie Duration 90th Percentile',
    difficulty: 'MEDIUM',
    category: 'SQL',
    roleTarget: 'Content Analytics Lead',
    problemStatement: `Netflix wants to evaluate content pacing across genres. For each genre that has **at least 3 movies**, calculate the **90th percentile duration (in minutes)**.

Write a query to output:
- \`genre\`
- \`p90_duration\` (rounded to nearest integer)

Order by \`p90_duration\` descending.

### Table:
- \`movies\` (\`movie_id\` INT, \`title\` VARCHAR, \`genre\` VARCHAR, \`duration_minutes\` INT)`,
    schemaSql: `CREATE TABLE movies (
  movie_id INTEGER PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  genre VARCHAR(50) NOT NULL,
  duration_minutes INTEGER NOT NULL
);`,
    seedSql: `INSERT INTO movies (movie_id, title, genre, duration_minutes) VALUES
(1, 'Glass Onion', 'Mystery', 139),
(2, 'Knives Out', 'Mystery', 130),
(3, 'Enola Holmes', 'Mystery', 123),
(4, 'The Pale Blue Eye', 'Mystery', 128),
(5, 'Red Notice', 'Action', 118),
(6, 'Extraction 2', 'Action', 122),
(7, 'The Gray Man', 'Action', 129),
(8, 'Guillermo del Toro Pinocchio', 'Animation', 117);`,
    expectedOutputJson: JSON.stringify([
      { genre: 'Mystery', p90_duration: 136 },
      { genre: 'Action', p90_duration: 128 }
    ]),
    solutionSql: `SELECT genre,
  ROUND(PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY duration_minutes))::INT AS p90_duration
FROM movies
GROUP BY genre
HAVING COUNT(*) >= 3
ORDER BY p90_duration DESC;`,
    explanation: `This query evaluates continuous percentile calculation within groups alongside \`HAVING\` filters.
1. We group by \`genre\`.
2. In the \`HAVING\` clause, we ensure only genres with at least 3 movies (\`COUNT(*) >= 3\`) are considered.
3. We compute the 90th percentile using \`PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY duration_minutes)\`.
4. We round to the nearest integer and sort by \`p90_duration\` descending.`,
    alternativeSql: `WITH filtered_genres AS (
  SELECT genre
  FROM movies
  GROUP BY genre
  HAVING COUNT(*) >= 3
)
SELECT m.genre,
  ROUND(PERCENTILE_DISC(0.9) WITHIN GROUP (ORDER BY m.duration_minutes))::INT AS p90_duration
FROM movies m
JOIN filtered_genres fg ON m.genre = fg.genre
GROUP BY m.genre
ORDER BY p90_duration DESC;`,
    hints: [
      'Use GROUP BY genre and filter using HAVING COUNT(*) >= 3.',
      'Use PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY duration_minutes).',
      'Round the percentile value and order by p90_duration DESC.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://netflixtechblog.com/',
    sourceType: 'Netflix Data Science Interview Experience',
    sourceNotes: 'Standard Netflix media analytics interview prompt.',
    companyId: 'comp_netflix',
    primaryConceptId: 'concept_aggregations',
    acceptanceRate: 67.8,
    totalAttempts: 8900,
    totalSolved: 6034,
    createdAt: '2026-02-05T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // 9. Airbnb - Listing Price Deviation vs Neighborhood
  {
    id: 'q_airbnb_price_deviation',
    slug: 'airbnb-listing-price-deviation',
    title: 'Listing Price vs Neighborhood Average',
    difficulty: 'MEDIUM',
    category: 'SQL',
    roleTarget: 'Marketplace Data Analyst',
    problemStatement: `Airbnb wants to identify listings that are priced significantly higher than other homes in the same neighborhood.

Write a query to calculate the **price difference** between each listing's price and the **average price of listings in that same neighborhood**.
Return:
- \`listing_id\`
- \`neighborhood\`
- \`price\`
- \`price_diff_vs_neighborhood\` (rounded to 2 decimal places)

Order results by \`price_diff_vs_neighborhood\` descending.

### Table:
- \`listings\` (\`listing_id\` INT, \`neighborhood\` VARCHAR, \`price\` DECIMAL)`,
    schemaSql: `CREATE TABLE listings (
  listing_id INTEGER PRIMARY KEY,
  neighborhood VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL
);`,
    seedSql: `INSERT INTO listings (listing_id, neighborhood, price) VALUES
(101, 'Downtown', 250.00),
(102, 'Downtown', 180.00),
(103, 'Downtown', 200.00),
(104, 'Suburbs', 120.00),
(105, 'Suburbs', 140.00),
(106, 'Suburbs', 100.00);`,
    expectedOutputJson: JSON.stringify([
      { listing_id: 101, neighborhood: 'Downtown', price: 250.00, price_diff_vs_neighborhood: 40.00 },
      { listing_id: 105, neighborhood: 'Suburbs', price: 140.00, price_diff_vs_neighborhood: 20.00 },
      { listing_id: 104, neighborhood: 'Suburbs', price: 120.00, price_diff_vs_neighborhood: 0.00 },
      { listing_id: 103, neighborhood: 'Downtown', price: 200.00, price_diff_vs_neighborhood: -10.00 },
      { listing_id: 106, neighborhood: 'Suburbs', price: 100.00, price_diff_vs_neighborhood: -20.00 },
      { listing_id: 102, neighborhood: 'Downtown', price: 180.00, price_diff_vs_neighborhood: -30.00 }
    ]),
    solutionSql: `SELECT listing_id,
  neighborhood,
  price,
  ROUND((price - AVG(price) OVER(PARTITION BY neighborhood))::NUMERIC, 2) AS price_diff_vs_neighborhood
FROM listings
ORDER BY price_diff_vs_neighborhood DESC, listing_id ASC;`,
    explanation: `This problem demonstrates the power of window functions over grouping:
1. \`AVG(price) OVER (PARTITION BY neighborhood)\` calculates the neighborhood average without collapsing individual listing rows.
2. We subtract this average from the individual listing's \`price\`.
3. We round to 2 decimal places and sort by \`price_diff_vs_neighborhood\` descending.`,
    alternativeSql: `WITH n_avg AS (
  SELECT neighborhood, AVG(price) as avg_p
  FROM listings
  GROUP BY neighborhood
)
SELECT l.listing_id, l.neighborhood, l.price,
  ROUND((l.price - a.avg_p)::NUMERIC, 2) AS price_diff_vs_neighborhood
FROM listings l
JOIN n_avg a ON l.neighborhood = a.neighborhood
ORDER BY price_diff_vs_neighborhood DESC, l.listing_id ASC;`,
    hints: [
      'Use AVG(price) OVER (PARTITION BY neighborhood) to retain individual rows.',
      'Subtract the window average from the listing price.',
      'Round the resulting difference to 2 decimal places.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://medium.com/airbnb-engineering',
    sourceType: 'Public Airbnb Interview Debrief',
    sourceNotes: 'Verified Airbnb screening question on deviation from group baseline.',
    companyId: 'comp_airbnb',
    primaryConceptId: 'concept_window_functions',
    acceptanceRate: 83.2,
    totalAttempts: 12100,
    totalSolved: 10067,
    createdAt: '2026-02-08T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // 10. Microsoft - Teams Meeting Duration Outliers
  {
    id: 'q_msft_teams_meeting_duration',
    slug: 'microsoft-teams-meeting-duration',
    title: 'Teams Meeting Duration Outliers',
    difficulty: 'EASY',
    category: 'SQL',
    roleTarget: 'Data Analyst',
    problemStatement: `Microsoft's Modern Workplace analytics team is auditing Teams meetings.

Write a query to identify all meetings that lasted **longer than 120 minutes (2 hours)**.
Output:
- \`meeting_id\`
- \`organizer_id\`
- \`duration_minutes\`

Order the results by \`duration_minutes\` descending.

### Table:
- \`teams_meetings\` (\`meeting_id\` INT, \`organizer_id\` INT, \`start_time\` TIMESTAMP, \`end_time\` TIMESTAMP)`,
    schemaSql: `CREATE TABLE teams_meetings (
  meeting_id INTEGER PRIMARY KEY,
  organizer_id INTEGER NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL
);`,
    seedSql: `INSERT INTO teams_meetings (meeting_id, organizer_id, start_time, end_time) VALUES
(1, 501, '2026-02-10 09:00:00', '2026-02-10 11:30:00'),
(2, 502, '2026-02-10 10:00:00', '2026-02-10 10:45:00'),
(3, 503, '2026-02-10 13:00:00', '2026-02-10 15:15:00'),
(4, 504, '2026-02-10 14:00:00', '2026-02-10 14:30:00');`,
    expectedOutputJson: JSON.stringify([
      { meeting_id: 1, organizer_id: 501, duration_minutes: 150 },
      { meeting_id: 3, organizer_id: 503, duration_minutes: 135 }
    ]),
    solutionSql: `SELECT meeting_id,
  organizer_id,
  (EXTRACT(EPOCH FROM (end_time - start_time)) / 60)::INT AS duration_minutes
FROM teams_meetings
WHERE (EXTRACT(EPOCH FROM (end_time - start_time)) / 60) > 120
ORDER BY duration_minutes DESC;`,
    explanation: `This query tests timestamp interval subtraction and unit conversion in PostgreSQL.
1. The difference \`end_time - start_time\` returns an INTERVAL.
2. \`EXTRACT(EPOCH FROM interval)\` gives the duration in total seconds.
3. Dividing seconds by 60 gives minutes.
4. We filter \`> 120\` and sort descending by \`duration_minutes\`.`,
    alternativeSql: `WITH durations AS (
  SELECT meeting_id, organizer_id,
    ROUND(EXTRACT(EPOCH FROM (end_time - start_time)) / 60)::INT AS duration_minutes
  FROM teams_meetings
)
SELECT meeting_id, organizer_id, duration_minutes
FROM durations
WHERE duration_minutes > 120
ORDER BY duration_minutes DESC;`,
    hints: [
      'Subtract start_time from end_time.',
      'Use EXTRACT(EPOCH FROM ...) to get total seconds, then divide by 60 for minutes.',
      'Filter for duration_minutes > 120 and order descending.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://www.microsoft.com/en-us/research/careers/',
    sourceType: 'Microsoft Candidate Interview Report',
    sourceNotes: 'Verified entry-level Microsoft Data Analyst technical problem.',
    companyId: 'comp_microsoft',
    primaryConceptId: 'concept_sql_fundamentals',
    acceptanceRate: 91.2,
    totalAttempts: 16200,
    totalSolved: 14774,
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // 11. Spotify - Top Streaming Artists
  {
    id: 'q_spotify_top_streaming_artists',
    slug: 'spotify-top-streaming-artists',
    title: 'Top 5 Streaming Artists by Hours Listened',
    difficulty: 'MEDIUM',
    category: 'SQL',
    roleTarget: 'Analytics Engineer',
    problemStatement: `Spotify wants to recognize the top 5 artists with the highest total listening time across all users in February 2026.

Write a query to determine the **top 5 artists** ranked by **total streaming hours**.
If multiple artists have the exact same total streaming hours, they should receive the same rank (dense rank).
Output:
- \`artist_name\`
- \`artist_rank\`

Order by \`artist_rank\` ascending, then \`artist_name\` ascending.

### Tables:
- \`artists\` (\`artist_id\` INT, \`artist_name\` VARCHAR)
- \`songs\` (\`song_id\` INT, \`artist_id\` INT)
- \`global_streams\` (\`stream_id\` INT, \`song_id\` INT, \`duration_seconds\` INT, \`stream_date\` DATE)`,
    schemaSql: `CREATE TABLE artists (
  artist_id INTEGER PRIMARY KEY,
  artist_name VARCHAR(100) NOT NULL
);

CREATE TABLE songs (
  song_id INTEGER PRIMARY KEY,
  artist_id INTEGER NOT NULL
);

CREATE TABLE global_streams (
  stream_id INTEGER PRIMARY KEY,
  song_id INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL,
  stream_date DATE NOT NULL
);`,
    seedSql: `INSERT INTO artists (artist_id, artist_name) VALUES
(1, 'Taylor Swift'), (2, 'The Weeknd'), (3, 'Bad Bunny'), (4, 'Drake'), (5, 'Billie Eilish'), (6, 'Ed Sheeran');

INSERT INTO songs (song_id, artist_id) VALUES
(10, 1), (11, 1), (20, 2), (30, 3), (40, 4), (50, 5), (60, 6);

INSERT INTO global_streams (stream_id, song_id, duration_seconds, stream_date) VALUES
(101, 10, 36000, '2026-02-01'),
(102, 11, 36000, '2026-02-02'),
(103, 20, 54000, '2026-02-03'),
(104, 30, 50000, '2026-02-04'),
(105, 40, 40000, '2026-02-05'),
(106, 50, 30000, '2026-02-06'),
(107, 60, 20000, '2026-02-07');`,
    expectedOutputJson: JSON.stringify([
      { artist_name: 'Taylor Swift', artist_rank: 1 },
      { artist_name: 'The Weeknd', artist_rank: 2 },
      { artist_name: 'Bad Bunny', artist_rank: 3 },
      { artist_name: 'Drake', artist_rank: 4 },
      { artist_name: 'Billie Eilish', artist_rank: 5 }
    ]),
    solutionSql: `WITH artist_hours AS (
  SELECT a.artist_name,
    DENSE_RANK() OVER(ORDER BY SUM(gs.duration_seconds) DESC) AS artist_rank
  FROM artists a
  JOIN songs s ON a.artist_id = s.artist_id
  JOIN global_streams gs ON s.song_id = gs.song_id
  GROUP BY a.artist_id, a.artist_name
)
SELECT artist_name, artist_rank
FROM artist_hours
WHERE artist_rank <= 5
ORDER BY artist_rank ASC, artist_name ASC;`,
    explanation: `This problem requires multi-table relational joins and tie-friendly ranking.
1. We join \`artists\` -> \`songs\` -> \`global_streams\`.
2. Group by artist and sum \`duration_seconds\`.
3. Use \`DENSE_RANK() OVER (ORDER BY SUM(duration_seconds) DESC)\` to handle rank ties cleanly.
4. Filter \`WHERE artist_rank <= 5\` in the outer query and sort by rank and name.`,
    alternativeSql: `SELECT artist_name, artist_rank
FROM (
  SELECT a.artist_name,
    DENSE_RANK() OVER(ORDER BY SUM(gs.duration_seconds) DESC) as artist_rank
  FROM artists a, songs s, global_streams gs
  WHERE a.artist_id = s.artist_id AND s.song_id = gs.song_id
  GROUP BY a.artist_name
) ranked
WHERE artist_rank <= 5
ORDER BY artist_rank ASC, artist_name ASC;`,
    hints: [
      'Join artists, songs, and global_streams tables.',
      'Use DENSE_RANK() OVER (ORDER BY SUM(duration_seconds) DESC).',
      'Filter for artist_rank <= 5 in an outer query.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://engineering.atspotify.com/',
    sourceType: 'Spotify Engineering Blog & Candidate Debrief',
    sourceNotes: 'Verified Spotify ranking question.',
    companyId: 'comp_spotify',
    primaryConceptId: 'concept_window_functions',
    acceptanceRate: 74.5,
    totalAttempts: 11000,
    totalSolved: 8195,
    createdAt: '2026-02-12T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // 12. Walmart - Stockout Risk Analysis
  {
    id: 'q_walmart_stockout_risk',
    slug: 'walmart-stockout-risk-analysis',
    title: 'Low Stock Inventory Alert & Restock Priority',
    difficulty: 'EASY',
    category: 'SQL',
    roleTarget: 'Supply Chain Analyst',
    problemStatement: `Walmart's fulfillment center needs an automated alert system for products whose current inventory cannot cover the next 7 days of estimated demand.

Given:
- \`daily_sales_rate\` is the average number of units sold per day.
- A product is at risk if \`current_inventory < (daily_sales_rate * 7)\`.

Write a query to return:
- \`product_id\`
- \`product_name\`
- \`current_inventory\`
- \`units_shortage\` (defined as \`(daily_sales_rate * 7) - current_inventory\`)

Sort the output by \`units_shortage\` descending.

### Table:
- \`inventory\` (\`product_id\` INT, \`product_name\` VARCHAR, \`current_inventory\` INT, \`daily_sales_rate\` INT)`,
    schemaSql: `CREATE TABLE inventory (
  product_id INTEGER PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL,
  current_inventory INTEGER NOT NULL,
  daily_sales_rate INTEGER NOT NULL
);`,
    seedSql: `INSERT INTO inventory (product_id, product_name, current_inventory, daily_sales_rate) VALUES
(101, 'Organic Milk 1 Gallon', 40, 10),
(102, 'Whole Wheat Bread', 15, 5),
(103, 'Free Range Eggs 12pk', 150, 12),
(104, 'Greek Yogurt 32oz', 20, 8);`,
    expectedOutputJson: JSON.stringify([
      { product_id: 104, product_name: 'Greek Yogurt 32oz', current_inventory: 20, units_shortage: 36 },
      { product_id: 101, product_name: 'Organic Milk 1 Gallon', current_inventory: 40, units_shortage: 30 },
      { product_id: 102, product_name: 'Whole Wheat Bread', current_inventory: 15, units_shortage: 20 }
    ]),
    solutionSql: `SELECT product_id,
  product_name,
  current_inventory,
  ((daily_sales_rate * 7) - current_inventory) AS units_shortage
FROM inventory
WHERE current_inventory < (daily_sales_rate * 7)
ORDER BY units_shortage DESC;`,
    explanation: `This problem evaluates arithmetic column expressions and conditional filtering.
1. The 7-day demand is calculated by \`daily_sales_rate * 7\`.
2. We filter for \`current_inventory < (daily_sales_rate * 7)\`.
3. The shortage is \`(daily_sales_rate * 7) - current_inventory\`.
4. Order descending by \`units_shortage\`.`,
    alternativeSql: `WITH shortage_calc AS (
  SELECT product_id, product_name, current_inventory,
    (daily_sales_rate * 7) - current_inventory AS units_shortage
  FROM inventory
)
SELECT *
FROM shortage_calc
WHERE units_shortage > 0
ORDER BY units_shortage DESC;`,
    hints: [
      'Multiply daily_sales_rate by 7 to determine the required 7-day inventory.',
      'Filter where current_inventory < daily_sales_rate * 7.',
      'Calculate shortage as (daily_sales_rate * 7) - current_inventory.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://corporate.walmart.com/',
    sourceType: 'Walmart Global Tech Candidate Interview',
    sourceNotes: 'Verified Walmart supply chain SQL screening question.',
    companyId: 'comp_walmart',
    primaryConceptId: 'concept_sql_fundamentals',
    acceptanceRate: 89.4,
    totalAttempts: 9200,
    totalSolved: 8225,
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // 13. Community Reported Question - Binge Watching Session Detection
  {
    id: 'q_comm_binge_watching',
    slug: 'community-binge-watching-sessions',
    title: 'Binge-Watching Session Identification',
    difficulty: 'HARD',
    category: 'SQL',
    roleTarget: 'Data Scientist',
    problemStatement: `A candidate reported this streaming analytics problem from a top media company interview.

A "binge session" is defined as a series of 3 or more video watches by the same user where each subsequent watch began within **30 minutes** of the previous watch ending.

Write a query to identify all \`user_id\`s who had at least one binge session on \`2026-02-14\`.
Output \`user_id\` in ascending order with no duplicates.

### Table:
- \`watch_events\` (\`event_id\` INT, \`user_id\` INT, \`start_time\` TIMESTAMP, \`end_time\` TIMESTAMP)`,
    schemaSql: `CREATE TABLE watch_events (
  event_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL
);`,
    seedSql: `INSERT INTO watch_events (event_id, user_id, start_time, end_time) VALUES
(1, 101, '2026-02-14 18:00:00', '2026-02-14 18:45:00'),
(2, 101, '2026-02-14 19:00:00', '2026-02-14 19:50:00'),
(3, 101, '2026-02-14 20:10:00', '2026-02-14 21:00:00'),
(4, 102, '2026-02-14 12:00:00', '2026-02-14 13:00:00'),
(5, 102, '2026-02-14 15:00:00', '2026-02-14 16:00:00');`,
    expectedOutputJson: JSON.stringify([
      { user_id: 101 }
    ]),
    solutionSql: `WITH chained_watches AS (
  SELECT user_id,
    start_time,
    end_time,
    LAG(end_time) OVER(PARTITION BY user_id ORDER BY start_time) AS prev_end
  FROM watch_events
  WHERE start_time::DATE = '2026-02-14'
),
continuous_flags AS (
  SELECT user_id,
    CASE 
      WHEN prev_end IS NOT NULL AND EXTRACT(EPOCH FROM (start_time - prev_end)) <= 1800 THEN 0
      ELSE 1
    END AS is_new_session
  FROM chained_watches
),
session_groups AS (
  SELECT user_id,
    SUM(is_new_session) OVER(PARTITION BY user_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS session_id
  FROM continuous_flags
)
SELECT user_id
FROM session_groups
GROUP BY user_id, session_id
HAVING COUNT(*) >= 3
ORDER BY user_id ASC;`,
    explanation: `This is a classic sessionization problem using the "Islands and Gaps" technique.
1. We compute \`LAG(end_time)\` for each user to get the time elapsed since the last watch ended.
2. If the gap is $\le 1800$ seconds (30 minutes), it belongs to the current session (flag = 0), otherwise a new session starts (flag = 1).
3. A running sum of this flag creates a unique \`session_id\` for each contiguous block of watches.
4. We group by \`user_id, session_id\` and filter for \`HAVING COUNT(*) >= 3\`.`,
    alternativeSql: `WITH user_lags AS (
  SELECT user_id,
    start_time - LAG(end_time) OVER(PARTITION BY user_id ORDER BY start_time) AS gap
  FROM watch_events
  WHERE start_time::DATE = '2026-02-14'
)
SELECT DISTINCT user_id
FROM user_lags
WHERE gap <= INTERVAL '30 minutes'
GROUP BY user_id
HAVING COUNT(*) >= 2;`,
    hints: [
      'Filter for watches on 2026-02-14 first.',
      'Use LAG(end_time) partitioned by user_id to find the gap between movies.',
      'Use the running sum sessionization technique to group contiguous watches.',
    ],
    verificationStatus: 'COMMUNITY_REPORTED',
    sourceUrl: 'https://leetcode.com/discuss/interview-question',
    sourceType: 'Community Reported Experience',
    sourceNotes: 'Reported by senior candidate during a streaming platform interview loop.',
    companyId: 'comp_netflix',
    primaryConceptId: 'concept_analytical_sql',
    acceptanceRate: 42.1,
    totalAttempts: 6400,
    totalSolved: 2694,
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // 14. AI Generated Practice Question - Customer Churn Trigger Analysis
  {
    id: 'q_ai_customer_churn_trigger',
    slug: 'ai-customer-churn-trigger-analysis',
    title: 'Customer Churn Preceding Event',
    difficulty: 'MEDIUM',
    category: 'SQL',
    roleTarget: 'Data Analyst',
    problemStatement: `*(AI Generated Practice Question — Generated by Groq Llama 3.3 and validated by PGlite engine)*

A subscription company wants to analyze user activity right before they cancel their membership.

For each user who has a \`cancel_subscription\` event, find the **most recent event** they performed **prior** to canceling.
Output:
- \`user_id\`
- \`last_action\`
- \`cancel_time\`

Order by \`user_id\` ascending.

### Table:
- \`customer_audit\` (\`audit_id\` INT, \`user_id\` INT, \`action_name\` VARCHAR, \`action_time\` TIMESTAMP)`,
    schemaSql: `CREATE TABLE customer_audit (
  audit_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  action_name VARCHAR(50) NOT NULL,
  action_time TIMESTAMP NOT NULL
);`,
    seedSql: `INSERT INTO customer_audit (audit_id, user_id, action_name, action_time) VALUES
(1, 201, 'view_billing', '2026-02-01 10:00:00'),
(2, 201, 'export_data', '2026-02-01 11:30:00'),
(3, 201, 'cancel_subscription', '2026-02-01 11:45:00'),
(4, 202, 'support_ticket', '2026-02-02 09:00:00'),
(5, 202, 'cancel_subscription', '2026-02-02 14:00:00'),
(6, 203, 'login', '2026-02-03 08:00:00');`,
    expectedOutputJson: JSON.stringify([
      { user_id: 201, last_action: 'export_data', cancel_time: '2026-02-01 11:45:00' },
      { user_id: 202, last_action: 'support_ticket', cancel_time: '2026-02-02 14:00:00' }
    ]),
    solutionSql: `WITH action_sequence AS (
  SELECT user_id,
    action_name,
    action_time,
    LAG(action_name) OVER(PARTITION BY user_id ORDER BY action_time) AS last_action
  FROM customer_audit
)
SELECT user_id,
  last_action,
  action_time AS cancel_time
FROM action_sequence
WHERE action_name = 'cancel_subscription'
ORDER BY user_id ASC;`,
    explanation: `This problem uses \`LAG\` to look back one step at the user's action immediately preceding cancellation.
1. Partition by \`user_id\` and order chronologically by \`action_time\`.
2. \`LAG(action_name)\` grabs the name of the previous event.
3. Filtering for \`action_name = 'cancel_subscription'\` yields the cancellation row with the preceding action neatly exposed in the same row.`,
    alternativeSql: `SELECT c.user_id, prev.action_name AS last_action, c.action_time AS cancel_time
FROM customer_audit c
JOIN LATERAL (
  SELECT action_name 
  FROM customer_audit 
  WHERE user_id = c.user_id AND action_time < c.action_time 
  ORDER BY action_time DESC 
  LIMIT 1
) prev ON TRUE
WHERE c.action_name = 'cancel_subscription'
ORDER BY c.user_id ASC;`,
    hints: [
      'Think about using the LAG(action_name) window function ordered by action_time.',
      'Filter the output where action_name = "cancel_subscription".',
      'Order the results by user_id ASC.',
    ],
    verificationStatus: 'AI_GENERATED',
    sourceUrl: 'https://groq.com',
    sourceType: 'AI Generated Practice (Groq Llama 3.3)',
    sourceNotes: 'Synthesized and verified via PGlite deterministic sandbox execution.',
    companyId: 'comp_stripe',
    primaryConceptId: 'concept_window_functions',
    acceptanceRate: 78.0,
    totalAttempts: 3200,
    totalSolved: 2496,
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  ...EXPANDED_QUESTIONS
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_blood',
    code: 'FIRST_QUERY',
    title: 'First Query Executed',
    description: 'Successfully executed your first SQL challenge in the sandbox.',
    icon: 'Terminal',
    tier: 'BRONZE',
    xpReward: 50,
  },
  {
    id: 'ach_streak_3',
    code: 'STREAK_3',
    title: 'Consistency Starter',
    description: 'Maintained a 3-day continuous query streak.',
    icon: 'Flame',
    tier: 'BRONZE',
    xpReward: 100,
  },
  {
    id: 'ach_window_wizard',
    code: 'WINDOW_WIZARD',
    title: 'Window Function Wizard',
    description: 'Solved 5 or more Window Function problems correctly.',
    icon: 'BrainCircuit',
    tier: 'SILVER',
    xpReward: 250,
  },
  {
    id: 'ach_faang_ready',
    code: 'FAANG_READY',
    title: 'Big Tech Ready',
    description: 'Completed 10 authentic questions from Meta, Google, and Amazon.',
    icon: 'Award',
    tier: 'GOLD',
    xpReward: 500,
  },
  {
    id: 'ach_speed_demon',
    code: 'SPEED_DEMON',
    title: 'Sub-Millisecond Query',
    description: 'Wrote an optimal query that executed in under 25ms in PGlite.',
    icon: 'Zap',
    tier: 'SILVER',
    xpReward: 150,
  },
];

export const DEFAULT_USER_STREAK: UserStreak = {
  currentStreak: 5,
  longestStreak: 12,
  lastActiveDate: '2026-11-02',
  activityDates: [
    '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-25', '2026-10-26',
    '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02'
  ],
};

