import { Link } from 'react-router-dom';
import Panel from '../components/Panel.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import TopBar from '../components/TopBar.jsx';
import { usePlacement } from '../context/PlacementContext.jsx';
import { useCsvExport } from '../hooks/useCsvExport.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

const CSV_HEADERS = ['Company', 'Role', 'Applied On', 'Status'];

export default function ApplicationsPage() {
  const { user, applications } = usePlacement();
  const exportCsv = useCsvExport();
  useDocumentTitle('Campora - Applications');

  if (!user) {
    return (
      <>
        <TopBar title="Application Tracking" subtitle="Your applications are stored on the server." />
        <Panel title="Sign In Required">
          <p>Sign in to see the applications saved for your account.</p>
          <div className="btn-row spaced-top">
            <Link className="btn" to="/login">Go to Login</Link>
          </div>
        </Panel>
      </>
    );
  }

  function handleExport() {
    const rows = applications.map((app) => [
      app.company, app.role, app.appliedOn, app.status,
    ]);
    exportCsv(CSV_HEADERS, rows, 'placement_applications.csv');
  }

  return (
    <>
      <TopBar
        title="Application Tracking"
        subtitle={applications.length + ' application(s) submitted so far.'}
        onExport={handleExport}
      />

      <Panel
        title="Your Applications"
        note="Each row links to its own URL - /applications/:id - handled by a dynamic route."
      >
        <table>
          <thead>
            <tr>
              <th>Company</th><th>Role</th><th>Applied On</th><th>Status</th>
              <th aria-label="Action" />
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.company}</td>
                <td>{app.role}</td>
                <td>{app.appliedOn}</td>
                <td><StatusBadge status={app.status} /></td>
                <td>
                  <Link className="btn-outline" to={'/applications/' + app.id}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
