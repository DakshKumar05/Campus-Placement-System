import { useNavigate } from 'react-router-dom';
import Panel from '../components/Panel.jsx';
import Button from '../components/Button.jsx';
import Field from '../components/Field.jsx';
import TopBar from '../components/TopBar.jsx';
import { DEFAULT_CRITERIA, usePlacement } from '../context/PlacementContext.jsx';
import { useToast } from '../hooks/useToast.js';
import { useForm } from '../hooks/useForm.js';
import { useEligibleJobs } from '../hooks/useEligibleJobs.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { BRANCH_OPTIONS } from '../data/seed.js';

function validateCriteria(values) {
  const errors = {};
  if (values.minCgpa < 0 || values.minCgpa > 10) {
    errors.minCgpa = 'CGPA must be between 0 and 10';
  }
  if (values.minCtc < 0) errors.minCtc = 'CTC cannot be negative';
  if (values.maxBacklogs < 0) errors.maxBacklogs = 'Backlogs cannot be negative';
  return errors;
}

export default function EligibilityPage() {
  const { jobs, criteria, setCriteria } = usePlacement();
  const showToast = useToast();
  const navigate = useNavigate();
  useDocumentTitle('Campora - Eligibility');

  const form = useForm(criteria, validateCriteria);

  // Previews the result live, before the form is even submitted.
  const { eligibleCount } = useEligibleJobs(jobs, form.values);

  function handleValidSubmit(values) {
    setCriteria(values);
    showToast('Criteria saved - ' + eligibleCount + ' matching postings', 'info');
    navigate('/jobs');
  }

  function restoreDefaults() {
    setCriteria(DEFAULT_CRITERIA);
    form.setValues(DEFAULT_CRITERIA);
    showToast('Criteria reset to the default rules', 'info');
  }

  return (
    <>
      <TopBar
        title="Eligibility Filtering"
        subtitle="Set the rules that decide which postings you can apply to."
      />

      <Panel
        title="Eligibility Criteria"
        note={'With these settings, ' + eligibleCount + ' posting(s) would be open to you.'}
      >
        <form className="form" onSubmit={form.handleSubmit(handleValidSubmit)} noValidate>
          <Field label="Branch" name="branch">
            <select
              id="branch" name="branch" className="input"
              value={form.values.branch}
              onChange={form.handleChange}
            >
              {BRANCH_OPTIONS.map((branch) => (
                <option key={branch} value={branch}>
                  {branch === 'All' ? 'All branches' : branch}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Minimum CGPA"
            name="minCgpa"
            error={form.errors.minCgpa}
            touched={form.touched.minCgpa}
          >
            <input
              id="minCgpa" name="minCgpa" type="number" step="0.1" min="0" max="10"
              className="input"
              value={form.values.minCgpa}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </Field>

          <Field
            label="Maximum Active Backlogs"
            name="maxBacklogs"
            error={form.errors.maxBacklogs}
            touched={form.touched.maxBacklogs}
          >
            <input
              id="maxBacklogs" name="maxBacklogs" type="number" min="0" className="input"
              value={form.values.maxBacklogs}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </Field>

          <Field
            label="Minimum CTC (LPA)"
            name="minCtc"
            error={form.errors.minCtc}
            touched={form.touched.minCtc}
            hint="Postings below this are dimmed on the Job Postings page"
          >
            <input
              id="minCtc" name="minCtc" type="number" min="0" className="input"
              value={form.values.minCtc}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </Field>

          <div className="btn-row">
            <Button type="submit">Apply Criteria</Button>
            <Button type="button" variant="outline" onClick={restoreDefaults}>
              Restore Defaults
            </Button>
          </div>
        </form>
      </Panel>
    </>
  );
}
