import { useListJobs, useGetDashboard, useGetProfile } from '@workspace/api-client-react';
import type { Job, Dashboard, Profile } from '@workspace/api-client-react';
import { fallbackJobs, fallbackDashboard, fallbackProfile } from '../lib/constants';

export function useWorkspaceData() {
  const jobsQuery = useListJobs();
  const dashQuery = useGetDashboard();
  const profileQuery = useGetProfile();
  const jobsData = jobsQuery.data as Job[] | undefined;
  const jobs = Array.isArray(jobsData) ? jobsData : fallbackJobs;
  const profileData = profileQuery.data as Profile | undefined;
  const profile = profileData && profileData.name ? profileData : fallbackProfile;
  const dashData = dashQuery.data as Dashboard | undefined;
  const dashboard = dashData && dashData.applicationsSent !== undefined ? dashData : fallbackDashboard;
  return { jobs, dashboard, profile, loading: jobsQuery.isLoading || dashQuery.isLoading, errors: jobsQuery.isError || dashQuery.isError };
}
