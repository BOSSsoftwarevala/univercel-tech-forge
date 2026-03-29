/**
 * Low Data Mode Toggle
 * Allows users to manually enable low-data mode
 */

import React from 'react';
import { Zap, ZapOff, Wifi, WifiLow } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useOffline } from '@/lib/offline/offline-context';
import { cn } from '@/lib/utils';

interface LowDataModeToggleProps {
  className?: string;
  showDescription?: boolean;
}

export function LowDataModeToggle({ className, showDescription = true }: LowDataModeToggleProps) {
  const { lowDataMode, setLowDataMode, networkQuality, dataMode } = useOffline();

  const isAutoEnabled = dataMode === 'ultra-low' || dataMode === 'low';

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {lowDataMode ? (
            <ZapOff className="h-4 w-4 text-cyan-400" />
          ) : (
            <Zap className="h-4 w-4 text-amber-400" />
          )}
          <Label htmlFor="low-data-mode" className="text-sm font-medium">
            Low Data Mode
          </Label>
        </div>
        <Switch
          id="low-data-mode"
          checked={lowDataMode}
          onCheckedChange={setLowDataMode}
          disabled={isAutoEnabled}
        />
      </div>
      
      {showDescription && (
        <div className="text-xs text-muted-foreground">
          {isAutoEnabled ? (
            <span className="flex items-center gap-1">
              <WifiLow className="h-3 w-3" />
              Auto-enabled due to slow connection ({networkQuality})
            </span>
          ) : (
            'Reduce data usage by disabling animations and heavy graphics'
          )}
        </div>
      )}
    </div>
  );
}
