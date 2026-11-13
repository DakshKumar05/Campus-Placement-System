import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import RequireRole from './components/RequireRole.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import JobsPage from './pages/JobsPage.jsx';
import EligibilityPage from './pages/EligibilityPage.jsx';
import ApplicationsPage from './pages/ApplicationsPage.jsx';
import ApplicationDetailPage from './pages/ApplicationDetailPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { PlacementProvider, usePlacement } from './context/PlacementContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ROLE_HOME, rolesFor } from './data/seed.js';
import './styles/global.css';

/* The route table. The sign-in screen stands on its own; every other page
   is nested inside <Layout>, which renders the sidebar and an <Outlet />
   for the matched page. RequireRole keeps each page to the roles listed
   for it in NAV_LINKS, so students and admins each see only their window. */

/** "/" sends a signed-in user to their role's home page. */
function RoleHome() {
  const { user } = usePlacement();
  return <Navigate to={ROLE_HOME[user.role]} replace />;
}

const guard = (path, page) => <RequireRole roles={rolesFor(path)}>{page}</RequireRole>;

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <PlacementProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<RequireRole><Layout /></RequireRole>}>
              <Route index element={<RoleHome />} />
              <Route path="profile" element={guard('/profile', <ProfilePage />)} />
              <Route path="jobs" element={guard('/jobs', <JobsPage />)} />
              <Route path="eligibility" element={guard('/eligibility', <EligibilityPage />)} />
              <Route path="applications" element={guard('/applications', <ApplicationsPage />)} />
              <Route path="applications/:id" element={guard('/applications', <ApplicationDetailPage />)} />
              <Route path="dashboard" element={guard('/dashboard', <DashboardPage />)} />
              <Route path="admin" element={guard('/admin', <AdminPage />)} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </PlacementProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
