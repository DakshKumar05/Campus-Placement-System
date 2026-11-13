import { Link } from 'react-router-dom';
import Panel from '../components/Panel.jsx';
import TopBar from '../components/TopBar.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

/* The catch-all route: <Route path="*" element={<NotFoundPage />} /> */

export default function NotFoundPage() {
  useDocumentTitle('Campora - Page not found');

  return (
    <>
      <TopBar title="Page Not Found" subtitle="That address does not match any section." />
      <Panel title="404">
        <p>Try one of the sections in the sidebar, or go back to the dashboard.</p>
        <div className="btn-row spaced-top">
          <Link className="btn" to="/dashboard">Go to Dashboard</Link>
        </div>
      </Panel>
    </>
  );
}
