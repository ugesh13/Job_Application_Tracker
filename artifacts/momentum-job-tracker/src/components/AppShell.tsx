import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Brain,
  Compass,
  Layers,
  Search,
  Settings2,
  TrendingUp,
  Sparkles,
  Zap,
  CheckCircle2,
  Bell,
} from 'lucide-react';
import { useWorkspaceData } from '../hooks/use-workspace-data';
import { Avatar } from './shared';

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { profile } = useWorkspaceData();

  const navLinks = [
    { href: '/', label: 'Home', icon: Sparkles },
    { href: '/search', label: 'Discover', icon: Compass },
    { href: '/career-intelligence', label: 'Career Twin', icon: Brain, highlight: true },
    { href: '/insights', label: 'Insights', icon: TrendingUp },
    { href: '/alerts', label: 'Alerts', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-100 font-sans-ui selection:bg-cyan-500/25 selection:text-cyan-200 antialiased relative">
      {/* Cinematic Ambient Backdrop Layers */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(14,116,144,0.14),transparent_65%)]" />
        <div className="absolute top-[35%] right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(6,78,99,0.08),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[20%] left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(15,23,42,0.4),transparent_60%)] blur-3xl" />
      </div>

      {/* Floating Cinematic Navigation Bar (Desktop & Tablet) */}
      <header className="sticky top-4 sm:top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto flex items-center justify-between gap-4 sm:gap-6 rounded-full border border-white/[0.09] bg-[#070F1B]/80 px-4 sm:px-6 py-2 shadow-[0_16px_36px_rgba(0,0,0,0.6)] backdrop-blur-2xl max-w-5xl w-full transition-all duration-300">
          
          {/* LEFT: Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-display text-[18px] font-bold tracking-tight text-white transition hover:text-cyan-400 group"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-400/30 text-[12px] shadow-[0_0_15px_rgba(34,211,238,0.35)] group-hover:scale-105 transition-transform">
              ✦
            </span>
            <span className="tracking-tight font-extrabold text-slate-100">Momentum</span>
            <span className="hidden sm:inline-block rounded-full bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 text-[9px] font-mono-ui uppercase tracking-widest text-slate-400">
              CareerOS
            </span>
          </Link>

          {/* CENTER: Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, highlight }) => {
              const isActive = location === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.18)] border border-white/[0.12]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{label}</span>
                  {highlight && (
                    <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* RIGHT: Search & Profile Avatar */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/search"
              aria-label="Search roles and skills"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-slate-300 transition hover:border-cyan-500/30 hover:bg-white/[0.08] hover:text-cyan-200"
            >
              <Search size={14} />
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] p-1 pr-2.5 transition hover:border-white/20 hover:bg-white/[0.08]"
            >
              <Avatar profile={profile} size="sm" />
              <span className="hidden sm:inline text-[12px] font-medium text-slate-200 truncate max-w-[100px]">
                {profile.name.split(' ')[0]}
              </span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Cinematic Content Canvas */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-28 sm:pb-24">
        {children}
      </main>

      {/* Floating Bottom Navigation Dock (Mobile Only) */}
      <div className="fixed bottom-3 inset-x-4 z-50 flex md:hidden justify-center pointer-events-none">
        <nav className="pointer-events-auto flex items-center justify-around gap-1 rounded-full border border-white/[0.12] bg-[#070F1B]/90 px-4 py-2 shadow-[0_12px_32px_rgba(0,0,0,0.8)] backdrop-blur-2xl w-full max-w-md">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = location === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 rounded-full p-2 transition ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={18} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
          <Link
            href="/settings"
            className={`flex flex-col items-center gap-0.5 rounded-full p-2 transition ${
              location === '/settings' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings2 size={18} />
            <span className="text-[10px] font-medium">Settings</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
