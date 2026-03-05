import React from 'react';

export function MMMarketplaceScreen() {
  return (
    <section className="p-6 space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Marketplace</h1>
        <p className="text-sm text-muted-foreground">Browse products, try demos, and place orders.</p>
      </header>

      <div className="flex flex-wrap gap-3">
        <button type="button" className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground border border-border">
          Demo
        </button>
        <button type="button" className="px-4 py-2 rounded-md bg-primary text-primary-foreground">
          Buy Now
        </button>
      </div>
    </section>
  );
}

export default MMMarketplaceScreen;
