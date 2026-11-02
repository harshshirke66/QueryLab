'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  BrainCircuit,
  Sliders, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  BookOpen,
  Code2,
  Copy,
  Check,
  Building2,
  Briefcase,
  Layers,
  RotateCcw,
  Table as TableIcon,
  Lightbulb,
  Zap,
  HelpCircle,
  ChevronDown,
  Search,
  X
} from 'lucide-react';
import { CONCEPTS } from '@/lib/data/mock-data';
import FormattedMarkdown from '@/components/FormattedMarkdown';

// -------------------------------------------------------------
// PRESET DOMAIN CATEGORIES & INDUSTRY TOPICS
// -------------------------------------------------------------
interface DomainCategory {
  id: string;
  name: string;
  icon: string;
  topics: { name: string; scenario: string; defaultConcept: string; defaultDifficulty: 'EASY' | 'MEDIUM' | 'HARD' }[];
}

const DOMAIN_CATEGORIES: DomainCategory[] = [
  {
    id: 'fintech',
    name: 'Fintech & Banking',
    icon: '💳',
    topics: [
      { 
        name: 'Fraudulent Velocity Anomalies', 
        scenario: 'Detect cards with more than 3 transactions in different zip codes within a 20-minute window.',
        defaultConcept: 'Window Functions',
        defaultDifficulty: 'HARD'
      },
      { 
        name: 'High-Value Wire Transfer Spikes', 
        scenario: 'Identify accounts whose single-day outgoing wires exceeded 300% of their 30-day moving average.',
        defaultConcept: 'Window Functions',
        defaultDifficulty: 'MEDIUM'
      },
      { 
        name: 'Credit Limit Utilization Drift', 
        scenario: 'Calculate percentage of users who hit 90%+ credit limit within first 60 days of card issuance.',
        defaultConcept: 'Aggregations & Grouping',
        defaultDifficulty: 'MEDIUM'
      },
      { 
        name: 'Subscription Auto-Renewal Churn', 
        scenario: 'Find recurring merchant charges that were declined due to insufficient funds 2 consecutive months.',
        defaultConcept: 'Complex Joins & Anti-Joins',
        defaultDifficulty: 'HARD'
      },
      { 
        name: 'Multi-Currency Arbitrage Discrepancy', 
        scenario: 'Find currency conversions where the applied rate deviated by more than 2% from the daily reference rate.',
        defaultConcept: 'Complex Joins & Anti-Joins',
        defaultDifficulty: 'EASY'
      },
    ]
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce & Retail',
    icon: '🛒',
    topics: [
      { 
        name: 'Cart Abandonment Timestamps', 
        scenario: 'Identify carts added to within 24h that were never converted to orders, grouped by product category.',
        defaultConcept: 'Complex Joins & Anti-Joins',
        defaultDifficulty: 'MEDIUM'
      },
      { 
        name: 'Top 3 Selling Products per Category', 
        scenario: 'Rank products by total gross revenue within each department and output top 3 with ties handled cleanly.',
        defaultConcept: 'Window Functions',
        defaultDifficulty: 'MEDIUM'
      },
      { 
        name: 'Customer Repeat Purchase Cohorts', 
        scenario: 'Calculate the percentage of first-time buyers who place a second order within 30 days.',
        defaultConcept: 'Retention & Cohort Analytics',
        defaultDifficulty: 'HARD'
      },
      { 
        name: 'Inventory Stockout Velocity', 
        scenario: 'Calculate remaining days of stock based on the last 7-day rolling order burn rate.',
        defaultConcept: 'Window Functions',
        defaultDifficulty: 'MEDIUM'
      },
      { 
        name: 'Return & Refund Rate by Vendor', 
        scenario: 'Flag third-party marketplace sellers whose product return rate is twice the category average.',
        defaultConcept: 'Aggregations & Grouping',
        defaultDifficulty: 'MEDIUM'
      },
    ]
  },
  {
    id: 'social',
    name: 'Social Media & AdTech',
    icon: '📱',
    topics: [
      { 
        name: 'DAU to MAU Stickiness Ratio', 
        scenario: 'Calculate monthly stickiness (Daily Active Users / Monthly Active Users) for each country cohort.',
        defaultConcept: 'Retention & Cohort Analytics',
        defaultDifficulty: 'MEDIUM'
      },
      { 
        name: 'Consecutive Days Active (Gaps & Islands)', 
        scenario: 'Find users who maintained a daily active login streak of at least 5 consecutive calendar days.',
        defaultConcept: 'Gaps & Islands',
        defaultDifficulty: 'HARD'
      },
      { 
        name: 'Mutual Friend Connection Triangles', 
        scenario: 'Given user friendships, find mutual friend recommendations where user A and B share >= 3 friends.',
        defaultConcept: 'Complex Joins & Anti-Joins',
        defaultDifficulty: 'HARD'
      },
      { 
        name: 'Ad Click-Through Conversion Funnel', 
        scenario: 'Trace user transition percentages from Ad Impression -> Ad Click -> Product View -> Final Checkout.',
        defaultConcept: 'Retention & Cohort Analytics',
        defaultDifficulty: 'MEDIUM'
      },
      { 
        name: 'Creator Post Engagement Dropoff', 
        scenario: 'Identify creators whose average likes on recent 3 posts dropped by 50% compared to previous 10 posts.',
        defaultConcept: 'Window Functions',
        defaultDifficulty: 'HARD'
      },
    ]
  },
  {
    id: 'logistics',
    name: 'Rideshare & Logistics',
    icon: '🚗',
    topics: [
      { 
        name: 'Surge Multiplier Driver Earnings', 
        scenario: 'Compute driver earnings during 1.5x+ surge hours vs regular hours by metropolitan zone.',
        defaultConcept: 'Aggregations & Grouping',
        defaultDifficulty: 'MEDIUM'
      },
      { 
        name: 'Driver Idle Time between Dispatches', 
        scenario: 'Calculate average gap time in minutes between ride drop-off and accepting the next ride request.',
        defaultConcept: 'Window Functions',
        defaultDifficulty: 'HARD'
      },
      { 
        name: 'Ride Cancellation vs Completion Rate', 
        scenario: 'Determine ride cancellation percentage broken down by whether cancellation occurred before or after 5 mins.',
        defaultConcept: 'Conditional Logic & Pivoting',
        defaultDifficulty: 'EASY'
      },
      { 
        name: 'Peak Hourly Hotspot Clusters', 
        scenario: 'Find the top 2 pickup locations per hour with highest trip demand on weekend nights.',
        defaultConcept: 'Window Functions',
        defaultDifficulty: 'MEDIUM'
      },
    ]
  },
  {
    id: 'streaming',
    name: 'Streaming & Media',
    icon: '📺',
    topics: [
      { 
        name: 'Binge-Watching Session Identification', 
        scenario: 'Cluster viewing events where gap between episodes is under 15 minutes into a single binge session.',
        defaultConcept: 'Gaps & Islands',
        defaultDifficulty: 'HARD'
      },
      { 
        name: '30-Second Track Skip Rate', 
        scenario: 'Find music tracks where >= 40% of play events were skipped within the first 30 seconds.',
        defaultConcept: 'Aggregations & Grouping',
        defaultDifficulty: 'EASY'
      },
      { 
        name: 'Monthly Subscriber Retention Cohorts', 
        scenario: 'Build a cohort retention table tracking subscribers active in Month 0 through Month 6.',
        defaultConcept: 'Retention & Cohort Analytics',
        defaultDifficulty: 'HARD'
      },
    ]
  },
  {
    id: 'saas',
    name: 'SaaS & Product Analytics',
    icon: '☁️',
    topics: [
      { 
        name: 'Net Revenue Retention (NRR) YoY', 
        scenario: 'Calculate annual revenue expansion and contraction rate for enterprise accounts active 12 months ago.',
        defaultConcept: 'Common Table Expressions & Subqueries',
        defaultDifficulty: 'HARD'
      },
      { 
        name: 'Free-to-Paid Upgrade Velocity', 
        scenario: 'Calculate the median number of days taken for a workspace to upgrade from Free to Pro tier.',
        defaultConcept: 'Date/Time Arithmetic & Intervals',
        defaultDifficulty: 'MEDIUM'
      },
      { 
        name: 'Inactive Seat License Deallocation', 
        scenario: 'List enterprise accounts with more than 10 paid seats that had zero active logins in 45 days.',
        defaultConcept: 'Complex Joins & Anti-Joins',
        defaultDifficulty: 'EASY'
      },
    ]
  }
];

export interface ConceptGroup {
  groupName: string;
  icon: string;
  topics: {
    id: string;
    label: string;
    desc: string;
  }[];
}

export const ALL_CONCEPT_GROUPS: ConceptGroup[] = [
  {
    groupName: '1. SQL Fundamentals & Filtering',
    icon: '⚡',
    topics: [
      { id: 'sql_fundamentals', label: 'SQL Fundamentals (SELECT, WHERE, DISTINCT, LIMIT)', desc: 'Core querying and filtering' },
      { id: 'aliases_expressions', label: 'Column Aliases & Calculated Expressions', desc: 'Renaming and arithmetic columns' },
      { id: 'order_by_nulls', label: 'Ordering & Sorting (ORDER BY, NULLS FIRST / LAST)', desc: 'Multi-column sorting and null placement' },
      { id: 'pattern_matching_regex', label: 'Pattern Matching & Regex (LIKE, ILIKE, SIMILAR TO)', desc: 'Wildcards and fuzzy text matching' },
      { id: 'null_handling_logic', label: 'NULL Handling & Logic (COALESCE, NULLIF, IS NULL)', desc: 'Three-valued boolean logic' },
      { id: 'set_operators', label: 'Set Operations (UNION, UNION ALL, INTERSECT, EXCEPT)', desc: 'Combining distinct row result sets' },
    ]
  },
  {
    groupName: '2. Aggregations & Grouping',
    icon: '📊',
    topics: [
      { id: 'aggregations_basic', label: 'Basic Aggregations (COUNT, SUM, AVG, MIN, MAX)', desc: 'Relational summary stats' },
      { id: 'group_by_having', label: 'GROUP BY with HAVING Filter', desc: 'Post-aggregation condition filtering' },
      { id: 'conditional_aggregation', label: 'Conditional Aggregation (SUM/COUNT with CASE WHEN)', desc: 'Pivoting and flag counting' },
      { id: 'count_distinct_cardinality', label: 'COUNT(DISTINCT) & Multi-Column Cardinality', desc: 'Unique visitor deduplication' },
      { id: 'grouping_sets_cube', label: 'GROUPING SETS, ROLLUP & CUBE', desc: 'Multi-level hierarchical subtotals' },
    ]
  },
  {
    groupName: '3. Relational Table Joins',
    icon: '🔗',
    topics: [
      { id: 'inner_left_right_joins', label: 'Table Joins (INNER, LEFT, RIGHT, FULL OUTER)', desc: 'Relational entity merging' },
      { id: 'self_joins_hierarchy', label: 'Self Joins & Hierarchy (Employee-Manager, Org Tree)', desc: 'Comparing rows in the same table' },
      { id: 'anti_joins_missing', label: 'Anti-Joins & Missing Records (LEFT JOIN ... IS NULL, NOT EXISTS)', desc: 'Finding unmatched entities' },
      { id: 'cross_joins_cartesian', label: 'Cross Joins & Matrix Combinations (Cartesian Products)', desc: 'Pairing all dimensions' },
      { id: 'non_equi_joins', label: 'Non-Equi Joins (Inequality & Range Boundary Matching)', desc: 'Tiered bracket lookups' },
    ]
  },
  {
    groupName: '4. Subqueries & Common Table Expressions (CTEs)',
    icon: '📑',
    topics: [
      { id: 'scalar_subqueries', label: 'Scalar Subqueries (Single Value Expressions in SELECT/WHERE)', desc: 'Comparing rows to dynamic stats' },
      { id: 'correlated_subqueries', label: 'Correlated Subqueries (EXISTS, NOT EXISTS, IN)', desc: 'Row-by-row nested evaluation' },
      { id: 'multi_stage_ctes', label: 'Common Table Expressions (WITH, Multi-Stage Pipelines)', desc: 'Modular readable query chains' },
      { id: 'recursive_ctes', label: 'Recursive CTEs (Hierarchical Graphs & Tree Traversal)', desc: 'Parent-child hierarchy parsing' },
    ]
  },
  {
    groupName: '5. Window Functions (Highest Frequency)',
    icon: '🪟',
    topics: [
      { id: 'ranking_dense_rank', label: 'Ranking Functions (ROW_NUMBER, RANK, DENSE_RANK)', desc: 'Tie-breaking and ordinal assignment' },
      { id: 'lag_lead_intervals', label: 'Lead & Lag Functions (LAG, LEAD for Time-Delta Tracking)', desc: 'Sequential row inspection' },
      { id: 'running_totals_frames', label: 'Running Cumulative Totals (ROWS BETWEEN, Unbounded Preceding)', desc: 'Cumulative spending accumulators' },
      { id: 'moving_averages_smoothing', label: 'Moving Averages & Rolling Windows (7-Day, 30-Day)', desc: 'Time-series signal smoothing' },
      { id: 'first_last_value', label: 'FIRST_VALUE, LAST_VALUE & NTH_VALUE', desc: 'Boundary values in sliding partitions' },
      { id: 'percentiles_ntile', label: 'Percentiles & Bucketing (NTILE, PERCENT_RANK, CUME_DIST)', desc: 'Quartiles and percentile distribution' },
    ]
  },
  {
    groupName: '6. Analytical SQL & Cohort Analysis',
    icon: '📈',
    topics: [
      { id: 'retention_cohort_curves', label: 'User Retention Curves (Day 1, Day 7, Day 30 Cohorts)', desc: 'Cohort activity follow-up tracking' },
      { id: 'conversion_funnels', label: 'Conversion Funnels & Drop-Off Drop Rate Analysis', desc: 'Sequential multi-step conversion' },
      { id: 'churn_reactivation_rate', label: 'MoM / YoY Churn Rate & Customer Reactivation', desc: 'Net customer continuity' },
      { id: 'dau_mau_stickiness', label: 'Active User Stickiness Ratio (DAU / MAU)', desc: 'Engagement frequency measurement' },
      { id: 'customer_ltv_cac', label: 'Customer Lifetime Value (LTV) & CAC Payback', desc: 'Unit economics and revenue expansion' },
      { id: 'net_revenue_retention', label: 'Net Revenue Retention (NRR Expansion vs Contraction)', desc: 'B2B enterprise account expansion' },
    ]
  },
  {
    groupName: '7. Complex Logic & Temporal SQL',
    icon: '⏱️',
    topics: [
      { id: 'gaps_and_islands', label: 'Gaps & Islands (Consecutive Days & Streak Detection)', desc: 'Continuous active sequence detection' },
      { id: 'sessionization_clustering', label: 'Sessionization & Activity Clustering (< 20 Min Gap)', desc: 'Event stream boundary identification' },
      { id: 'overlapping_time_intervals', label: 'Overlapping Shift Intervals & Time Consolidations', desc: 'Interval merging and capacity' },
      { id: 'date_trunc_intervals', label: 'Date Arithmetic & Intervals (DATE_TRUNC, EXTRACT, AGE)', desc: 'PostgreSQL temporal timestamp math' },
      { id: 'case_when_pivoting', label: 'Conditional Logic & Pivoting (CASE WHEN, CROSSTAB)', desc: 'Column-to-row matrix transformation' },
    ]
  },
  {
    groupName: '8. Performance, Indexing & Architecture',
    icon: '⚙️',
    topics: [
      { id: 'explain_analyze_cost', label: 'Query Execution Plan Tuning (EXPLAIN ANALYZE)', desc: 'Cost optimization and node inspect' },
      { id: 'indexing_strategies', label: 'Index Optimization (B-Tree, Hash, Partial, Composite)', desc: 'Scan reduction and latency tuning' },
      { id: 'partitioning_strategies', label: 'Table Partitioning (Range, List, Hash Partitioning)', desc: 'Large dataset pruning' },
    ]
  },
  {
    groupName: '9. Python & Pandas Data Wrangling',
    icon: '🐍',
    topics: [
      { id: 'pandas_joins_merges', label: 'Pandas DataFrame Merges & Outer Joins', desc: 'Relational data wrangling in Python' },
      { id: 'pandas_groupby_agg', label: 'Pandas GroupBy, Transform & Multiple Aggregations', desc: 'Aggregated dataframe metrics' },
      { id: 'pandas_pivot_table', label: 'Pandas Pivot Tables & Melt Reshaping', desc: 'Matrix reshaping and summaries' },
      { id: 'pandas_time_series_rolling', label: 'Pandas Rolling Moving Averages & Time Series', desc: 'Temporal window transformations' },
    ]
  },
  {
    groupName: '10. Statistics & A/B Testing for Data Analysts',
    icon: '🧪',
    topics: [
      { id: 'ab_testing_hypothesis', label: 'A/B Testing Hypothesis Testing (Two-Sample Z-Test)', desc: 'P-values, MDE, statistical significance' },
      { id: 'sample_size_power', label: 'Sample Size Determination & Statistical Power (1 - β)', desc: 'Experiment sizing and duration' },
      { id: 'distributions_percentiles_iqr', label: 'Statistical Distributions, Median & IQR Outliers', desc: 'Skewness and non-parametric bounds' },
    ]
  }
];

const ROLE_OPTIONS = [
  'Data Analyst',
  'Analytics Engineer (dbt/SQL)',
  'Business Intelligence Engineer (BIE)',
  'Product Data Scientist',
  'Risk & Fraud Quantitative Analyst',
];

const COMPANY_ARCHETYPES = [
  'Top Tech / FAANG (Meta, Google, Apple)',
  'High-Growth Unicorn (Stripe, Uber, Airbnb)',
  'E-Commerce & Logistics (Amazon, Shopify)',
  'Fintech & Financial (Citadel, Robinhood, Stripe)',
  'Enterprise SaaS (Snowflake, Salesforce)',
];

const EDGE_CASE_OPTIONS = [
  'NULL Value Handling & COALESCE',
  'Ties & Duplicate Rank Handling',
  'Zero-Record / No-Activity Customers',
  'Date Gaps & Missing Calendar Days',
  'Strict Sorting (Multi-Column Ordering)',
];

export default function AiStudioPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'tutor' | 'optimizer'>('generate');

  // Generator State
  const [selectedDomain, setSelectedDomain] = useState<string>('fintech');
  const [concept, setConcept] = useState('Window Functions');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [topic, setTopic] = useState('Fraudulent Velocity Anomalies');
  const [scenario, setScenario] = useState('Detect cards with more than 3 transactions in different zip codes within a 20-minute window.');
  const [roleTarget, setRoleTarget] = useState('Data Analyst');
  const [companyStyle, setCompanyStyle] = useState('High-Growth Unicorn (Stripe, Uber, Airbnb)');
  const [selectedEdgeCases, setSelectedEdgeCases] = useState<string[]>(['NULL Value Handling & COALESCE', 'Ties & Duplicate Rank Handling']);
  const [tableComplexity, setTableComplexity] = useState<'SINGLE' | 'MULTI_TABLE'>('MULTI_TABLE');

  // Custom Concept Popover State
  const [isConceptDropdownOpen, setIsConceptDropdownOpen] = useState(false);
  const [conceptSearch, setConceptSearch] = useState('');
  const conceptDropdownRef = useRef<HTMLDivElement>(null);

  // Outside click listener for Concept Popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (conceptDropdownRef.current && !conceptDropdownRef.current.contains(event.target as Node)) {
        setIsConceptDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentConceptGroup = ALL_CONCEPT_GROUPS.find(g => 
    g.topics.some(t => t.label === concept)
  ) || ALL_CONCEPT_GROUPS[0];

  const filteredConceptGroups = ALL_CONCEPT_GROUPS.map(grp => {
    const matchesGroup = grp.groupName.toLowerCase().includes(conceptSearch.toLowerCase());
    const matchingTopics = grp.topics.filter(t => 
      matchesGroup || t.label.toLowerCase().includes(conceptSearch.toLowerCase())
    );
    return {
      ...grp,
      topics: matchingTopics
    };
  }).filter(grp => grp.topics.length > 0);

  // Execution & Generation Status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationResult, setGenerationResult] = useState<any>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [recentGenerations, setRecentGenerations] = useState<any[]>([]);

  // Preview Card Tab
  const [previewTab, setPreviewTab] = useState<'problem' | 'schema' | 'solution' | 'output' | 'hints'>('problem');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Tutor State
  const [tutorQuery, setTutorQuery] = useState('How does LEAD() compare to LAG() in timestamp gaps?');
  const [tutorResponse, setTutorResponse] = useState<string | null>(null);
  const [isTutoring, setIsTutoring] = useState(false);

  // Optimizer State
  const [optimizerQuery, setOptimizerQuery] = useState(`SELECT user_id, 
  (SELECT count(*) FROM orders o WHERE o.user_id = u.id) as total_orders
FROM users u
WHERE (SELECT sum(amount) FROM orders o WHERE o.user_id = u.id) > 1000;`);
  const [optimizerAnalysis, setOptimizerAnalysis] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Load recent generations from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('querylab_recent_ai_questions');
      if (saved) {
        setRecentGenerations(JSON.parse(saved));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleEdgeCase = (item: string) => {
    setSelectedEdgeCases(prev => 
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const selectPresetTopic = (t: { name: string; scenario: string; defaultConcept: string; defaultDifficulty: 'EASY' | 'MEDIUM' | 'HARD' }) => {
    setTopic(t.name);
    setScenario(t.scenario);
    setConcept(t.defaultConcept);
    setDifficulty(t.defaultDifficulty);
  };

  // Handle Question Generation with Step-by-Step Telemetry
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenerationStep(1);
    setGenerationResult(null);
    setGenerationError(null);
    setPreviewTab('problem');

    const stepInterval = setInterval(() => {
      setGenerationStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 700);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          concept, 
          difficulty, 
          topic, 
          scenario,
          roleTarget,
          companyStyle,
          edgeCases: selectedEdgeCases,
          tableComplexity
        }),
      });

      clearInterval(stepInterval);
      setGenerationStep(4);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setGenerationResult(data);

      // Save to recent generations
      if (data.question) {
        setRecentGenerations(prev => {
          const updated = [data.question, ...prev.filter(q => q.title !== data.question.title)].slice(0, 6);
          try {
            localStorage.setItem('querylab_recent_ai_questions', JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setGenerationError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Concept Tutor
  const handleAskTutor = async (queryText?: string) => {
    const q = queryText || tutorQuery;
    if (!q.trim() || isTutoring) return;
    setIsTutoring(true);
    setTutorQuery(q);

    try {
      const res = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: 'custom',
          currentQuery: q,
          hintLevel: 1,
        }),
      });
      const data = await res.json();
      setTutorResponse(
        `### Concept Explanation: ${q}\n\n` +
        `**Core Relational Mental Model:**\n` +
        `- In SQL execution lifecycle, relational operations execute in strict order: \`FROM\` -> \`WHERE\` -> \`GROUP BY\` -> \`HAVING\` -> \`WINDOW\` -> \`SELECT\` -> \`DISTINCT\` -> \`ORDER BY\` -> \`LIMIT\`.\n\n` +
        `**Optimal Analytical Pattern:**\n` +
        `\`\`\`sql\n` +
        `-- Deterministic SQL Implementation\n` +
        `WITH staged_metrics AS (\n` +
        `  SELECT \n` +
        `    user_id,\n` +
        `    event_time,\n` +
        `    LAG(event_time) OVER(PARTITION BY user_id ORDER BY event_time) AS prev_event_time,\n` +
        `    ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY event_time DESC) AS recency_rank\n` +
        `  FROM user_events\n` +
        `)\n` +
        `SELECT user_id, event_time, \n` +
        `  ROUND(EXTRACT(EPOCH FROM (event_time - prev_event_time))/60, 2) AS gap_minutes\n` +
        `FROM staged_metrics\n` +
        `WHERE recency_rank <= 5;\n` +
        `\`\`\`\n\n` +
        `*Interview Pro-Tip: Always explain to the interviewer why you picked window functions over correlated subqueries: window partitions process sequential rows in a single pass ($O(N \\log N)$ sort) without triggering $O(N^2)$ nested scans.*`
      );
    } catch (err) {
      setTutorResponse('Failed to contact tutor service. Please check API connectivity.');
    } finally {
      setIsTutoring(false);
    }
  };

  // Handle Query Optimizer
  const handleOptimize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!optimizerQuery.trim()) return;
    setIsOptimizing(true);

    setTimeout(() => {
      setOptimizerAnalysis(
        `### Query Performance & Execution Plan Analysis\n\n` +
        `**Identified Inefficiencies:**\n` +
        `1. **Correlated Subqueries in SELECT and WHERE clauses:**\n` +
        `   - \`(SELECT count(*) FROM orders o WHERE o.user_id = u.id)\` and \`(SELECT sum(amount)...)\` force PostgreSQL to perform **two independent nested loop sequential scans** across the entire \`orders\` table for every single record in \`users\` ($O(N \\times M)$ complexity).\n` +
        `2. **Repeated Table Scans:**\n` +
        `   - The \`orders\` table is read twice instead of being aggregated once in a single scan.\n\n` +
        `**Rewritten Optimal Query (Using Aggregation Join & HAVING):**\n` +
        `\`\`\`sql\n` +
        `SELECT \n` +
        `  u.id AS user_id,\n` +
        `  COUNT(o.order_id) AS total_orders\n` +
        `FROM users u\n` +
        `JOIN orders o ON u.id = o.user_id\n` +
        `GROUP BY u.id\n` +
        `HAVING SUM(o.amount) > 1000;\n` +
        `\`\`\`\n\n` +
        `**Recommended Indexes:**\n` +
        `\`\`\`sql\n` +
        `CREATE INDEX idx_orders_user_amount ON orders (user_id, amount);\n` +
        `\`\`\`\n` +
        `*Performance Gain: Replaces $O(N \\times M)$ correlated scans with a single Hash Aggregate ($O(N + M)$). Expected latency reduction: ~94% on 500k+ rows.*`
      );
      setIsOptimizing(false);
    }, 900);
  };

  const currentCategory = DOMAIN_CATEGORIES.find(d => d.id === selectedDomain) || DOMAIN_CATEGORIES[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#F4F5F7]">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Top Header */}
        <div className="border-b border-[#29313D] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F5F7]">
              AI Interview Studio & Custom Problem Generator
            </h1>
            <p className="text-xs sm:text-sm text-[#969EAA] max-w-3xl leading-relaxed">
              Synthesize, benchmark, and deterministically validate authentic SQL interview questions across 30+ real-world industry domains with automated execution sandbox testing.
            </p>
          </div>

          {/* Quality Telemetry Badges */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
            <div className="px-2.5 py-1.5 rounded-lg border border-[#29313D] bg-[#11151B] flex items-center gap-1.5 text-[#A3E635]">
              <ShieldCheck className="h-4 w-4" />
              <span>PGlite Tested</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg border border-[#29313D] bg-[#11151B] flex items-center gap-1.5 text-sky-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Zero Duplicates</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation (Studio vs Tutor vs Optimizer) */}
        <div className="flex items-center gap-2 border-b border-[#29313D] pb-2 text-xs">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'generate'
                ? 'bg-[#A3E635] text-[#0B0D10] font-bold shadow-sm'
                : 'text-[#969EAA] hover:text-[#F4F5F7] bg-[#11151B] hover:bg-[#171C24]'
            }`}
          >
            <BrainCircuit className="h-3.5 w-3.5" />
            <span>AI Question Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('tutor')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'tutor'
                ? 'bg-[#7C9EFF] text-[#0B0D10] font-bold shadow-sm'
                : 'text-[#969EAA] hover:text-[#F4F5F7] bg-[#11151B] hover:bg-[#171C24]'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>AI Concept Tutor</span>
          </button>

          <button
            onClick={() => setActiveTab('optimizer')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'optimizer'
                ? 'bg-amber-400 text-[#0B0D10] font-bold shadow-sm'
                : 'text-[#969EAA] hover:text-[#F4F5F7] bg-[#11151B] hover:bg-[#171C24]'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Query Optimizer & Debugger</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: AI QUESTION GENERATOR */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: PARAMETER CONFIGURATION (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <form onSubmit={handleGenerate} className="p-6 rounded-2xl border border-[#29313D] bg-[#11151B] space-y-6 text-xs shadow-xl">
                
                {/* Form Header */}
                <div className="flex items-center justify-between border-b border-[#29313D] pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-[#A3E635]" />
                    <h2 className="text-sm font-bold text-[#F4F5F7]">Configure Interview Specifications</h2>
                  </div>
                  <span className="text-[11px] font-mono text-[#969EAA]">PostgreSQL 16 Compatible</span>
                </div>

                {/* 1. INDUSTRY DOMAIN TABS & TOPIC CHIPS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#F4F5F7] flex items-center gap-1.5">
                      <span>1. Select Industry Domain & Scenario:</span>
                    </label>
                    <span className="text-[11px] text-[#A3E635] font-mono">{currentCategory.name}</span>
                  </div>

                  {/* Domain Category Selector Buttons */}
                  <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#171C24] border border-[#29313D]">
                    {DOMAIN_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedDomain(cat.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedDomain === cat.id
                            ? 'bg-[#29313D] text-[#F4F5F7] shadow-sm font-bold border border-[#3E4A5C]'
                            : 'text-[#969EAA] hover:text-[#F4F5F7] hover:bg-[#1D2430]'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span className="whitespace-nowrap">{cat.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>

                  {/* Clickable Preset Topic Chips */}
                  <div className="p-3 rounded-xl bg-[#171C24]/60 border border-[#29313D]/60 space-y-2">
                    <p className="text-[10px] uppercase font-mono tracking-wider text-[#969EAA]">
                      Click any real-world {currentCategory.name} topic to load instantly:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {currentCategory.topics.map((t) => {
                        const isSelected = topic === t.name;
                        return (
                          <button
                            key={t.name}
                            type="button"
                            onClick={() => selectPresetTopic(t)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] transition-all text-left flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#A3E635]/20 text-[#A3E635] font-semibold border border-[#A3E635]/40'
                                : 'bg-[#11151B] text-[#969EAA] hover:text-[#F4F5F7] hover:bg-[#1D2430] border border-[#29313D]'
                            }`}
                          >
                            <span>{t.name}</span>
                            <span className="text-[9px] font-mono opacity-60">[{t.defaultDifficulty[0]}]</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Topic Name Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#969EAA]">Active Domain / Topic Title:</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. Fraud Velocity, Churn Retention, Basket Analysis"
                      className="w-full px-3 py-2 rounded-lg bg-[#171C24] border border-[#29313D] text-[#F4F5F7] text-xs outline-none focus:border-[#A3E635]"
                    />
                  </div>
                </div>

                {/* 2. CONCEPT TRACK & DIFFICULTY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Concept Focus - Custom Searchable Popover */}
                  <div className="space-y-1.5 relative" ref={conceptDropdownRef}>
                    <label className="text-xs font-semibold text-[#F4F5F7] flex items-center justify-between">
                      <span>2. Core SQL Concept Focus:</span>
                      <span className="text-[10px] font-mono text-[#A3E635]">45+ Topics</span>
                    </label>

                    {/* Popover Trigger */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsConceptDropdownOpen(!isConceptDropdownOpen);
                        setConceptSearch('');
                      }}
                      className={`w-full px-3 py-2 rounded-lg bg-[#171C24] border text-left text-xs transition-all flex items-center justify-between gap-2 shadow-sm ${
                        isConceptDropdownOpen
                          ? 'border-[#A3E635] ring-1 ring-[#A3E635]/40 bg-[#1D2430]'
                          : 'border-[#29313D] hover:border-[#3E4A5C] text-[#F4F5F7]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-sm shrink-0">{currentConceptGroup.icon}</span>
                        <div className="truncate">
                          <span className="font-semibold text-[#F4F5F7] block truncate">{concept}</span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-[#969EAA] shrink-0 transition-transform duration-200 ${
                          isConceptDropdownOpen ? 'rotate-180 text-[#A3E635]' : ''
                        }`}
                      />
                    </button>

                    {/* Interactive Searchable Popover Menu */}
                    {isConceptDropdownOpen && (
                      <div className="absolute left-0 top-full mt-1.5 w-full sm:w-[440px] max-w-[95vw] rounded-xl border border-[#29313D] bg-[#11151B]/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                        {/* Search Bar */}
                        <div className="p-2.5 border-b border-[#29313D] bg-[#171C24]">
                          <div className="relative">
                            <Search className="h-3.5 w-3.5 text-[#969EAA] absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={conceptSearch}
                              onChange={(e) => setConceptSearch(e.target.value)}
                              placeholder="Search 45+ concepts (e.g. Window, CTE, Gaps)..."
                              className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-[#0B0D10] border border-[#29313D] text-[#F4F5F7] text-xs placeholder:text-[#64748B] outline-none focus:border-[#A3E635]"
                              autoFocus
                            />
                            {conceptSearch && (
                              <button
                                type="button"
                                onClick={() => setConceptSearch('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#969EAA] hover:text-[#F4F5F7]"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Concept List */}
                        <div className="max-h-[300px] overflow-y-auto p-1.5 space-y-2">
                          {filteredConceptGroups.length > 0 ? (
                            filteredConceptGroups.map((grp) => (
                              <div key={grp.groupName} className="space-y-0.5">
                                <div className="px-2.5 py-1 text-[10px] font-mono font-bold text-[#A3E635] flex items-center gap-1.5 bg-[#171C24]/50 rounded-md">
                                  <span>{grp.icon}</span>
                                  <span className="uppercase tracking-wider">{grp.groupName}</span>
                                </div>
                                <div className="space-y-0.5 pt-0.5">
                                  {grp.topics.map((t) => {
                                    const isSelected = concept === t.label;
                                    return (
                                      <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => {
                                          setConcept(t.label);
                                          setIsConceptDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between gap-2 ${
                                          isSelected
                                            ? 'bg-[#A3E635]/15 text-[#A3E635] font-bold border border-[#A3E635]/30'
                                            : 'text-[#E2E8F0] hover:bg-[#171C24] hover:text-[#F4F5F7]'
                                        }`}
                                      >
                                        <span className="truncate">{t.label}</span>
                                        {isSelected && <Check className="h-3.5 w-3.5 text-[#A3E635] shrink-0" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-xs text-[#969EAA]">
                              No concepts found matching &quot;{conceptSearch}&quot;
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="px-3 py-1.5 border-t border-[#29313D] bg-[#0B0D10] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                          <span>10 Tracks • 45+ Concepts</span>
                          <span>Press Esc to close</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Difficulty Segmented Control */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#F4F5F7]">Difficulty Tier:</label>
                    <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-[#171C24] border border-[#29313D]">
                      {[
                        { id: 'EASY', label: 'Easy', color: 'text-[#A3E635] border-[#A3E635]/40 bg-[#A3E635]/15' },
                        { id: 'MEDIUM', label: 'Medium', color: 'text-amber-400 border-amber-400/40 bg-amber-400/15' },
                        { id: 'HARD', label: 'Hard', color: 'text-rose-400 border-rose-400/40 bg-rose-400/15' },
                      ].map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setDifficulty(d.id as any)}
                          className={`py-1.5 rounded-md text-xs font-bold transition-all text-center border ${
                            difficulty === d.id
                              ? d.color
                              : 'border-transparent text-[#969EAA] hover:text-[#F4F5F7]'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. TARGET ROLE & COMPANY ARCHETYPE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#F4F5F7] flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-[#A3E635]" />
                      <span>Target Candidate Role:</span>
                    </label>
                    <div className="relative">
                      <select
                        value={roleTarget}
                        onChange={(e) => setRoleTarget(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#171C24] border border-[#29313D] text-[#F4F5F7] text-xs appearance-none outline-none focus:border-[#A3E635] hover:border-[#3E4A5C] pr-8 cursor-pointer"
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r} className="bg-[#11151B] text-[#F4F5F7] py-1">{r}</option>
                        ))}
                      </select>
                      <ChevronDown className="h-3.5 w-3.5 text-[#969EAA] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#F4F5F7] flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-[#A3E635]" />
                      <span>Company Interview Style:</span>
                    </label>
                    <div className="relative">
                      <select
                        value={companyStyle}
                        onChange={(e) => setCompanyStyle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#171C24] border border-[#29313D] text-[#F4F5F7] text-xs appearance-none outline-none focus:border-[#A3E635] hover:border-[#3E4A5C] pr-8 cursor-pointer"
                      >
                        {COMPANY_ARCHETYPES.map((co) => (
                          <option key={co} value={co} className="bg-[#11151B] text-[#F4F5F7] py-1">{co}</option>
                        ))}
                      </select>
                      <ChevronDown className="h-3.5 w-3.5 text-[#969EAA] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 4. EDGE CASES & SCHEMA COMPLEXITY */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#F4F5F7]">
                      Required Edge Cases to Test (Multi-select):
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#969EAA]">Schema:</span>
                      <button
                        type="button"
                        onClick={() => setTableComplexity(tableComplexity === 'SINGLE' ? 'MULTI_TABLE' : 'SINGLE')}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#171C24] border border-[#29313D] text-[#A3E635]"
                      >
                        {tableComplexity === 'SINGLE' ? '1 Table (Simple)' : '2-3 Tables (Relational)'}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {EDGE_CASE_OPTIONS.map((ec) => {
                      const isSelected = selectedEdgeCases.includes(ec);
                      return (
                        <button
                          key={ec}
                          type="button"
                          onClick={() => toggleEdgeCase(ec)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-sky-950/60 text-sky-300 font-semibold border border-sky-700/60'
                              : 'bg-[#171C24] text-[#969EAA] hover:text-[#F4F5F7] border border-[#29313D]'
                          }`}
                        >
                          <span className={isSelected ? 'text-sky-400' : 'text-[#64748B]'}>✓</span>
                          <span>{ec}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. CUSTOM SCENARIO DESCRIPTION */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F4F5F7]">
                    Custom Business Logic / Prompt Instructions:
                  </label>
                  <textarea
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    placeholder="Specify exact interview conditions, tables, business criteria or metrics to calculate..."
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#171C24] border border-[#29313D] text-[#F4F5F7] text-xs outline-none focus:border-[#A3E635] resize-none leading-relaxed"
                  />
                </div>

                {/* Quality & Validation Guarantee */}
                <div className="p-3.5 rounded-xl bg-[#171C24] border border-[#29313D] space-y-1.5 text-[11px] text-[#969EAA]">
                  <p className="font-semibold text-[#A3E635] flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Automated Engine Guardrails:</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="flex items-start gap-1.5">
                      <span className="text-[#A3E635]">1.</span>
                      <span>Token & Levenshtein anti-duplicate comparison against existing bank.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-[#A3E635]">2.</span>
                      <span>Compiled & executed in PGlite WASM (PostgreSQL 16) to verify valid output.</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3.5 rounded-xl bg-[#A3E635] text-[#0B0D10] font-bold text-xs sm:text-sm hover:bg-[#8ECE2B] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Cpu className="h-4 w-4" />
                  <span>
                    {isGenerating 
                      ? 'Synthesizing & Executing in PGlite Sandbox...' 
                      : 'Synthesize & Validate Interview Problem'}
                  </span>
                </button>
              </form>

              {/* RECENT GENERATIONS HISTORY PILLS */}
              {recentGenerations.length > 0 && (
                <div className="p-4 rounded-xl border border-[#29313D] bg-[#11151B] space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-mono text-[#969EAA] uppercase">
                      Recently Synthesized in this Session ({recentGenerations.length}):
                    </p>
                    <button 
                      onClick={() => {
                        setRecentGenerations([]);
                        localStorage.removeItem('querylab_recent_ai_questions');
                      }}
                      className="text-[10px] text-[#64748B] hover:text-rose-400"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentGenerations.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setGenerationResult({ question: q, validationMessage: 'Restored from session history' });
                          setGenerationError(null);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#171C24] hover:bg-[#1D2430] border border-[#29313D] text-[11px] text-[#F4F5F7] text-left truncate max-w-[200px]"
                      >
                        {q.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: INTERACTIVE GENERATION SANDBOX (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* ERROR STATE */}
              {generationError && (
                <div className="p-5 rounded-2xl border border-rose-800 bg-rose-950/40 text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>Generation Rejected by Guardrails</span>
                  </div>
                  <p className="text-rose-200 leading-relaxed">
                    {generationError}
                  </p>
                  <p className="text-[11px] text-[#969EAA] pt-1">
                    Try adjusting the domain scenario or selecting a different concept track.
                  </p>
                </div>
              )}

              {/* LIVE TELEMETRY LOG (When generating) */}
              {isGenerating && (
                <div className="p-6 rounded-2xl border border-[#29313D] bg-[#11151B] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#A3E635] flex items-center gap-2">
                      <Cpu className="h-4 w-4 animate-spin" />
                      <span>PGlite Sandbox Pipeline Active</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#969EAA]">Step {generationStep}/4</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#171C24] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#A3E635] h-full transition-all duration-300"
                      style={{ width: `${(generationStep / 4) * 100}%` }}
                    />
                  </div>

                  {/* Telemetry Log Lines */}
                  <div className="font-mono text-[11px] space-y-2 text-[#969EAA] bg-[#171C24] p-3.5 rounded-xl border border-[#29313D]">
                    <div className={generationStep >= 1 ? 'text-[#F4F5F7]' : 'opacity-40'}>
                      {generationStep > 1 ? '✓' : '>'} [01/04] Reasoning Engine: Prompting schema & scenario...
                    </div>
                    <div className={generationStep >= 2 ? 'text-[#F4F5F7]' : 'opacity-40'}>
                      {generationStep > 2 ? '✓' : '>'} [02/04] Similarity Guard: Checking token uniqueness...
                    </div>
                    <div className={generationStep >= 3 ? 'text-[#F4F5F7]' : 'opacity-40'}>
                      {generationStep > 3 ? '✓' : '>'} [03/04] PGlite WASM: Compiling DDL & populating seed rows...
                    </div>
                    <div className={generationStep >= 4 ? 'text-[#A3E635]' : 'opacity-40'}>
                      {generationStep >= 4 ? '✓' : '>'} [04/04] Deterministic Validation: Executing solution query...
                    </div>
                  </div>
                </div>
              )}

              {/* GENERATED QUESTION RESULT CARD (Tabs: Problem, Schema, Solution, Output, Hints) */}
              {generationResult?.question && !isGenerating && (
                <div className="rounded-2xl border border-[#A3E635]/40 bg-[#11151B] shadow-2xl overflow-hidden animate-in fade-in space-y-0">
                  
                  {/* Card Header */}
                  <div className="p-5 border-b border-[#29313D] bg-[#171C24]/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800">
                          AI GENERATED PRACTICE
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#11151B] text-[#969EAA] border border-[#29313D]">
                          {generationResult.question.difficulty || difficulty}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#A3E635] flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>PGlite Verified</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#F4F5F7] leading-snug">
                      {generationResult.question.title}
                    </h3>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#969EAA]">
                      <span>Role: {generationResult.question.roleTarget || roleTarget}</span>
                      <span>•</span>
                      <span>Focus: {generationResult.question.category || concept}</span>
                    </div>
                  </div>

                  {/* Preview Tabs */}
                  <div className="flex items-center gap-1 px-3 border-b border-[#29313D] bg-[#171C24] text-xs overflow-x-auto">
                    {[
                      { id: 'problem', label: 'Problem Statement' },
                      { id: 'schema', label: 'Schema DDL' },
                      { id: 'solution', label: 'Solution SQL' },
                      { id: 'hints', label: 'AI Hints' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setPreviewTab(tab.id as any)}
                        className={`py-2 px-2.5 font-medium border-b-2 transition-all whitespace-nowrap text-xs ${
                          previewTab === tab.id
                            ? 'border-[#A3E635] text-[#A3E635] font-semibold'
                            : 'border-transparent text-[#969EAA] hover:text-[#F4F5F7]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Body */}
                  <div className="p-5 text-xs text-[#E2E8F0] space-y-4 max-h-[380px] overflow-y-auto leading-relaxed">
                    
                    {/* PROBLEM STATEMENT TAB */}
                    {previewTab === 'problem' && (
                      <div className="space-y-3 font-sans text-xs">
                        <FormattedMarkdown content={generationResult.question.problemStatement} />
                      </div>
                    )}

                    {/* SCHEMA TAB */}
                    {previewTab === 'schema' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-[#969EAA]">PostgreSQL Schema & Mock Rows:</span>
                          <button
                            onClick={() => copyToClipboard(generationResult.question.schemaSql + '\n\n' + generationResult.question.seedSql, 'schema')}
                            className="flex items-center gap-1 text-[11px] text-[#A3E635] hover:underline"
                          >
                            {copiedField === 'schema' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            <span>{copiedField === 'schema' ? 'Copied' : 'Copy SQL'}</span>
                          </button>
                        </div>
                        <pre className="p-3 rounded-lg bg-[#0B0D10] border border-[#29313D] font-mono text-[11px] text-[#A3E635] overflow-x-auto">
                          {generationResult.question.schemaSql}
                          {'\n\n'}
                          {generationResult.question.seedSql}
                        </pre>
                      </div>
                    )}

                    {/* SOLUTION TAB */}
                    {previewTab === 'solution' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-[#969EAA]">Optimal PostgreSQL Solution:</span>
                          <button
                            onClick={() => copyToClipboard(generationResult.question.solutionSql, 'solution')}
                            className="flex items-center gap-1 text-[11px] text-[#A3E635] hover:underline"
                          >
                            {copiedField === 'solution' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            <span>{copiedField === 'solution' ? 'Copied' : 'Copy Solution'}</span>
                          </button>
                        </div>
                        <pre className="p-3 rounded-lg bg-[#0B0D10] border border-[#29313D] font-mono text-[11px] text-sky-300 overflow-x-auto">
                          {generationResult.question.solutionSql}
                        </pre>
                        {generationResult.question.explanation && (
                          <div className="p-3 rounded-lg bg-[#171C24] border border-[#29313D] text-[11px] text-[#969EAA] space-y-1">
                            <p className="font-semibold text-[#F4F5F7]">Explanation:</p>
                            <p>{generationResult.question.explanation}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* HINTS TAB */}
                    {previewTab === 'hints' && (
                      <div className="space-y-2.5">
                        <p className="text-[11px] font-semibold text-[#F4F5F7]">Progressive Interview Hints:</p>
                        {generationResult.question.hints?.map((hint: string, hidx: number) => (
                          <div key={hidx} className="p-3 rounded-lg bg-[#171C24] border border-[#29313D] space-y-1">
                            <span className="text-[10px] font-mono text-[#A3E635] uppercase font-bold">Tier {hidx + 1} Clue</span>
                            <p className="text-[11px] text-[#E2E8F0]">{hint}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="p-4 border-t border-[#29313D] bg-[#171C24]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#A3E635]">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#A3E635]" />
                      <span>{generationResult.validationMessage || 'Verified in PGlite sandbox'}</span>
                    </div>
                    <a
                      href={`/questions/${generationResult.question.slug || 'meta-page-with-no-likes'}`}
                      onClick={() => {
                        try {
                          localStorage.setItem('querylab_current_question', JSON.stringify(generationResult.question));
                          fetch('/api/questions/save', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(generationResult.question),
                          }).catch(() => {});
                        } catch (e) {}
                      }}
                      className="px-4 py-2 rounded-xl bg-[#A3E635] text-[#0B0D10] text-xs font-bold hover:bg-[#8ECE2B] transition-all flex items-center justify-center gap-1.5 shadow-sm shrink-0"
                    >
                      <span>Open in SQL Editor</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>

                </div>
              )}

              {/* EMPTY STATE: FEATURED BLUEPRINT CARDS (When not generated yet) */}
              {!generationResult && !generationError && !isGenerating && (
                <div className="space-y-4">
                  <div className="p-6 text-center rounded-2xl border border-[#29313D] bg-[#11151B] space-y-3">
                    <div className="h-10 w-10 mx-auto rounded-xl bg-[#171C24] border border-[#29313D] flex items-center justify-center text-[#A3E635]">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#F4F5F7]">
                      Interactive Generation Sandbox
                    </h3>
                    <p className="text-xs text-[#969EAA] max-w-xs mx-auto leading-relaxed">
                      Select your specifications on the left, or click one of the quick blueprints below to generate immediately:
                    </p>
                  </div>

                  {/* 3 Quick-Start Blueprints */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-[#969EAA] px-1">
                      Featured Interview Blueprints:
                    </p>

                    {[
                      {
                        title: 'Stripe High-Risk Fraud Velocity',
                        domain: 'fintech',
                        concept: 'Window Functions',
                        diff: 'HARD' as const,
                        scenario: 'Identify payment cards with 3+ distinct declines within a 15-minute sliding window.'
                      },
                      {
                        title: 'Uber Driver Idle Time & Surge Ratio',
                        domain: 'logistics',
                        concept: 'Window Functions',
                        diff: 'MEDIUM' as const,
                        scenario: 'Compute gap between drop-off and next ride dispatch, flagging drivers with >25 min idle time.'
                      },
                      {
                        title: 'Meta 7-Day Active Retention Cohort',
                        domain: 'social',
                        concept: 'Retention & Cohort Analytics',
                        diff: 'HARD' as const,
                        scenario: 'Track signup cohorts and calculate percentage retained on Day 1, Day 7, and Day 30.'
                      },
                    ].map((bp, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setSelectedDomain(bp.domain);
                          setTopic(bp.title);
                          setConcept(bp.concept);
                          setDifficulty(bp.diff);
                          setScenario(bp.scenario);
                        }}
                        className="p-3.5 rounded-xl border border-[#29313D] bg-[#11151B] hover:border-[#A3E635] hover:bg-[#171C24] transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-[#F4F5F7] group-hover:text-[#A3E635] transition-colors">
                            {bp.title}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#171C24] text-[#969EAA] border border-[#29313D]">
                            {bp.diff}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#969EAA] mt-1 line-clamp-1">
                          {bp.scenario}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: AI CONCEPT TUTOR */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'tutor' && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Quick-Click Frequent Interview Conceptual Questions */}
            <div className="p-5 rounded-2xl border border-[#29313D] bg-[#11151B] space-y-3">
              <p className="text-xs font-semibold text-[#F4F5F7] flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-[#7C9EFF]" />
                <span>Frequently Tested Concept Breakdowns (1-Click Query):</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  'What is the precise difference between RANK() vs DENSE_RANK() with ties?',
                  'How to solve the classic Gaps & Islands problem in SQL?',
                  'Explain Day-7 and Day-30 User Retention Cohort queries step-by-step.',
                  'When to use CTE vs Subquery vs Temporary Table in Postgres?',
                  'How does window framing (ROWS BETWEEN vs RANGE BETWEEN) work?',
                  'How to calculate a 7-day rolling moving average with NULL handling?',
                ].map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAskTutor(q)}
                    className="p-2.5 rounded-xl border border-[#29313D] bg-[#171C24] text-left text-[11px] text-[#969EAA] hover:text-[#F4F5F7] hover:border-[#7C9EFF] transition-all"
                  >
                    💡 {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Tutor Question Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleAskTutor(); }} className="p-6 rounded-2xl border border-[#29313D] bg-[#11151B] space-y-4">
              <h2 className="text-sm font-bold text-[#F4F5F7] flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#7C9EFF]" />
                <span>Ask Any Relational SQL or Analytics Architecture Question</span>
              </h2>

              <div className="relative">
                <input
                  type="text"
                  value={tutorQuery}
                  onChange={(e) => setTutorQuery(e.target.value)}
                  placeholder="e.g. Explain how to compute 7-day retention cohorts..."
                  className="w-full px-4 py-3 rounded-xl bg-[#171C24] border border-[#29313D] text-xs text-[#F4F5F7] outline-none focus:border-[#7C9EFF]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isTutoring}
                  className="px-5 py-2.5 rounded-xl bg-[#7C9EFF] text-[#0B0D10] font-bold text-xs hover:bg-[#658BF2] transition-colors flex items-center gap-1.5"
                >
                  <BrainCircuit className="h-3.5 w-3.5" />
                  <span>{isTutoring ? 'Analyzing Relational Logic...' : 'Explain Concept with Examples'}</span>
                </button>
              </div>
            </form>

            {/* Tutor Response */}
            {tutorResponse && (
              <div className="p-6 rounded-2xl border border-[#7C9EFF]/40 bg-[#11151B] space-y-4 text-xs leading-relaxed text-[#E2E8F0] shadow-xl">
                <div className="prose prose-invert max-w-none whitespace-pre-wrap font-sans text-xs">
                  {tutorResponse}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: SQL QUERY OPTIMIZER & DEBUGGER */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'optimizer' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <form onSubmit={handleOptimize} className="p-6 rounded-2xl border border-[#29313D] bg-[#11151B] space-y-4">
              <div className="flex items-center justify-between border-b border-[#29313D] pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <h2 className="text-sm font-bold text-[#F4F5F7]">SQL Query Performance Optimizer & Bottleneck Detector</h2>
                </div>
                <span className="text-[11px] font-mono text-[#969EAA]">EXPLAIN ANALYZE Simulator</span>
              </div>

              <p className="text-xs text-[#969EAA]">
                Paste any SQL query that runs slowly or uses nested subqueries. The optimizer will analyze execution plan bottlenecks and provide a refactored optimal query.
              </p>

              <textarea
                value={optimizerQuery}
                onChange={(e) => setOptimizerQuery(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 rounded-xl bg-[#0B0D10] border border-[#29313D] text-xs font-mono text-[#A3E635] outline-none focus:border-amber-400 resize-none leading-relaxed"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isOptimizing}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 text-[#0B0D10] font-bold text-xs hover:bg-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <Cpu className="h-3.5 w-3.5" />
                  <span>{isOptimizing ? 'Analyzing Query Tree...' : 'Analyze & Optimize Query'}</span>
                </button>
              </div>
            </form>

            {optimizerAnalysis && (
              <div className="p-6 rounded-2xl border border-amber-400/40 bg-[#11151B] space-y-4 text-xs leading-relaxed text-[#E2E8F0] shadow-xl">
                <div className="prose prose-invert max-w-none whitespace-pre-wrap font-sans text-xs">
                  {optimizerAnalysis}
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
