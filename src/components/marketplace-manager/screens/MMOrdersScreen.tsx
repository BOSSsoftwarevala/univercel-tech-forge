import React from 'react';
import { MarketplaceOrders } from '@/components/marketplace/MarketplaceOrders';

export function MMOrdersScreen() {
  return (
    <MarketplaceOrders
      title="My Orders"
      subtitle="Real marketplace orders, live payment states, and license issuance from the production order engine."
    />
  );
}
