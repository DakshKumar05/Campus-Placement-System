import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Panel from '../components/Panel.jsx';
import Button from '../components/Button.jsx';
import RoundTimeline from '../components/RoundTimeline.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import TopBar from '../components/TopBar.jsx';
import { usePlacement } from '../context/PlacementContext.jsx';
import { api } from '../data/api.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useToast } from '../hooks/useToast.js';

/* A dynamic route: useParams() reads the :id segment out of the URL,
   so /applications/2 and /applications/3 render the same component
   with different data. */

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications } = usePlacement();

  // The URL segment is a string; ids from the backend are numbers.
  const application = applications.find((app) => String(app.id) === id);
  const showToast = useToast();

  useDocumentTitle(application ? 'Campora - ' + application.company : 'Campora - Not found');

  // Rounds are loaded per application, and again if the URL moves to another one.
  // The ignore flag drops a response that arrives after the effect is cleaned up.
  const [rounds, setRounds] = useState(null);
  const applicationId = application?.id;
  useEffect(() => {
    if (applicationId == null) return;
    let ignore = false;
    setRounds(null);
    api.getRounds(applicationId)
      .then((list) => {
        if (!ignore) setRounds(list);
      })
      .catch((error) => {
        if (!ignore) showToast('Could not load rounds: ' + error.message, 'error');
      });
    return () => {
      ignore = true;
    };
  }, [applicationId]);

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
      <Panel
        title="Selection Rounds"
        note="Every round of the selection process, from the online assessment to the offer."
      >
        {rounds ? <RoundTimeline rounds={rounds} /> : <p className="panel-note">Loading rounds...</p>}
      </Panel>
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
