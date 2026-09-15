import type { ReactNode } from 'react';
import type { Profile } from '@workspace/api-client-react';
import { Activity, Sparkles } from 'lucide-react';

export function Avatar({ profile, size = 'md' }: { profile: Profile; size?: 'sm' | 'md' }) {
  return <div data-testid="avatar-profile" className={`flex shrink-0 items-center justify-center rounded-full font-mono-ui font-semibold text-primary-foreground ${size === 'sm' ? 'h-8 w-8 text-[10px]' : 'h-11 w-11 text-[12px]'}`} style={{ backgroundColor: profile.avatarColor || '#47766c' }}>{profile.initials}</div>;
}

export function PageTitle({ eyebrow, title, intro, action }: { eyebrow: string; title: string; intro?: string; action?: ReactNode }) {
  return <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="mb-3 flex items-center gap-2 font-mono-ui text-[10px] font-semibold uppercase tracking-[.2em] text-primary"><span className="h-px w-5 bg-primary"></span>{eyebrow}</div><h1 data-testid={`heading-${title.toLowerCase().replaceAll(' ', '-')}`} className="font-display text-[38px] leading-[1.05] tracking-[-.025em] text-foreground sm:text-[48px]">{title}</h1>{intro && <p className="mt-3 max-w-xl text-[14px] leading-6 text-muted-foreground">{intro}</p>}</div>{action}</div>;
}

export function StatCard({ label, value, note, icon: Icon, tone = 'coral' }: { label: string; value: string | number; note: string; icon: typeof Activity; tone?: 'coral' | 'teal' | 'gold' | 'ink' }) {
  return <div className="lift soft-shadow rounded-2xl border border-card-border bg-card p-5"><div className="flex items-start justify-between"><div className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-muted-foreground">{label}</div><div className={`rounded-lg p-2 ${tone === 'teal' ? 'bg-accent/12 text-accent' : tone === 'gold' ? 'bg-[#d3953d]/15 text-[#a36c17]' : tone === 'ink' ? 'bg-foreground/8 text-foreground' : 'bg-primary/10 text-primary'}`}><Icon size={16} /></div></div><div data-testid={`stat-${label.toLowerCase().replaceAll(' ', '-')}`} className="mt-4 font-display text-[34px] tracking-[-.02em]">{value}</div><div className="mt-1 text-[12px] text-muted-foreground">{note}</div></div>;
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-primary"><Sparkles size={21} /></div><h3 className="font-display text-xl">{title}</h3><p className="mt-2 max-w-sm text-[13px] leading-5 text-muted-foreground">{text}</p>{action && <div className="mt-5">{action}</div>}</div>;
}

export function Field({ label, required, wide, children }: { label: string; required?: boolean; wide?: boolean; children: ReactNode }) {
  return <label className={`block ${wide ? 'sm:col-span-2' : ''}`}><span className="mb-1.5 block text-[11px] font-bold text-muted-foreground">{label}{required && <span className="text-primary"> *</span>}</span>{children}</label>;
}
