import React, { useEffect, useState } from 'react';
import { Shield, Lock, AlertTriangle, Fingerprint, MapPin, Smartphone, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFortressProtection } from '@/hooks/useFortressProtection';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FortressGateProps {
  children: React.ReactNode;
  requiredTrust?: 0 | 1 | 2 | 3 | 4 | 5;
  showStatus?: boolean;
}

const FortressGate: React.FC<FortressGateProps> = ({
  children,
  requiredTrust = 2,
  showStatus = true,
}) => {
  const { fortress, isUnlocked, trustLevel, verifyAndTrust } = useFortressProtection();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verify = async () => {
      setVerifying(true);
      await verifyAndTrust();
      setVerifying(false);
    };
    verify();
  }, [verifyAndTrust]);

  const getTrustColor = (level: number) => {
    if (level >= 4) return 'text-emerald-400';
    if (level >= 3) return 'text-green-400';
    if (level >= 2) return 'text-yellow-400';
    if (level >= 1) return 'text-orange-400';
    return 'text-red-400';
  };

  const getTrustBg = (level: number) => {
    if (level >= 4) return 'bg-emerald-500/20';
    if (level >= 3) return 'bg-green-500/20';
    if (level >= 2) return 'bg-yellow-500/20';
    if (level >= 1) return 'bg-orange-500/20';
    return 'bg-red-500/20';
  };

  // Show verification screen
  if (verifying) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 bg-slate-900/90 border-slate-700/50">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
              <div className="relative w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border-2 border-blue-500/50">
                <Fingerprint className="w-10 h-10 text-blue-400 animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Verifying Identity</h2>
            <p className="text-slate-400 text-sm mb-6">Establishing secure connection...</p>
            <Progress value={33} className="h-1" />
          </div>
        </Card>
      </div>
    );
  }

  // Show locked screen if intrusion detected
  if (fortress.intrusionDetected) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 bg-red-950/50 border-red-500/50">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">SECURITY ALERT</h2>
            <p className="text-red-300/80 mb-4">
              Suspicious activity detected. Access has been blocked.
            </p>
            <p className="text-sm text-slate-400 mb-6">
              If you believe this is an error, please contact your administrator.
            </p>
            <Button
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              onClick={() => window.location.href = '/auth'}
            >
              Return to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show geo-restricted screen
  if (fortress.geoRestricted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 bg-slate-900/90 border-red-500/30">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
              <MapPin className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
            <p className="text-slate-400 text-sm">
              This service is not available in your region.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Show insufficient trust screen
  if (trustLevel < requiredTrust) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-8 bg-slate-900/90 border-slate-700/50">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-amber-500/20 rounded-full flex items-center justify-center">
              <Lock className="w-10 h-10 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Additional Verification Required</h2>
            <p className="text-slate-400 text-sm">
              Your current trust level is {trustLevel}. This area requires level {requiredTrust}.
            </p>
          </div>

          {/* Trust Level Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Trust Level</span>
              <span className={cn("font-bold", getTrustColor(trustLevel))}>
                {trustLevel}/5
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={cn("h-full transition-all", getTrustBg(trustLevel))}
                style={{ width: `${(trustLevel / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
              <Fingerprint className={cn("w-5 h-5", fortress.deviceApproved ? 'text-green-400' : 'text-slate-500')} />
              <span className="text-sm text-slate-300 flex-1">Device Verified</span>
              {fortress.deviceApproved ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
              <MapPin className={cn("w-5 h-5", fortress.ipApproved ? 'text-green-400' : 'text-slate-500')} />
              <span className="text-sm text-slate-300 flex-1">IP Address Approved</span>
              {fortress.ipApproved ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
              <Smartphone className={cn("w-5 h-5", fortress.mfaVerified ? 'text-green-400' : 'text-slate-500')} />
              <span className="text-sm text-slate-300 flex-1">MFA Enabled</span>
              {fortress.mfaVerified ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-slate-500" />
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-slate-700"
              onClick={() => window.location.href = '/'}
            >
              Go Back
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => verifyAndTrust()}
            >
              Retry Verification
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Render children with optional status indicator
  return (
    <div className="relative">
      {children}

      {/* Security Status Indicator */}
      {showStatus && (
        <div className={cn(
          "fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border backdrop-blur-sm",
          getTrustBg(trustLevel),
          trustLevel >= 4 ? 'border-emerald-500/30' :
          trustLevel >= 3 ? 'border-green-500/30' :
          trustLevel >= 2 ? 'border-yellow-500/30' :
          'border-red-500/30'
        )}>
          <Shield className={cn("w-4 h-4", getTrustColor(trustLevel))} />
          <div className="flex flex-col">
            <span className={getTrustColor(trustLevel)}>
              Trust Level {trustLevel}
            </span>
            <span className="text-slate-400 text-[10px]">
              {fortress.lastVerification 
                ? `Verified ${Math.round((Date.now() - fortress.lastVerification.getTime()) / 1000)}s ago`
                : 'Not verified'
              }
            </span>
          </div>
          {fortress.intrusionDetected && (
            <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
          )}
        </div>
      )}
    </div>
  );
};

export default FortressGate;
