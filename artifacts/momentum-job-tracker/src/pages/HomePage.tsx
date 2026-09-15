import { useState, useMemo, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGetDashboardQueryKey,
  getGetJobQueryKey,
  getListJobsQueryKey,
  useCreateJob,
  useDeleteJob,
  useGetJob,
  useUpdateJob,
  useGetCareerTwin,
  useSimulateTimeMachine,
  useGetReverseJobSearch,
  type CareerTwin,
  type TimeMachineResult,
  type ReverseSearchResult,
  type Job,
} from '@workspace/api-client-react';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  Bot,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  Compass,
  Cpu,
  Dna,
  ExternalLink,
  Flame,
  FolderGit2,
  GitBranch,
  HelpCircle,
  History,
  Layers,
  Lightbulb,
  Loader2,
  Mail,
  MapPin,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  UserCheck,
  Wand2,
  X,
  Zap,
} from 'lucide-react';
import { useWorkspaceData } from '../hooks/use-workspace-data';
import { Avatar, Field } from '../components/shared';
import { stages, formatShortDate, formatLongDate, type Stage } from '../lib/constants';
import { JobFitSection } from '../components/JobFitSection';
import { OnboardingModal } from '../components/OnboardingModal';
import CareerObject3D from '../components/CareerObject3D';

const TIME_MACHINE_PRESETS = [
  'AWS Cloud Architecture',
  'Docker & Container Orchestration',
  'PostgreSQL Distributed Systems',
  'LLM Integration & LangChain',
  'Kubernetes Production Operations',
  'GraphQL Platform Federation',
];

const SANDBOX_SCENARIOS = [
  {
    id: 'ai-engineer',
    title: 'AI Application Engineer',
    badge: 'High Growth',
    description: 'Bridges production interface engineering with generative LLM inference and vector search embeddings.',
    unlockedCapabilities: ['Prompt Engineering & Evaluation', 'Retrieval-Augmented Generation (RAG)', 'Context Streaming UX'],
    evidenceGaps: ['LangChain / LlamaIndex portfolio proof', 'Production vector database deployment'],
  },
  {
    id: 'backend-lead',
    title: 'Backend & Platform Specialist',
    badge: 'High Scalability',
    description: 'Designs resilient distributed microservices, schema migrations, and high-throughput API platform layers.',
    unlockedCapabilities: ['ACID Distributed Transactions', 'Event Streaming & Message Queues', 'Database Index Tuning'],
    evidenceGaps: ['Benchmark telemetry in public repo', 'Multi-tenant architecture whitepaper'],
  },
  {
    id: 'fullstack-product',
    title: 'Full-Lifecycle Product Engineer',
    badge: 'Most Aligned',
    description: 'Owns user experiences from responsive component state down to relational databases and automated CI/CD.',
    unlockedCapabilities: ['Type-safe End-to-End Delivery', 'Component Design Systems', 'Database Schema Modeling'],
    evidenceGaps: ['Production deployment documentation'],
  },
];

export default function HomePage() {
  const queryClient = useQueryClient();
  const { jobs, profile, dashboard } = useWorkspaceData();

  // Career Intelligence Data
  const { data: twinData, isLoading: twinLoading } = useGetCareerTwin();
  const twin = (twinData && typeof twinData === 'object' && 'provenance' in twinData ? (twinData as CareerTwin) : undefined);

  const { data: reverseData, isLoading: reverseLoading } = useGetReverseJobSearch();
  const reverse = (reverseData && typeof reverseData === 'object' && 'directions' in reverseData ? (reverseData as ReverseSearchResult) : undefined);

  // Time Machine State
  const timeMachineMutation = useSimulateTimeMachine();
  const [selectedPreset, setSelectedPreset] = useState('AWS Cloud Architecture');
  const [simulationResult, setSimulationResult] = useState<TimeMachineResult | null>(null);

  // Sandbox State
  const [activeSandboxIndex, setActiveSandboxIndex] = useState(0);

  // Job Modal & Tracker State
  const [trackerTab, setTrackerTab] = useState<'timeline' | 'kanban'>('timeline');
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();

  const handleUpdateJobStage = (job: Job, stage: Stage) => {
    updateJob.mutate(
      { id: job.id, data: { stage } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() }) }
    );
  };

  const handleRunTimeMachine = (skillToAdd: string) => {
    setSelectedPreset(skillToAdd);
    timeMachineMutation.mutate(
      {
        data: {
          additionalSkills: [skillToAdd],
          targetDirection: 'Advanced Cloud & Platform Engineering',
        },
      },
      {
        onSuccess: (data) => {
          setSimulationResult(data as TimeMachineResult);
        },
      }
    );
  };

  // Timeline Applications Categorization
  const timelineStages: Stage[] = ['applied', 'interview', 'offer', 'wishlist', 'rejected'];

  return (
    <div className="relative">
      {/* 3D Cosmic Object & Interactive Orbit System (Strictly in background behind all letters & cards) */}
      <CareerObject3D />

      {/* Main Content Layer - Explicitly stacked with relative z-10 over the 3D background */}
      <div className="relative z-10 space-y-28 sm:space-y-36 pb-16">
        <OnboardingModal isOpen={onboardingOpen} onClose={() => setOnboardingOpen(false)} profile={profile} />

        {/* =========================================================================
            01 — CINEMATIC HERO SECTION
            ========================================================================= */}
        <section className="relative z-20 pt-8 sm:pt-14 text-center">
          {/* Subtle Ambient Radial Top Glow */}
          <div className="pointer-events-none absolute left-1/2 -top-24 -translate-x-1/2 h-[450px] w-full max-w-4xl rounded-full bg-cyan-500/[0.08] blur-[140px]" />

          {/* Large Cinematic Brand Header */}
          <div className="relative z-20 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-[#06101e]/80 px-4 py-1 text-[11px] font-mono-ui uppercase tracking-[0.22em] text-cyan-300 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span>AI Career Operating System</span>
          </div>

          {/* Big Cinematic Brand Display Typography */}
          <div className="relative z-20 mt-4 font-display text-[52px] sm:text-[84px] md:text-[110px] lg:text-[132px] font-black uppercase tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-500/60 select-none leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.85)]">
            Momentum
          </div>

          {/* Hero Copy */}
          <h1 className="relative z-20 mt-2 font-display text-[32px] sm:text-[46px] md:text-[54px] font-bold tracking-tight text-white max-w-3xl mx-auto leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            Your career, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-teal-200">
              understood.
            </span>
          </h1>

          <p className="relative z-20 mt-4 text-[15px] sm:text-[18px] text-slate-200 max-w-xl mx-auto font-normal leading-relaxed drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
            Stop applying blindly. Understand where you fit, what you&apos;re missing, and what you could become next.
          </p>

          {/* Hero CTAs */}
          <div className="relative z-20 mt-7 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/career-intelligence"
              className="group flex items-center gap-2.5 rounded-full bg-cyan-500 px-7 py-3 text-[14px] font-bold text-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:bg-cyan-400 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore My Career</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#section-intro"
              className="flex items-center gap-2 rounded-full border border-white/15 bg-[#081220]/80 px-6 py-3 text-[14px] font-semibold text-slate-200 backdrop-blur-md transition hover:bg-white/[0.12] hover:text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            >
              <span>See How It Works</span>
              <ArrowDown size={14} className="text-slate-400" />
            </a>
          </div>

          {/* Subtle Cosmic Status Indicator */}
          <div className="relative z-20 mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[12px] font-mono-ui uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> 8 Career Intelligence Vectors</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Verifiable Proof Engine</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-sky-400" /> Real-time Market Fit</span>
          </div>
        </section>

      {/* =========================================================================
          02 — INTRODUCTION: MORE THAN A JOB TRACKER
          ========================================================================= */}
      <section id="section-intro" className="max-w-5xl mx-auto scroll-mt-28">
        <div className="text-center">
          <div className="text-[11px] font-mono-ui uppercase tracking-widest text-cyan-400 font-semibold">
            02 — Strategic Elevation
          </div>
          <h2 className="mt-2 font-display text-[32px] sm:text-[44px] font-bold text-white tracking-tight">
            More than a job tracker. <br />
            <span className="text-slate-400">It&apos;s your career co-pilot.</span>
          </h2>
          <p className="mt-3 text-[15px] text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Conventional portals push you to spray hundreds of resumes into corporate black holes. Momentum synthesizes your real engineering evidence to help you target roles where you hold genuine leverage.
          </p>
        </div>

        {/* Contrast Grid: Old Way vs Momentum Career OS */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Old Way */}
          <div className="rounded-3xl border border-white/[0.06] bg-[#070E18]/60 p-7 sm:p-8 backdrop-blur-xl relative overflow-hidden">
            <div className="text-[11px] font-mono-ui uppercase tracking-wider text-rose-400/80 font-bold">
              The Conventional Portal
            </div>
            <h3 className="mt-2 font-display text-[22px] font-bold text-slate-200">
              Blind High-Volume Applying
            </h3>
            <ul className="mt-5 space-y-3.5 text-[13px] text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>Endless scrolling through thousand-listing search grids with zero context.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>Applying without knowing why you were rejected or what skills you lacked.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>Generic keyword stuffing instead of verifiable project proof.</span>
              </li>
            </ul>
          </div>

          {/* Momentum OS */}
          <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-[#071322]/80 to-[#070E18]/80 p-7 sm:p-8 backdrop-blur-xl relative shadow-[0_0_50px_rgba(6,182,212,0.1)]">
            <div className="text-[11px] font-mono-ui uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
              <Sparkles size={13} /> The Momentum Career OS
            </div>
            <h3 className="mt-2 font-display text-[22px] font-bold text-white">
              Evidence-Grounded Intelligence
            </h3>
            <ul className="mt-5 space-y-3.5 text-[13px] text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>Algorithmic Job Fit and Skill Gap analysis before submitting any application.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>Reverse Job Search discovering high-alignment roles seeking your exact portfolio.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>Simulate future skills with the Career Time Machine to project your growth.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          03 — CAREER TWIN SPOTLIGHT
          ========================================================================= */}
      <section className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono-ui uppercase tracking-widest text-cyan-400 font-semibold">
              03 — Digital Twin Architecture
            </div>
            <h2 className="mt-1 font-display text-[30px] sm:text-[40px] font-bold text-white tracking-tight">
              Your Career Twin
            </h2>
            <p className="mt-1 text-[14px] text-slate-400 max-w-xl">
              An evidence-grounded computational model reflecting what you know, what you can prove in production, and what you could become next.
            </p>
          </div>
          <Link
            href="/career-intelligence"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[12px] font-bold text-slate-200 hover:border-cyan-500/40 hover:text-cyan-300 transition w-fit"
          >
            <span>Open Full Twin</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Visual Twin Capability Matrix */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {twinLoading ? (
            <div className="col-span-full flex h-48 items-center justify-center">
              <Loader2 className="animate-spin text-cyan-400" size={24} />
            </div>
          ) : (
            (twin?.skillDNA?.categories ?? []).map((cat) => (
              <div
                key={cat.name}
                className="group rounded-2xl border border-white/[0.07] bg-[#070F1B]/60 p-5 backdrop-blur-xl transition hover:border-cyan-500/30 hover:bg-[#091526]/75"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[14px] text-white group-hover:text-cyan-300 transition-colors">
                    {cat.name}
                  </span>
                  <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 text-[10px] font-mono-ui font-semibold text-cyan-300">
                    {cat.level}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] font-mono-ui text-slate-400">
                  <span>Capability Density</span>
                  <span className="font-bold text-slate-200">{cat.score}%</span>
                </div>

                {/* Progress bar */}
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-700"
                    style={{ width: `${cat.score}%` }}
                  />
                </div>

                <div className="mt-3.5 flex flex-wrap gap-1">
                  {cat.skills && cat.skills.length > 0 ? (
                    cat.skills.map((s) => (
                      <span key={s} className="rounded bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-[10px] text-slate-300">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-500 italic">Foundational capability</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* =========================================================================
          04 & 05 — SKILL DNA & CAREER OPPORTUNITY GRAPH
          ========================================================================= */}
      <section className="max-w-6xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* 04 — Skill DNA */}
          <div className="rounded-3xl border border-white/[0.07] bg-[#070F1B]/60 p-7 sm:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-[11px] font-mono-ui uppercase tracking-wider text-cyan-400 font-semibold">
              <Dna size={14} /> 04 — Skill DNA
            </div>
            <h3 className="mt-2 font-display text-[26px] font-bold text-white tracking-tight">
              Emerging Professional Identity
            </h3>
            <p className="mt-1 text-[13px] text-slate-400">
              Your verified skills synthesize into an overarching technical identity recognized by engineering managers.
            </p>

            <div className="mt-6 rounded-2xl border border-cyan-500/25 bg-cyan-950/20 p-5">
              <div className="text-[10px] font-mono-ui uppercase tracking-wider text-cyan-400 font-bold">
                Identified Core Archetype
              </div>
              <div className="mt-1 text-[20px] font-bold text-white">
                {twin?.emergingIdentity?.primary ?? 'Full-Stack Software Engineer'}
              </div>
              <div className="mt-1 text-[12px] text-slate-400">
                Secondary focus: <span className="text-slate-200">{twin?.emergingIdentity?.secondary ?? 'Platform Engineering'}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="text-[11px] font-mono-ui uppercase tracking-wider text-slate-400">
                Grounding Evidence Proof Points:
              </div>
              {(twin?.emergingIdentity?.evidenceList ?? []).map((e, idx) => (
                <div key={idx} className="flex items-start gap-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] p-3 text-[12px] text-slate-300">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{e}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 05 — Career Opportunity Graph */}
          <div className="rounded-3xl border border-white/[0.07] bg-[#070F1B]/60 p-7 sm:p-8 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono-ui uppercase tracking-wider text-cyan-400 font-semibold">
                <GitBranch size={14} /> 05 — Opportunity Graph
              </div>
              <h3 className="mt-2 font-display text-[26px] font-bold text-white tracking-tight">
                Capability-to-Role Pipeline
              </h3>
              <p className="mt-1 text-[13px] text-slate-400">
                How your proven skills branch into production capabilities and open market trajectories.
              </p>

              {/* Visual Connected Pipeline */}
              <div className="mt-6 space-y-3 font-mono-ui text-[12px]">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400 text-[10px]">1</span>
                  <div className="flex-1">
                    <span className="text-slate-400 text-[10px] block uppercase">Current Verified Layer</span>
                    <span className="text-slate-100 font-bold">TypeScript · React · PostgreSQL</span>
                  </div>
                </div>

                <div className="flex justify-center text-cyan-500/50">
                  <ArrowDown size={16} />
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/15 text-sky-400 text-[10px]">2</span>
                  <div className="flex-1">
                    <span className="text-slate-400 text-[10px] block uppercase">Activated Capabilities</span>
                    <span className="text-slate-100 font-bold">API Platforming · Reactive Interfaces · State Sync</span>
                  </div>
                </div>

                <div className="flex justify-center text-cyan-500/50">
                  <ArrowDown size={16} />
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-slate-950 text-[10px] font-bold">3</span>
                  <div className="flex-1">
                    <span className="text-cyan-300 text-[10px] block uppercase">Target Market Roles</span>
                    <span className="text-white font-bold">Full Stack Engineer · Product Systems Architect</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] text-right">
              <Link
                href="/career-intelligence"
                className="text-[12px] font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5"
              >
                <span>Interactive Graph Explorer</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          06 — CAREER TIME MACHINE
          ========================================================================= */}
      <section className="max-w-6xl mx-auto">
        <div className="rounded-3xl border border-cyan-500/25 bg-gradient-to-b from-[#081528]/80 via-[#070F1B]/80 to-[#070E18]/80 p-7 sm:p-10 backdrop-blur-2xl shadow-[0_0_60px_rgba(6,182,212,0.08)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono-ui uppercase tracking-widest text-cyan-400 font-semibold">
                <History size={14} /> 06 — Time Machine
              </div>
              <h2 className="mt-1.5 font-display text-[28px] sm:text-[36px] font-bold text-white tracking-tight">
                Simulate Future Career Scenarios
              </h2>
              <p className="mt-1 text-[14px] text-slate-400 max-w-xl">
                What if you master AWS? Or build production LLM systems? Test capability shifts without modifying your profile.
              </p>
            </div>

            <div className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 text-[11px] font-mono-ui text-amber-300/90 w-fit">
              Scenario Simulation · Non-destructive
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="mt-8">
            <div className="text-[11px] font-mono-ui uppercase tracking-wider text-slate-400 mb-3">
              Select a hypothetical skill to project:
            </div>
            <div className="flex flex-wrap gap-2">
              {TIME_MACHINE_PRESETS.map((preset) => {
                const isSelected = selectedPreset === preset;
                return (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => handleRunTimeMachine(preset)}
                    className={`rounded-full px-4 py-2 text-[12px] font-bold transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105'
                        : 'border border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-500/40 hover:text-white'
                    }`}
                  >
                    {isSelected ? `✓ ${preset}` : `+ ${preset}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inline Simulation Results Projection */}
          {timeMachineMutation.isPending && (
            <div className="mt-8 flex h-40 items-center justify-center gap-3 text-slate-400">
              <Loader2 className="animate-spin text-cyan-400" size={20} />
              <span>Simulating capability deltas and role unlock probabilities…</span>
            </div>
          )}

          {simulationResult && !timeMachineMutation.isPending && (
            <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#050A14]/70 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-mono-ui uppercase tracking-wider text-cyan-400 font-bold">
                  Projected Capability Deltas:
                </span>
                <span className="text-[11px] text-slate-400">Target: {selectedPreset}</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {simulationResult.simulatedDNA.map((item) => (
                  <div key={item.name} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                    <div className="font-bold text-[13px] text-slate-200">{item.name}</div>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-mono-ui">
                      <span className="text-slate-400">Current: {item.currentScore}%</span>
                      <span className="font-bold text-cyan-300">Projected: {item.simulatedScore}%</span>
                    </div>
                    {item.delta > 0 && (
                      <div className="mt-1 text-right text-[11px] font-bold text-emerald-400">
                        +{item.delta}% growth
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-cyan-950/30 border border-cyan-500/20 p-4 text-[12px] text-slate-300 flex items-start gap-2.5">
                <Sparkles size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Newly Unlocked Direction: </strong>
                  {(simulationResult.potentialDirections || []).slice(0, 2).join(' · ')}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          07 & 08 — CAREER SANDBOX & REVERSE JOB SEARCH
          ========================================================================= */}
      <section className="max-w-6xl mx-auto space-y-16">
        {/* 07 — Sandbox */}
        <div>
          <div className="text-[11px] font-mono-ui uppercase tracking-widest text-cyan-400 font-semibold">
            07 — Career Sandbox
          </div>
          <h2 className="mt-1.5 font-display text-[28px] sm:text-[36px] font-bold text-white tracking-tight">
            Explore Alternative Trajectories
          </h2>
          <p className="mt-1 text-[14px] text-slate-400 max-w-xl">
            Model how your background translates into adjacent engineering specializations.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {SANDBOX_SCENARIOS.map((scen, idx) => {
              const active = activeSandboxIndex === idx;
              return (
                <div
                  key={scen.id}
                  onClick={() => setActiveSandboxIndex(idx)}
                  className={`cursor-pointer rounded-2xl border p-6 transition-all backdrop-blur-xl flex flex-col justify-between ${
                    active
                      ? 'border-cyan-500/50 bg-[#071324]/80 shadow-[0_0_30px_rgba(6,182,212,0.15)] scale-[1.02]'
                      : 'border-white/[0.07] bg-[#070F1B]/60 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[16px] text-white">{scen.title}</span>
                      <span className="rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 px-2.5 py-0.5 text-[10px] font-mono-ui">
                        {scen.badge}
                      </span>
                    </div>
                    <p className="mt-2 text-[12px] text-slate-400 leading-relaxed">
                      {scen.description}
                    </p>

                    <div className="mt-4 space-y-1 text-[11px] text-slate-300">
                      <div className="font-bold text-cyan-400 text-[10px] uppercase font-mono-ui">Unlocked Skills:</div>
                      {scen.unlockedCapabilities.map((u) => (
                        <div key={u} className="flex items-center gap-1.5 text-slate-300">
                          <Check size={12} className="text-cyan-400" /> {u}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.06] text-right">
                    <span className="text-[11px] font-bold text-cyan-400 group-hover:underline">
                      {active ? 'Selected Direction ✓' : 'Explore Scenario →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 08 — Reverse Job Search */}
        <div className="rounded-3xl border border-white/[0.07] bg-[#070F1B]/60 p-7 sm:p-10 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono-ui uppercase tracking-widest text-cyan-400 font-semibold">
                <Compass size={14} /> 08 — Reverse Discovery
              </div>
              <h3 className="mt-1 font-display text-[26px] sm:text-[32px] font-bold text-white tracking-tight">
                What Jobs Are Looking for Someone Like You?
              </h3>
              <p className="mt-1 text-[13px] text-slate-400 max-w-xl">
                Instead of searching titles blindly, our engine queries market postings seeking your verified project evidence.
              </p>
            </div>
            <Link
              href="/search"
              className="rounded-full bg-white/[0.06] border border-white/10 px-5 py-2 text-[12px] font-bold text-slate-200 hover:text-white transition w-fit"
            >
              Browse All Roles →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {reverseLoading ? (
              <div className="col-span-full flex h-32 items-center justify-center">
                <Loader2 size={20} className="animate-spin text-cyan-400" />
              </div>
            ) : (
              (reverse?.directions ?? []).slice(0, 4).map((dir, idx) => (
                <div key={idx} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[15px] text-white">{dir.title}</h4>
                    <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono-ui font-semibold text-cyan-300">
                      {dir.matchLevel}
                    </span>
                  </div>

                  <div className="mt-3 rounded-xl bg-black/40 p-3 border border-white/[0.05] text-[12px] text-slate-300">
                    <strong className="text-cyan-400">Why discovered: </strong>
                    {dir.whyDiscovered}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(dir.potentialRoles || []).map((r) => (
                      <span key={r} className="rounded bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-[10px] text-slate-300">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          09, 10, 11 — IDENTITY, EVIDENCE RESUME & CONTINUOUS FEEDBACK LOOP
          ========================================================================= */}
      <section className="max-w-6xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* 09 — Career Identity */}
          <div className="rounded-3xl border border-white/[0.07] bg-[#070F1B]/60 p-7 backdrop-blur-xl">
            <div className="text-[11px] font-mono-ui uppercase tracking-wider text-cyan-400 font-semibold">
              09 — Career Identity
            </div>
            <h3 className="mt-1 font-display text-[22px] font-bold text-white">
              Engineering Stature
            </h3>
            <p className="mt-2 text-[13px] text-slate-400 leading-relaxed">
              &quot;What kind of engineer are you becoming?&quot; Not just an employee, but an owner of resilient systems.
            </p>
            <div className="mt-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 font-mono-ui text-[11px] text-slate-300 space-y-2">
              <div>• Level: Mid-to-Senior Transition</div>
              <div>• Strength: End-to-End Delivery</div>
              <div>• Strategic Focus: Cloud Production</div>
            </div>
          </div>

          {/* 10 — Evidence Resume */}
          <div className="rounded-3xl border border-white/[0.07] bg-[#070F1B]/60 p-7 backdrop-blur-xl">
            <div className="text-[11px] font-mono-ui uppercase tracking-wider text-cyan-400 font-semibold">
              10 — Evidence Proof
            </div>
            <h3 className="mt-1 font-display text-[22px] font-bold text-white">
              Beyond Plain Bullet Points
            </h3>
            <p className="mt-2 text-[13px] text-slate-400 leading-relaxed">
              Recruiters don&apos;t trust claimed keywords. We connect your skills to verifiable GitHub repositories and deployed live projects.
            </p>
            <div className="mt-6">
              <Link
                href="/settings"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-4 py-2 text-[12px] font-bold text-cyan-300 hover:bg-cyan-900/40 transition"
              >
                <FolderGit2 size={14} /> Add Project Proof
              </Link>
            </div>
          </div>

          {/* 11 — Career Feedback Loop */}
          <div className="rounded-3xl border border-white/[0.07] bg-[#070F1B]/60 p-7 backdrop-blur-xl">
            <div className="text-[11px] font-mono-ui uppercase tracking-wider text-cyan-400 font-semibold">
              11 — Continuous Loop
            </div>
            <h3 className="mt-1 font-display text-[22px] font-bold text-white">
              Adaptive Learning Loop
            </h3>
            <div className="mt-4 space-y-2 text-[11px] font-mono-ui text-slate-300">
              <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-cyan-400" /> Action: Submit Application</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-cyan-400" /> Outcome: Recruiter Response</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-cyan-400" /> Insight: Telemetry Analysis</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Updated Career Strategy</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          APPLICATION TRACKER: STAGE TIMELINE & KANBAN
          ========================================================================= */}
      <section id="applications" className="max-w-6xl mx-auto scroll-mt-28">
        <div className="rounded-3xl border border-white/[0.08] bg-[#070F1B]/80 p-7 sm:p-10 backdrop-blur-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono-ui uppercase tracking-widest text-cyan-400 font-semibold">
                Live Pipeline
              </div>
              <h2 className="mt-1 font-display text-[28px] sm:text-[36px] font-bold text-white tracking-tight">
                Active Applications
              </h2>
              <p className="mt-1 text-[13px] text-slate-400">
                Track your active conversations, next best actions, and interview stages with deep intelligence.
              </p>
            </div>

            {/* View Switcher: Timeline vs Kanban */}
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 p-1 w-fit">
              <button
                type="button"
                onClick={() => setTrackerTab('timeline')}
                className={`rounded-full px-4 py-1.5 text-[12px] font-bold transition ${
                  trackerTab === 'timeline'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Stage Timeline
              </button>
              <button
                type="button"
                onClick={() => setTrackerTab('kanban')}
                className={`rounded-full px-4 py-1.5 text-[12px] font-bold transition ${
                  trackerTab === 'kanban'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Kanban Board
              </button>
            </div>
          </div>

          {/* Timeline View (The new requested design) */}
          {trackerTab === 'timeline' ? (
            <div className="mt-10 space-y-8">
              {timelineStages.map((stageKey) => {
                const stageJobs = jobs.filter((j) => j.stage === stageKey);
                const stageTitle = stages.find((s) => s.id === stageKey)?.label || stageKey;
                const isOffered = stageKey === 'offer';
                const isRejected = stageKey === 'rejected';

                return (
                  <div key={stageKey} className="relative pl-8 border-l border-white/[0.12] pb-6 last:pb-0">
                    {/* Glowing Node Beacon on Timeline */}
                    <div
                      className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 transition-all ${
                        stageJobs.length > 0
                          ? isOffered
                            ? 'bg-emerald-400 border-emerald-300 shadow-[0_0_12px_#34d399]'
                            : isRejected
                            ? 'bg-rose-500 border-rose-400 shadow-[0_0_12px_#f43f5e]'
                            : 'bg-cyan-400 border-cyan-300 shadow-[0_0_12px_#22d3ee]'
                          : 'bg-[#050A14] border-slate-600'
                      }`}
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-bold text-[17px] text-white capitalize">{stageTitle}</h3>
                        <span className="rounded-full bg-white/[0.06] border border-white/10 px-2 py-0.5 text-[10px] font-mono-ui text-slate-300">
                          {stageJobs.length}
                        </span>
                      </div>
                    </div>

                    {stageJobs.length === 0 ? (
                      <div className="mt-3 text-[12px] text-slate-500 italic">No roles in this stage.</div>
                    ) : (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {stageJobs.map((job) => (
                          <div
                            key={job.id}
                            onClick={() => setSelectedJobId(job.id)}
                            className="cursor-pointer rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all hover:border-cyan-500/30 hover:bg-[#071324]/60 hover:scale-[1.01]"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[14px] text-white truncate">{job.title}</span>
                              <span className="text-[11px] text-cyan-400 font-semibold">{job.company}</span>
                            </div>
                            <div className="mt-2 text-[12px] text-slate-400 flex items-center gap-1.5">
                              <MapPin size={12} /> {job.location || 'Remote'}
                            </div>
                            <div className="mt-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 p-2 text-[11px] text-slate-300">
                              <strong className="text-cyan-400">Next: </strong>
                              {job.nextAction || 'Follow up with recruiter'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Kanban Board View */
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {stages.map((stage) => {
                const colJobs = jobs.filter((j) => j.stage === stage.id);
                return (
                  <div key={stage.id} className="rounded-2xl border border-white/[0.06] bg-black/30 p-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                      <span className="font-bold text-[13px] text-white">{stage.label}</span>
                      <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-mono-ui text-slate-400">
                        {colJobs.length}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2.5">
                      {colJobs.map((job) => (
                        <div
                          key={job.id}
                          onClick={() => setSelectedJobId(job.id)}
                          className="cursor-pointer rounded-xl border border-white/[0.06] bg-[#070E18] p-3 text-[12px] transition hover:border-cyan-500/30"
                        >
                          <div className="font-bold text-white truncate">{job.title}</div>
                          <div className="text-[11px] text-slate-400 truncate">{job.company}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          12 — FINAL CALL TO ACTION
          ========================================================================= */}
      <section className="max-w-4xl mx-auto text-center relative py-12">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-full max-w-xl rounded-full bg-cyan-500/[0.1] blur-[120px]" />

        <div className="relative">
          <div className="text-[11px] font-mono-ui uppercase tracking-widest text-cyan-400 font-semibold">
            12 — The Next Step
          </div>
          <h2 className="mt-2 font-display text-[36px] sm:text-[52px] font-bold text-white tracking-tight">
            Build the next version of your career.
          </h2>
          <p className="mt-3 text-[16px] text-slate-400 max-w-xl mx-auto leading-relaxed">
            Uncover the jobs seeking your capabilities and turn your engineering evidence into your greatest career leverage.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/career-intelligence"
              className="flex items-center gap-2 rounded-full bg-cyan-500 px-8 py-3.5 text-[14px] font-bold text-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.4)] transition hover:bg-cyan-400 hover:scale-[1.02]"
            >
              <span>Launch Career Twin</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/search"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-7 py-3.5 text-[14px] font-semibold text-slate-200 hover:bg-white/[0.08] hover:text-white transition"
            >
              <span>Discover Roles</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          JOB DETAIL MODAL (FEATURING TRUTH LAYER & FIT SCORE)
          ========================================================================= */}
      {selectedJobId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/[0.12] bg-[#070F1B] p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedJobId(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              <X size={18} />
            </button>

            {(() => {
              const activeJob = jobs.find((j) => j.id === selectedJobId);
              if (!activeJob) return <div>Job not found</div>;

              return (
                <div className="space-y-6">
                  <div>
                    <div className="text-[11px] font-mono-ui uppercase tracking-wider text-cyan-400">
                      {activeJob.company}
                    </div>
                    <h3 className="mt-1 font-display text-[26px] font-bold text-white">
                      {activeJob.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-3 text-[12px] text-slate-400">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {activeJob.location || 'Remote'}</span>
                      <span>·</span>
                      <span>Stage: <strong className="text-slate-200 capitalize">{activeJob.stage}</strong></span>
                      {activeJob.salary && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-400 font-semibold">{activeJob.salary}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Stage Switcher Buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.08]">
                    {stages.map((stage) => (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => {
                          handleUpdateJobStage(activeJob, stage.id);
                        }}
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                          activeJob.stage === stage.id
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
                        }`}
                      >
                        {stage.label}
                      </button>
                    ))}
                  </div>

                  {/* Integrated Job Fit & Truth Layer */}
                  <JobFitSection jobId={activeJob.id} />
                </div>
              );
            })()}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
