import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function DoctorRoute() {
  const { user, role, loading } = useAuthStore();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/for-doctors" replace />;
  }

  if (role !== 'doctor') {
    return <Navigate to="/for-doctors" replace />;
  }

  return <Outlet />;
}
