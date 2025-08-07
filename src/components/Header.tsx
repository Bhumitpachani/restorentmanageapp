import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ChefHat, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg">
            <ChefHat className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">MenuMaster</h1>
            {user && (
              <p className="text-sm text-muted-foreground">
                {user.role === 'super_admin' ? 'Super Admin' : user.restaurantName}
              </p>
            )}
          </div>
        </div>
        
        {user && (
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;