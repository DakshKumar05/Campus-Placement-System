import { useDebugValue, useMemo } from 'react';

/**
 * Applies the eligibility criteria to the job list loaded from the backend.
 * The filtering runs inside useMemo, so it is repeated only when the jobs
 * or the criteria actually change and not on every keystroke elsewhere.
 */
export function useEligibleJobs(allJobs, criteria) {
  const jobs = useMemo(() => {
    return allJobs.map((job) => ({
      ...job,
      eligible:
        job.ctc >= criteria.minCtc &&
        (criteria.branch === 'All' || job.branches.includes(criteria.branch)),
    }));
  }, [allJobs, criteria]);

  const eligibleCount = useMemo(
    () => jobs.filter((job) => job.eligible).length,
    [jobs]
  );

  useDebugValue(eligibleCount + ' of ' + jobs.length + ' eligible');

  return { jobs, eligibleCount };
}
