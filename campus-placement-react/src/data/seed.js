/* Seed data for the Campus Placement Management System.
   Kept out of the components so the UI stays declarative. */

export const STUDENT_PROFILE = {
  name: 'Daksh P.',
  registerNumber: 'RA2211026010123',
  branch: 'CSE',
  cgpa: 9.44,
  backlogs: 0,
  gradYear: 2027,
  skills: 'React, Node.js, FastAPI, scikit-learn',
};

export const BRANCH_OPTIONS = ['All', 'CSE', 'IT', 'AI & DS'];

export const JOB_POSTINGS = [
  {
    id: 'j1', category: 'Product Companies', company: 'Zenith Labs',
    role: 'SDE Intern', ctc: 12, location: 'Bengaluru',
    branches: ['CSE', 'IT'],
  },
  {
    id: 'j2', category: 'Product Companies', company: 'Northbridge',
    role: 'Frontend Engineer', ctc: 14, location: 'Hyderabad',
    branches: ['CSE', 'IT', 'AI & DS'],
  },
  {
    id: 'j5', category: 'Product Companies', company: 'Helios Systems',
    role: 'Backend Engineer', ctc: 13, location: 'Pune',
    branches: ['CSE'],
  },
  {
    id: 'j3', category: 'FinTech Companies', company: 'Ledgerly',
    role: 'Full Stack Intern', ctc: 10, location: 'Chennai',
    branches: ['CSE', 'IT'],
  },
  {
    id: 'j4', category: 'FinTech Companies', company: 'Vantage Pay',
    role: 'Software Engineer', ctc: 16, location: 'Remote',
    branches: ['CSE', 'AI & DS'],
  },
  {
    id: 'j6', category: 'FinTech Companies', company: 'Arcadia Capital',
    role: 'Quant Analyst Intern', ctc: 11, location: 'Mumbai',
    branches: ['AI & DS'],
  },
];

export const INITIAL_APPLICATIONS = [
  { id: 'a1', company: 'Zenith Labs', role: 'SDE Intern', appliedOn: '02 Aug 2026', status: 'Shortlisted' },
  { id: 'a2', company: 'Ledgerly', role: 'Full Stack Intern', appliedOn: '05 Aug 2026', status: 'Selected' },
  { id: 'a3', company: 'Northbridge', role: 'Frontend Engineer', appliedOn: '07 Aug 2026', status: 'Applied' },
  { id: 'a4', company: 'Vantage Pay', role: 'Software Engineer', appliedOn: '10 Aug 2026', status: 'Rejected' },
];

export const INITIAL_ADMIN_TASKS = [
  { id: 't1', task: 'Company Approvals', pending: 5, lastRemark: '' },
  { id: 't2', task: 'Job Postings Review', pending: 3, lastRemark: '' },
];

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

/** Sidebar links — path is the route, not a hash fragment. */
export const NAV_LINKS = [
  { to: '/login', label: 'Login' },
  { to: '/profile', label: 'Profile' },
  { to: '/jobs', label: 'Job Postings' },
  { to: '/eligibility', label: 'Eligibility' },
  { to: '/applications', label: 'Applications' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/admin', label: 'Admin' },
];

/** Formats a Date as "02 Aug 2026". */
export function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  return day + ' ' + month + ' ' + date.getFullYear();
}
