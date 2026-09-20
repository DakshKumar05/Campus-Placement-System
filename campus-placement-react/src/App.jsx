import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import JobsPage from './pages/JobsPage.jsx';
import EligibilityPage from './pages/EligibilityPage.jsx';
import ApplicationsPage from './pages/ApplicationsPage.jsx';
import ApplicationDetailPage from './pages/ApplicationDetailPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { PlacementProvider } from './context/PlacementContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import './styles/global.css';

/* The route table. Every page is nested inside <Layout>, which renders the
   sidebar and an <Outlet /> for the matched page. */

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <PlacementProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="eligibility" element={<EligibilityPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="applications/:id" element={<ApplicationDetailPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </PlacementProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
