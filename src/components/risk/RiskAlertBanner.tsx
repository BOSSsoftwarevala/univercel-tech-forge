import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  ShieldAlert, 
  X, 
  AlertTriangle, 
  Ban,
  Wallet,
  Users,
  Code
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RiskAlertBannerProps {
  type: 'login' | 'wallet' | 'refund' | 'code' | 'commission';
  title: string;
  message: string;
  severity: 'warning' | 'danger' | 'critical';
  onDismiss?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export function RiskAlertBanner({
  type,
  title,
  message,
  severity,
  onDismiss,
  onAction,
  actionLabel = 'Take Action',
  autoHide = false,
  autoHideDelay = 5000,
}: RiskAlertBannerProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay, onDismiss]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'login': return <ShieldAlert className="h-5 w-5" />;
      case 'wallet': return <Wallet className="h-5 w-5" />;
      case 'refund': return <AlertTriangle className="h-5 w-5" />;
      case 'code': return <Code className="h-5 w-5" />;
      case 'commission': return <Users className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getSeverityStyles = () => {
    switch (severity) {
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'danger':
        return 'border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-400';
      case 'critical':
        return 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400 animate-pulse';
      default:
        return '';
    }
  };

  return (
    <Alert className={cn(
      "relative pr-12",
      getSeverityStyles()
    )}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <AlertTitle className="font-semibold">{title}</AlertTitle>
          <AlertDescription className="mt-1">
            {message}
          </AlertDescription>
          {onAction && (
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-2"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0"
          onClick={() => {
            setVisible(false);
            onDismiss();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  );
}

// Pre-configured alert types
export function NewHighRiskLoginAlert({ onDismiss }: { onDismiss?: () => void }) {
  return (
    <RiskAlertBanner
      type="login"
      title="New high-risk login detected"
      message="A login attempt was made from an unrecognized device or location."
      severity="danger"
      onDismiss={onDismiss}
      actionLabel="Review Login"
    />
  );
}

export function WalletFlaggedAlert({ onDismiss }: { onDismiss?: () => void }) {
  return (
    <RiskAlertBanner
      type="wallet"
      title="Wallet flagged due to unusual behavior"
      message="Multiple suspicious transactions detected. Payouts have been temporarily held."
      severity="critical"
      onDismiss={onDismiss}
      actionLabel="Review Wallet"
    />
  );
}

export function RefundPatternAlert({ onDismiss }: { onDismiss?: () => void }) {
  return (
    <RiskAlertBanner
      type="refund"
      title="Multiple refund patterns found"
      message="This user has an unusually high refund rate. Manual review recommended."
      severity="warning"
      onDismiss={onDismiss}
      actionLabel="View History"
    />
  );
}
