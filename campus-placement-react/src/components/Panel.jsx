import styles from './Panel.module.css';

/* Section shell shared by every page. Styled with a CSS Module, so the
   class names are scoped to this component. */

export default function Panel({ title, note, ribbon, children }) {
  return (
    <section className={styles.panel}>
      {ribbon && <span className={styles.ribbon}>{ribbon}</span>}
      <h3 className={styles.heading}>{title}</h3>
      {note && <p className={styles.note}>{note}</p>}
      {children}
    </section>
  );
}
