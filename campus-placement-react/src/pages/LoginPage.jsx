import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Panel from '../components/Panel.jsx';
import Button from '../components/Button.jsx';
import Field from '../components/Field.jsx';
import TopBar from '../components/TopBar.jsx';
import { usePlacement } from '../context/PlacementContext.jsx';
import { useToast } from '../hooks/useToast.js';
import { useForm } from '../hooks/useForm.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

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

export default function LoginPage() {
  const { login } = usePlacement();
  const showToast = useToast();
  const navigate = useNavigate();
  useDocumentTitle('CPMS - Login');

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

  function handleValidSubmit(values) {
    login({ username: values.username.trim(), role: values.role });
    showToast('Signed in as ' + (values.role === 'student' ? 'Student' : 'Recruiter'), 'success');
    navigate('/profile');          // programmatic navigation after login
  }

  return (
    <>
      <TopBar
        title="Sign In"
        subtitle="Students and recruiters use the same form; the fields change with the role."
      />

      <Panel
        title="Student & Recruiter Login"
        note="A controlled form: every input's value comes from state and every keystroke goes through one change handler."
      >
        <div className="btn-row" style={{ marginBottom: '14px' }}>
          <Button
            variant={role === 'student' ? 'primary' : 'outline'}
            onClick={() => selectRole('student')}
          >
            Student
          </Button>
          <Button
            variant={role === 'recruiter' ? 'primary' : 'outline'}
            onClick={() => selectRole('recruiter')}
          >
            Recruiter
          </Button>
        </div>

        <form className="form" onSubmit={form.handleSubmit(handleValidSubmit)} noValidate>
          <Field
            label={role === 'student' ? 'Register Number' : 'Company ID'}
            name="username"
            error={form.errors.username}
            touched={form.touched.username}
            hint={role === 'student' ? 'e.g. RA2211026010123' : 'e.g. REC-20260801'}
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

          <div className="btn-row">
            <Button type="submit">Sign In</Button>
            <Button type="button" variant="outline" onClick={form.reset}>
              Clear
            </Button>
          </div>
        </form>
      </Panel>
    </>
  );
}
