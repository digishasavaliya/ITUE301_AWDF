import { Navigate, useLocation } from 'react-router-dom';

function RequireAuth({ children }) {
  const location = useLocation();

  if (!localStorage.getItem('token')) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default RequireAuth;
