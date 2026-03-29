/**
 * FRANCHISE OWNER MY ORDERS SCREEN
 * Order tracking with project ID linking
 */

import React from 'react';
import { MarketplaceOrders } from '@/components/marketplace/MarketplaceOrders';

export function FOMyOrdersScreen() {
  return (
    <MarketplaceOrders
      title="My Orders"
      subtitle="Live franchise marketplace orders with verified payment state, order progression, and license visibility."
    />
  );
}
