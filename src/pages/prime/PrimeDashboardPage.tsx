/**
 * Prime User Dashboard Page
 * 
 * Entry point for /prime route
 * Wraps PrimeUserDashboard with route protection
 */

import React from 'react';
import { PrimeUserDashboard } from '@/components/prime-user';
import { PrimeRouteGuard } from '@/components/prime-user';

const PrimeDashboardPage = () => {
  return (
    <PrimeRouteGuard>
      <PrimeUserDashboard />
    </PrimeRouteGuard>
  );
};

export default PrimeDashboardPage;
