'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Terminal, 
  Search, 
  Flame, 
  Zap, 
  ShieldCheck, 
  BookOpen,
  Building2,
  Trophy, 
  BarChart3, 
  Bookmark,
  User as UserIcon,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  BrainCircuit,
  Menu,
  X,
  HelpCircle
} from 'lucide-react';
import CommandMenu from './CommandMenu';
import { getUserProgress, subscribeToProgress, saveProgress, UserProgressData, DEFAULT_FALLBACK } from '@/lib/user-progress';

export default function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<UserProgressData>(DEFAULT_FALLBACK);

  useEffect(() => {
    setMounted(true);
    setProgress(getUserProgress());
    const unsubscribe = subscribeToProgress((updated) => {
      setProgress(updated);
    });
    return unsubscribe;
  }, []);

  const safeProgress = progress || DEFAULT_FALLBACK;
  const userInitials = (safeProgress?.name || 'User')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'QL';

  // Global keyboard shortcut for search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on path change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setMoreDropdownOpen(false);
  }, [pathname]);

  const switchRole = async (role: 'candidate' | 'admin') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoType: role }),
      });
      const data = await res.json();
      if (data.success) {
        if (role === 'admin') {
          saveProgress({
            ...progress,
            name: 'Sarah Chen (Admin)',
            email: 'admin@querylab.dev',
            role: 'ADMIN',
            targetRole: 'Lead Interview Architect',
          });
        } else {
          saveProgress({
            ...progress,
            role: 'CANDIDATE',
          });
        }
        setUserDropdownOpen(false);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const primaryNavLinks = [
    { href: '/questions', label: 'Questions', icon: Terminal },
    { href: '/concepts', label: 'Concepts', icon: BookOpen },
    { href: '/companies', label: 'Companies', icon: Building2 },
    { href: '/mock-interview', label: 'Mock Interview', icon: ShieldCheck },
  ];

  const secondaryNavLinks = [
    { href: '/quiz', label: 'Analytics MCQs', icon: HelpCircle, desc: 'Unlimited AI quiz practice' },
    { href: '/ai-assistant', label: 'AI Studio', icon: BrainCircuit, desc: 'Synthesize & tutor' },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy, desc: 'Global rankings' },
    { href: '/analytics', label: 'Analytics', icon: BarChart3, desc: 'Performance heatmap' },
    { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark, desc: 'Saved questions' },
  ];

  const isSecondaryActive = secondaryNavLinks.some(link => pathname.startsWith(link.href));

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#29313D] bg-[#0B0D10]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo & Primary Navigation */}
          <div className="flex items-center gap-6 xl:gap-8 min-w-0">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#171C24] border border-[#29313D] group-hover:border-[#A3E635] transition-colors shadow-sm">
                <span className="font-mono text-xs font-bold text-[#A3E635]">QL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm sm:text-base font-bold tracking-tight text-[#F4F5F7] whitespace-nowrap">
                  QUERYLAB
                </span>
                <span className="h-2 w-2 rounded-full bg-[#A3E635] animate-pulse shrink-0"></span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 shrink-0">
              {primaryNavLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#171C24] text-[#A3E635] border border-[#29313D] shadow-sm font-semibold'
                        : 'text-[#969EAA] hover:text-[#F4F5F7] hover:bg-[#11151B]'
                    }`}
                  >
                    <link.icon className="h-4 w-4 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* More Dropdown (AI Studio, Leaderboard, Analytics, Bookmarks) */}
              <div className="relative" ref={moreMenuRef}>
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    isSecondaryActive || moreDropdownOpen
                      ? 'bg-[#171C24] text-[#A3E635] border border-[#29313D] shadow-sm font-semibold'
                      : 'text-[#969EAA] hover:text-[#F4F5F7] hover:bg-[#11151B]'
                  }`}
                >
                  <span>More</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-[#29313D] bg-[#171C24] p-1.5 shadow-2xl z-50">
                    {secondaryNavLinks.map((item) => {
                      const isActive = pathname.startsWith(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMoreDropdownOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                            isActive
                              ? 'bg-[#1D2430] text-[#A3E635] font-semibold'
                              : 'text-[#F4F5F7] hover:bg-[#1D2430]'
                          }`}
                        >
                          <item.icon className="h-4 w-4 text-[#969EAA] shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-medium leading-snug">{item.label}</span>
                            <span className="text-[10px] text-[#969EAA]">{item.desc}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Utilities (Search, Streak & XP Capsule, User Profile) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Global Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-[#29313D] bg-[#11151B] px-2.5 py-1.5 text-xs text-[#969EAA] hover:border-[#3E4A5C] hover:text-[#F4F5F7] transition-all shrink-0"
              title="Search questions, concepts, companies (Ctrl+K or ⌘K)"
            >
              <Search className="h-3.5 w-3.5 text-[#969EAA]" />
              <span className="hidden xl:inline font-mono text-xs">Search...</span>
              <kbd className="hidden sm:inline-flex items-center rounded border border-[#29313D] bg-[#171C24] px-1.5 py-0.5 text-[10px] font-mono text-[#969EAA]">
                ⌘K
              </kbd>
            </button>

            {/* Streak & XP Unified Capsule (Saves ~100px of space) */}
            <div 
              suppressHydrationWarning
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#171C24] border border-[#29313D] text-xs font-mono shrink-0 select-none"
            >
              <div className="flex items-center gap-1 text-amber-400 font-bold" title="Current Daily Practice Streak">
                <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span suppressHydrationWarning>{safeProgress.currentStreak}d</span>
              </div>
              <span className="text-[#3E4A5C]">|</span>
              <div className="flex items-center gap-1 text-[#A3E635] font-bold" title="Total Accumulated QueryLab XP">
                <Zap className="h-3.5 w-3.5 fill-[#A3E635] text-[#A3E635]" />
                <span suppressHydrationWarning>{safeProgress.xp} XP</span>
              </div>
            </div>

            {/* User Dropdown / Role Switcher */}
            <div className="relative shrink-0" ref={userMenuRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-[#29313D] bg-[#171C24] px-2.5 py-1.5 text-xs text-[#F4F5F7] hover:border-[#3E4A5C] transition-all shrink-0"
              >
                <div 
                  suppressHydrationWarning
                  className="h-7 w-7 rounded-lg bg-[#29313D] flex items-center justify-center font-mono font-bold text-xs text-[#A3E635] shrink-0"
                >
                  {userInitials}
                </div>
                <div className="hidden md:flex flex-col text-left whitespace-nowrap">
                  <span suppressHydrationWarning className="text-xs font-bold text-[#F4F5F7] leading-none">
                    {safeProgress.name || 'Candidate'}
                  </span>
                  <span suppressHydrationWarning className="text-[10px] text-[#969EAA] leading-none mt-1">
                    {safeProgress.role === 'ADMIN' ? '🛡️ Admin' : safeProgress.targetRole || 'Candidate'}
                  </span>
                </div>
                <ChevronDown className={`h-3 w-3 text-[#969EAA] transition-transform shrink-0 ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-[#29313D] bg-[#171C24] py-2 shadow-2xl z-50">
                  <div className="px-4 py-2.5 border-b border-[#29313D]">
                    <p className="text-xs font-bold text-[#F4F5F7]">{safeProgress.name || 'Candidate'}</p>
                    <p className="text-[11px] text-[#969EAA] truncate">{safeProgress.email || 'candidate@querylab.dev'}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-[#A3E635]">
                      <span>Role: {safeProgress.role}</span>
                      <span>•</span>
                      <span>{safeProgress.targetRole}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#F4F5F7] hover:bg-[#1D2430] transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#969EAA]" />
                      <span>My Dashboard</span>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#F4F5F7] hover:bg-[#1D2430] transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-[#969EAA]" />
                      <span>Profile & Badges</span>
                    </Link>
                    <Link
                      href="/analytics"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#F4F5F7] hover:bg-[#1D2430] transition-colors"
                    >
                      <BarChart3 className="h-4 w-4 text-[#969EAA]" />
                      <span>Performance Analytics</span>
                    </Link>
                    {progress.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#A3E635] hover:bg-[#1D2430] transition-colors"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>Admin Console</span>
                      </Link>
                    )}
                  </div>

                  {/* 1-Click Role Switcher */}
                  <div className="border-t border-[#29313D] px-4 py-2.5">
                    <p className="text-[10px] font-mono uppercase text-[#969EAA] mb-1.5">Switch Demo Mode</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => switchRole('candidate')}
                        className={`text-xs py-1.5 px-2 rounded-lg text-center transition-colors ${
                          progress.role === 'CANDIDATE'
                            ? 'bg-[#A3E635]/20 text-[#A3E635] font-bold border border-[#A3E635]/40'
                            : 'bg-[#11151B] text-[#969EAA] hover:text-[#F4F5F7]'
                        }`}
                      >
                        Candidate
                      </button>
                      <button
                        onClick={() => switchRole('admin')}
                        className={`text-xs py-1.5 px-2 rounded-lg text-center transition-colors ${
                          progress.role === 'ADMIN'
                            ? 'bg-[#A3E635]/20 text-[#A3E635] font-bold border border-[#A3E635]/40'
                            : 'bg-[#11151B] text-[#969EAA] hover:text-[#F4F5F7]'
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-[#29313D] pt-1">
                    <Link
                      href="/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-[#1D2430] transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Switch Account / Sign In</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center h-8 w-8 rounded-xl border border-[#29313D] bg-[#171C24] text-[#969EAA] hover:text-[#F4F5F7] shrink-0"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#29313D] bg-[#0B0D10] px-4 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#29313D]">
              {primaryNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#969EAA] hover:text-[#F4F5F7] hover:bg-[#171C24]"
                >
                  <link.icon className="h-4 w-4 text-[#A3E635]" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            <div className="space-y-1">
              {secondaryNavLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#969EAA] hover:text-[#F4F5F7] hover:bg-[#171C24]"
                >
                  <item.icon className="h-4 w-4 text-[#A3E635]" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-[#29313D] flex items-center justify-between text-xs text-[#969EAA] px-1 font-mono">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Flame className="h-4 w-4 fill-amber-400" />
                <span>{progress.currentStreak} Days Streak</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#A3E635] font-bold">
                <Zap className="h-4 w-4 fill-[#A3E635]" />
                <span>{progress.xp} XP</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Command Menu */}
      <CommandMenu isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
