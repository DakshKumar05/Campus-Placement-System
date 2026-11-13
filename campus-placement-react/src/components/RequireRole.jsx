import { Navigate } from 'react-router-dom';
import { usePlacement } from '../context/PlacementContext.jsx';
import { ROLE_HOME } from '../data/seed.js';

/* Route guard. Nobody signed in goes to the sign-in screen; a signed-in
   user on a page their role cannot open goes to their own home page, so
   the student and admin windows stay apart. Without `roles`, any signed-in
   user may pass. The backend repeats these checks on every request. */

export default function RequireRole({ roles, children }) {
  const { user } = usePlacement();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user.role]} replace />;
  }
  return children;
}
