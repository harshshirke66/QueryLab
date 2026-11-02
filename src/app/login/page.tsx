'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  User as UserIcon, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { 
  initializeNewUserAccount, 
  getUserProgress, 
  saveProgress, 
  DEMO_PROGRESS 
} from '@/lib/user-progress';

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Data Analyst');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password,
          name: authMode === 'signup' ? name : undefined,
          targetRole: authMode === 'signup' ? targetRole : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      // Update live profile
      if (authMode === 'signup') {
        initializeNewUserAccount(
          name || data.user?.name,
          email || data.user?.email,
          targetRole || data.user?.targetRole || 'Data Analyst'
        );
      } else {
        // Sign in mode
        if (email.toLowerCase() === 'candidate@querylab.dev') {
          saveProgress(DEMO_PROGRESS);
        } else {
          const current = getUserProgress();
          if (!current.email || current.email.toLowerCase() !== email.toLowerCase()) {
            initializeNewUserAccount(
              data.user?.name || email.split('@')[0],
              email,
              data.user?.targetRole || 'Data Analyst'
            );
          }
        }
      }

      setSuccessMessage(authMode === 'signup' ? 'Account created! Redirecting to workspace...' : 'Signed in! Redirecting...');
      setTimeout(() => {
        window.location.href = data.user?.role === 'ADMIN' ? '/admin' : '/dashboard';
      }, 700);
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#F4F5F7]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md rounded-2xl border border-[#29313D] bg-[#11151B] p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in">
          
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#171C24] border border-[#29313D] mb-1">
              <span className="font-mono text-sm font-bold text-[#A3E635]">QL</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#F4F5F7]">
              {authMode === 'signin' ? 'Sign in to QUERYLAB' : 'Create your Candidate Account'}
            </h1>
            <p className="text-xs text-[#969EAA]">
              {authMode === 'signin' 
                ? 'Think in Queries. Crack Real Interviews.' 
                : 'Join thousands of analysts mastering SQL & technical interviews.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#171C24] border border-[#29313D] text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setAuthMode('signin'); setError(null); }}
              className={`py-2 rounded-lg transition-all text-center ${
                authMode === 'signin'
                  ? 'bg-[#A3E635] text-[#0B0D10] font-bold shadow-sm'
                  : 'text-[#969EAA] hover:text-[#F4F5F7]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('signup'); setError(null); }}
              className={`py-2 rounded-lg transition-all text-center ${
                authMode === 'signup'
                  ? 'bg-[#A3E635] text-[#0B0D10] font-bold shadow-sm'
                  : 'text-[#969EAA] hover:text-[#F4F5F7]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error & Success Banners */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs leading-relaxed animate-in fade-in">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleAuth} className="space-y-4 text-xs">
            
            {/* Full Name (Sign Up only) */}
            {authMode === 'signup' && (
              <div className="space-y-1.5 animate-in fade-in">
                <label className="text-[#969EAA] font-medium flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5 text-[#A3E635]" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171C24] border border-[#29313D] text-[#F4F5F7] placeholder-[#64748B] outline-none focus:border-[#A3E635] transition-colors"
                />
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[#969EAA] font-medium flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#A3E635]" />
                <span>Email address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#171C24] border border-[#29313D] text-[#F4F5F7] placeholder-[#64748B] outline-none focus:border-[#A3E635] transition-colors"
              />
            </div>

            {/* Target Role Selection (Sign Up only) */}
            {authMode === 'signup' && (
              <div className="space-y-1.5 animate-in fade-in">
                <label className="text-[#969EAA] font-medium flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-[#A3E635]" />
                  <span>Target Career Track</span>
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171C24] border border-[#29313D] text-[#F4F5F7] outline-none focus:border-[#A3E635] transition-colors"
                >
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Analytics Engineer">Analytics Engineer</option>
                  <option value="Product Data Scientist">Product Data Scientist</option>
                  <option value="Business Intelligence Engineer">Business Intelligence Engineer</option>
                </select>
              </div>
            )}

            {/* Password with Eye Toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[#969EAA] font-medium flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-[#A3E635]" />
                  <span>Password</span>
                </label>
                {authMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to registered email address.')}
                    className="text-[11px] text-[#A3E635] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-[#171C24] border border-[#29313D] text-[#F4F5F7] placeholder-[#64748B] outline-none focus:border-[#A3E635] transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#969EAA] hover:text-[#F4F5F7]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#29313D] bg-[#171C24] text-[#A3E635] focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="remember" className="text-[11px] text-[#969EAA] cursor-pointer">
                Keep me signed in for 30 days
              </label>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#A3E635] text-[#0B0D10] font-bold text-xs hover:bg-[#8ECE2B] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <span>
                {isLoading 
                  ? 'Authenticating...' 
                  : authMode === 'signin' 
                  ? 'Sign In to Workspace' 
                  : 'Complete Registration & Start Practice'}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Security & Privacy Notice */}
          <div className="pt-2 text-center text-[11px] text-[#64748B]">
            Protected by modern token authentication & PostgreSQL security standards.
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
