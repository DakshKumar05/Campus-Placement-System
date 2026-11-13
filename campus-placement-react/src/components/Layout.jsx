import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import ToastHost from './ToastHost.jsx';

/* The frame every route renders inside. <Outlet /> is the slot the router
   fills with the page component for the current URL. */

export default function Layout() {
  return (
    <>
      <Sidebar />
      <main className="main">
        <Outlet />
      </main>
      <ToastHost />
    </>
  );
}
