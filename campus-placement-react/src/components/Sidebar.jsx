import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../data/seed.js';

/* Routing navigation. NavLink applies the "active" class itself by
   comparing the current URL with `to`, which replaces the scroll listener
   the HTML build used to highlight the current section. */

export default function Sidebar() {
  return (
    <nav className="sidebar" aria-label="Main navigation">
      <h1>SRM Placement Cell</h1>
      <ul>
        {NAV_LINKS.map((link) => (
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
