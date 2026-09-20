import Button from './Button.jsx';
import { usePlacement } from '../context/PlacementContext.jsx';

export default function TopBar({ title, subtitle, onExport }) {
  const { user, logout } = usePlacement();

  return (
    <header className="topbar">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="btn-row">
        {user && (
          <span className="who">
            {user.role === 'student' ? 'Student' : 'Recruiter'}: {user.username}
          </span>
        )}
        <Button onClick={onExport}>Export All Data</Button>
        {user && (
          <Button variant="outline" onClick={logout}>
            Log out
          </Button>
        )}
      </div>
    </header>
  );
}
