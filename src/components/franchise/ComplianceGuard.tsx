import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, FileText, Ban, Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

const complianceRules = [
  { id: 1, rule: 'Pricing Lock', description: 'No discounts without approval', status: 'enforced', violations: 0 },
  { id: 2, rule: 'Identity Masking', description: 'Client details always masked', status: 'enforced', violations: 0 },
  { id: 3, rule: 'NDA Acceptance', description: 'All resellers must sign NDA', status: 'enforced', violations: 2 },
  { id: 4, rule: 'Data Export Restriction', description: 'No bulk data export allowed', status: 'enforced', violations: 0 },
];

const recentViolations = [
  { id: 1, type: 'NDA Missing', reseller: 'New Reseller Mumbai', date: '2 days ago', severity: 'medium' },
  { id: 2, type: 'NDA Missing', reseller: 'Tech Partner Pune', date: '5 days ago', severity: 'medium' },
];

const ndaStatus = [
  { reseller: 'Tech Solutions Mumbai', signed: true, date: '15 Jan 2024' },
  { reseller: 'Digital Pune', signed: true, date: '20 Jan 2024' },
  { reseller: 'InfoTech Nagpur', signed: false, date: null },
  { reseller: 'Smart Systems Thane', signed: true, date: '22 Jan 2024' },
];

export const ComplianceGuard = () => {
  const [maskingEnabled, setMaskingEnabled] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-foreground">Compliance Guard</h2>
          <p className="text-sm text-muted-foreground">Pricing lock, identity masking, NDA compliance</p>
        </div>
        <Badge variant="default" className="bg-neon-green/20 text-neon-green border-neon-green/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          System Compliant
        </Badge>
      </div>

      {/* Compliance Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="glass-panel border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-neon-green" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold text-foreground">4</p>
                <p className="text-xs text-muted-foreground">Rules Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neon-orange/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-neon-orange" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold text-foreground">2</p>
                <p className="text-xs text-muted-foreground">Violations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">Pricing Lock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neon-purple/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-neon-purple" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold text-foreground">75%</p>
                <p className="text-xs text-muted-foreground">NDA Signed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Compliance Rules */}
        <Card className="glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="text-foreground">Active Compliance Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {complianceRules.map((rule, index) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-secondary/20 border border-border/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{rule.rule}</span>
                      <Badge variant="default" className="bg-neon-green/20 text-neon-green border-neon-green/30">
                        {rule.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                  {rule.violations > 0 ? (
                    <Badge variant="destructive">{rule.violations} violations</Badge>
                  ) : (
                    <CheckCircle className="w-5 h-5 text-neon-green" />
                  )}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Identity Masking Control */}
        <Card className="glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              {maskingEnabled ? <EyeOff className="w-5 h-5 text-primary" /> : <Eye className="w-5 h-5 text-neon-red" />}
              Identity Masking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">Masking Status</span>
                <Switch checked={maskingEnabled} onCheckedChange={setMaskingEnabled} disabled />
              </div>
              <p className="text-sm text-muted-foreground">
                Client identities are automatically masked. This cannot be disabled.
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">What is masked:</p>
              <div className="grid grid-cols-2 gap-2">
                {['Full Names', 'Phone Numbers', 'Email Addresses', 'Company Names'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="w-3 h-3 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NDA Status & Violations */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="text-foreground">NDA Acceptance Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ndaStatus.map((item, index) => (
              <motion.div
                key={item.reseller}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${
                  item.signed ? 'bg-secondary/20 border-border/30' : 'bg-neon-red/10 border-neon-red/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{item.reseller}</span>
                  {item.signed ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-neon-green" />
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                  ) : (
                    <Badge variant="destructive">Pending</Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Flag className="w-5 h-5 text-neon-red" />
              Recent Violations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentViolations.length > 0 ? (
              recentViolations.map((violation, index) => (
                <motion.div
                  key={violation.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-neon-red/10 border border-neon-red/30"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground">{violation.type}</span>
                    <Badge variant={violation.severity === 'high' ? 'destructive' : 'secondary'}>
                      {violation.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{violation.reseller}</p>
                  <p className="text-xs text-muted-foreground">{violation.date}</p>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-neon-green" />
                <p>No violations detected</p>
              </div>
            )}
            <Button variant="outline" className="w-full border-neon-red/30 text-neon-red">
              <Flag className="w-4 h-4 mr-2" />
              Report Misuse
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
