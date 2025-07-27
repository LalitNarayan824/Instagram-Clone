// ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { userData } = useSelector(state => state.user);
  return userData ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
