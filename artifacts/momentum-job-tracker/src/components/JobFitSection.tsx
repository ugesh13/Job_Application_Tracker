import { useState } from 'react';
import { useGetJobFitScore, useGetJobTruthLayer } from '@workspace/api-client-react';
import type { FitScore, JobTruthLayer } from '@workspace/api-client-react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Compass,
  Eye,
  FileSearch,
  FolderGit2,
  HelpCircle,
  Info,
  Lightbulb,
  Loader2,
  Scale,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';

export function JobFitSection({ jobId }: { jobId: number }) {
  const [activeTab, setActiveTab] = useState<'fit' | 'truth' | 'recruiter' | 'alternatives'>('fit');

  const { data: fitData, isLoading: fitLoading } = useGetJobFitScore(jobId);
  const fit = fitData as FitScore | undefined;

  const { data: truthData, isLoading: truthLoading } = useGetJobTruthLayer(jobId);
  const truth = truthData as JobTruthLayer | undefined;

  if (fitLoading || truthLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-border/70 bg-primary/5 p-6">
        <div className="flex items-center gap-3 text-[13px] font-medium text-muted-foreground">
          <Loader2 size={18} className="animate-spin text-primary" />
          Computing Career Intelligence, Truth Layer, and Strategy Simulation…
        </div>
      </div>
    );
  }

  if (!fit) {
    return (
      <div className="rounded-2xl border border-border/70 bg-muted/40 p-4 text-[12px] text-muted-foreground">
        AI Fit Score calculation temporarily unavailable. Add your skills in Settings to enable live matching.
      </div>
    );
  }

  const scoreColor =
    fit.overallScore >= 80
      ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10'
      : fit.overallScore >= 60
        ? 'text-primary border-primary/30 bg-primary/10'
        : fit.overallScore >= 40
          ? 'text-amber-500 border-amber-500/30 bg-amber-500/10'
          : 'text-rose-500 border-rose-500/30 bg-rose-500/10';

  const badgeBg =
    fit.overallScore >= 80
      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
      : fit.overallScore >= 60
        ? 'bg-primary/15 text-primary'
        : fit.overallScore >= 40
          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
          : 'bg-rose-500/15 text-rose-600 dark:text-rose-400';

  return (
    <div className="rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent p-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Sparkles size={14} />
          </div>
          <div>
            <h4 className="text-[13px] font-bold">Advanced Career Intelligence</h4>
            <p className="text-[11px] text-muted-foreground">Evidence-grounded role analysis</p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeBg}`}>
          {fit.recommendation}
        </span>
      </div>

      {/* Intelligence Sub-Tabs */}
      <div className="mt-4 flex flex-wrap gap-1.5 border-b border-border/70 pb-2.5">
        <button
          type="button"
          onClick={() => setActiveTab('fit')}
          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
            activeTab === 'fit' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          Fit Score & Gaps
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('truth')}
          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
            activeTab === 'truth' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          Job Truth Layer & Strategy
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('recruiter')}
          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
            activeTab === 'recruiter' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          Recruiter Perspective
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('alternatives')}
          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
            activeTab === 'alternatives' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          What If I Don&apos;t Apply?
        </button>
      </div>

      {/* TAB 1: Fit Score & Gaps */}
      {activeTab === 'fit' && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-card p-3 shadow-xs">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl border text-[18px] font-extrabold ${scoreColor}`}>
                {fit.overallScore}%
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Fit Score</div>
                <div className="text-[12px] font-bold">{fit.recommendation}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-card p-3 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-[18px] font-extrabold text-primary">
                {fit.readinessScore ?? 75}%
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Readiness</div>
                <div className="text-[12px] font-bold">Preparation Level</div>
              </div>
            </div>
          </div>

          {/* Skill Gap Analysis */}
          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Skill Match Breakdown</span>
              <span>{fit.matchingSkills.length} of {fit.matchingSkills.length + fit.missingSkills.length} matched</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {fit.matchingSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  <CheckCircle2 size={12} /> {skill}
                </span>
              ))}

              {fit.missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-400"
                >
                  <AlertTriangle size={12} /> {skill} (gap)
                </span>
              ))}
            </div>
          </div>

          {/* Relevant Portfolio Projects */}
          {fit.matchingProjects && fit.matchingProjects.length > 0 && (
            <div className="rounded-xl border border-border/70 bg-card p-4">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <FolderGit2 size={14} className="text-primary" /> Recommended Portfolio Projects
              </div>
              <div className="mt-2.5 space-y-2">
                {fit.matchingProjects.slice(0, 2).map((proj) => (
                  <div
                    key={proj.id}
                    className="flex items-center justify-between rounded-lg bg-muted/60 p-2.5 text-[12px]"
                  >
                    <div>
                      <span className="font-bold text-foreground">{proj.name}</span>
                      {proj.matchingSkills.length > 0 && (
                        <span className="ml-2 text-[11px] text-muted-foreground">
                          Proves: {proj.matchingSkills.join(', ')}
                        </span>
                      )}
                    </div>
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                      {proj.matchScore}% match
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Job Truth Layer & Strategies */}
      {activeTab === 'truth' && truth && (
        <div className="mt-4 space-y-4">
          {/* Core vs Secondary vs Nice-to-Have */}
          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="font-mono-ui text-[10px] uppercase tracking-wider text-primary font-bold">
              Requirements Deconstruction
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <span className="text-[11px] font-bold uppercase text-rose-500">Core Requirements (Non-Negotiable)</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {truth.coreRequirements.map((r) => (
                    <span key={r} className="rounded-md bg-rose-500/10 border border-rose-500/25 px-2 py-0.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                      🔥 {r}
                    </span>
                  ))}
                </div>
              </div>

              {truth.secondaryRequirements.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400">Secondary Requirements</span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {truth.secondaryRequirements.map((r) => (
                      <span key={r} className="rounded-md bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                        ⚠ {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-[11px] font-bold uppercase text-muted-foreground">Nice-to-Have</span>
                <ul className="mt-1 space-y-1 text-[11px] text-muted-foreground">
                  {truth.niceToHave.map((n) => (
                    <li key={n}>○ {n}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* AI-Inferred Hidden Requirements */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
              <FileSearch size={14} /> AI-Inferred Competencies (Hidden Requirements)
            </div>
            <div className="mt-2.5 space-y-2">
              {truth.aiInferredCompetencies.map((item, idx) => (
                <div key={idx} className="rounded-lg bg-card p-3 border border-border/60">
                  <div className="text-[12px] font-bold text-foreground">{item.competency}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{item.inferredFrom}</div>
                  <div className="mt-2 inline-block rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {item.disclaimer}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Strategy Simulator */}
          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <Scale size={14} className="text-primary" /> Application Strategy Simulator
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Simulate decision trade-offs: apply now vs. strengthen evidence first.
            </p>

            <div className="mt-3 space-y-2.5">
              {truth.strategies.map((strat) => (
                <div
                  key={strat.id}
                  className={`rounded-xl border p-3.5 ${
                    strat.recommended
                      ? 'border-primary bg-primary/7 shadow-xs'
                      : 'border-border/70 bg-card'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[12px]">{strat.name}</span>
                    {strat.recommended && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                        Recommended Strategy
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-[11px] text-muted-foreground">
                    <strong className="text-foreground">Pros:</strong> {strat.pros}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    <strong className="text-foreground">Cons:</strong> {strat.cons}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Recruiter Perspective */}
      {activeTab === 'recruiter' && truth && (
        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Eye size={14} /> Recruiter First Impression Simulation
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-foreground">
              {truth.recruiterPerspective.firstImpression}
            </p>
            <div className="mt-3 rounded-lg bg-muted p-2.5 text-[11px]">
              <span className="font-bold">Perceived Evidence Level: </span>
              <span className="text-primary font-semibold">{truth.recruiterPerspective.perceivedEvidenceStrength}</span>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <HelpCircle size={14} className="text-amber-500" /> Anticipated Recruiter Questions
            </div>
            <ul className="mt-2 space-y-2 text-[12px] text-foreground">
              {truth.recruiterPerspective.likelyQuestions.map((q, idx) => (
                <li key={idx} className="rounded-lg bg-muted/50 p-2.5 border border-border/50">
                  {idx + 1}. {q}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/7 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Lightbulb size={14} /> How to Improve Perceived Evidence
            </div>
            <ul className="mt-2 space-y-1.5 text-[12px] text-foreground/90">
              {truth.recruiterPerspective.improvementAdvice.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ArrowRight size={13} className="mt-0.5 text-primary shrink-0" />
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAB 4: What If I Don't Apply? */}
      {activeTab === 'alternatives' && truth && (
        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Compass size={14} /> Market Alternatives & Prioritization Analysis
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Objective perspective on role scarcity versus comparable opportunities.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted p-3">
                <div className="text-[10px] text-muted-foreground">Similar Roles</div>
                <div className="mt-1 text-[15px] font-bold text-foreground">
                  ~{truth.whatIfIDontApply.marketAlternativesCount} available
                </div>
              </div>
              <div className="rounded-xl bg-muted p-3">
                <div className="text-[10px] text-muted-foreground">Role Uniqueness</div>
                <div className="mt-1 text-[13px] font-bold text-primary">Standard Stack</div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-[12px] text-foreground">
              <div className="rounded-lg bg-muted/40 p-3 border border-border/60">
                <strong>Assessment: </strong> {truth.whatIfIDontApply.uniquenessAssessment}
              </div>
              <div className="rounded-lg bg-muted/40 p-3 border border-border/60">
                <strong>Skill Transferability: </strong> {truth.whatIfIDontApply.skillOverlapInsight}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
