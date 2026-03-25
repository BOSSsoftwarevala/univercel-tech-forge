/**
 * FRANCHISE OWNER FIXED HEADER
 * 6 Fixed buttons: Marketplace, Place Order, Promise, Assist, Alerts, Wallet
 * NO SCROLL - ALWAYS VISIBLE
 */

import React from 'react';
import { 
  ShoppingBag, Plus, Handshake, HeadphonesIcon, Bell, Wallet, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FOSection } from './FranchiseOwnerTypes';
import { useNavigate } from 'react-router-dom';

interface FOFixedHeaderProps {
  onNavigate: (section: FOSection) => void;
  onPlaceOrder: () => void;
  activeSection: FOSection;
  alertCount?: number;
  walletBalance?: string;
}

export function FOFixedHeader({ 
  onNavigate, 
  onPlaceOrder, 
  activeSection,
  alertCount = 3,
  walletBalance = '₹2,45,680'
}: FOFixedHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (activeSection === 'dashboard') {
      navigate('/franchise/dashboard');
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <header className="h-14 shrink-0 bg-card border-b border-border px-4 flex items-center justify-between">
      {/* Left - Back + Title */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="font-semibold text-sm">Franchise Owner</span>
      </div>

      {/* Right - 6 Fixed Buttons */}
      <div className="flex items-center gap-2">
        {/* Marketplace */}
        <Button 
          variant={activeSection === 'marketplace' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => onNavigate('marketplace')}
          className="gap-1.5 h-8"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Marketplace</span>
        </Button>

        {/* Place Order */}
        <Button 
          size="sm"
          onClick={onPlaceOrder}
          className="gap-1.5 h-8 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Place Order</span>
        </Button>

        {/* Promise */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onNavigate('support_assist')}
          className="gap-1.5 h-8"
        >
          <Handshake className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Promise</span>
        </Button>

        {/* Assist */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onNavigate('support_assist')}
          className="gap-1.5 h-8"
        >
          <HeadphonesIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Assist</span>
        </Button>

        {/* Alerts */}
        <Button 
          variant="outline" 
          size="icon"
          className="h-8 w-8 relative"
        >
          <Bell className="h-3.5 w-3.5" />
          {alertCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive">
              {alertCount}
            </Badge>
          )}
        </Button>

        {/* Wallet */}
        <Button 
          variant={activeSection === 'wallet' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => onNavigate('wallet')}
          className="gap-1.5 h-8"
        >
          <Wallet className="h-3.5 w-3.5" />
          <span className="text-xs font-mono">{walletBalance}</span>
        </Button>
      </div>
    </header>
  );
}
