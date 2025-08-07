import { useAuth } from '@/contexts/AuthContext';
import SuperAdminDashboard from './SuperAdminDashboard';
import RestaurantAdminDashboard from './RestaurantAdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'super_admin') {
    return <SuperAdminDashboard />;
  }

  if (user?.role === 'restaurant_admin') {
    return <RestaurantAdminDashboard />;
  }

  return null;
};

export default Dashboard;