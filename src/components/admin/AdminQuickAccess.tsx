import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, Users, Shield, Key, LayoutDashboard } from 'lucide-react';

// Public routes where the button should NEVER appear
const PUBLIC_ROUTES = [
  '/',
  '/auth',
  '/demos',
  '/demo-showcase',
  '/demo-directory',
  '/demo-login',
  '/demo-access',
  '/simple-demo',
  '/checkout',
  '/franchise-landing',
  '/franchise-program',
  '/reseller-landing',
  '/influencer-landing',
  '/client-portal',
  '/premium-demo',
];

const AdminQuickAccess = () => {
  const { userRole, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // STRICT: Only show for specific admin roles when fully authenticated
  const adminRoles = ['super_admin', 'master'];
  
  // Hide completely while loading
  if (loading) {
    return null;
  }
  
  // Hide if not authenticated
  if (!user) {
    return null;
  }
  
  // Hide if no role or role is not admin
  if (!userRole || !adminRoles.includes(userRole)) {
    return null;
  }
  
  // Hide on public routes
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    location.pathname === route || location.pathname.startsWith('/demo/')
  );
  if (isPublicRoute) {
    return null;
  }

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/super-admin' },
    { label: 'User Manager', icon: Users, path: '/super-admin/user-manager' },
    { label: 'Role Manager', icon: Shield, path: '/super-admin/role-manager' },
    { label: 'Permissions', icon: Key, path: '/super-admin/permission-matrix' },
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
