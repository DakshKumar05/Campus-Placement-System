import { Fragment, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Panel from '../components/Panel.jsx';
import JobRow from '../components/JobRow.jsx';
import TopBar from '../components/TopBar.jsx';
import Field from '../components/Field.jsx';
import { usePlacement } from '../context/PlacementContext.jsx';
import { useToast } from '../hooks/useToast.js';
import { useEligibleJobs } from '../hooks/useEligibleJobs.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function JobsPage() {
  const { user, jobs: allJobs, applications, criteria, applyToJob } = usePlacement();
  const showToast = useToast();
  const navigate = useNavigate();
  useDocumentTitle('Campora - Job Postings');

  // A controlled search box — one piece of local state, one event handler.
  const [search, setSearch] = useState('');

  const { jobs, eligibleCount } = useEligibleJobs(allJobs, criteria);

  // Derived data: filter by the search text, then group by category.
  const grouped = useMemo(() => {
    const term = search.trim().toLowerCase();
    const matching = term
      ? jobs.filter(
          (job) =>
            job.company.toLowerCase().includes(term) ||
            job.role.toLowerCase().includes(term) ||
            job.location.toLowerCase().includes(term)
        )
      : jobs;

    const map = new Map();
    matching.forEach((job) => {
      if (!map.has(job.category)) map.set(job.category, []);
      map.get(job.category).push(job);
    });
    return [...map.entries()];
  }, [jobs, search]);

  const appliedJobIds = useMemo(
    () => new Set(applications.map((app) => app.jobId)),
    [applications]
  );

  async function handleApply(job) {
    if (!user) {
      showToast('Sign in as a student to apply', 'warning');
      navigate('/login');
      return;
    }
    try {
      await applyToJob(job);
      showToast('Applied to ' + job.company + ' - ' + job.role, 'success');
      navigate('/applications');
    } catch (error) {
      // The server explains why: already applied, or branch not eligible.
      showToast(error.message, 'warning');
    }
  }

  return (
    <>
      <TopBar
        title="Job Postings"
        subtitle={eligibleCount + ' of ' + jobs.length + ' postings match your current eligibility criteria.'}
      />

      <Panel
        title="Company & Job Postings"
        note="Postings you are not eligible for are dimmed. Change the rules on the Eligibility page."
        ribbon="New"
      >
        <div className="form-inline">
          <Field label="Search postings" name="search">
            <input
              id="search"
              name="search"
              type="search"
              className="input"
              placeholder="Company, role or location"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </Field>
        </div>

        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>CTC (LPA)</th>
              <th>Location</th>
              <th>Open To</th>
              <th aria-label="Action" />
            </tr>
          </thead>
          <tbody>
            {grouped.length === 0 && (
              <tr>
                <td colSpan={6}>No postings match &ldquo;{search}&rdquo;.</td>
              </tr>
            )}
            {grouped.map(([category, categoryJobs]) => (
              <Fragment key={category}>
                <tr>
                  <td colSpan={6}>
                    <strong>{category}</strong>
                  </td>
                </tr>
                {categoryJobs.map((job) => (
                  <JobRow
                    key={job.id}
                    job={job}
                    applied={appliedJobIds.has(job.id)}
                    onApply={handleApply}
                  />
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
