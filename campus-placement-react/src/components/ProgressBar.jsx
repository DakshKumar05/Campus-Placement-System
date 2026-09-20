/* The width is an inline style object — the third styling approach used in
   the project, alongside global CSS and CSS Modules. It is here because the
   value is computed at runtime. */

export default function ProgressBar({ label, value, active, delay = 0 }) {
  const fillStyle = {
    width: active ? value + '%' : '0%',
    transitionDelay: delay + 'ms',
  };

  return (
    <div className="bar-block">
      <p className="bar-label">
        {label} - {value}%
      </p>
      <div
        className="bar-outer"
        role="progressbar"
        aria-label={label + ' placement rate'}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="bar-inner" style={fillStyle} />
      </div>
    </div>
  );
}
