/* One button primitive replacing the four anchor classes of the HTML build.
   `variant` picks the class set; everything else is spread onto the real
   <button>, so onClick, type and disabled pass straight through. */

const VARIANT_CLASS = {
  primary: 'btn',
  green: 'btn btn-green',
  red: 'btn btn-red',
  outline: 'btn-outline',
  muted: 'btn btn-muted',
};

export default function Button({ variant = 'primary', className = '', type = 'button', children, ...rest }) {
  const classes = [VARIANT_CLASS[variant] || VARIANT_CLASS.primary, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
