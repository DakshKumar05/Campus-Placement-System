import styles from './RoundTimeline.module.css';

/* The selection rounds of one application drawn as a flowchart: a node per
   round joined by connectors, left to right on wide screens and top to
   bottom on narrow ones. Each round's status picks its colour and icon. */

const STATE_CLASS = {
  Cleared: styles.cleared,
  Scheduled: styles.scheduled,
  Upcoming: styles.upcoming,
  Rejected: styles.rejected,
  'Not Reached': styles.notReached,
};

/** One line describing where the application stands overall. */
function summarise(rounds) {
  const rejected = rounds.find((round) => round.status === 'Rejected');
  if (rejected) {
    return 'Not selected after the ' + rejected.name + ' on ' + rejected.date + '.';
  }
  const scheduled = rounds.find((round) => round.status === 'Scheduled');
  if (scheduled) {
    return 'Next step: ' + scheduled.name + ' on ' + scheduled.date + '.';
  }
  return 'All rounds cleared - offer released.';
}

export default function RoundTimeline({ rounds }) {
  if (rounds.length === 0) {
    return <p className="panel-note">No rounds have been set up for this application yet.</p>;
  }

  return (
    <>
      <p className={styles.summary}>{summarise(rounds)}</p>
      <ol className={styles.timeline}>
        {rounds.map((round, index) => (
          <li
            key={round.id}
            className={styles.step + ' ' + (STATE_CLASS[round.status] || styles.upcoming)}
            aria-current={round.status === 'Scheduled' ? 'step' : undefined}
          >
            <span className={styles.node} aria-hidden="true">
              {round.status === 'Cleared' ? '✓' : round.status === 'Rejected' ? '✕' : index + 1}
            </span>
            <span className={styles.label}>
              <span className={styles.name}>{round.name}</span>
              <span className={styles.status}>{round.status}</span>
              <span className={styles.date}>{round.date || 'Date to be announced'}</span>
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}
