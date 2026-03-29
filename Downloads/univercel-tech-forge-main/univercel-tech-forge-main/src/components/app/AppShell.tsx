import React from 'react';
import { Outlet } from 'react-router-dom';
import RequireAuth from '@/components/auth/RequireAuth';

/**
 * AppShell – thin authenticated wrapper for all /app/* routes.
 * It enforces authentication via RequireAuth and renders the
 * matched child route via <Outlet />.
 *
 * Individual module components keep their own sidebars/layouts;
 * AppShell only guarantees the user is logged in.
 */
const AppShell: React.FC = () => {
  return (
    <RequireAuth>
      <Outlet />
    </RequireAuth>
  );
};

export default AppShell;
