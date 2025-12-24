import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Ban, 
  Clock, 
  FileText,
  Gavel,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PenaltyRecord, 
  PenaltyLevel, 
  PENALTY_LEVELS 
} from '@/types/compliance';
import { ROLE_CONFIG } from '@/types/roles';

interface PenaltyHistoryScreenProps {
  penalties?: PenaltyRecord[];
  showAppealButton?: boolean;
  onAppeal?: (penaltyId: string) => void;
}

// Mock penalties for demo
const mockPenalties: PenaltyRecord[] = [
  {
    id: 'pen-001',
    userId: 'user-001',
    userRole: 'developer',
    level: 1,
    reason: 'Minor code quality violation',
    violationType: 'code_quality',
    issuedBy: 'System',
    issuedAt: '2024-01-10T14:30:00Z',
    isActive: false,
    canAppeal: false,
    auditTrailId: 'audit-001',
  },
  {
    id: 'pen-002',
    userId: 'user-001',
    userRole: 'developer',
    level: 2,
    reason: 'Repeated code commits outside assigned tasks',
    violationType: 'unauthorized_access',
    evidence: 'Git commit logs showing 5 unauthorized commits',
    issuedBy: 'Task Manager',
    issuedAt: '2024-01-15T09:00:00Z',
    expiresAt: '2024-02-15T09:00:00Z',
    isActive: true,
    canAppeal: true,
    auditTrailId: 'audit-002',
  },
  {
    id: 'pen-003',
    userId: 'user-002',
    userRole: 'reseller',
    level: 3,
    reason: 'Unauthorized discount applied to multiple orders',
    violationType: 'billing_violation',
    evidence: 'Order records showing unauthorized 50% discount',
    issuedBy: 'Finance Manager',
    issuedAt: '2024-01-18T16:45:00Z',
    isActive: true,
    canAppeal: true,
    appealStatus: 'pending',
    auditTrailId: 'audit-003',
  },
];

const getPenaltyIcon = (level: PenaltyLevel) => {
  switch (level) {
    case 1:
      return AlertCircle;
    case 2:
      return AlertTriangle;
    case 3:
      return Ban;
    case 4:
      return XCircle;
    case 5:
      return Gavel;
  }
};

export const PenaltyHistoryScreen = ({ 
  penalties = mockPenalties,
  showAppealButton = true,
  onAppeal
}: PenaltyHistoryScreenProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const activePenalties = penalties.filter(p => p.isActive);
  const resolvedPenalties = penalties.filter(p => !p.isActive);

  const renderPenaltyCard = (penalty: PenaltyRecord) => {
    const config = PENALTY_LEVELS.find(l => l.level === penalty.level);
    const Icon = getPenaltyIcon(penalty.level);
    const isExpanded = expandedId === penalty.id;
    const roleConfig = ROLE_CONFIG[penalty.userRole];

    return (
      <motion.div
        key={penalty.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border rounded-lg overflow-hidden ${config?.borderColor} ${config?.bgColor}`}
      >
        <div 
          className="p-4 cursor-pointer"
          onClick={() => setExpandedId(isExpanded ? null : penalty.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config?.bgColor}`}>
                <Icon className={`w-5 h-5 ${config?.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`${config?.bgColor} ${config?.color} border ${config?.borderColor}`}>
                    Level {penalty.level}: {config?.name}
                  </Badge>
                  {penalty.isActive ? (
                    <Badge variant="destructive" className="text-xs">Active</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">Resolved</Badge>
                  )}
                  {penalty.appealStatus && (
                    <Badge variant="outline" className="text-xs">
                      Appeal: {penalty.appealStatus}
                    </Badge>
                  )}
                </div>
                <h4 className="font-medium">{penalty.reason}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {penalty.violationType.replace('_', ' ')} • Issued by {penalty.issuedBy}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {new Date(penalty.issuedAt).toLocaleDateString()}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border/50"
            >
              <div className="p-4 space-y-4">
                {/* Penalty Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: roleConfig?.color }}
                      />
                      <span className="text-sm">{roleConfig?.label}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Violation Type</Label>
                    <span className="text-sm capitalize">{penalty.violationType.replace('_', ' ')}</span>
                  </div>
                  {penalty.expiresAt && (
                    <div className="space-y-2">
                      <Label>Expires</Label>
                      <span className="text-sm">{new Date(penalty.expiresAt).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Audit Trail ID</Label>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{penalty.auditTrailId}</code>
                  </div>
                </div>

                {/* Evidence */}
                {penalty.evidence && (
                  <div className="space-y-2">
                    <Label>Evidence</Label>
                    <div className="bg-muted/50 rounded-lg p-3 text-sm">
                      {penalty.evidence}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {config && (
                  <div className="space-y-2">
                    <Label>Actions Taken</Label>
                    <ul className="space-y-1">
                      {config.actions.map((action, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Appeal Button */}
                {showAppealButton && penalty.canAppeal && penalty.isActive && !penalty.appealStatus && (
                  <div className="flex justify-end pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAppeal?.(penalty.id);
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Submit Appeal
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {PENALTY_LEVELS.map((level) => {
          const count = penalties.filter(p => p.level === level.level).length;
          return (
            <Card key={level.level} className={`${level.bgColor} border ${level.borderColor}`}>
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold ${level.color}`}>{count}</p>
                <p className={`text-xs ${level.color}`}>Level {level.level}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Penalties */}
      {activePenalties.length > 0 && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Active Penalties ({activePenalties.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activePenalties.map(renderPenaltyCard)}
          </CardContent>
        </Card>
      )}

      {/* Resolved Penalties */}
      {resolvedPenalties.length > 0 && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Penalty History ({resolvedPenalties.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resolvedPenalties.map(renderPenaltyCard)}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {penalties.length === 0 && (
        <Card className="bg-green-500/5 border-green-500/30">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-green-500">No Penalties</h3>
            <p className="text-sm text-muted-foreground mt-1">
              No penalty records found for this account
            </p>
          </CardContent>
        </Card>
      )}

      {/* Penalty Level Reference */}
      <Card className="bg-muted/20 border-muted">
        <CardHeader>
          <CardTitle className="text-sm">Penalty Level Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-3">
            {PENALTY_LEVELS.map((level) => (
              <div 
                key={level.level}
                className={`p-3 rounded-lg border text-center ${level.bgColor} ${level.borderColor}`}
              >
                <p className={`font-bold ${level.color}`}>L{level.level}</p>
                <p className={`text-xs ${level.color}`}>{level.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{children}</p>
);

export default PenaltyHistoryScreen;
