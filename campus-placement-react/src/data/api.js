/* Every call to the Spring Boot backend goes through request(). In
   development Vite forwards /api to http://localhost:8080 (vite.config.js). */

// The signed-in user's id, sent as X-User-Id so the backend can tell an
// admin from a student. PlacementContext sets it on sign-in and sign-out.
let currentUserId = null;

export function setApiUser(id) {
  currentUserId = id;
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (currentUserId != null) headers['X-User-Id'] = String(currentUserId);

  const response = await fetch('/api' + path, { headers, ...options });
  const text = await response.text();
  if (!response.ok) {
    // The backend sends a plain-text reason for rejected requests.
    throw new Error(text || 'Request failed (' + response.status + ')');
  }
  return text ? JSON.parse(text) : null;
}

export const api = {
  login: (alias, role) =>
    request('/login', { method: 'POST', body: JSON.stringify({ alias, role }) }),

  getJobs: () => request('/jobs'),

  getProfile: (userId) => request('/students/' + userId),

  saveProfile: (userId, profile) =>
    request('/students/' + userId, { method: 'PUT', body: JSON.stringify(profile) }),

  getApplications: (userId) => request('/applications/user/' + userId),

  getRounds: (applicationId) => request('/applications/' + applicationId + '/rounds'),

  apply: (userId, jobId) =>
    request('/applications/' + userId + '/' + jobId, { method: 'POST' }),

  getAdminTasks: () => request('/admin/tasks'),

  resolveTask: (taskId, remark) =>
    request(
      '/admin/tasks/' + taskId + '/resolve?remark=' + encodeURIComponent(remark),
      { method: 'POST' }
    ),
};
