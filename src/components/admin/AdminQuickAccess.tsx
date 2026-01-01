import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, Users, Shield, Key, LayoutDashboard } from 'lucide-react';

const AdminQuickAccess = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  
  // Only show for admin roles
  const adminRoles = ['super_admin', 'admin', 'master'];
  if (!userRole || !adminRoles.includes(userRole)) {
    return null;
  }

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/super-admin' },
    { label: 'User Manager', icon: Users, path: '/super-admin/users' },
    { label: 'Role Manager', icon: Shield, path: '/admin/role-manager' },
    { label: 'Permissions', icon: Key, path: '/super-admin/permissions' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {menuItems.map((item) => (
            <DropdownMenuItem 
              key={item.path}
              onClick={() => navigate(item.path)}
              className="cursor-pointer"
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AdminQuickAccess;
