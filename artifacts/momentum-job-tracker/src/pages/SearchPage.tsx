import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import {
  getListJobsQueryKey,
  useCreateJob,
  useListJobs,
  useUpdateJob,
  type Job,
} from '@workspace/api-client-react';
import {
  Bell,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Filter,
  MapPin,
  Search,
  Sparkles,
  Star,
  ArrowUpRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { PageTitle, EmptyState } from '../components/shared';
import { fallbackJobs, formatShortDate } from '../lib/constants';
import { JobFitSection } from '../components/JobFitSection';

function EditorialJobCard({
  job,
  onSave,
  onAdd,
  adding,
}: {
  job: Job;
  onSave: () => void;
  onAdd: () => void;
  adding: boolean;
}) {
  const [showFit, setShowFit] = useState(false);

  // Extract or synthesize tech stack tags from description or skillsRequired
  const tags = useMemo(() => {
    if (job.skillsRequired && job.skillsRequired.length > 0) {
      return job.skillsRequired;
    }
    const detected: string[] = [];
    const lower = (job.description || '').toLowerCase();
    const common = ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'FastAPI', 'Next.js'];
    common.forEach((t) => {
      if (lower.includes(t.toLowerCase())) detected.push(t);
    });
    return detected.length > 0 ? detected.slice(0, 4) : ['Full Stack', 'Cloud', 'System Architecture'];
  }, [job]);

  return (
    <article
      data-testid={`result-job-${job.id}`}
      className="group rounded-3xl border border-white/[0.08] bg-[#070F1B]/80 p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300 hover:border-cyan-500/30 hover:bg-[#081528]/85 hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)]"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1 space-y-3">
          {/* Company & Location Badges */}
          <div className="flex flex-wrap items-center gap-3 text-[12px] text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-cyan-400 uppercase tracking-wider text-[11px] font-mono-ui">
              <Building size={13} /> {job.company}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-slate-500" /> {job.location || 'Remote'}
            </span>
            {job.salary && (
              <>
                <span>·</span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-mono-ui font-semibold text-emerald-400">
                  {job.salary}
                </span>
              </>
            )}
          </div>

          {/* Role Title */}
          <h3 className="font-display text-[22px] sm:text-[26px] font-bold text-white group-hover:text-cyan-300 transition-colors">
            {job.title}
          </h3>

          {/* Tech Stack Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-[11px] font-mono-ui text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* "Why This Fits You" Editorial Callout */}
          <div className="mt-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 p-4 text-[13px] leading-relaxed text-slate-300">
            <div className="flex items-center gap-1.5 text-[11px] font-mono-ui uppercase tracking-wider text-cyan-400 font-bold mb-1">
              <Sparkles size={13} /> Why this fits you
            </div>
            {job.description ? (
              <span className="line-clamp-2">
                Matches your verified technical capabilities and project delivery evidence with high alignment in modern architectures.
              </span>
            ) : (
              'Your backend experience and API projects strongly connect with this role.'
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 shrink-0 pt-2 md:pt-0">
          <button
            type="button"
            aria-label={`Save ${job.title}`}
            data-testid={`button-save-search-job-${job.id}`}
            onClick={onSave}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
              job.saved
                ? 'border-amber-500/40 bg-amber-500/15 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-white'
            }`}
          >
            <Star size={16} fill={job.saved ? 'currentColor' : 'none'} />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFit(!showFit)}
              className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-4 py-2 text-[12px] font-bold text-cyan-300 hover:bg-cyan-900/40 transition"
            >
              <Sparkles size={13} /> {showFit ? 'Hide Fit' : 'Truth Layer'}
              {showFit ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            <button
              type="button"
              data-testid={`button-add-search-job-${job.id}`}
              onClick={onAdd}
              disabled={adding}
              className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500 px-5 py-2 text-[12px] font-bold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition hover:bg-cyan-400 disabled:opacity-60"
            >
              {adding ? 'Tracking…' : 'Track Role →'}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Integrated Job Fit & Truth Layer */}
      {showFit && (
        <div className="mt-6 pt-6 border-t border-white/[0.08]">
          <JobFitSection jobId={job.id} />
        </div>
      )}
    </article>
  );
}

export default function SearchPage() {
  const queryClient = useQueryClient();
  const { data: serverJobs, isLoading } = useListJobs();
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<number | null>(null);

  const jobs = useMemo(() => {
    const list = serverJobs && serverJobs.length > 0 ? serverJobs : fallbackJobs;
    return list.filter((job) => {
      const matchQuery =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchTag =
        !selectedTag ||
        (job.description || '').toLowerCase().includes(selectedTag.toLowerCase()) ||
        (job.skillsRequired || []).some((s) => s.toLowerCase().includes(selectedTag.toLowerCase()));

      return matchQuery && matchTag;
    });
  }, [serverJobs, searchQuery, selectedTag]);

  const handleToggleSave = (job: Job) => {
    updateJob.mutate({
      id: job.id,
      data: { saved: !job.saved },
    });
  };

  const handleTrackRole = (job: Job) => {
    setAddingId(job.id);
    createJob.mutate(
      {
        data: {
          title: job.title,
          company: job.company,
          location: job.location ?? undefined,
          stage: 'applied',
          salary: job.salary ?? undefined,
          experienceLevel: job.experienceLevel,
          jobType: job.jobType,
          description: job.description ?? undefined,
          skillsRequired: job.skillsRequired || [],
        },
      },
      {
        onSettled: () => {
          setAddingId(null);
          queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });
        },
      }
    );
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono-ui uppercase tracking-widest text-cyan-400 font-semibold">
          High-Conviction Discovery
        </div>
        <h1 className="mt-1 font-display text-[34px] sm:text-[44px] font-bold text-white tracking-tight">
          Discover Roles
        </h1>
        <p className="mt-1 text-[15px] text-slate-400 max-w-2xl">
          Evaluate roles with complete algorithmic transparency before applying. Inspect required competencies, strategy simulators, and recruiter perspectives.
        </p>
      </div>

      {/* Cinematic Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, engineering stack, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-white/10 bg-[#070E18]/80 pl-11 pr-4 py-3 text-[14px] text-white placeholder:text-slate-500 backdrop-blur-xl focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
          />
        </div>

        {/* Filter Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['React', 'TypeScript', 'Python', 'AWS', 'Remote'].map((filter) => {
            const active = selectedTag === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedTag(active ? null : filter)}
                className={`rounded-full px-4 py-2.5 text-[12px] font-semibold whitespace-nowrap transition ${
                  active
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'border border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-white/20 hover:text-white'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editorial Job Feed */}
      <div className="space-y-5">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex items-center gap-3 text-slate-400 text-[14px]">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
              Scanning matching opportunities…
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.08] bg-[#070F1B]/60 p-12 text-center">
            <Search className="mx-auto text-slate-500" size={36} />
            <h3 className="mt-3 text-lg font-bold text-white">No matching roles found</h3>
            <p className="mt-1 text-sm text-slate-400 max-w-sm mx-auto">
              Try adjusting your search terms or clearing your selected filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedTag(null);
              }}
              className="mt-5 rounded-full bg-white/10 px-5 py-2 text-[12px] font-bold text-white hover:bg-white/20 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          jobs.map((job) => (
            <EditorialJobCard
              key={job.id}
              job={job}
              onSave={() => handleToggleSave(job)}
              onAdd={() => handleTrackRole(job)}
              adding={addingId === job.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
