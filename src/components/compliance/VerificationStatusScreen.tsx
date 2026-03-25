import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  FileText,
  User,
  Shield,
  Scale,
  Unlock,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  VerificationRecord, 
  VerificationStep, 
  VerificationStatus,
  VERIFICATION_STEPS 
} from '@/types/compliance';
import { AppRole, ROLE_CONFIG } from '@/types/roles';

interface VerificationStatusScreenProps {
  verification?: VerificationRecord;
  role: AppRole;
  onStepAction?: (step: VerificationStep) => void;
}

const getStatusIcon = (status: VerificationStatus) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'rejected':
      return <XCircle className="w-5 h-5 text-red-500" />;
    case 'in_progress':
      return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
    case 'requires_action':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    default:
      return <Clock className="w-5 h-5 text-muted-foreground" />;
  }
};

const getStatusColor = (status: VerificationStatus) => {
  switch (status) {
    case 'approved':
      return 'bg-green-500/10 text-green-500 border-green-500/30';
    case 'rejected':
      return 'bg-red-500/10 text-red-500 border-red-500/30';
    case 'in_progress':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
    case 'requires_action':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
    default:
      return 'bg-muted/50 text-muted-foreground border-muted';
  }
};

const getStepIcon = (step: VerificationStep) => {
  switch (step) {
    case 'agreement':
      return FileText;
    case 'identity':
      return User;
    case 'risk_scoring':
      return Shield;
    case 'legal_review':
      return Scale;
    case 'activation':
      return Unlock;
  }
};

// Mock verification for demo
const mockVerification: VerificationRecord = {
  id: 'ver-001',
  userId: 'user-001',
  role: 'developer',
  currentStep: 'legal_review',
  stepStatuses: {
    agreement: 'approved',
    identity: 'approved',
    risk_scoring: 'approved',
    legal_review: 'in_progress',
    activation: 'pending',
  },
  agreementAcceptedAt: '2024-01-15T10:30:00Z',
  agreementVersion: '1.0.0',
  identityVerifiedAt: '2024-01-15T11:00:00Z',
  riskScore: 15,
  riskFactors: [
    { type: 'ip_reputation', score: 95, status: 'pass', details: 'Clean IP history' },
    { type: 'device_fingerprint', score: 88, status: 'pass', details: 'Recognized device' },
    { type: 'country_risk', score: 90, status: 'pass', details: 'Low-risk jurisdiction' },
    { type: 'asn_check', score: 92, status: 'pass', details: 'Residential ISP' },
    { type: 'violation_history', score: 100, status: 'pass', details: 'No previous violations' },
  ],
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T14:00:00Z',
};

export const VerificationStatusScreen = ({ 
  verification = mockVerification,
  role,
  onStepAction 
}: VerificationStatusScreenProps) => {
  const roleConfig = ROLE_CONFIG[role];
  const isFullyVerified = Object.values(verification.stepStatuses).every(s => s === 'approved');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Status */}
      <Card className={`${isFullyVerified ? 'bg-green-500/5 border-green-500/30' : 'bg-card/50 border-border/50'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${roleConfig?.color}20` }}
              >
                {isFullyVerified ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Clock className="w-6 h-6" style={{ color: roleConfig?.color }} />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {isFullyVerified ? 'Verification Complete' : 'Verification In Progress'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Role: {roleConfig?.label} • Started: {new Date(verification.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(isFullyVerified ? 'approved' : 'in_progress')}>
              {isFullyVerified ? 'Active' : 'Pending'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Verification Steps */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Verification Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {VERIFICATION_STEPS.map((step, index) => {
              const status = verification.stepStatuses[step.step];
              const StepIcon = getStepIcon(step.step);
              const isCurrent = verification.currentStep === step.step;

              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    isCurrent ? 'border-primary bg-primary/5' : 'border-border/50 bg-muted/20'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    status === 'approved' 
                      ? 'bg-green-500/20' 
                      : status === 'rejected'
                        ? 'bg-red-500/20'
                        : isCurrent
                          ? 'bg-primary/20'
                          : 'bg-muted/50'
                  }`}>
                    <StepIcon className={`w-5 h-5 ${
                      status === 'approved' 
                        ? 'text-green-500' 
                        : status === 'rejected'
                          ? 'text-red-500'
                          : isCurrent
                            ? 'text-primary'
                            : 'text-muted-foreground'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{step.title}</h4>
                      {isCurrent && (
                        <Badge variant="outline" className="text-xs border-primary text-primary">
                          Current Step
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusIcon(status)}
                    <Badge className={getStatusColor(status)}>
                      {status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    {status === 'requires_action' && onStepAction && (
                      <Button size="sm" onClick={() => onStepAction(step.step)}>
                        Take Action
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Risk Score */}
      {verification.riskScore !== undefined && verification.riskFactors && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Risk Assessment
              </CardTitle>
              <Badge className={
                verification.riskScore < 30 
                  ? 'bg-green-500/10 text-green-500 border-green-500/30'
                  : verification.riskScore < 60
                    ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                    : 'bg-red-500/10 text-red-500 border-red-500/30'
              }>
                Risk Score: {verification.riskScore}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {verification.riskFactors.map((factor, index) => (
                <motion.div
                  key={factor.type}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border ${
                    factor.status === 'pass'
                      ? 'bg-green-500/5 border-green-500/30'
                      : factor.status === 'warning'
                        ? 'bg-yellow-500/5 border-yellow-500/30'
                        : 'bg-red-500/5 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium capitalize">
                      {factor.type.replace('_', ' ')}
                    </span>
                    <Badge variant="outline" className={
                      factor.status === 'pass'
                        ? 'border-green-500/50 text-green-500'
                        : factor.status === 'warning'
                          ? 'border-yellow-500/50 text-yellow-500'
                          : 'border-red-500/50 text-red-500'
                    }>
                      {factor.score}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{factor.details}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card className="bg-muted/20 border-muted">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Created: {new Date(verification.createdAt).toLocaleString()}</span>
            <span>Last Updated: {new Date(verification.updatedAt).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VerificationStatusScreen;
