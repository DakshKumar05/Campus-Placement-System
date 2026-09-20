import Panel from '../components/Panel.jsx';
import Button from '../components/Button.jsx';
import Field from '../components/Field.jsx';
import TopBar from '../components/TopBar.jsx';
import { usePlacement } from '../context/PlacementContext.jsx';
import { useToast } from '../hooks/useToast.js';
import { useForm } from '../hooks/useForm.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

function validateRemark(values) {
  const errors = {};
  if (values.remark.trim().length > 0 && values.remark.trim().length < 4) {
    errors.remark = 'A remark should be at least 4 characters';
  }
  return errors;
}

export default function AdminPage() {
  const { adminTasks, resolveTask } = usePlacement();
  const showToast = useToast();
  useDocumentTitle('CPMS - Admin');

  // One shared remark box; the buttons read its current value on click.
  const form = useForm({ remark: '' }, validateRemark);

  function handleDecision(task, approved) {
    if (task.pending <= 0) {
      showToast('No pending items for ' + task.task, 'warning');
      return;
    }

    const remark = form.values.remark.trim();
    const remaining = task.pending - 1;
    resolveTask(task.id, remark);
    form.reset();

    showToast(
      (approved ? task.task + ' approved. ' : task.task + ' rejected. ') +
        remaining + ' remaining.' + (remark ? ' Note: ' + remark : ''),
      approved ? 'success' : 'error'
    );
  }

  return (
    <>
      <TopBar title="Admin Panel" subtitle="Approve or reject the items waiting in the queue." />

      <Panel
        title="Pending Approvals"
        note="The optional remark is stored with whichever decision you make next."
      >
        <form className="form" onSubmit={form.handleSubmit(() => {})} noValidate>
          <Field
            label="Remark (optional)"
            name="remark"
            error={form.errors.remark}
            touched={form.touched.remark}
            hint="Attached to the next approve or reject"
          >
            <input
              id="remark" name="remark" type="text" className="input"
              value={form.values.remark}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </Field>
        </form>

        <table>
          <thead>
            <tr><th>Task</th><th>Pending</th><th>Last Remark</th><th aria-label="Actions" /></tr>
          </thead>
          <tbody>
            {adminTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.task}</td>
                <td className={task.pending === 0 ? 'cell-done' : undefined}>
                  {task.pending === 0 ? '\u2713 Done' : task.pending}
                </td>
                <td>{task.lastRemark || '\u2014'}</td>
                <td>
                  <div className="btn-row">
                    <Button variant="green" onClick={() => handleDecision(task, true)}>
                      Approve
                    </Button>
                    <Button variant="red" onClick={() => handleDecision(task, false)}>
                      Reject
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
