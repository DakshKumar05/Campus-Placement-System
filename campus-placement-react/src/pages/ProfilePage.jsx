import { useState } from 'react';
import Panel from '../components/Panel.jsx';
import Button from '../components/Button.jsx';
import Field from '../components/Field.jsx';
import TopBar from '../components/TopBar.jsx';
import { usePlacement } from '../context/PlacementContext.jsx';
import { useToast } from '../hooks/useToast.js';
import { useForm } from '../hooks/useForm.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { BRANCH_OPTIONS } from '../data/seed.js';

function validateProfile(values) {
  const errors = {};

  if (!values.name.trim()) errors.name = 'Name is required';

  if (Number.isNaN(values.cgpa) || values.cgpa < 0 || values.cgpa > 10) {
    errors.cgpa = 'CGPA must be between 0 and 10';
  }
  if (values.backlogs < 0) errors.backlogs = 'Backlogs cannot be negative';
  if (values.gradYear < 2024 || values.gradYear > 2030) {
    errors.gradYear = 'Graduation year looks wrong';
  }
  if (!values.skills.trim()) errors.skills = 'List at least one skill';

  return errors;
}

export default function ProfilePage() {
  const { profile, setProfile } = usePlacement();
  const showToast = useToast();
  useDocumentTitle('CPMS - Profile');

  const [editing, setEditing] = useState(false);
  const form = useForm(profile, validateProfile);

  function handleValidSubmit(values) {
    setProfile(values);
    setEditing(false);
    showToast('Profile updated', 'success');
  }

  function cancelEdit() {
    form.reset();
    setEditing(false);
  }

  // Conditional rendering: the same data is either a table or a form.
  if (!editing) {
    return (
      <>
        <TopBar title="Student Profile" subtitle="The details recruiters see with your applications." />
        <Panel title="Student Profile">
          <table>
            <tbody>
              <tr><td>Name</td><td>{profile.name}</td></tr>
              <tr><td>Register Number</td><td>{profile.registerNumber}</td></tr>
              <tr><td>Branch</td><td>{profile.branch}</td></tr>
              <tr><td>CGPA</td><td>{profile.cgpa}</td></tr>
              <tr><td>Active Backlogs</td><td>{profile.backlogs}</td></tr>
              <tr><td>Graduation Year</td><td>{profile.gradYear}</td></tr>
              <tr><td>Skills</td><td>{profile.skills}</td></tr>
            </tbody>
          </table>
          <div className="btn-row spaced-top">
            <Button onClick={() => setEditing(true)}>Edit Profile</Button>
          </div>
        </Panel>
      </>
    );
  }

  return (
    <>
      <TopBar title="Student Profile" subtitle="Editing — changes are held in state until you save." />
      <Panel
        title="Edit Profile"
        note="Text, number and select inputs, all controlled by the same useForm hook."
      >
        <form className="form" onSubmit={form.handleSubmit(handleValidSubmit)} noValidate>
          <Field label="Name" name="name" error={form.errors.name} touched={form.touched.name}>
            <input
              id="name" name="name" type="text" className="input"
              value={form.values.name}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </Field>

          <Field label="Branch" name="branch">
            <select
              id="branch" name="branch" className="input"
              value={form.values.branch}
              onChange={form.handleChange}
            >
              {BRANCH_OPTIONS.filter((branch) => branch !== 'All').map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </Field>

          <Field label="CGPA" name="cgpa" error={form.errors.cgpa} touched={form.touched.cgpa}>
            <input
              id="cgpa" name="cgpa" type="number" step="0.01" min="0" max="10" className="input"
              value={form.values.cgpa}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </Field>

          <Field label="Active Backlogs" name="backlogs" error={form.errors.backlogs} touched={form.touched.backlogs}>
            <input
              id="backlogs" name="backlogs" type="number" min="0" className="input"
              value={form.values.backlogs}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </Field>

          <Field label="Graduation Year" name="gradYear" error={form.errors.gradYear} touched={form.touched.gradYear}>
            <input
              id="gradYear" name="gradYear" type="number" className="input"
              value={form.values.gradYear}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </Field>

          <Field label="Skills" name="skills" error={form.errors.skills} touched={form.touched.skills}>
            <textarea
              id="skills" name="skills" rows={3} className="input"
              value={form.values.skills}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </Field>

          <div className="btn-row">
            <Button type="submit" variant="green">Save Changes</Button>
            <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>
          </div>
        </form>
      </Panel>
    </>
  );
}
