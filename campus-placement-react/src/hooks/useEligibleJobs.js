import { useDebugValue, useMemo } from 'react';
import { JOB_POSTINGS } from '../data/seed.js';

/**
 * Applies the eligibility criteria to the job list.
 * The filtering runs inside useMemo, so it is repeated only when the
 * criteria actually change and not on every keystroke elsewhere.
 */
export function useEligibleJobs(criteria) {
  const jobs = useMemo(() => {
    return JOB_POSTINGS.map((job) => ({
      ...job,
      eligible:
        job.ctc >= criteria.minCtc &&
        (criteria.branch === 'All' || job.branches.includes(criteria.branch)),
    }));
  }, [criteria]);

  const eligibleCount = useMemo(
    () => jobs.filter((job) => job.eligible).length,
    [jobs]
  );

  useDebugValue(eligibleCount + ' of ' + jobs.length + ' eligible');

  return { jobs, eligibleCount };
}
