import Button from './Button.jsx';

/* One posting row. The parent decides whether it has been applied to and
   whether the current criteria make it eligible. */

export default function JobRow({ job, applied, onApply }) {
  return (
    <tr className={job.eligible ? undefined : 'row-filtered'}>
      <td>{job.company}</td>
      <td>{job.role}</td>
      <td>{job.ctc}</td>
      <td>{job.location}</td>
      <td>{job.branches.join(', ')}</td>
      <td>
        <Button
          variant={applied ? 'muted' : 'primary'}
          disabled={applied || !job.eligible}
          onClick={() => onApply(job)}
        >
          {applied ? 'Applied' : 'Apply'}
        </Button>
      </td>
    </tr>
  );
}
