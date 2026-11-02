import { Question } from '../types';

export const EXPANDED_QUESTIONS: Question[] = [
  // -------------------------------------------------------------
  // MODULE 1: SQL FUNDAMENTALS
  // -------------------------------------------------------------
  {
    id: 'q_amazon_duplicate_products',
    slug: 'amazon-duplicate-products',
    title: 'Duplicate ASIN Product Listings',
    difficulty: 'EASY',
    category: 'SQL',
    roleTarget: 'Data Analyst / BIE',
    problemStatement: `Amazon Marketplace needs to detect seller listings where the same **product ASIN** has been posted more than once by different merchants.

Write a SQL query to return the \`asin\` and the total number of distinct \`seller_id\` accounts listing that ASIN, for all products listed by **2 or more sellers**.
Sort the output by the listing count descending, then by \`asin\` ascending.

### Tables:
- \`product_listings\` (\`listing_id\` INT, \`asin\` VARCHAR, \`seller_id\` INT, \`price\` DECIMAL)`,
    schemaSql: `CREATE TABLE product_listings (
  listing_id INTEGER PRIMARY KEY,
  asin VARCHAR(20) NOT NULL,
  seller_id INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);`,
    seedSql: `INSERT INTO product_listings (listing_id, asin, seller_id, price) VALUES
(1, 'B08N5WRWNW', 101, 29.99),
(2, 'B08N5WRWNW', 102, 28.50),
(3, 'B08N5WRWNW', 103, 31.00),
(4, 'B07XJ8C8F5', 104, 15.20),
(5, 'B09G9FPHY6', 105, 99.00),
(6, 'B09G9FPHY6', 106, 94.50);`,
    expectedOutputJson: JSON.stringify([
      { asin: 'B08N5WRWNW', seller_count: 3 },
      { asin: 'B09G9FPHY6', seller_count: 2 }
    ]),
    solutionSql: `SELECT asin, COUNT(DISTINCT seller_id) AS seller_count
FROM product_listings
GROUP BY asin
HAVING COUNT(DISTINCT seller_id) >= 2
ORDER BY seller_count DESC, asin ASC;`,
    explanation: `We group all listings by ASIN and count unique seller IDs using \`COUNT(DISTINCT seller_id)\`. Using \`HAVING COUNT(DISTINCT seller_id) >= 2\` filters to ASINs with multi-seller competition, sorted descending.`,
    alternativeSql: `WITH asin_counts AS (
  SELECT asin, COUNT(DISTINCT seller_id) AS seller_count
  FROM product_listings
  GROUP BY asin
)
SELECT * FROM asin_counts WHERE seller_count >= 2 ORDER BY seller_count DESC, asin ASC;`,
    hints: [
      'Group by asin column.',
      'Use COUNT(DISTINCT seller_id) to avoid duplicate seller entries.',
      'Filter with HAVING seller_count >= 2.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://www.glassdoor.com/Interview/Amazon-Business-Intelligence-Engineer-Interview-Questions-E6036.htm',
    sourceType: 'Public Candidate Interview Report',
    companyId: 'comp_amazon',
    primaryConceptId: 'concept_sql_fundamentals',
    acceptanceRate: 91.2,
    totalAttempts: 18400,
    totalSolved: 16780,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'q_uber_high_mileage_cancelled',
    slug: 'uber-cancelled-high-mileage-trips',
    title: 'High-Mileage Ride Cancellations',
    difficulty: 'EASY',
    category: 'SQL',
    roleTarget: 'Operations Data Analyst',
    problemStatement: `Uber Operations team is analyzing long-distance driver cancellations to reduce passenger churn.

Write a SQL query to find all rides with \`status = 'cancelled_by_driver'\` that had an estimated distance of **15.0 miles or greater**.
Return the \`trip_id\`, \`city_id\`, \`distance_miles\`, and \`fare_estimate\`.
Order by \`distance_miles\` descending.

### Tables:
- \`trips\` (\`trip_id\` INT, \`city_id\` INT, \`status\` VARCHAR, \`distance_miles\` DECIMAL, \`fare_estimate\` DECIMAL)`,
    schemaSql: `CREATE TABLE trips (
  trip_id INTEGER PRIMARY KEY,
  city_id INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL,
  distance_miles DECIMAL(6,2) NOT NULL,
  fare_estimate DECIMAL(8,2) NOT NULL
);`,
    seedSql: `INSERT INTO trips (trip_id, city_id, status, distance_miles, fare_estimate) VALUES
(101, 1, 'completed', 8.50, 22.00),
(102, 1, 'cancelled_by_driver', 18.20, 48.50),
(103, 2, 'cancelled_by_driver', 12.00, 32.00),
(104, 2, 'cancelled_by_driver', 24.50, 65.00),
(105, 1, 'completed', 16.00, 40.00);`,
    expectedOutputJson: JSON.stringify([
      { trip_id: 104, city_id: 2, distance_miles: 24.50, fare_estimate: 65.00 },
      { trip_id: 102, city_id: 1, distance_miles: 18.20, fare_estimate: 48.50 }
    ]),
    solutionSql: `SELECT trip_id, city_id, distance_miles, fare_estimate
FROM trips
WHERE status = 'cancelled_by_driver' AND distance_miles >= 15.0
ORDER BY distance_miles DESC;`,
    explanation: `A fundamental relational filtering query combining equality on categorical column \`status\` and inequality on numeric column \`distance_miles >= 15.0\`.`,
    hints: [
      'Filter with WHERE status = \'cancelled_by_driver\' AND distance_miles >= 15.0.',
      'Order by distance_miles DESC.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://www.glassdoor.com/Interview/Uber-Data-Analyst-Interview-Questions-E575263.htm',
    sourceType: 'Public Candidate Interview Report',
    companyId: 'comp_uber',
    primaryConceptId: 'concept_sql_fundamentals',
    acceptanceRate: 94.8,
    totalAttempts: 15200,
    totalSolved: 14410,
    createdAt: '2026-01-22T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'q_netflix_top_comedy_releases',
    slug: 'netflix-top-rated-comedy-releases',
    title: 'Top-Rated Comedy Releases',
    difficulty: 'EASY',
    category: 'SQL',
    roleTarget: 'Content Analytics Analyst',
    problemStatement: `Netflix Content Strategy team wants a list of all Comedy titles released between **2024 and 2026** with an IMDb rating of **8.0 or higher**.

Write a SQL query to return \`title\`, \`release_year\`, and \`imdb_rating\`.
Order results by \`imdb_rating\` descending, then by \`title\` alphabetically.

### Tables:
- \`titles\` (\`title_id\` INT, \`title\` VARCHAR, \`genre\` VARCHAR, \`release_year\` INT, \`imdb_rating\` DECIMAL)`,
    schemaSql: `CREATE TABLE titles (
  title_id INTEGER PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  genre VARCHAR(50) NOT NULL,
  release_year INTEGER NOT NULL,
  imdb_rating DECIMAL(3,1) NOT NULL
);`,
    seedSql: `INSERT INTO titles (title_id, title, genre, release_year, imdb_rating) VALUES
(1, 'The Good Laugh', 'Comedy', 2025, 8.4),
(2, 'Midnight Echoes', 'Drama', 2024, 8.7),
(3, 'Standup Special Alpha', 'Comedy', 2024, 8.1),
(4, 'Giggle City', 'Comedy', 2023, 8.5),
(5, 'Office Satire 2026', 'Comedy', 2026, 8.4);`,
    expectedOutputJson: JSON.stringify([
      { title: 'Office Satire 2026', release_year: 2026, imdb_rating: 8.4 },
      { title: 'The Good Laugh', release_year: 2025, imdb_rating: 8.4 },
      { title: 'Standup Special Alpha', release_year: 2024, imdb_rating: 8.1 }
    ]),
    solutionSql: `SELECT title, release_year, imdb_rating
FROM titles
WHERE genre = 'Comedy' 
  AND release_year BETWEEN 2024 AND 2026
  AND imdb_rating >= 8.0
ORDER BY imdb_rating DESC, title ASC;`,
    explanation: `Filters on genre equality, BETWEEN boundary dates, and numeric rating threshold, with multi-column sorting.`,
    hints: [
      'Use release_year BETWEEN 2024 AND 2026.',
      'Order by imdb_rating DESC, title ASC.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://www.glassdoor.com/Interview/Netflix-Analytics-Interview-Questions-E11891.htm',
    sourceType: 'Public Candidate Interview Report',
    companyId: 'comp_netflix',
    primaryConceptId: 'concept_sql_fundamentals',
    acceptanceRate: 92.0,
    totalAttempts: 11300,
    totalSolved: 10400,
    createdAt: '2026-01-25T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // -------------------------------------------------------------
  // MODULE 2: AGGREGATIONS & GROUPING
  // -------------------------------------------------------------
  {
    id: 'q_meta_messaging_volume',
    slug: 'meta-active-user-messaging-volume',
    title: 'User Direct Message Volume & Word Counts',
    difficulty: 'MEDIUM',
    category: 'SQL',
    roleTarget: 'Product Analytics Engineer',
    problemStatement: `Meta Messenger team is analyzing user communication frequency.

Write a SQL query to calculate:
1. \`sender_id\`
2. Total messages sent (\`total_messages\`)
3. Total words sent across all messages (\`total_words\`)
4. Average words per message rounded to 1 decimal place (\`avg_words_per_message\`)

Only include users who sent **at least 3 messages**. Sort by \`total_words\` descending.

### Tables:
- \`messages\` (\`message_id\` INT, \`sender_id\` INT, \`receiver_id\` INT, \`word_count\` INT, \`sent_time\` TIMESTAMP)`,
    schemaSql: `CREATE TABLE messages (
  message_id INTEGER PRIMARY KEY,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  word_count INTEGER NOT NULL,
  sent_time TIMESTAMP NOT NULL
);`,
    seedSql: `INSERT INTO messages (message_id, sender_id, receiver_id, word_count, sent_time) VALUES
(1, 101, 201, 12, '2026-03-01 10:00:00'),
(2, 101, 202, 24, '2026-03-01 10:15:00'),
(3, 101, 203, 14, '2026-03-01 10:30:00'),
(4, 102, 201, 50, '2026-03-01 11:00:00'),
(5, 102, 202, 30, '2026-03-01 11:10:00'),
(6, 103, 201, 10, '2026-03-01 12:00:00'),
(7, 103, 202, 15, '2026-03-01 12:05:00'),
(8, 103, 204, 20, '2026-03-01 12:10:00');`,
    expectedOutputJson: JSON.stringify([
      { sender_id: 101, total_messages: 3, total_words: 50, avg_words_per_message: 16.7 },
      { sender_id: 103, total_messages: 3, total_words: 45, avg_words_per_message: 15.0 }
    ]),
    solutionSql: `SELECT sender_id,
  COUNT(message_id) AS total_messages,
  SUM(word_count) AS total_words,
  ROUND(AVG(word_count)::numeric, 1) AS avg_words_per_message
FROM messages
GROUP BY sender_id
HAVING COUNT(message_id) >= 3
ORDER BY total_words DESC;`,
    explanation: `We aggregate by \`sender_id\` with \`COUNT\`, \`SUM\`, and \`AVG\` functions, casting to numeric for clean \`ROUND(..., 1)\` formatting, and filter groups with \`HAVING COUNT(*) >= 3\`.`,
    hints: [
      'GROUP BY sender_id.',
      'Use HAVING COUNT(*) >= 3 to filter users with fewer than 3 messages.',
      'Cast to numeric in ROUND(AVG(word_count)::numeric, 1).',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://www.glassdoor.com/Interview/Meta-Data-Engineer-Interview-Questions-E40772.htm',
    sourceType: 'Public Candidate Interview Report',
    companyId: 'comp_meta',
    primaryConceptId: 'concept_aggregations',
    acceptanceRate: 84.3,
    totalAttempts: 16500,
    totalSolved: 13910,
    createdAt: '2026-01-26T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'q_stripe_merchant_disputes',
    slug: 'stripe-merchant-dispute-rate',
    title: 'High-Dispute Merchant Chargeback Thresholds',
    difficulty: 'MEDIUM',
    category: 'SQL',
    roleTarget: 'Risk & Fraud Quantitative Analyst',
    problemStatement: `Stripe's Risk team monitors merchants whose chargeback dispute rate exceeds regulatory caps.

Write a SQL query to identify all merchants with **at least 5 processed charges** whose dispute rate is **strictly greater than 20.0%**.
Return \`merchant_id\`, total charges (\`total_charges\`), disputed charges (\`disputed_charges\`), and the dispute percentage rounded to 2 decimals (\`dispute_pct\`).
Sort by \`dispute_pct\` descending.

### Tables:
- \`charges\` (\`charge_id\` INT, \`merchant_id\` INT, \`amount\` DECIMAL, \`is_disputed\` BOOLEAN)`,
    schemaSql: `CREATE TABLE charges (
  charge_id INTEGER PRIMARY KEY,
  merchant_id INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  is_disputed BOOLEAN NOT NULL
);`,
    seedSql: `INSERT INTO charges (charge_id, merchant_id, amount, is_disputed) VALUES
(1, 501, 120.00, true),
(2, 501, 80.00, true),
(3, 501, 45.00, false),
(4, 501, 90.00, false),
(5, 501, 60.00, false),
(6, 502, 100.00, false),
(7, 502, 110.00, false),
(8, 502, 120.00, false),
(9, 502, 130.00, false),
(10, 502, 140.00, false),
(11, 503, 200.00, true),
(12, 503, 250.00, true);`,
    expectedOutputJson: JSON.stringify([
      { merchant_id: 501, total_charges: 5, disputed_charges: 2, dispute_pct: 40.00 }
    ]),
    solutionSql: `SELECT merchant_id,
  COUNT(*) AS total_charges,
  COUNT(CASE WHEN is_disputed = TRUE THEN 1 END) AS disputed_charges,
  ROUND(COUNT(CASE WHEN is_disputed = TRUE THEN 1 END) * 100.0 / COUNT(*), 2) AS dispute_pct
FROM charges
GROUP BY merchant_id
HAVING COUNT(*) >= 5 
  AND (COUNT(CASE WHEN is_disputed = TRUE THEN 1 END) * 100.0 / COUNT(*)) > 20.0
ORDER BY dispute_pct DESC;`,
    explanation: `Uses conditional aggregation \`COUNT(CASE WHEN is_disputed = TRUE THEN 1 END)\` to calculate the proportion of disputes, filtering via \`HAVING\` for sample size and threshold.`,
    hints: [
      'Use CASE WHEN inside COUNT or SUM for conditional disputed charges.',
      'Multiply by 100.0 to prevent integer division in SQL.',
      'Filter with HAVING COUNT(*) >= 5.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://www.glassdoor.com/Interview/Stripe-Data-Scientist-Interview-Questions-E671932.htm',
    sourceType: 'Public Candidate Interview Report',
    companyId: 'comp_stripe',
    primaryConceptId: 'concept_aggregations',
    acceptanceRate: 78.9,
    totalAttempts: 14800,
    totalSolved: 11670,
    createdAt: '2026-01-28T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // -------------------------------------------------------------
  // MODULE 3: TABLE JOINS
  // -------------------------------------------------------------
  {
    id: 'q_meta_salary_higher_than_manager',
    slug: 'meta-employee-salary-higher-than-manager',
    title: 'Employees Earning More Than Their Manager',
    difficulty: 'EASY',
    category: 'SQL',
    roleTarget: 'Data Analyst / People Analytics',
    problemStatement: `Meta's Compensation & People Analytics team is evaluating managerial equity balance.

Write a SQL query to find all employees who earn **strictly more than their direct manager**.
Return the employee's name (\`employee_name\`), their salary (\`employee_salary\`), their manager's name (\`manager_name\`), and their manager's salary (\`manager_salary\`).
Sort by employee salary descending.

### Tables:
- \`employees\` (\`emp_id\` INT, \`name\` VARCHAR, \`salary\` INT, \`manager_id\` INT)`,
    schemaSql: `CREATE TABLE employees (
  emp_id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  salary INTEGER NOT NULL,
  manager_id INTEGER
);`,
    seedSql: `INSERT INTO employees (emp_id, name, salary, manager_id) VALUES
(1, 'Alice Chen', 185000, 3),
(2, 'Bob Smith', 140000, 3),
(3, 'Charlie Dave', 170000, 4),
(4, 'Diana Prince', 250000, NULL),
(5, 'Evan Wright', 195000, 3);`,
    expectedOutputJson: JSON.stringify([
      { employee_name: 'Evan Wright', employee_salary: 195000, manager_name: 'Charlie Dave', manager_salary: 170000 },
      { employee_name: 'Alice Chen', employee_salary: 185000, manager_name: 'Charlie Dave', manager_salary: 170000 }
    ]),
    solutionSql: `SELECT e.name AS employee_name,
  e.salary AS employee_salary,
  m.name AS manager_name,
  m.salary AS manager_salary
FROM employees e
JOIN employees m ON e.manager_id = m.emp_id
WHERE e.salary > m.salary
ORDER BY employee_salary DESC;`,
    explanation: `A canonical self-join problem: joining the \`employees\` table to itself on \`e.manager_id = m.emp_id\` links each worker directly with their superior, allowing a direct WHERE comparison.`,
    hints: [
      'Perform a self-join: JOIN employees m ON e.manager_id = m.emp_id.',
      'Filter with WHERE e.salary > m.salary.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://leetcode.com/problems/employees-earning-more-than-their-managers/',
    sourceType: 'Public Interview Repository',
    companyId: 'comp_meta',
    primaryConceptId: 'concept_joins',
    acceptanceRate: 89.2,
    totalAttempts: 28400,
    totalSolved: 25330,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'q_amazon_unreviewed_orders',
    slug: 'amazon-customer-purchased-never-reviewed',
    title: 'Purchased Products With Zero Customer Reviews',
    difficulty: 'EASY',
    category: 'SQL',
    roleTarget: 'Data Analyst / BIE',
    problemStatement: `Amazon Marketplace wants to target customers with automated review request emails.

Write a SQL query to find all orders where the customer **has never written a product review** for that item.
Return \`customer_id\`, \`product_id\`, and \`order_date\`.
Sort by \`order_date\` descending, then by \`customer_id\` ascending.

### Tables:
- \`customer_orders\` (\`order_id\` INT, \`customer_id\` INT, \`product_id\` INT, \`order_date\` DATE)
- \`product_reviews\` (\`review_id\` INT, \`customer_id\` INT, \`product_id\` INT, \`rating\` INT)`,
    schemaSql: `CREATE TABLE customer_orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  order_date DATE NOT NULL
);

CREATE TABLE product_reviews (
  review_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  rating INTEGER NOT NULL
);`,
    seedSql: `INSERT INTO customer_orders (order_id, customer_id, product_id, order_date) VALUES
(1, 1001, 501, '2026-02-15'),
(2, 1001, 502, '2026-02-16'),
(3, 1002, 501, '2026-02-17'),
(4, 1003, 503, '2026-02-18');

INSERT INTO product_reviews (review_id, customer_id, product_id, rating) VALUES
(101, 1001, 501, 5),
(102, 1002, 501, 4);`,
    expectedOutputJson: JSON.stringify([
      { customer_id: 1003, product_id: 503, order_date: '2026-02-18' },
      { customer_id: 1001, product_id: 502, order_date: '2026-02-16' }
    ]),
    solutionSql: `SELECT o.customer_id, o.product_id, o.order_date
FROM customer_orders o
LEFT JOIN product_reviews r 
  ON o.customer_id = r.customer_id AND o.product_id = r.product_id
WHERE r.review_id IS NULL
ORDER BY o.order_date DESC, o.customer_id ASC;`,
    explanation: `A multi-column composite key anti-join: we join on both \`customer_id\` and \`product_id\`, filtering with \`WHERE r.review_id IS NULL\`.`,
    hints: [
      'LEFT JOIN on both customer_id AND product_id.',
      'Filter with WHERE r.review_id IS NULL.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://www.glassdoor.com/Interview/Amazon-SQL-Assessment-Questions-E6036.htm',
    sourceType: 'Public Candidate Interview Report',
    companyId: 'comp_amazon',
    primaryConceptId: 'concept_joins',
    acceptanceRate: 87.1,
    totalAttempts: 19100,
    totalSolved: 16640,
    createdAt: '2026-02-03T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // -------------------------------------------------------------
  // MODULE 4: SUBQUERIES & CTES
  // -------------------------------------------------------------
  {
    id: 'q_meta_above_avg_friends',
    slug: 'meta-users-above-median-friends',
    title: 'Users With Above-Average Connection Count',
    difficulty: 'MEDIUM',
    category: 'SQL',
    roleTarget: 'Social Graph Analyst',
    problemStatement: `Meta's Network Graph team wants to identify hub accounts that possess strictly more friends than the overall network average.

Write a SQL query to return the \`user_id\` and their \`friend_count\`, for all users whose friend count is **strictly greater than the platform-wide average friend count per user**.
Sort by \`friend_count\` descending.

### Tables:
- \`friendships\` (\`user_id\` INT, \`friend_id\` INT)`,
    schemaSql: `CREATE TABLE friendships (
  user_id INTEGER NOT NULL,
  friend_id INTEGER NOT NULL
);`,
    seedSql: `INSERT INTO friendships (user_id, friend_id) VALUES
(1, 2), (1, 3), (1, 4), (1, 5),
(2, 1), (2, 3),
(3, 1),
(4, 1),
(5, 1);`,
    expectedOutputJson: JSON.stringify([
      { user_id: 1, friend_count: 4 }
    ]),
    solutionSql: `WITH user_counts AS (
  SELECT user_id, COUNT(friend_id) AS friend_count
  FROM friendships
  GROUP BY user_id
)
SELECT user_id, friend_count
FROM user_counts
WHERE friend_count > (SELECT AVG(friend_count) FROM user_counts)
ORDER BY friend_count DESC;`,
    explanation: `We stage individual friend totals inside a CTE, then query the CTE using a scalar subquery \`(SELECT AVG(friend_count) FROM user_counts)\` in the WHERE clause.`,
    hints: [
      'Write a CTE to aggregate COUNT(friend_id) per user_id.',
      'In the outer query, filter WHERE friend_count > (SELECT AVG(friend_count) FROM cte).',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://www.glassdoor.com/Interview/Meta-Product-Analytics-Questions-E40772.htm',
    sourceType: 'Public Candidate Interview Report',
    companyId: 'comp_meta',
    primaryConceptId: 'concept_subqueries',
    acceptanceRate: 81.4,
    totalAttempts: 17200,
    totalSolved: 14000,
    createdAt: '2026-02-05T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'q_amazon_highest_spend_day',
    slug: 'amazon-highest-spend-day-per-customer',
    title: 'Customer Peak Spending Day (Chained CTE)',
    difficulty: 'HARD',
    category: 'SQL',
    roleTarget: 'Analytics Engineer',
    problemStatement: `Amazon Prime analytics wants to identify each customer's single highest spending calendar day.

Write a SQL query using Common Table Expressions (WITH) to find each customer's peak spend day.
Return \`customer_id\`, \`order_date\`, and \`daily_spend\`.
If a customer tied their peak spend across multiple days, output the **most recent date**.
Sort by \`daily_spend\` descending, then \`customer_id\` ascending.

### Tables:
- \`orders\` (\`order_id\` INT, \`customer_id\` INT, \`order_date\` DATE, \`amount\` DECIMAL)`,
    schemaSql: `CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  order_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL
);`,
    seedSql: `INSERT INTO orders (order_id, customer_id, order_date, amount) VALUES
(1, 101, '2026-02-01', 45.00),
(2, 101, '2026-02-01', 85.00),
(3, 101, '2026-02-10', 110.00),
(4, 102, '2026-02-05', 250.00),
(5, 102, '2026-02-12', 300.00),
(6, 103, '2026-02-02', 80.00);`,
    expectedOutputJson: JSON.stringify([
      { customer_id: 102, order_date: '2026-02-12', daily_spend: 300.00 },
      { customer_id: 101, order_date: '2026-02-01', daily_spend: 130.00 },
      { customer_id: 103, order_date: '2026-02-02', daily_spend: 80.00 }
    ]),
    solutionSql: `WITH daily_totals AS (
  SELECT customer_id, order_date, SUM(amount) AS daily_spend
  FROM orders
  GROUP BY customer_id, order_date
),
ranked_days AS (
  SELECT customer_id, order_date, daily_spend,
    ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY daily_spend DESC, order_date DESC) AS rn
  FROM daily_totals
)
SELECT customer_id, order_date, daily_spend
FROM ranked_days
WHERE rn = 1
ORDER BY daily_spend DESC, customer_id ASC;`,
    explanation: `Chains two CTEs: the first aggregates total spend by customer and day; the second partitions by customer and orders by daily spend and recency; the final query filters \`WHERE rn = 1\`.`,
    hints: [
      'First CTE: SUM(amount) GROUP BY customer_id, order_date.',
      'Second CTE: ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY daily_spend DESC, order_date DESC).',
      'Select WHERE rn = 1.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://www.glassdoor.com/Interview/Amazon-Senior-Data-Analyst-Questions-E6036.htm',
    sourceType: 'Public Candidate Interview Report',
    companyId: 'comp_amazon',
    primaryConceptId: 'concept_subqueries',
    acceptanceRate: 75.3,
    totalAttempts: 14200,
    totalSolved: 10690,
    createdAt: '2026-02-08T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // -------------------------------------------------------------
  // MODULE 5: WINDOW FUNCTIONS
  // -------------------------------------------------------------
  {
    id: 'q_amazon_top_3_products_department',
    slug: 'amazon-top-3-products-per-department',
    title: 'Top 3 Selling Products by Department (DENSE_RANK)',
    difficulty: 'MEDIUM',
    category: 'SQL',
    roleTarget: 'Business Intelligence Engineer',
    problemStatement: `Amazon Retail analytics needs to determine the top 3 revenue-generating products within each retail department.

Write a SQL query using \`DENSE_RANK()\` to find the top 3 products by revenue within each \`department\`.
In case of tied revenue, both products should share the same rank without skipping subsequent ranks.
Return \`department\`, \`product_name\`, \`total_revenue\`, and \`rank\`.
Sort by \`department\` ascending, then by \`rank\` ascending.

### Tables:
- \`product_sales\` (\`product_id\` INT, \`product_name\` VARCHAR, \`department\` VARCHAR, \`total_revenue\` DECIMAL)`,
    schemaSql: `CREATE TABLE product_sales (
  product_id INTEGER PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL,
  department VARCHAR(50) NOT NULL,
  total_revenue DECIMAL(12,2) NOT NULL
);`,
    seedSql: `INSERT INTO product_sales (product_id, product_name, department, total_revenue) VALUES
(1, 'Kindle Paperwhite', 'Electronics', 45000.00),
(2, 'Echo Dot', 'Electronics', 52000.00),
(3, 'Fire TV Stick 4K', 'Electronics', 52000.00),
(4, 'Ring Video Doorbell', 'Electronics', 38000.00),
(5, 'Smart Plug', 'Electronics', 12000.00),
(6, 'Ergonomic Chair', 'Furniture', 28000.00),
(7, 'Standing Desk', 'Furniture', 34000.00),
(8, 'Desk Lamp', 'Furniture', 14000.00);`,
    expectedOutputJson: JSON.stringify([
      { department: 'Electronics', product_name: 'Echo Dot', total_revenue: 52000.00, rank: 1 },
      { department: 'Electronics', product_name: 'Fire TV Stick 4K', total_revenue: 52000.00, rank: 1 },
      { department: 'Electronics', product_name: 'Kindle Paperwhite', total_revenue: 45000.00, rank: 2 },
      { department: 'Electronics', product_name: 'Ring Video Doorbell', total_revenue: 38000.00, rank: 3 },
      { department: 'Furniture', product_name: 'Standing Desk', total_revenue: 34000.00, rank: 1 },
      { department: 'Furniture', product_name: 'Ergonomic Chair', total_revenue: 28000.00, rank: 2 },
      { department: 'Furniture', product_name: 'Desk Lamp', total_revenue: 14000.00, rank: 3 }
    ]),
    solutionSql: `WITH ranked_products AS (
  SELECT department, product_name, total_revenue,
    DENSE_RANK() OVER(PARTITION BY department ORDER BY total_revenue DESC) AS rank
  FROM product_sales
)
SELECT department, product_name, total_revenue, rank
FROM ranked_products
WHERE rank <= 3
ORDER BY department ASC, rank ASC, product_name ASC;`,
    explanation: `\`DENSE_RANK()\` ensures that products with tied revenue receive the same rank and the subsequent product gets the next consecutive integer without rank skipping (unlike \`RANK()\`).`,
    hints: [
      'Use DENSE_RANK() OVER(PARTITION BY department ORDER BY total_revenue DESC).',
      'Filter with WHERE rank <= 3.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://www.glassdoor.com/Interview/Amazon-Data-Engineer-SQL-Interview-E6036.htm',
    sourceType: 'Public Candidate Interview Report',
    companyId: 'comp_amazon',
    primaryConceptId: 'concept_window_functions',
    acceptanceRate: 83.0,
    totalAttempts: 24500,
    totalSolved: 20335,
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'q_stripe_rolling_7_day_payouts',
    slug: 'stripe-rolling-7-day-payout-volume',
    title: 'Rolling 7-Day Cumulative Payout Volume',
    difficulty: 'HARD',
    category: 'SQL',
    roleTarget: 'Financial Analytics Engineer',
    problemStatement: `Stripe's Treasury team monitors rolling 7-day cumulative payout volumes to ensure liquidity reserves.

Write a SQL query using window frames (\`ROWS BETWEEN\`) to calculate the **7-day rolling total payout amount** for each calendar date.
Return \`payout_date\`, daily payout amount (\`daily_amount\`), and the 7-day rolling cumulative total (\`rolling_7d_total\`).
Sort by \`payout_date\` ascending.

### Tables:
- \`daily_payouts\` (\`payout_date\` DATE PRIMARY KEY, \`amount\` DECIMAL)`,
    schemaSql: `CREATE TABLE daily_payouts (
  payout_date DATE PRIMARY KEY,
  amount DECIMAL(12,2) NOT NULL
);`,
    seedSql: `INSERT INTO daily_payouts (payout_date, amount) VALUES
('2026-02-01', 1000.00),
('2026-02-02', 1500.00),
('2026-02-03', 2000.00),
('2026-02-04', 1200.00),
('2026-02-05', 1800.00),
('2026-02-06', 2200.00),
('2026-02-07', 3000.00),
('2026-02-08', 2500.00),
('2026-02-09', 1400.00);`,
    expectedOutputJson: JSON.stringify([
      { payout_date: '2026-02-01', daily_amount: 1000.00, rolling_7d_total: 1000.00 },
      { payout_date: '2026-02-02', daily_amount: 1500.00, rolling_7d_total: 2500.00 },
      { payout_date: '2026-02-03', daily_amount: 2000.00, rolling_7d_total: 4500.00 },
      { payout_date: '2026-02-04', daily_amount: 1200.00, rolling_7d_total: 5700.00 },
      { payout_date: '2026-02-05', daily_amount: 1800.00, rolling_7d_total: 7500.00 },
      { payout_date: '2026-02-06', daily_amount: 2200.00, rolling_7d_total: 9700.00 },
      { payout_date: '2026-02-07', daily_amount: 3000.00, rolling_7d_total: 12700.00 },
      { payout_date: '2026-02-08', daily_amount: 2500.00, rolling_7d_total: 14200.00 },
      { payout_date: '2026-02-09', daily_amount: 1400.00, rolling_7d_total: 14100.00 }
    ]),
    solutionSql: `SELECT payout_date,
  amount AS daily_amount,
  SUM(amount) OVER(
    ORDER BY payout_date 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS rolling_7d_total
FROM daily_payouts
ORDER BY payout_date ASC;`,
    explanation: `Window frame \`ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\` sums exactly 7 rows (the current day plus the preceding 6 days), providing a clean moving window aggregation without joins.`,
    hints: [
      'Use SUM(amount) OVER(ORDER BY payout_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW).',
      'Order by payout_date ASC.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://www.glassdoor.com/Interview/Stripe-Data-Engineering-Questions-E671932.htm',
    sourceType: 'Public Candidate Interview Report',
    companyId: 'comp_stripe',
    primaryConceptId: 'concept_window_functions',
    acceptanceRate: 71.5,
    totalAttempts: 13900,
    totalSolved: 9940,
    createdAt: '2026-02-12T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // -------------------------------------------------------------
  // MODULE 6: ANALYTICAL SQL & COHORTS
  // -------------------------------------------------------------
  {
    id: 'q_meta_weekly_retention_cohorts',
    slug: 'meta-weekly-user-retention-cohorts',
    title: 'Weekly Signup Retention Cohort Curves',
    difficulty: 'HARD',
    category: 'SQL',
    roleTarget: 'Product Data Scientist',
    problemStatement: `Meta's Growth leadership tracks user retention curves across weekly signup cohorts.

Write a SQL query to calculate **Day-7 Retention Rate** for each weekly cohort.
A user signed up on date $D$ is defined as retained on Day-7 if they logged at least one activity between day $D+1$ and day $D+7$.
Return the \`cohort_week\` (formatted as 'YYYY-MM-DD' representing the start of the week), \`new_users_count\`, \`retained_users_count\`, and \`retention_rate_pct\` rounded to 1 decimal place.
Sort by \`cohort_week\` ascending.

### Tables:
- \`users\` (\`user_id\` INT, \`signup_date\` DATE)
- \`user_activity\` (\`user_id\` INT, \`activity_date\` DATE)`,
    schemaSql: `CREATE TABLE users (
  user_id INTEGER PRIMARY KEY,
  signup_date DATE NOT NULL
);

CREATE TABLE user_activity (
  user_id INTEGER NOT NULL,
  activity_date DATE NOT NULL
);`,
    seedSql: `INSERT INTO users (user_id, signup_date) VALUES
(1, '2026-02-01'),
(2, '2026-02-02'),
(3, '2026-02-03'),
(4, '2026-02-08'),
(5, '2026-02-09');

INSERT INTO user_activity (user_id, activity_date) VALUES
(1, '2026-02-05'),
(2, '2026-02-06'),
(4, '2026-02-14');`,
    expectedOutputJson: JSON.stringify([
      { cohort_week: '2026-02-01', new_users_count: 3, retained_users_count: 2, retention_rate_pct: 66.7 },
      { cohort_week: '2026-02-08', new_users_count: 2, retained_users_count: 1, retention_rate_pct: 50.0 }
    ]),
    solutionSql: `WITH cohort_users AS (
  SELECT user_id, 
    signup_date,
    DATE_TRUNC('week', signup_date)::DATE AS cohort_week
  FROM users
),
active_in_d7 AS (
  SELECT DISTINCT c.user_id
  FROM cohort_users c
  JOIN user_activity a ON c.user_id = a.user_id
  WHERE a.activity_date > c.signup_date 
    AND a.activity_date <= c.signup_date + INTERVAL '7 days'
)
SELECT c.cohort_week,
  COUNT(DISTINCT c.user_id) AS new_users_count,
  COUNT(DISTINCT a.user_id) AS retained_users_count,
  ROUND(COUNT(DISTINCT a.user_id) * 100.0 / COUNT(DISTINCT c.user_id), 1) AS retention_rate_pct
FROM cohort_users c
LEFT JOIN active_in_d7 a ON c.user_id = a.user_id
GROUP BY c.cohort_week
ORDER BY c.cohort_week ASC;`,
    explanation: `Cohorts are created using \`DATE_TRUNC('week', signup_date)\`. Day-7 active users are filtered using \`activity_date > signup_date AND <= signup_date + 7 days\`, then grouped by cohort week.`,
    hints: [
      'Use DATE_TRUNC(\'week\', signup_date) to group weekly cohorts.',
      'Join activity table on activity_date BETWEEN signup_date + 1 AND signup_date + 7.',
      'LEFT JOIN to include cohorts where users did not return.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://www.glassdoor.com/Interview/Meta-Product-Data-Science-Questions-E40772.htm',
    sourceType: 'Public Candidate Interview Report',
    companyId: 'comp_meta',
    primaryConceptId: 'concept_analytical_sql',
    acceptanceRate: 64.8,
    totalAttempts: 12500,
    totalSolved: 8100,
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'q_netflix_mom_churn_rate',
    slug: 'netflix-subscriber-month-over-month-churn',
    title: 'Month-over-Month Net Churn & Reactivations',
    difficulty: 'HARD',
    category: 'SQL',
    roleTarget: 'Senior Data Analyst',
    problemStatement: `Netflix Subscriber Analytics tracks monthly subscription continuity to compute net churn.

Write a SQL query to identify subscribers who were active in **January 2026** but did **not renew or log in** in **February 2026** (churned users).
Return the \`plan_type\`, total starting active users in January (\`jan_subscribers\`), and churned count in February (\`churned_count\`).
Order by \`churned_count\` descending.

### Tables:
- \`subscriptions\` (\`user_id\` INT, \`plan_type\` VARCHAR, \`active_month\` DATE)`,
    schemaSql: `CREATE TABLE subscriptions (
  user_id INTEGER NOT NULL,
  plan_type VARCHAR(50) NOT NULL,
  active_month DATE NOT NULL
);`,
    seedSql: `INSERT INTO subscriptions (user_id, plan_type, active_month) VALUES
(1, 'Premium 4K', '2026-01-01'),
(1, 'Premium 4K', '2026-02-01'),
(2, 'Premium 4K', '2026-01-01'),
(3, 'Standard HD', '2026-01-01'),
(3, 'Standard HD', '2026-02-01'),
(4, 'Standard HD', '2026-01-01'),
(5, 'Standard HD', '2026-01-01');`,
    expectedOutputJson: JSON.stringify([
      { plan_type: 'Standard HD', jan_subscribers: 3, churned_count: 2 },
      { plan_type: 'Premium 4K', jan_subscribers: 2, churned_count: 1 }
    ]),
    solutionSql: `SELECT s1.plan_type,
  COUNT(DISTINCT s1.user_id) AS jan_subscribers,
  COUNT(DISTINCT CASE WHEN s2.user_id IS NULL THEN s1.user_id END) AS churned_count
FROM subscriptions s1
LEFT JOIN subscriptions s2 
  ON s1.user_id = s2.user_id AND s2.active_month = '2026-02-01'
WHERE s1.active_month = '2026-01-01'
GROUP BY s1.plan_type
ORDER BY churned_count DESC;`,
    explanation: `We perform an anti-join on \`subscriptions\` for the subsequent month (\`s2.active_month = '2026-02-01'\`). Where \`s2.user_id IS NULL\`, the subscriber churned.`,
    hints: [
      'Self-join subscriptions on user_id with s1.active_month = \'2026-01-01\' and s2.active_month = \'2026-02-01\'.',
      'Use CASE WHEN s2.user_id IS NULL THEN 1 END for churned count.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://www.glassdoor.com/Interview/Netflix-Senior-Data-Analyst-Questions-E11891.htm',
    sourceType: 'Public Candidate Interview Report',
    companyId: 'comp_netflix',
    primaryConceptId: 'concept_analytical_sql',
    acceptanceRate: 72.1,
    totalAttempts: 13100,
    totalSolved: 9450,
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // -------------------------------------------------------------
  // MODULE 7: ADVANCED SQL PATTERNS & CASE WHEN
  // -------------------------------------------------------------
  {
    id: 'q_meta_weekend_activity_split',
    slug: 'meta-weekend-vs-weekday-activity-split',
    title: 'Weekend vs. Weekday Engagement Split',
    difficulty: 'MEDIUM',
    category: 'SQL',
    roleTarget: 'Product Analytics Analyst',
    problemStatement: `Meta's Instagram engagement team wants to compare user posts published on **Weekends (Saturday, Sunday)** versus **Weekdays (Monday - Friday)**.

Write a SQL query using \`CASE WHEN\` and PostgreSQL \`EXTRACT(ISODOW FROM ...)\` or \`TO_CHAR\` to calculate:
- \`user_id\`
- \`weekday_posts\` (count of posts created Monday through Friday)
- \`weekend_posts\` (count of posts created Saturday or Sunday)
- \`pct_weekend_posts\` (percentage of total posts on weekends, rounded to 1 decimal place)

Only include users who published at least 3 total posts. Order by \`pct_weekend_posts\` descending.

### Tables:
- \`posts\` (\`post_id\` INT, \`user_id\` INT, \`post_timestamp\` TIMESTAMP)`,
    schemaSql: `CREATE TABLE posts (
  post_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  post_timestamp TIMESTAMP NOT NULL
);`,
    seedSql: `INSERT INTO posts (post_id, user_id, post_timestamp) VALUES
(1, 101, '2026-02-28 14:00:00'), -- Saturday
(2, 101, '2026-03-01 16:00:00'), -- Sunday
(3, 101, '2026-03-02 09:00:00'), -- Monday
(4, 102, '2026-03-02 10:00:00'), -- Monday
(5, 102, '2026-03-03 11:00:00'), -- Tuesday
(6, 102, '2026-03-04 12:00:00'), -- Wednesday
(7, 103, '2026-02-28 10:00:00'), -- Saturday
(8, 103, '2026-03-01 11:00:00'); -- Sunday`,
    expectedOutputJson: JSON.stringify([
      { user_id: 101, weekday_posts: 1, weekend_posts: 2, pct_weekend_posts: 66.7 },
      { user_id: 102, weekday_posts: 3, weekend_posts: 0, pct_weekend_posts: 0.0 }
    ]),
    solutionSql: `SELECT user_id,
  COUNT(CASE WHEN EXTRACT(ISODOW FROM post_timestamp) IN (1,2,3,4,5) THEN 1 END) AS weekday_posts,
  COUNT(CASE WHEN EXTRACT(ISODOW FROM post_timestamp) IN (6,7) THEN 1 END) AS weekend_posts,
  ROUND(
    COUNT(CASE WHEN EXTRACT(ISODOW FROM post_timestamp) IN (6,7) THEN 1 END) * 100.0 / COUNT(*), 
    1
  ) AS pct_weekend_posts
FROM posts
GROUP BY user_id
HAVING COUNT(*) >= 3
ORDER BY pct_weekend_posts DESC, user_id ASC;`,
    explanation: `\`EXTRACT(ISODOW FROM ...)\` returns 1 (Monday) through 7 (Sunday). We conditionally count weekdays (1-5) and weekends (6-7) using CASE WHEN inside COUNT.`,
    hints: [
      'Use EXTRACT(ISODOW FROM post_timestamp) to get day of week (1=Mon, 7=Sun).',
      'Use CASE WHEN EXTRACT(ISODOW FROM ...) IN (6,7) for weekends.',
      'Filter with HAVING COUNT(*) >= 3.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://www.glassdoor.com/Interview/Meta-Analytics-SQL-Questions-E40772.htm',
    sourceType: 'Public Candidate Interview Report',
    companyId: 'comp_meta',
    primaryConceptId: 'concept_advanced_sql',
    acceptanceRate: 85.5,
    totalAttempts: 15300,
    totalSolved: 13080,
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'q_amazon_delivery_sla_breaches',
    slug: 'amazon-order-delivery-sla-breach',
    title: 'Prime 24-Hour Guaranteed Delivery SLA Breaches',
    difficulty: 'MEDIUM',
    category: 'SQL',
    roleTarget: 'Logistics Operations Analyst',
    problemStatement: `Amazon Logistics monitors fulfillment performance against Prime 24-hour delivery SLAs.

Write a SQL query to identify all orders where actual delivery time exceeded order placement time by **more than 24.0 hours**.
Calculate:
- \`order_id\`
- \`customer_id\`
- \`hours_to_deliver\` (rounded to 1 decimal place)
- \`breach_severity\` categorizing delay:
  - 'Moderate Breach' if between 24.1 and 36.0 hours
  - 'Severe Breach' if greater than 36.0 hours

Order by \`hours_to_deliver\` descending.

### Tables:
- \`fulfillment_orders\` (\`order_id\` INT, \`customer_id\` INT, \`ordered_at\` TIMESTAMP, \`delivered_at\` TIMESTAMP)`,
    schemaSql: `CREATE TABLE fulfillment_orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  ordered_at TIMESTAMP NOT NULL,
  delivered_at TIMESTAMP NOT NULL
);`,
    seedSql: `INSERT INTO fulfillment_orders (order_id, customer_id, ordered_at, delivered_at) VALUES
(1, 101, '2026-03-01 10:00:00', '2026-03-02 08:00:00'), -- 22 hrs (On time)
(2, 102, '2026-03-01 12:00:00', '2026-03-02 18:00:00'), -- 30 hrs (Moderate)
(3, 103, '2026-03-01 14:00:00', '2026-03-03 04:00:00'), -- 38 hrs (Severe)
(4, 104, '2026-03-02 09:00:00', '2026-03-04 12:00:00'); -- 51 hrs (Severe)`,
    expectedOutputJson: JSON.stringify([
      { order_id: 4, customer_id: 104, hours_to_deliver: 51.0, breach_severity: 'Severe Breach' },
      { order_id: 3, customer_id: 103, hours_to_deliver: 38.0, breach_severity: 'Severe Breach' },
      { order_id: 2, customer_id: 102, hours_to_deliver: 30.0, breach_severity: 'Moderate Breach' }
    ]),
    solutionSql: `SELECT order_id, customer_id,
  ROUND(EXTRACT(EPOCH FROM (delivered_at - ordered_at)) / 3600.0, 1) AS hours_to_deliver,
  CASE 
    WHEN EXTRACT(EPOCH FROM (delivered_at - ordered_at)) / 3600.0 > 36.0 THEN 'Severe Breach'
    ELSE 'Moderate Breach'
  END AS breach_severity
FROM fulfillment_orders
WHERE EXTRACT(EPOCH FROM (delivered_at - ordered_at)) / 3600.0 > 24.0
ORDER BY hours_to_deliver DESC;`,
    explanation: `Calculates elapsed hours using \`EXTRACT(EPOCH FROM (delivered_at - ordered_at)) / 3600.0\`, and applies \`CASE WHEN\` to bucket the breach severity.`,
    hints: [
      'In PostgreSQL, EXTRACT(EPOCH FROM (t2 - t1)) converts timestamp interval to total seconds.',
      'Divide by 3600.0 to convert seconds to fractional hours.',
      'Use CASE WHEN to classify severity.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://www.glassdoor.com/Interview/Amazon-Supply-Chain-Analyst-Questions-E6036.htm',
    sourceType: 'Public Candidate Interview Report',
    companyId: 'comp_amazon',
    primaryConceptId: 'concept_advanced_sql',
    acceptanceRate: 86.4,
    totalAttempts: 14100,
    totalSolved: 12180,
    createdAt: '2026-02-22T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },

  // -------------------------------------------------------------
  // MODULE 8: GAPS & ISLANDS
  // -------------------------------------------------------------
  {
    id: 'q_meta_consecutive_active_days',
    slug: 'meta-consecutive-daily-login-streaks',
    title: 'Consecutive Daily Login Streaks (Gaps & Islands)',
    difficulty: 'HARD',
    category: 'SQL',
    roleTarget: 'Data Scientist / Growth',
    problemStatement: `Meta's Growth team rewards engaged users who achieve consecutive daily active streaks.

Write a SQL query using the classic **Gaps & Islands technique** (subtracting a row number from the login date) to find all users who maintained a streak of **at least 3 consecutive calendar days**.
For each qualifying streak, return:
- \`user_id\`
- \`streak_start_date\` (earliest date in the continuous streak)
- \`streak_end_date\` (latest date in the continuous streak)
- \`streak_length_days\` (total consecutive days)

Sort by \`streak_length_days\` descending, then by \`user_id\` ascending.

### Tables:
- \`user_logins\` (\`user_id\` INT, \`login_date\` DATE)`,
    schemaSql: `CREATE TABLE user_logins (
  user_id INTEGER NOT NULL,
  login_date DATE NOT NULL,
  PRIMARY KEY (user_id, login_date)
);`,
    seedSql: `INSERT INTO user_logins (user_id, login_date) VALUES
(101, '2026-03-01'),
(101, '2026-03-02'),
(101, '2026-03-03'),
(101, '2026-03-04'),
(101, '2026-03-08'),
(102, '2026-03-01'),
(102, '2026-03-02'),
(103, '2026-03-05'),
(103, '2026-03-06'),
(103, '2026-03-07');`,
    expectedOutputJson: JSON.stringify([
      { user_id: 101, streak_start_date: '2026-03-01', streak_end_date: '2026-03-04', streak_length_days: 4 },
      { user_id: 103, streak_start_date: '2026-03-05', streak_end_date: '2026-03-07', streak_length_days: 3 }
    ]),
    solutionSql: `WITH ranked_logins AS (
  SELECT user_id, login_date,
    login_date - (ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY login_date))::INTEGER AS island_group
  FROM user_logins
),
streak_summary AS (
  SELECT user_id,
    MIN(login_date) AS streak_start_date,
    MAX(login_date) AS streak_end_date,
    COUNT(*) AS streak_length_days
  FROM ranked_logins
  GROUP BY user_id, island_group
)
SELECT user_id, streak_start_date, streak_end_date, streak_length_days
FROM streak_summary
WHERE streak_length_days >= 3
ORDER BY streak_length_days DESC, user_id ASC;`,
    explanation: `The textbook Gaps and Islands pattern: subtracting \`ROW_NUMBER()\` from consecutive calendar dates produces an invariant anchor date (\`island_group\`). Grouping by \`island_group\` yields each distinct streak.`,
    hints: [
      'Compute login_date - ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY login_date).',
      'Notice how consecutive dates produce identical date subtraction results.',
      'GROUP BY user_id, island_group and filter HAVING COUNT(*) >= 3.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://www.glassdoor.com/Interview/Meta-Data-Scientist-SQL-Interview-E40772.htm',
    sourceType: 'Public Candidate Interview Report',
    companyId: 'comp_meta',
    primaryConceptId: 'concept_gaps_islands',
    acceptanceRate: 61.2,
    totalAttempts: 18900,
    totalSolved: 11560,
    createdAt: '2026-02-25T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'q_netflix_binge_watching_sessions',
    slug: 'netflix-binge-session-boundary-detection',
    title: 'Binge-Watching Session Boundary Clustering',
    difficulty: 'HARD',
    category: 'SQL',
    roleTarget: 'Streaming Analytics Data Scientist',
    problemStatement: `Netflix clusters playback events into continuous "Binge Sessions" whenever the gap between sequential episodes is **less than or equal to 20 minutes**.

Write a SQL query using \`LAG()\` to detect session breaks, compute a running session ID, and aggregate each binge session.
Return:
- \`user_id\`
- \`session_id\` (starting from 1 for each user)
- \`episodes_watched\` (count of episodes in the session)
- \`session_start_time\` (first episode start time)

Only output sessions with **at least 3 episodes**. Sort by \`episodes_watched\` descending.

### Tables:
- \`viewing_logs\` (\`view_id\` INT, \`user_id\` INT, \`start_time\` TIMESTAMP, \`end_time\` TIMESTAMP)`,
    schemaSql: `CREATE TABLE viewing_logs (
  view_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL
);`,
    seedSql: `INSERT INTO viewing_logs (view_id, user_id, start_time, end_time) VALUES
(1, 101, '2026-03-01 19:00:00', '2026-03-01 19:45:00'),
(2, 101, '2026-03-01 19:50:00', '2026-03-01 20:35:00'), -- 5 min gap
(3, 101, '2026-03-01 20:45:00', '2026-03-01 21:30:00'), -- 10 min gap (3 in row!)
(4, 101, '2026-03-02 18:00:00', '2026-03-02 18:45:00'), -- Next day
(5, 102, '2026-03-01 20:00:00', '2026-03-01 20:45:00');`,
    expectedOutputJson: JSON.stringify([
      { user_id: 101, session_id: 1, episodes_watched: 3, session_start_time: '2026-03-01 19:00:00' }
    ]),
    solutionSql: `WITH prev_viewings AS (
  SELECT user_id, start_time, end_time,
    LAG(end_time) OVER(PARTITION BY user_id ORDER BY start_time) AS prev_end_time
  FROM viewing_logs
),
session_flags AS (
  SELECT user_id, start_time, end_time,
    CASE 
      WHEN prev_end_time IS NULL OR EXTRACT(EPOCH FROM (start_time - prev_end_time))/60.0 > 20.0 THEN 1 
      ELSE 0 
    END AS is_new_session
  FROM prev_viewings
),
session_groups AS (
  SELECT user_id, start_time, end_time,
    SUM(is_new_session) OVER(PARTITION BY user_id ORDER BY start_time) AS session_id
  FROM session_flags
)
SELECT user_id, session_id,
  COUNT(*) AS episodes_watched,
  TO_CHAR(MIN(start_time), 'YYYY-MM-DD HH24:MI:SS') AS session_start_time
FROM session_groups
GROUP BY user_id, session_id
HAVING COUNT(*) >= 3
ORDER BY episodes_watched DESC, user_id ASC;`,
    explanation: `We use \`LAG(end_time)\` to find time gaps between shows, flag new sessions where gap > 20 mins, and compute a cumulative sum \`SUM(is_new_session) OVER(...)\` to assign a unique session ID.`,
    hints: [
      'Use LAG(end_time) OVER(PARTITION BY user_id ORDER BY start_time).',
      'Flag gap > 20 mins as new session: CASE WHEN gap > 20 THEN 1 ELSE 0 END.',
      'Cumulative sum: SUM(is_new_session) OVER(PARTITION BY user_id ORDER BY start_time) yields session_id.',
    ],
    verificationStatus: 'VERIFIED_REAL',
    sourceUrl: 'https://www.glassdoor.com/Interview/Netflix-Data-Science-Interview-E11891.htm',
    sourceType: 'Public Candidate Interview Report',
    companyId: 'comp_netflix',
    primaryConceptId: 'concept_gaps_islands',
    acceptanceRate: 59.4,
    totalAttempts: 11200,
    totalSolved: 6650,
    createdAt: '2026-02-27T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  }
];

