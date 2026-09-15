import { useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getListAlertsQueryKey, useCreateAlert, useListAlerts } from '@workspace/api-client-react';
import type { Alert } from '@workspace/api-client-react';
import { Bell, MapPin, Plus, X } from 'lucide-react';
import { PageTitle, EmptyState, Field } from '../components/shared';
import { fallbackAlerts } from '../lib/constants';

export default function AlertsPage() {
  const query = useListAlerts();
  const alertsData = query.data as Alert[] | undefined;
  const alerts = Array.isArray(alertsData) ? alertsData : fallbackAlerts;
  const createAlert = useCreateAlert();
  const qc = useQueryClient();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ query: '', location: '', frequency: 'Daily' });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.query || !form.location) return;
    createAlert.mutate({ data: { ...form, active: true } }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListAlertsQueryKey() });
        setShow(false);
        setForm({ query: '', location: '', frequency: 'Daily' });
      },
    });
  };
  return <>
    <PageTitle eyebrow="A little help from future-you" title="Let good roles find you." intro="Alerts keep the search open without asking you to keep refreshing it. Make them specific enough to feel useful." action={<button type="button" data-testid="button-new-alert" onClick={() => setShow(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-[13px] font-bold text-primary-foreground"><Plus size={17} />New alert</button>} />
    <div className="grid gap-4 xl:grid-cols-2">{alerts.map(alert => <article key={alert.id} data-testid={`card-alert-${alert.id}`} className="lift rounded-2xl border border-card-border bg-card p-5">
      <div className="flex items-start justify-between"><div className="flex items-start gap-3"><div className="rounded-xl bg-accent/12 p-2.5 text-accent"><Bell size={18} /></div><div><h3 className="text-[15px] font-bold">{alert.query}</h3><div className="mt-1 flex items-center gap-1.5 text-[12px] text-muted-foreground"><MapPin size={13} />{alert.location}</div></div></div><span className={`rounded-full px-2.5 py-1 font-mono-ui text-[9px] uppercase tracking-[.12em] ${alert.active ? 'bg-accent/12 text-accent' : 'bg-muted text-muted-foreground'}`}>{alert.active ? 'Active' : 'Paused'}</span></div>
      <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4"><div className="flex items-center gap-5"><div><div className="font-mono-ui text-[10px] uppercase tracking-[.1em] text-muted-foreground">Matches</div><div className="mt-1 text-[14px] font-bold">{alert.matchCount} new roles</div></div><div><div className="font-mono-ui text-[10px] uppercase tracking-[.1em] text-muted-foreground">Cadence</div><div className="mt-1 text-[14px] font-bold">{alert.frequency}</div></div></div><button type="button" data-testid={`button-edit-alert-${alert.id}`} className="rounded-xl border border-border px-3 py-2 text-[11px] font-semibold hover:bg-muted">Manage</button></div>
    </article>)}</div>
    {!alerts.length && <EmptyState title="No alerts yet." text="Set one up for the kind of work you want to notice, even on a low-energy day." action={<button type="button" data-testid="button-empty-new-alert" onClick={() => setShow(true)} className="rounded-xl bg-primary px-4 py-2.5 text-[12px] font-bold text-primary-foreground">Create your first alert</button>} />}
    {show && <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/25 p-0 sm:items-center sm:p-5"><form onSubmit={submit} className="w-full max-w-md rounded-t-3xl border border-border bg-card p-6 shadow-2xl sm:rounded-3xl">
      <div className="flex items-start justify-between"><div><div className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">Saved search</div><h2 className="mt-2 font-display text-[28px]">Create an alert.</h2></div><button type="button" data-testid="button-close-alert-dialog" onClick={() => setShow(false)} className="rounded-xl p-2 text-muted-foreground hover:bg-muted"><X size={18} /></button></div>
      <div className="mt-6 space-y-4"><Field label="What are you looking for?" required><input required data-testid="input-alert-query" value={form.query} onChange={e => setForm({ ...form, query: e.target.value })} placeholder="Design systems, product design…" /></Field><Field label="Where?" required><input required data-testid="input-alert-location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Remote · US, New York…" /></Field><Field label="How often?"><select data-testid="select-alert-frequency" value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })}><option>Daily</option><option>Weekly</option><option>Instant</option></select></Field></div>
      <button type="submit" data-testid="button-save-alert" disabled={createAlert.isPending} className="mt-7 w-full rounded-xl bg-primary py-3 text-[13px] font-bold text-primary-foreground disabled:opacity-60">{createAlert.isPending ? 'Saving…' : 'Save alert'}</button>
    </form></div>}
  </>;
}
