import { useState } from 'react';
import {
  useChatCareerAgent,
  useGetCareerTwin,
  useGetOpportunityGraph,
  useGetReverseJobSearch,
  useSimulateTimeMachine,
  useUpdateProfile,
  type CareerTwin,
  type OpportunityGraph,
  type ReverseSearchResult,
  type TimeMachineResult,
} from '@workspace/api-client-react';
import {
  AlertCircle,
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Cpu,
  Dna,
  FileCode,
  FolderGit2,
  GitBranch,
  HelpCircle,
  History,
  Layers,
  Lightbulb,
  Loader2,
  Play,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Wand2,
  Zap,
} from 'lucide-react';
import { PageTitle } from '../components/shared';

const TIME_MACHINE_PRESETS = [
  'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'LangChain', 'PostgreSQL', 'GraphQL', 'System Design'
];

export default function CareerIntelligencePage() {
  const [activeTab, setActiveTab] = useState<'twin' | 'time-machine' | 'sandbox' | 'reverse' | 'agent'>('twin');

  // API Queries
  const { data: twinData, isLoading: twinLoading, error: twinError, refetch: refetchTwin } = useGetCareerTwin();
  const twin = (twinData && typeof twinData === 'object' && 'provenance' in twinData ? (twinData as CareerTwin) : undefined);

  const { data: reverseData, isLoading: reverseLoading } = useGetReverseJobSearch();
  const reverse = (reverseData && typeof reverseData === 'object' && 'directions' in reverseData ? (reverseData as ReverseSearchResult) : undefined);

  const { data: graphData, isLoading: graphLoading } = useGetOpportunityGraph();
  const graph = (graphData && typeof graphData === 'object' && 'nodes' in graphData ? (graphData as OpportunityGraph) : undefined);

  // Time Machine Mutation & State
  const timeMachineMutation = useSimulateTimeMachine();
  const [selectedAdditions, setSelectedAdditions] = useState<string[]>(['AWS', 'Docker']);
  const [customAddition, setCustomAddition] = useState('');
  const [simulationResult, setSimulationResult] = useState<TimeMachineResult | null>(null);

  // Sandbox State
  const updateProfile = useUpdateProfile();
  const [sandboxActiveScenario, setSandboxActiveScenario] = useState<'fullstack' | 'backend' | 'ai'>('ai');
  const [appliedNotice, setAppliedNotice] = useState('');

  // Career Agent State
  const agentChatMutation = useChatCareerAgent();
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; evidence?: string[] }>>([
    {
      role: 'assistant',
      text: 'Hello! I am your Personal Career Agent. I have full context on your verified skills, projects, and target career direction. How can I help evaluate your next career move?',
      evidence: ['Grounded in your real profile, active skills, and portfolio projects.'],
    },
  ]);

  const togglePreset = (skill: string) => {
    if (selectedAdditions.includes(skill)) {
      setSelectedAdditions(selectedAdditions.filter((s) => s !== skill));
    } else {
      setSelectedAdditions([...selectedAdditions, skill]);
    }
  };

  const handleRunSimulation = () => {
    if (selectedAdditions.length === 0) return;
    timeMachineMutation.mutate(
      {
        data: {
          additionalSkills: selectedAdditions,
          targetDirection: 'Advanced Cloud & AI Systems',
        },
      },
      {
        onSuccess: (data) => {
          setSimulationResult(data as TimeMachineResult);
        },
      }
    );
  };

  const handleApplySandboxDirection = (title: string) => {
    updateProfile.mutate(
      {
        data: { targetRole: title },
      },
      {
        onSuccess: () => {
          setAppliedNotice(`Updated your active target role to "${title}".`);
          setTimeout(() => setAppliedNotice(''), 3000);
        },
      }
    );
  };

  const handleSendChatMessage = (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', text: query }]);
    setChatInput('');

    agentChatMutation.mutate(
      {
        data: { message: query },
      },
      {
        onSuccess: (res: any) => {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              text: res.reply,
              evidence: res.groundedEvidence,
            },
          ]);
        },
      }
    );
  };

  if (twinLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center gap-3 text-[14px] font-medium text-muted-foreground">
          <Loader2 size={20} className="animate-spin text-primary" />
          Synthesizing Career Digital Twin and Capability Vectors…
        </div>
      </div>
    );
  }

  if (!twin || !twin.provenance) {
    return (
      <div className="space-y-6">
        <PageTitle
          eyebrow="Advanced Career Intelligence"
          title="Career Digital Twin"
          intro="An evidence-grounded model of what you know, what you can prove, and what you could become."
        />
        <div className="rounded-2xl border border-border/80 bg-card p-8 text-center shadow-xs">
          <Brain className="mx-auto text-primary" size={40} />
          <h3 className="mt-3 text-lg font-bold">Initializing Career Intelligence</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
            {twinError ? 'Unable to load Career Twin data right now. Please check your connection or sign-in state.' : 'Connecting your skills, portfolio projects, and capability vectors…'}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={() => refetchTwin()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-xs"
            >
              <RotateCcw size={16} /> Re-sync Career Twin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageTitle
        eyebrow="Advanced Career Intelligence"
        title="Career Digital Twin"
        intro="An evidence-grounded model of what you know, what you can prove, and what you could become."
      />

      {appliedNotice && (
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 px-4 py-3 text-[13px] font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={16} /> {appliedNotice}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-border/70 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('twin')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold transition ${
            activeTab === 'twin'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Dna size={16} /> Career Twin & Skill DNA
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('time-machine')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold transition ${
            activeTab === 'time-machine'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <History size={16} /> Opportunity Graph & Time Machine
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sandbox')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold transition ${
            activeTab === 'sandbox'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Layers size={16} /> Career Sandbox & Autopilot
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reverse')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold transition ${
            activeTab === 'reverse'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Compass size={16} /> Reverse Job Search
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('agent')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold transition ${
            activeTab === 'agent'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Bot size={16} /> Personal Career Agent
        </button>
      </div>

      {/* TAB 1: Career Twin & Skill DNA */}
      {activeTab === 'twin' && twin && (
        <div className="space-y-6">
          {/* Provenance Header Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <Brain size={16} className="text-primary" />
              <span>Evidence Transparency:</span>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] font-bold">
              <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-primary">
                {twin.provenance?.userProvidedCount ?? 0} User-Provided Skills
              </span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-emerald-600 dark:text-emerald-400">
                {twin.provenance?.verifiedCount ?? 0} Verified by Projects
              </span>
              <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-purple-600 dark:text-purple-400">
                {twin.provenance?.inferredCount ?? 6} AI Capability Domains
              </span>
            </div>
          </div>

          {/* Emerging Career Identity */}
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-card p-6 shadow-xs">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Sparkles size={15} /> Evidence-Based Emerging Identity
            </div>
            <h3 className="mt-2 font-display text-[26px] text-foreground">
              {twin.emergingIdentity?.primary ?? 'Software Engineer'}
            </h3>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Secondary direction: <strong className="text-foreground">{twin.emergingIdentity?.secondary ?? 'Technical Specialist'}</strong> · Developing capability: <strong className="text-foreground">{twin.emergingIdentity?.developing ?? 'System Architecture'}</strong>
            </p>

            <div className="mt-4 border-t border-border/60 pt-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Verifiable Grounding Evidence:
              </div>
              <div className="flex flex-wrap gap-2">
                {(twin.emergingIdentity?.evidenceList ?? []).map((e, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-[11px] text-foreground"
                  >
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" /> {e}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Skill DNA: 6 Domains */}
          <div className="rounded-2xl border border-card-border bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-[22px]">Your Skill DNA</h3>
                <p className="text-[13px] text-muted-foreground">
                  Higher-level capability structure across major engineering dimensions.
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
                Multi-Domain Profile
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(twin.skillDNA?.categories ?? []).map((cat) => (
                <div key={cat.name} className="rounded-xl border border-border/70 bg-muted/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[13px] text-foreground">{cat.name}</span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        cat.score >= 70
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : cat.score >= 35
                          ? 'bg-primary/15 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {cat.level}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground font-mono-ui">
                    <span>Capability Strength</span>
                    <span className="font-bold text-foreground">{cat.score}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {cat.skills && cat.skills.length > 0 ? (
                      cat.skills.map((s) => (
                        <span key={s} className="rounded bg-card px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/50">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic">Foundational / No verified skills</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Cross-Domain Superpower */}
            <div className="mt-6 rounded-xl border border-primary/20 bg-primary/7 p-4">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                <Zap size={14} /> Strongest Capability Combination
              </div>
              <div className="mt-1 font-bold text-[15px] text-foreground">
                {twin.skillDNA?.strongestCombination ?? 'Engineering Capabilities'}
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                {twin.skillDNA?.crossDomainInsight ?? ''}
              </p>
            </div>
          </div>

          {/* Evidence Matrix: Claimed vs Verified */}
          <div className="rounded-2xl border border-card-border bg-card p-6 shadow-xs">
            <h3 className="font-display text-[22px]">Skill Evidence Matrix</h3>
            <p className="text-[13px] text-muted-foreground">
              Distinguishing between self-reported skills and skills verified by documented portfolio projects.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(twin.evidence ?? []).map((item) => (
                <div
                  key={item.skill}
                  className="flex items-center justify-between rounded-xl border border-border/70 bg-card p-3.5"
                >
                  <div>
                    <span className="font-bold text-[13px] text-foreground">{item.skill}</span>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {item.status === 'verified' ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Proved in: {(item.provenBy || []).join(', ')}
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400">
                          Evidence needed (no project linked)
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      item.status === 'verified'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {item.status === 'verified' ? 'Verified' : 'Claimed'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Opportunity Graph & Time Machine */}
      {activeTab === 'time-machine' && (
        <div className="space-y-6">
          {/* Opportunity Graph Overview */}
          <div className="rounded-2xl border border-card-border bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono-ui text-[10px] uppercase tracking-wider text-primary font-bold">
                  Relationship Ontology
                </div>
                <h3 className="mt-1 font-display text-[22px]">Career Opportunity Graph</h3>
                <p className="text-[13px] text-muted-foreground">
                  Understand how your active skills connect to core capabilities and career trajectories.
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
                Interactive Graph
              </span>
            </div>

            {graph && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {(graph.nodes ?? []).filter((n) => n.category !== 'root').map((node) => (
                  <div key={node.id} className="rounded-xl border border-border/70 bg-muted/40 p-3.5">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      {node.category}
                    </div>
                    <div className="mt-1 font-bold text-[13px] text-foreground">{node.label}</div>
                    <div className="mt-2 text-[11px] text-primary font-semibold">{node.level}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Time Machine Simulation */}
          <div className="rounded-2xl border border-primary/20 bg-card p-6 shadow-xs">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
              <History size={15} /> Career Time Machine
            </div>
            <h3 className="mt-1 font-display text-[24px]">Simulate Future Capability Shifts</h3>
            <p className="mt-1 text-[13px] text-muted-foreground">
              What if you learn AWS? Or containerization with Docker? Test the impact on your capability vectors without modifying your real profile.
            </p>

            <div className="mt-5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Select skills to simulate adding:
              </div>
              <div className="flex flex-wrap gap-2">
                {TIME_MACHINE_PRESETS.map((preset) => {
                  const active = selectedAdditions.includes(preset);
                  return (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => togglePreset(preset)}
                      className={`rounded-full px-3 py-1.5 text-[12px] font-bold transition ${
                        active
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'border border-border bg-card text-foreground hover:border-primary/50'
                      }`}
                    >
                      {active ? `✓ ${preset}` : `+ ${preset}`}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleRunSimulation}
                disabled={timeMachineMutation.isPending || selectedAdditions.length === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-[13px] font-bold text-primary-foreground disabled:opacity-60 shadow-xs"
              >
                {timeMachineMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Simulating…
                  </>
                ) : (
                  <>
                    <Play size={15} /> Run What-If Simulation
                  </>
                )}
              </button>
            </div>

            {/* Simulation Results */}
            {simulationResult && (
              <div className="mt-8 border-t border-border/70 pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-[20px]">Simulation Projection</h4>
                  <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                    Scenario Estimate · Not a guarantee
                  </span>
                </div>

                {/* Before vs After Capability */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {simulationResult.simulatedDNA.map((item) => (
                    <div key={item.name} className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
                      <div className="font-bold text-[12px] text-foreground">{item.name}</div>
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Current: {item.currentScore}%</span>
                        <span className="font-bold text-primary">Simulated: {item.simulatedScore}%</span>
                      </div>
                      {item.delta > 0 && (
                        <div className="mt-1 text-right text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          +{item.delta}% growth
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Newly Unlocked Capabilities */}
                <div className="rounded-xl border border-primary/20 bg-primary/7 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Newly Unlocked Capabilities
                  </div>
                  <ul className="mt-2 space-y-1.5 text-[12px] text-foreground">
                    {simulationResult.newlyUnlockedCapabilities.map((cap, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggested Roadmap */}
                <div className="rounded-xl border border-border/70 bg-card p-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Suggested Execution Roadmap
                  </div>
                  <ul className="mt-2 space-y-1 text-[12px] text-muted-foreground">
                    {simulationResult.suggestedLearningPath.map((step, idx) => (
                      <li key={idx}>Step {idx + 1}: {step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Career Sandbox & Autopilot */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-card-border bg-card p-6 shadow-xs">
            <h3 className="font-display text-[22px]">Career Sandbox</h3>
            <p className="text-[13px] text-muted-foreground">
              Experiment with alternative career tracks. Compare requirements, missing evidence, and readiness without altering your active profile until you choose to apply a direction.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSandboxActiveScenario('ai')}
                className={`rounded-xl px-4 py-2 text-[12px] font-bold transition ${
                  sandboxActiveScenario === 'ai'
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                Scenario A: AI Application Engineer
              </button>
              <button
                type="button"
                onClick={() => setSandboxActiveScenario('backend')}
                className={`rounded-xl px-4 py-2 text-[12px] font-bold transition ${
                  sandboxActiveScenario === 'backend'
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                Scenario B: Backend & Systems Lead
              </button>
              <button
                type="button"
                onClick={() => setSandboxActiveScenario('fullstack')}
                className={`rounded-xl px-4 py-2 text-[12px] font-bold transition ${
                  sandboxActiveScenario === 'fullstack'
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                Scenario C: Full Stack Product Engineer
              </button>
            </div>

            {/* Active Sandbox Scenario Detail */}
            <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-mono-ui text-[10px] uppercase tracking-wider text-primary font-bold">
                    Sandbox Scenario Exploration
                  </span>
                  <h4 className="mt-1 font-display text-[22px]">
                    {sandboxActiveScenario === 'ai'
                      ? 'AI Application Engineer'
                      : sandboxActiveScenario === 'backend'
                      ? 'Backend & Systems Lead'
                      : 'Full Stack Product Engineer'}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleApplySandboxDirection(
                      sandboxActiveScenario === 'ai'
                        ? 'AI Application Engineer'
                        : sandboxActiveScenario === 'backend'
                        ? 'Backend & Systems Lead'
                        : 'Full Stack Product Engineer'
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[12px] font-bold text-primary-foreground shadow-xs hover:bg-primary/90"
                >
                  <Target size={14} /> Apply this direction to my profile
                </button>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-card p-4 border border-border/70">
                  <div className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                    Already Supported by Evidence
                  </div>
                  <ul className="mt-2 space-y-1 text-[12px] text-foreground">
                    <li>✓ RESTful API architecture & service communication</li>
                    <li>✓ Modern front-end interface engineering</li>
                    <li>✓ Data persistence with relational schemas</li>
                  </ul>
                </div>

                <div className="rounded-xl bg-card p-4 border border-border/70">
                  <div className="text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400">
                    Capabilities to Develop & Prove
                  </div>
                  <ul className="mt-2 space-y-1 text-[12px] text-foreground">
                    <li>⚠ Production container orchestration (Docker/K8s)</li>
                    <li>⚠ Automated telemetry & observability logging</li>
                    <li>⚠ Scaled benchmark evidence in public repositories</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Reverse Job Search */}
      {activeTab === 'reverse' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-card-border bg-card p-6 shadow-xs">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Compass size={15} /> Reverse Discovery
            </div>
            <h3 className="mt-1 font-display text-[24px]">What Jobs Are Looking for Someone Like You?</h3>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Instead of searching for job titles blindly, this engine analyzes your verified projects and skills to identify role categories you may not have considered.
            </p>

            {reverseLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 size={20} className="animate-spin text-primary" />
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {(reverse?.directions ?? []).map((dir, idx) => (
                  <div key={idx} className="flex flex-col justify-between rounded-xl border border-border/70 bg-muted/30 p-5">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-[16px] text-foreground">{dir.title}</h4>
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          {dir.matchLevel}
                        </span>
                      </div>

                      <div className="mt-3 rounded-lg bg-card p-3 border border-border/60 text-[12px] text-foreground">
                        <strong className="text-primary">Why discovered: </strong>
                        {dir.whyDiscovered}
                      </div>

                      <div className="mt-3">
                        <div className="text-[10px] uppercase font-bold text-muted-foreground">
                          Target Title Variants:
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {(dir.potentialRoles || []).map((r) => (
                            <span key={r} className="rounded bg-card px-2 py-0.5 text-[11px] font-medium text-foreground border border-border/50">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: Personal Career Agent */}
      {activeTab === 'agent' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-card-border bg-card p-6 shadow-xs">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Bot size={16} /> My Career Agent
            </div>
            <h3 className="mt-1 font-display text-[24px]">Conversational Career Intelligence</h3>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Reason across your skills, projects, and target trajectories. Ask analytical questions grounded in your real candidate evidence.
            </p>

            {/* Quick Prompt Chips */}
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                'Why are you suggesting backend roles for me?',
                'What would happen if I learned Docker and AWS?',
                'Which of my projects best proves my ability?',
                'What is currently holding me back from my target direction?',
              ].map((chip) => (
                <button
                  type="button"
                  key={chip}
                  onClick={() => handleSendChatMessage(chip)}
                  className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-[11px] font-semibold text-foreground hover:border-primary/50 transition"
                >
                  &ldquo;{chip}&rdquo;
                </button>
              ))}
            </div>

            {/* Messages Box */}
            <div className="mt-6 flex flex-col gap-4 rounded-xl border border-border/70 bg-muted/20 p-4 min-h-[320px] max-h-[480px] overflow-y-auto">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col max-w-[85%] rounded-2xl p-4 text-[13px] leading-relaxed ${
                    m.role === 'user'
                      ? 'self-end bg-primary text-primary-foreground font-medium'
                      : 'self-start bg-card border border-border/70 text-foreground shadow-xs'
                  }`}
                >
                  <div>{m.text}</div>
                  {m.evidence && m.evidence.length > 0 && (
                    <div className="mt-3 border-t border-border/50 pt-2 text-[11px] text-muted-foreground">
                      <strong className="text-foreground">Grounded in: </strong>
                      {m.evidence.join(' ')}
                    </div>
                  )}
                </div>
              ))}
              {agentChatMutation.isPending && (
                <div className="self-start rounded-2xl bg-card border border-border/70 p-3 text-[12px] text-muted-foreground flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-primary" /> Thinking through candidate evidence…
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              className="mt-4 flex gap-2"
            >
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about your skills, projects, gaps, or career strategy…"
                className="flex-1 rounded-xl border border-input bg-card px-4 py-3 text-[13px] outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={agentChatMutation.isPending || !chatInput.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-[13px] font-bold text-primary-foreground disabled:opacity-60"
              >
                <Send size={15} /> Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
