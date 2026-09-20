import { createContext, useContext, useMemo, useState } from 'react';
import {
  INITIAL_ADMIN_TASKS,
  INITIAL_APPLICATIONS,
  STUDENT_PROFILE,
  formatDate,
} from '../data/seed.js';

/* Shared state for the whole app: the signed-in user, the student profile,
   the applications list, the admin queue and the eligibility criteria.
   Held with useState and handed down through context, so no page has to
   pass this data to another page as props. */

const PlacementContext = createContext(null);

export const DEFAULT_CRITERIA = {
  branch: 'All',
  minCgpa: 7.5,
  maxBacklogs: 0,
  minCtc: 12,
};

export function PlacementProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(STUDENT_PROFILE);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [adminTasks, setAdminTasks] = useState(INITIAL_ADMIN_TASKS);
  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA);

  function login(credentials) {
    setUser(credentials);
  }

  function logout() {
    setUser(null);
  }

  /** Adds an application unless the same company + role is already there.
      Returns false so the caller can show a warning instead. */
  function applyToJob(job) {
    const duplicate = applications.some(
      (app) => app.company === job.company && app.role === job.role
    );
    if (duplicate) return false;

    setApplications((current) => [
      ...current,
      {
        id: 'a' + (current.length + 1) + '-' + job.id,
        company: job.company,
        role: job.role,
        appliedOn: formatDate(new Date()),
        status: 'Applied',
      },
    ]);
    return true;
  }

  function resolveTask(taskId, remark) {
    setAdminTasks((current) =>
      current.map((task) =>
        task.id === taskId && task.pending > 0
          ? { ...task, pending: task.pending - 1, lastRemark: remark }
          : task
      )
    );
  }

  // useMemo keeps this object stable between renders, so components reading
  // the context are not re-rendered just because the provider rendered.
  const value = useMemo(
    () => ({
      user,
      profile,
      applications,
      adminTasks,
      criteria,
      login,
      logout,
      applyToJob,
      resolveTask,
      setProfile,
      setCriteria,
    }),
    [user, profile, applications, adminTasks, criteria]
  );

  return (
    <PlacementContext.Provider value={value}>
      {children}
    </PlacementContext.Provider>
  );
}

/** Custom hook that reads the context and fails clearly if the provider
    is missing. Every page uses this instead of calling useContext itself. */
export function usePlacement() {
  const context = useContext(PlacementContext);
  if (!context) {
    throw new Error('usePlacement must be used inside <PlacementProvider>');
  }
  return context;
}
