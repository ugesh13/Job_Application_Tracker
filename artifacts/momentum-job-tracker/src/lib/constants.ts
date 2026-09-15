// Shared types, constants, and utilities for the Momentum app

import type { Dashboard, Job, Profile, Alert } from '@workspace/api-client-react';

export type Stage = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';

export const stages: { id: Stage; label: string; hint: string; tone: string }[] = [
  { id: 'wishlist', label: 'Wishlist', hint: 'Good possibilities', tone: 'stone' },
  { id: 'applied', label: 'Applied', hint: 'Keep the thread warm', tone: 'coral' },
  { id: 'interview', label: 'Interview', hint: 'Your moment is close', tone: 'teal' },
  { id: 'offer', label: 'Offer', hint: 'Decisions to make', tone: 'gold' },
  { id: 'rejected', label: 'Closed', hint: 'Part of the process', tone: 'muted' },
];

export const fallbackJobs: Job[] = [];
export const fallbackDashboard: Dashboard = {
  applicationsSent: 0, responseRate: 0, interviews: 0, averageDays: 0, needsAction: 0,
  weekSeries: [
    { label: 'Mon', applications: 0, interviews: 0 }, { label: 'Tue', applications: 0, interviews: 0 },
    { label: 'Wed', applications: 0, interviews: 0 }, { label: 'Thu', applications: 0, interviews: 0 },
    { label: 'Fri', applications: 0, interviews: 0 }, { label: 'Sat', applications: 0, interviews: 0 },
    { label: 'Sun', applications: 0, interviews: 0 },
  ],
  activity: [],
};
export const fallbackProfile: Profile = { id: 1, name: 'Guest User', email: '', role: '', targetRole: '', location: '', avatarColor: '#47766c', initials: 'GU' };
export const fallbackAlerts: Alert[] = [];

export function formatShortDate(value: string) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatLongDate(value: string) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}
