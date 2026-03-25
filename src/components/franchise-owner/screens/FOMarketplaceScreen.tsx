/**
 * FRANCHISE OWNER MARKETPLACE SCREEN
 * Product listing with buy/order functionality
 * 30% franchise discount auto-applied
 */

import { MarketplaceCatalog } from '@/components/marketplace/MarketplaceCatalog';

export function FOMarketplaceScreen() {
  return (
    <MarketplaceCatalog
      title="Marketplace"
      subtitle="Browse live Software Vala products, launch secure demos, and create real marketplace orders with franchise pricing."
      audienceLabel="Franchise"
    />
  );
}
