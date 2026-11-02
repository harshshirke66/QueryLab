import React from 'react';
import { Terminal, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#29313D] bg-[#0B0D10] text-[#969EAA] text-xs">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Manifesto */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#171C24] border border-[#29313D]">
                <span className="font-mono text-xs font-bold text-[#A3E635]">QL</span>
              </div>
              <span className="font-mono text-sm font-bold tracking-tight text-[#F4F5F7]">QUERYLAB</span>
            </div>
            <p className="text-xs text-[#969EAA] leading-relaxed">
              Think in Queries. Crack Real Interviews. A production-grade interview preparation platform engineered for Data Analysts, Analytics Engineers, and Data Scientists.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-[#A3E635]">
              <ShieldCheck className="h-4 w-4" />
              <span>Authentic Sourced Questions Only</span>
            </div>
          </div>

          {/* Learning Tracks */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#F4F5F7] mb-3">
              Learning Tracks
            </h4>
            <ul className="space-y-2">
              <li><a href="/concepts/sql-fundamentals" className="hover:text-[#F4F5F7] transition-colors">SQL Fundamentals</a></li>
              <li><a href="/concepts/window-functions" className="hover:text-[#F4F5F7] transition-colors">Window Functions Mastery</a></li>
              <li><a href="/concepts/subqueries-ctes" className="hover:text-[#F4F5F7] transition-colors">CTEs & Subqueries</a></li>
              <li><a href="/concepts/analytical-sql" className="hover:text-[#F4F5F7] transition-colors">Cohort & Retention Analysis</a></li>
              <li><a href="/concepts/pandas-wrangling" className="hover:text-[#F4F5F7] transition-colors">Python & Pandas Track</a></li>
            </ul>
          </div>

          {/* Company Hubs */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#F4F5F7] mb-3">
              Company Interview Hubs
            </h4>
            <ul className="space-y-2">
              <li><a href="/companies/meta" className="hover:text-[#F4F5F7] transition-colors">Meta SQL Questions</a></li>
              <li><a href="/companies/google" className="hover:text-[#F4F5F7] transition-colors">Google Analytics Questions</a></li>
              <li><a href="/companies/amazon" className="hover:text-[#F4F5F7] transition-colors">Amazon BIE Interview Questions</a></li>
              <li><a href="/companies/uber" className="hover:text-[#F4F5F7] transition-colors">Uber Logistics Analytics</a></li>
              <li><a href="/companies/stripe" className="hover:text-[#F4F5F7] transition-colors">Stripe Risk & Fraud SQL</a></li>
            </ul>
          </div>

          {/* Platform Features */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#F4F5F7] mb-3">
              Interview Engine
            </h4>
            <ul className="space-y-2">
              <li><a href="/questions" className="hover:text-[#F4F5F7] transition-colors">Question Bank Explorer</a></li>
              <li><a href="/mock-interview" className="hover:text-[#F4F5F7] transition-colors">Timed Mock Assessments</a></li>
              <li><a href="/ai-assistant" className="hover:text-[#F4F5F7] transition-colors">AI Studio & Question Generator</a></li>
              <li><a href="/leaderboard" className="hover:text-[#F4F5F7] transition-colors">Global Leaderboard</a></li>
              <li><a href="/analytics" className="hover:text-[#F4F5F7] transition-colors">Performance Heatmap & Analytics</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#29313D] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#64748B]">
          <p>© 2026 QUERYLAB. All rights reserved.</p>
          <p className="text-[#64748B]">Think in Queries. Crack Real Interviews.</p>
        </div>
      </div>
    </footer>
  );
}

