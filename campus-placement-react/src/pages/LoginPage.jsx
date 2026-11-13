import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Field from '../components/Field.jsx';
import ToastHost from '../components/ToastHost.jsx';
import { usePlacement } from '../context/PlacementContext.jsx';
import { ROLE_HOME, ROLE_LABEL } from '../data/seed.js';
import { useToast } from '../hooks/useToast.js';
import { useForm } from '../hooks/useForm.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import styles from './LoginPage.module.css';

// The three sign-in tabs, each with its own label and example ID.
const ROLE_FIELDS = {
  student: { label: 'Register Number', hint: 'e.g. RA2211026010123' },
  recruiter: { label: 'Company ID', hint: 'e.g. REC-20260801' },
  admin: { label: 'Admin ID', hint: 'e.g. ADMIN01' },
};

/** Validation runs on submit; the keys match the field names. */
function validateLogin(values) {
  const errors = {};

  if (!values.username.trim()) {
    errors.username = 'This field is required';
  } else if (values.role === 'student' && !/^RA\d{13}$/i.test(values.username.trim())) {
    errors.username = 'Register number should look like RA2211026010123';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!values.agree) {
    errors.agree = 'Please accept the placement policy';
  }

  return errors;
}

/* The sign-in screen renders outside <Layout>, so it fills the window with
   its own backdrop and brings its own <ToastHost /> for sign-in messages.
   The form is still a controlled form: every input's value comes from
   state and every keystroke goes through one change handler. */
export default function LoginPage() {
  const { login } = usePlacement();
  const showToast = useToast();
  const navigate = useNavigate();
  useDocumentTitle('Campora - Login');

  // Remembers the last role used, so the form opens on the right tab.
  const [savedRole, setSavedRole] = useLocalStorage('cpms:role', 'student');
  const [role, setRole] = useState(savedRole);

  // A ref pointing at a DOM node, used to move focus — not to store data.
  const usernameRef = useRef(null);

  const form = useForm(
    { username: '', password: '', role: savedRole, agree: false },
    validateLogin
  );

  // Focus the first field when the page opens, and again when the role changes.
  useEffect(() => {
    usernameRef.current?.focus();
  }, [role]);

  function selectRole(nextRole) {
    setRole(nextRole);
    setSavedRole(nextRole);
    form.setValues((current) => ({ ...current, role: nextRole }));
  }

  async function handleValidSubmit(values) {
    try {
      await login({ username: values.username.trim(), role: values.role });
      showToast('Signed in as ' + ROLE_LABEL[values.role], 'success');
      navigate(ROLE_HOME[values.role]);   // each role opens its own window
    } catch (error) {
      showToast('Sign-in failed: ' + error.message, 'error');
    }
  }

  return (
    <div className={styles.page}>
      <svg className={styles.waves} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="silkA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#9fc1e6" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="silkB" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#00509e" stopOpacity="0.45" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
          <filter id="soften"><feGaussianBlur stdDeviation="18" /></filter>
        </defs>
        <g filter="url(#soften)">
          <path d="M-100 620 C 260 420, 520 820, 860 560 S 1380 300, 1560 460 L 1560 900 L -100 900 Z" fill="url(#silkB)" />
          <path d="M-100 360 C 300 160, 640 560, 980 340 S 1360 120, 1560 240 L 1560 520 C 1300 380, 1000 700, 640 560 S 120 520, -100 640 Z" fill="url(#silkA)" />
          <path d="M200 900 C 420 640, 760 760, 1000 600 S 1360 520, 1560 680 L 1560 900 Z" fill="url(#silkA)" opacity="0.7" />
        </g>
        {/* Thin highlights along the folds give the silk its sheen. */}
        <g fill="none" stroke="#ffffff" strokeLinecap="round">
          <path d="M-100 420 C 300 220, 640 620, 980 400 S 1360 180, 1560 300" strokeWidth="3" opacity="0.65" />
          <path d="M-100 470 C 320 280, 660 660, 1000 450 S 1370 240, 1560 360" strokeWidth="1.5" opacity="0.5" />
          <path d="M-100 690 C 280 500, 560 860, 900 620 S 1380 380, 1560 520" strokeWidth="2.5" opacity="0.45" />
        </g>
      </svg>

      <main className={styles.content}>
        <section className={styles.hero}>
          <h1 className={styles.brand}>CAMPORA</h1>
          <p className={styles.tagline}>
            Every drive, every round, every offer — tracked in one place.
          </p>
        </section>

        <section className={styles.card} aria-labelledby="signin-heading">
          <h2 id="signin-heading" className={styles.cardTitle}>Welcome back</h2>
          <p className={styles.cardNote}>
            {role === 'admin'
              ? 'Sign in to manage the placement approval queue.'
              : 'Sign in to track your applications and rounds.'}
          </p>

          <div className={styles.roles} role="group" aria-label="Sign in as">
            {Object.keys(ROLE_FIELDS).map((option) => (
              <button
                key={option}
                type="button"
                className={role === option ? styles.roleActive : styles.role}
                aria-pressed={role === option}
                onClick={() => selectRole(option)}
              >
                {ROLE_LABEL[option]}
              </button>
            ))}
          </div>

          <form className={styles.form} onSubmit={form.handleSubmit(handleValidSubmit)} noValidate>
            <Field
              label={ROLE_FIELDS[role].label}
              name="username"
              error={form.errors.username}
              touched={form.touched.username}
              hint={ROLE_FIELDS[role].hint}
            >
              <input
                ref={usernameRef}
                id="username"
                name="username"
                type="text"
                className="input"
                value={form.values.username}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                autoComplete="username"
              />
            </Field>

            <Field
              label="Password"
              name="password"
              error={form.errors.password}
              touched={form.touched.password}
            >
              <input
                id="password"
                name="password"
                type="password"
                className="input"
                value={form.values.password}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                autoComplete="current-password"
              />
            </Field>

            <Field
              label="I accept the placement policy"
              name="agree"
              inline
              error={form.errors.agree}
              touched={form.touched.agree}
            >
              <input
                id="agree"
                name="agree"
                type="checkbox"
                checked={form.values.agree}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
            </Field>

            <button type="submit" className={styles.submit}>Sign In</button>
            <button type="button" className={styles.clear} onClick={form.reset}>
              Clear form
            </button>
          </form>
        </section>
      </main>

      <ToastHost />
    </div>
  );
}
