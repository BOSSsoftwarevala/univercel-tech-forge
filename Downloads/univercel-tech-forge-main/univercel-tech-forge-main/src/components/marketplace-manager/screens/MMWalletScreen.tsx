import React from 'react';
import { MarketplaceWallet } from '@/components/marketplace/MarketplaceWallet';

export function MMWalletScreen() {
  return (
    <MarketplaceWallet
      title="Wallet"
      subtitle="Live wallet balance, pending holds, and real transaction history from the financial backend."
    />
  );
}
