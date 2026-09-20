import { useCountUp } from '../hooks/useCountUp.js';
import styles from './StatCard.module.css';

/* Each card runs its own count-up animation; the parent only says whether
   the dashboard has scrolled into view yet. */

export default function StatCard({ value, caption, decimals, active }) {
  const display = useCountUp(value, { decimals, active });

  return (
    <div className={styles.stat}>
      <div className={styles.num}>{display}</div>
      <div className={styles.cap}>{caption}</div>
    </div>
  );
}
