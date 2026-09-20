/* A labelled form control used by every form in the app.
   `htmlFor`/`id` tie the label to the input, and the error message appears
   only once the field has been touched. `inline` puts the control before
   the label, which is what a checkbox needs. */

export default function Field({ label, name, error, touched, hint, inline, children }) {
  const showError = Boolean(error && touched);

  return (
    <div className={inline ? 'field field-inline' : 'field'}>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      {children}
      {hint && !showError && <span className="field-hint">{hint}</span>}
      {showError && (
        <span className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
