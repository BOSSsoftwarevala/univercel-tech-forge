import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck,
  Smartphone,
  MapPin,
  AlertTriangle,
  Ban,
  Eye,
  Clock,
  CreditCard
} from 'lucide-react';
import { UserRiskCard as UserRiskCardType, getRiskBadgeColor } from '@/hooks/useGlobalBlacklist';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface UserRiskCardComponentProps {
  riskCard: UserRiskCardType;
  onBlock?: (userId: string) => void;
  onWatch?: (userId: string) => void;
  onWhitelist?: (userId: string) => void;
  compact?: boolean;
}

export function UserRiskCardComponent({ 
  riskCard, 
  onBlock, 
  onWatch, 
  onWhitelist,
  compact = false 
}: UserRiskCardComponentProps) {
  const getRiskIcon = () => {
    switch (riskCard.risk_level) {
      case 'safe': return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case 'watch': return <Eye className="h-5 w-5 text-yellow-500" />;
      case 'high_risk': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'blocked': return <Ban className="h-5 w-5 text-red-500" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getRiskLabel = () => {
    switch (riskCard.risk_level) {
      case 'safe': return 'SAFE';
      case 'watch': return 'WATCH';
      case 'high_risk': return 'HIGH RISK';
      case 'blocked': return 'BLOCKED';
      default: return 'UNKNOWN';
    }
  };

  if (compact) {
    return (
      <div className={cn(
        "flex items-center gap-3 p-3 rounded-lg border",
        getRiskBadgeColor(riskCard.risk_level)
      )}>
        {getRiskIcon()}
        <div className="flex-1">
          <div className="font-medium">{riskCard.email_hint}</div>
          <div className="text-xs text-muted-foreground">
            Score: {riskCard.risk_score} | Devices: {riskCard.device_count}
          </div>
        </div>
        <Badge variant="outline" className={getRiskBadgeColor(riskCard.risk_level)}>
          {getRiskLabel()}
        </Badge>
      </div>
    );
  }

  return (
    <Card className={cn("border-2", getRiskBadgeColor(riskCard.risk_level))}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getRiskIcon()}
            User Risk Profile
          </CardTitle>
          <Badge className={cn("px-3 py-1", getRiskBadgeColor(riskCard.risk_level))}>
            {getRiskLabel()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Risk Score</span>
            <span className={cn("text-2xl font-bold", 
              riskCard.risk_score <= 30 ? 'text-green-500' :
              riskCard.risk_score <= 60 ? 'text-yellow-500' :
              riskCard.risk_score <= 80 ? 'text-orange-500' : 'text-red-500'
            )}>
              {riskCard.risk_score}
            </span>
          </div>
          <Progress value={riskCard.risk_score} className="h-2" />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Safe</span>
            <span>Watch</span>
            <span>High Risk</span>
            <span>Blocked</span>
          </div>
        </div>

        {/* User Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground mb-1">Email</div>
            <div className="font-medium">{riskCard.email_hint}</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground mb-1">Phone</div>
            <div className="font-medium">{riskCard.phone_hint}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg border">
            <Smartphone className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-lg font-bold">{riskCard.device_count}</div>
            <div className="text-xs text-muted-foreground">Devices</div>
          </div>
          <div className="text-center p-3 rounded-lg border">
            <ShieldAlert className="h-4 w-4 mx-auto mb-1 text-red-500" />
            <div className="text-lg font-bold text-red-500">{riskCard.blacklist_matches}</div>
            <div className="text-xs text-muted-foreground">Blacklist Hits</div>
          </div>
          <div className="text-center p-3 rounded-lg border">
            <MapPin className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-lg font-bold">{riskCard.ip_locations.length}</div>
            <div className="text-xs text-muted-foreground">Locations</div>
          </div>
        </div>

        {/* Payment History */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment History
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded bg-yellow-500/10">
              <div className="font-bold text-yellow-600">{riskCard.payment_history.disputes}</div>
              <div className="text-xs text-muted-foreground">Disputes</div>
            </div>
            <div className="p-2 rounded bg-red-500/10">
              <div className="font-bold text-red-600">{riskCard.payment_history.chargebacks}</div>
              <div className="text-xs text-muted-foreground">Chargebacks</div>
            </div>
            <div className="p-2 rounded bg-orange-500/10">
              <div className="font-bold text-orange-600">{riskCard.payment_history.refunds}</div>
              <div className="text-xs text-muted-foreground">Refunds</div>
            </div>
          </div>
        </div>

        {/* Behavior Flags */}
        {riskCard.behavior_flags.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Behavior Flags
            </h4>
            <div className="flex flex-wrap gap-2">
              {riskCard.behavior_flags.map((flag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {flag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Locations */}
        {riskCard.ip_locations.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Recent Locations
            </h4>
            <div className="flex flex-wrap gap-2">
              {riskCard.ip_locations.slice(0, 5).map((loc, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {loc}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Last Activity */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Last activity: {format(new Date(riskCard.last_activity), 'MMM d, yyyy HH:mm')}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          {riskCard.risk_level !== 'blocked' && onBlock && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onBlock(riskCard.user_id)}
              className="flex-1"
            >
              <Ban className="h-4 w-4 mr-1" />
              Block
            </Button>
          )}
          {riskCard.risk_level !== 'watch' && onWatch && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onWatch(riskCard.user_id)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              Watch
            </Button>
          )}
          {!riskCard.whitelist_status && onWhitelist && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onWhitelist(riskCard.user_id)}
              className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
            >
              <ShieldCheck className="h-4 w-4 mr-1" />
              Whitelist
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
