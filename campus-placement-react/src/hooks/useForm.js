import { useDebugValue, useState } from 'react';

/**
 * Controlled-form hook. Holds the values of every field, runs a validate
 * function on submit and exposes the handlers a form needs.
 *
 *   const form = useForm({ email: '' }, validate);
 *   <input name="email" value={form.values.email} onChange={form.handleChange} />
 *   <form onSubmit={form.handleSubmit(onValid)}>
 *
 * Built from useState only — the same hook serves the login form, the
 * profile form, the eligibility form and the admin remark form.
 */
export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Shows "3 fields, 1 error" next to the hook in React DevTools.
  useDebugValue(
    Object.keys(values).length +
      ' fields, ' +
      Object.keys(errors).length +
      ' error(s)'
  );

  /** One handler for every input, including checkboxes and number fields. */
  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    const nextValue =
      type === 'checkbox' ? checked : type === 'number' ? Number(value) : value;

    setValues((current) => ({ ...current, [name]: nextValue }));

    // Clear the error for this field as soon as the user edits it.
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  }

  /** Wraps the caller's submit handler: validates first, calls it only if clean. */
  function handleSubmit(onValid) {
    return (event) => {
      event.preventDefault();               // stop the browser's page reload
      const found = validate ? validate(values) : {};
      setErrors(found);
      setTouched(
        Object.keys(values).reduce((all, key) => ({ ...all, [key]: true }), {})
      );
      if (Object.keys(found).length === 0) {
        onValid(values);
      }
    };
  }

  function reset() {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
  };
}
