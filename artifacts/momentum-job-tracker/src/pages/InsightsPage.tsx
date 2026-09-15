import { Activity, Clock3, Sparkles, Target } from 'lucide-react';
import { useWorkspaceData } from '../hooks/use-workspace-data';
import { PageTitle, StatCard } from '../components/shared';
import { stages } from '../lib/constants';
import type { Dashboard } from '@workspace/api-client-react';

function MiniChart({ series }: { series: Dashboard['weekSeries'] }) {
  const max = Math.max(...series.map(x => x.applications), 1);
  return <div className="mt-8 flex h-[150px] items-end gap-2 border-b border-border/70 pb-0 sm:gap-4">{series.map(item => <div key={item.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="flex h-[112px] w-full items-end justify-center gap-1"><div className="w-2 rounded-t-md bg-primary/75 transition-all sm:w-3" style={{ height: `${Math.max(10, item.applications / max * 100)}%` }}></div><div className="w-2 rounded-t-md bg-accent/70 transition-all sm:w-3" style={{ height: `${Math.max(7, item.interviews / Math.max(max, 2) * 100)}%` }}></div></div><span className="font-mono-ui text-[9px] text-muted-foreground">{item.label}</span></div>)}</div>;
}

export default function InsightsPage() {
  const { jobs, dashboard } = useWorkspaceData();
  const stageCounts = stages.map(s => ({ ...s, count: jobs.filter(j => j.stage === s.id).length }));
  const responseText = dashboard.responseRate > 35 ? 'Your signal is getting through.' : 'A few sharper applications could help.';
  return <>
    <PageTitle eyebrow="Your pattern, not a score" title="Read the rhythm." intro="Momentum is built from repeatable effort. These signals help you protect energy and notice what is working." />
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Response rate" value={`${dashboard.responseRate}%`} note={responseText} icon={Activity} tone="teal" />
      <StatCard label="Average days" value={dashboard.averageDays} note="Before your next move" icon={Clock3} tone="gold" />
      <StatCard label="Interviews" value={dashboard.interviews} note="Keep the conversation warm" icon={Target} />
    </div>
    <div className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
      <section className="rounded-2xl border border-card-border bg-card p-6">
        <div className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">Pipeline shape</div>
        <h2 className="mt-1 font-display text-[26px]">Where your energy is sitting.</h2>
        <div className="mt-7 space-y-5">{stageCounts.map(item => <div key={item.id}><div className="mb-2 flex items-center justify-between text-[12px]"><span className="font-semibold">{item.label}</span><span className="font-mono-ui text-[10px] text-muted-foreground">{item.count} roles</span></div><div className="h-2 rounded-full bg-muted"><div className={`h-full rounded-full ${item.tone === 'teal' ? 'bg-accent' : item.tone === 'gold' ? 'bg-[#d3953d]' : item.tone === 'coral' ? 'bg-primary' : 'bg-foreground/35'}`} style={{ width: `${Math.max(item.count ? 12 : 2, item.count / Math.max(jobs.length, 1) * 100)}%` }}></div></div></div>)}</div>
        <div className="mt-8 rounded-2xl bg-accent/10 p-4"><div className="flex gap-3"><Sparkles size={18} className="mt-0.5 shrink-0 text-accent" /><div><div className="text-[13px] font-bold">A gentle read</div><p className="mt-1 text-[12px] leading-5 text-muted-foreground">{dashboard.interviews > 2 ? 'You have enough active conversations to spend this week on thoughtful follow-ups rather than adding more volume.' : 'Keep a light weekly cadence: two focused applications, one follow-up, and a little room to notice what feels promising.'}</p></div></div></div>
      </section>
      <section className="rounded-2xl border border-card-border bg-card p-6">
        <div className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">Weekly activity</div>
        <h2 className="mt-1 font-display text-[26px]">Consistency over intensity.</h2>
        <MiniChart series={dashboard.weekSeries} />
        <div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-xl bg-muted p-4"><div className="font-mono-ui text-[10px] uppercase tracking-[.12em] text-muted-foreground">Sent this week</div><div className="mt-2 font-display text-2xl">{dashboard.weekSeries.reduce((n, x) => n + x.applications, 0)}</div></div><div className="rounded-xl bg-muted p-4"><div className="font-mono-ui text-[10px] uppercase tracking-[.12em] text-muted-foreground">Conversations</div><div className="mt-2 font-display text-2xl">{dashboard.weekSeries.reduce((n, x) => n + x.interviews, 0)}</div></div></div>
      </section>
    </div>
  </>;
}
