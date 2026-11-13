import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setApiUser } from '../data/api.js';
import { useToast } from '../hooks/useToast.js';

/* Shared state for the whole app: the signed-in user, the student profile,
   the job postings, the applications list, the admin queue and the
   eligibility criteria. The data now lives in the Spring Boot backend; this
   provider loads it with fetch and keeps a copy in state, so pages read it
   through context exactly as before. */

const PlacementContext = createContext(null);

export const DEFAULT_CRITERIA = {
  branch: 'All',
  minCgpa: 7.5,
  maxBacklogs: 0,
  minCtc: 12,
};

/** The backend stores branches as "CSE,IT"; the pages expect an array. */
function toJob(job) {
  return { ...job, branches: job.branches.split(',') };
}

export function PlacementProvider({ children }) {
  const showToast = useToast();

  // The signed-in user survives a page reload for the rest of the browser
  // session, so the role-guarded routes do not bounce back to sign-in.
  const [user, setUser] = useState(() => {
    try {
      const saved = JSON.parse(window.sessionStorage.getItem('cpms:user'));
      setApiUser(saved ? saved.id : null);
      return saved;
    } catch {
      return null;
    }
  });
  useEffect(() => {
    try {
      if (user) window.sessionStorage.setItem('cpms:user', JSON.stringify(user));
      else window.sessionStorage.removeItem('cpms:user');
    } catch {
      /* storage blocked (private window) — sign-in just won't survive a reload */
    }
  }, [user]);
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [adminTasks, setAdminTasks] = useState([]);
  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA);

  // Postings are the same for everyone, signed in or not: load them once.
  // The ignore flag drops a response that arrives after the effect is cleaned up.
  useEffect(() => {
    let ignore = false;
    api.getJobs()
      .then((jobList) => {
        if (!ignore) setJobs(jobList.map(toJob));
      })
      .catch(() => {
        if (!ignore) {
          showToast('Could not reach the server - is Spring Boot running on port 8080?', 'error');
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  // Each role loads only its own data on sign-in: a student gets their
  // profile and applications, an admin gets the approval queue.
  useEffect(() => {
    setProfile(null);
    setApplications([]);
    setAdminTasks([]);
    if (!user) return;

    let ignore = false;
    const fail = (error) => {
      if (!ignore) showToast(error.message, 'error');
    };

    if (user.role === 'student') {
      api.getApplications(user.id)
        .then((list) => {
          if (!ignore) setApplications(list);
        })
        .catch(fail);
      api.getProfile(user.id)
        .then((found) => {
          if (!ignore) setProfile(found);
        })
        .catch(() => {
          if (!ignore) setProfile(null);
        });
    } else if (user.role === 'admin') {
      api.getAdminTasks()
        .then((tasks) => {
          if (!ignore) setAdminTasks(tasks);
        })
        .catch(fail);
    }

    return () => {
      ignore = true;
    };
  }, [user]);

  /** Signs in (registering the alias on first use) and returns the user. */
  async function login(credentials) {
    const saved = await api.login(credentials.username, credentials.role);
    const signedIn = { id: saved.id, username: saved.alias, role: saved.role };
    setApiUser(signedIn.id);
    setUser(signedIn);
    return signedIn;
  }

  function logout() {
    setApiUser(null);
    setUser(null);
  }

  /** Saves an application on the server. Throws with the server's reason
      (already applied, branch not eligible) so the caller can show it. */
  async function applyToJob(job) {
    if (!user) {
      throw new Error('Sign in as a student to apply');
    }
    const created = await api.apply(user.id, job.id);
    setApplications((current) => [...current, created]);
    return created;
  }

  async function resolveTask(taskId, remark) {
    const updated = await api.resolveTask(taskId, remark);
    setAdminTasks((current) =>
      current.map((task) => (task.id === updated.id ? updated : task))
    );
    return updated;
  }

  async function saveProfile(values) {
    const updated = await api.saveProfile(user.id, values);
    setProfile(updated);
    return updated;
  }

  // useMemo keeps this object stable between renders, so components reading
  // the context are not re-rendered just because the provider rendered.
  const value = useMemo(
    () => ({
      user,
      profile,
      jobs,
      applications,
      adminTasks,
      criteria,
      login,
      logout,
      applyToJob,
      resolveTask,
      saveProfile,
      setCriteria,
    }),
    [user, profile, jobs, applications, adminTasks, criteria]
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
