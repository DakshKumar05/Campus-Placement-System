import { useEffect, useRef } from 'react';
import Panel from '../components/Panel.jsx';
import Button from '../components/Button.jsx';
import StatCard from '../components/StatCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import TopBar from '../components/TopBar.jsx';
import { usePlacement } from '../context/PlacementContext.jsx';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.js';
import { useCsvExport } from '../hooks/useCsvExport.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { BRANCH_RATES, PLACEMENT_STATS } from '../data/seed.js';

const CSV_HEADERS = ['Company', 'Role', 'Applied On', 'Status'];

export default function DashboardPage() {
  const { applications } = usePlacement();
  const exportCsv = useCsvExport();
  useDocumentTitle('CPMS - Dashboard');

  // Ref + effect: start the animations when the stats scroll into view.
  const [statsRef, statsVisible] = useIntersectionObserver(0.2);

  // A second ref, used only to focus the panel heading when the page opens.
  const headingRef = useRef(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  function handleExport() {
    const rows = applications.map((app) => [
      app.company, app.role, app.appliedOn, app.status,
    ]);
    exportCsv(CSV_HEADERS, rows, 'placement_report.csv');
  }

  // Keyboard event: Ctrl/Cmd + E exports, as in the HTML build.
  useEffect(() => {
    function onKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'e') {
        event.preventDefault();
        handleExport();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  });

  return (
    <>
      <TopBar
        title="Placement Dashboard"
        subtitle="Overall placement statistics for the 2027 batch."
        onExport={handleExport}
      />

      <div ref={statsRef}>
        <Panel title="Placement Statistics">
          <h4 ref={headingRef} tabIndex={-1} className="visually-quiet">
            Statistics for the current batch
          </h4>

          <div className="stats-grid">
            {PLACEMENT_STATS.map((stat) => (
              <StatCard
                key={stat.id}
                value={stat.value}
                caption={stat.caption}
                decimals={stat.decimals}
                active={statsVisible}
              />
            ))}
          </div>

          <p className="panel-note spaced-top">Branch-wise placement rate:</p>
          {BRANCH_RATES.map((branch, index) => (
            <ProgressBar
              key={branch.id}
              label={branch.branch}
              value={branch.rate}
              active={statsVisible}
              delay={index * 200}
            />
          ))}

          <div className="btn-row spaced-top">
            <Button onClick={handleExport}>Export Report</Button>
          </div>
          <p className="panel-note">Tip: press Ctrl + E to export from anywhere on this page.</p>
        </Panel>
      </div>
    </>
  );
}
