/**
 * FRANCHISE LAYOUT
 * Simple wrapper that renders full-height content
 * The FUFullLayout inside FranchiseDash handles the actual sidebar
 */

import { ReactNode } from 'react';

interface FranchiseLayoutProps {
  children: ReactNode;
}

const FranchiseLayout = ({ children }: FranchiseLayoutProps) => {
  return (
    <div className="min-h-screen h-screen bg-background">
      {children}
    </div>
  );
};

export default FranchiseLayout;
