/* Fixed display data for the Campus Placement Management System.
   Students, job postings, applications and the admin queue now come from
   the Spring Boot backend (see api.js); only static lookups stay here. */

export const BRANCH_OPTIONS = ['All', 'CSE', 'IT', 'AI & DS'];

export const PLACEMENT_STATS = [
  { id: 's1', value: 412, caption: 'STUDENTS PLACED', decimals: 0 },
  { id: 's2', value: 61, caption: 'RECRUITERS', decimals: 0 },
  { id: 's3', value: 14.2, caption: 'AVG. CTC (LPA)', decimals: 1 },
];

export const BRANCH_RATES = [
  { id: 'b1', branch: 'CSE', rate: 82 },
  { id: 'b2', branch: 'IT', rate: 74 },
  { id: 'b3', branch: 'AI & DS', rate: 68 },
];

/** Sidebar links — path is the route, not a hash fragment. `roles` lists
    who may open the page; the sidebar and the route guards both read it. */
export const NAV_LINKS = [
  { to: '/profile', label: 'Profile', roles: ['student'] },
  { to: '/jobs', label: 'Job Postings', roles: ['student', 'recruiter'] },
  { to: '/eligibility', label: 'Eligibility', roles: ['student'] },
  { to: '/applications', label: 'Applications', roles: ['student'] },
  { to: '/admin', label: 'Approval Queue', roles: ['admin'] },
  { to: '/dashboard', label: 'Dashboard', roles: ['student', 'recruiter', 'admin'] },
];

/** Where each role lands after signing in. */
export const ROLE_HOME = { student: '/profile', recruiter: '/jobs', admin: '/admin' };

/** Display names for the roles. */
export const ROLE_LABEL = { student: 'Student', recruiter: 'Recruiter', admin: 'Admin' };

/** Roles allowed on one route, looked up from NAV_LINKS. */
export function rolesFor(path) {
  return NAV_LINKS.find((link) => link.to === path).roles;
}
