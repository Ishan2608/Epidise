import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function PatientRoute() {
  const { user, loading } = useAuthStore();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
