import { NavLink } from 'react-router-dom';
import { usePlacement } from '../context/PlacementContext.jsx';
import { NAV_LINKS, ROLE_LABEL } from '../data/seed.js';

/* Routing navigation. NavLink applies the "active" class itself by
   comparing the current URL with `to`. Only the links the signed-in
   user's role may open are listed, so each role gets its own window. */

export default function Sidebar() {
  const { user } = usePlacement();
  const links = NAV_LINKS.filter((link) => link.roles.includes(user.role));

  return (
    <nav className="sidebar" aria-label="Main navigation">
      <h1>Campus Placement Management System</h1>
      <p className="sidebar-portal">{ROLE_LABEL[user.role]} Portal</p>
      <ul>
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
