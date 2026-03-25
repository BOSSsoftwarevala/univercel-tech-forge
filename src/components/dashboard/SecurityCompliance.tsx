import { motion } from 'framer-motion';
import { Scale, CheckCircle, AlertTriangle, FileText, Shield } from 'lucide-react';

interface ComplianceItem {
  category: string;
  status: 'compliant' | 'warning' | 'review';
  percentage: number;
  lastAudit: string;
}

const complianceItems: ComplianceItem[] = [
  { category: 'Data Privacy (GDPR)', status: 'compliant', percentage: 100, lastAudit: '2 days ago' },
  { category: 'Financial Regulations', status: 'compliant', percentage: 98, lastAudit: '5 days ago' },
  { category: 'Security Protocols', status: 'compliant', percentage: 96, lastAudit: '1 day ago' },
  { category: 'Regional Compliance', status: 'warning', percentage: 87, lastAudit: '3 days ago' },
  { category: 'Audit Trail', status: 'review', percentage: 72, lastAudit: '7 days ago' },
];

const SecurityCompliance = ({ delay = 0 }: { delay?: number }) => {
  const getStatusIcon = (status: ComplianceItem['status']) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4 text-neon-green" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-neon-orange" />;
      case 'review': return <FileText className="w-4 h-4 text-neon-cyan" />;
    }
  };

  const overallScore = Math.round(
    complianceItems.reduce((acc, item) => acc + item.percentage, 0) / complianceItems.length
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="glass-panel p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Security & Compliance</h3>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-neon-green" />
          <span className="font-mono text-sm font-bold text-neon-green">{overallScore}%</span>
        </div>
      </div>

      {/* Overall Score Ring */}
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-secondary"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: overallScore / 100 }}
              transition={{ delay: delay + 0.3, duration: 1 }}
              style={{ strokeDasharray: '251.2', strokeDashoffset: '0' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(187 100% 50%)" />
                <stop offset="100%" stopColor="hsl(142 76% 50%)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-2xl font-bold text-foreground">{overallScore}%</span>
          </div>
        </div>
      </div>

      {/* Compliance Items */}
      <div className="space-y-2">
        {complianceItems.map((item, index) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + (index * 0.05) }}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              {getStatusIcon(item.status)}
              <span className="text-sm text-foreground">{item.category}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{item.lastAudit}</span>
              <span className={`font-mono text-xs font-bold ${
                item.percentage >= 95 ? 'text-neon-green' :
                item.percentage >= 80 ? 'text-neon-cyan' : 'text-neon-orange'
              }`}>
                {item.percentage}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SecurityCompliance;