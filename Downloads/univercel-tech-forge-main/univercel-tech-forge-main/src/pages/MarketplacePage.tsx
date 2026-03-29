import React from 'react';
import { MarketplaceCatalog } from '@/components/marketplace/MarketplaceCatalog';

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-7xl">
        <MarketplaceCatalog
          title="Software Marketplace"
          subtitle="Browse live products, validate demos, and purchase through the real payment pipeline."
          audienceLabel="Client"
        />
      </div>
    </div>
  );
}