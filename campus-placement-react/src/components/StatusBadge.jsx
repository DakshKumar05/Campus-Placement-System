/* Maps a status string to its colour class. */

const STATUS_CLASS = {
  Selected: 'status-selected',
  Shortlisted: 'status-shortlisted',
  Rejected: 'status-rejected',
  Applied: 'status-applied',
};

export default function StatusBadge({ status }) {
  return <span className={STATUS_CLASS[status] || 'status-applied'}>{status}</span>;
}
