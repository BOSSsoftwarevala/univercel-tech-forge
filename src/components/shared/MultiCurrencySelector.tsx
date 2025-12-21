import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Check, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate: number; // Exchange rate to INR
  trend: 'up' | 'down' | 'stable';
}

const currencies: Currency[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', rate: 1, trend: 'stable' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rate: 83.12, trend: 'up' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 90.45, trend: 'up' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rate: 105.23, trend: 'down' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', rate: 22.63, trend: 'stable' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦', rate: 22.16, trend: 'stable' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', rate: 61.89, trend: 'up' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', rate: 54.32, trend: 'down' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', rate: 61.45, trend: 'stable' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', rate: 0.55, trend: 'down' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', rate: 11.52, trend: 'up' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭', rate: 95.67, trend: 'up' },
];

interface MultiCurrencySelectorProps {
  compact?: boolean;
  showRate?: boolean;
  onCurrencyChange?: (currency: Currency) => void;
}

export function MultiCurrencySelector({ 
  compact = false, 
  showRate = true,
  onCurrencyChange 
}: MultiCurrencySelectorProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);

  const handleSelect = (currency: Currency) => {
    setSelectedCurrency(currency);
    onCurrencyChange?.(currency);
  };

  const TrendIcon = selectedCurrency.trend === 'up' ? TrendingUp : 
                    selectedCurrency.trend === 'down' ? TrendingDown : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "sm" : "default"}
          className="gap-2 bg-background/20 backdrop-blur-sm border border-border/30 hover:bg-background/40"
        >
          <Wallet className="w-4 h-4 text-primary" />
          {!compact && (
            <>
              <span className="text-sm">{selectedCurrency.flag}</span>
              <span className="text-sm font-mono font-medium">{selectedCurrency.code}</span>
              {showRate && selectedCurrency.code !== 'INR' && (
                <span className="text-xs text-muted-foreground">
                  ₹{selectedCurrency.rate.toFixed(2)}
                </span>
              )}
            </>
          )}
          <ChevronDown className="w-3 h-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-72 max-h-80 overflow-auto bg-background/95 backdrop-blur-xl border-border/50"
      >
        <div className="p-2 border-b border-border/30">
          <p className="text-xs text-muted-foreground font-medium px-2">Select Currency</p>
        </div>
        <div className="py-1">
          {currencies.map((currency) => (
            <DropdownMenuItem
              key={currency.code}
              onClick={() => handleSelect(currency)}
              className="flex items-center justify-between gap-3 cursor-pointer py-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{currency.flag}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono font-medium">{currency.code}</p>
                    <span className="text-sm text-muted-foreground">{currency.symbol}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{currency.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {currency.code !== 'INR' && (
                  <div className="text-right">
                    <p className="text-xs font-mono text-primary">₹{currency.rate.toFixed(2)}</p>
                    <div className="flex items-center gap-1">
                      {currency.trend === 'up' && (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      )}
                      {currency.trend === 'down' && (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={`text-[10px] ${
                        currency.trend === 'up' ? 'text-green-500' : 
                        currency.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
                      }`}>
                        {currency.trend === 'up' ? '+0.5%' : currency.trend === 'down' ? '-0.3%' : '0.0%'}
                      </span>
                    </div>
                  </div>
                )}
                {selectedCurrency.code === currency.code && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-primary" />
                  </motion.div>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MultiCurrencySelector;
