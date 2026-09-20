import { Link, useNavigate, useParams } from 'react-router-dom';
import Panel from '../components/Panel.jsx';
import Button from '../components/Button.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import TopBar from '../components/TopBar.jsx';
import { usePlacement } from '../context/PlacementContext.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

/* A dynamic route: useParams() reads the :id segment out of the URL,
   so /applications/a2 and /applications/a3 render the same component
   with different data. */

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications } = usePlacement();

  const application = applications.find((app) => app.id === id);

  useDocumentTitle(application ? 'CPMS - ' + application.company : 'CPMS - Not found');

  if (!application) {
    return (
      <>
        <TopBar title="Application" subtitle="That application could not be found." />
        <Panel title="Not Found">
          <p>No application matches the id <code>{id}</code>.</p>
          <div className="btn-row spaced-top">
            <Link className="btn" to="/applications">Back to Applications</Link>
          </div>
        </Panel>
      </>
    );
  }

  return (
    <>
      <TopBar
        title={application.company}
        subtitle={'Application detail for ' + application.role + '.'}
      />
      <Panel title="Application Detail">
        <table>
          <tbody>
            <tr><td>Company</td><td>{application.company}</td></tr>
            <tr><td>Role</td><td>{application.role}</td></tr>
            <tr><td>Applied On</td><td>{application.appliedOn}</td></tr>
            <tr><td>Status</td><td><StatusBadge status={application.status} /></td></tr>
            <tr><td>Reference</td><td><code>{application.id}</code></td></tr>
          </tbody>
        </table>
        <div className="btn-row spaced-top">
          <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
          <Link className="btn" to="/jobs">Browse More Jobs</Link>
        </div>
      </Panel>
    </>
  );
}
