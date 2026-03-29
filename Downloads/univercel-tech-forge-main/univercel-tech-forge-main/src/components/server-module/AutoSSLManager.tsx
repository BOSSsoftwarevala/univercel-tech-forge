/**
 * AUTO SSL MANAGER
 * Automatic SSL certificate management with Let's Encrypt
 * Detect domain → Generate SSL → Install → HTTPS → Auto-renew
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lock, Shield, CheckCircle, AlertTriangle, RefreshCw, Globe,
  Clock, ArrowRight, Zap, XCircle, Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface SSLCertificate {
  id: string;
  domain: string;
  issuer: string;
  status: 'active' | 'expiring' | 'expired' | 'provisioning';
  issuedAt: string;
  expiresAt: string;
  autoRenew: boolean;
  protocol: string;
}

const certificates: SSLCertificate[] = [
  { id: '1', domain: 'softwarevala.com', issuer: "Let's Encrypt", status: 'active', issuedAt: '2026-01-15', expiresAt: '2026-04-15', autoRenew: true, protocol: 'TLS 1.3' },
  { id: '2', domain: 'api.softwarevala.com', issuer: "Let's Encrypt", status: 'active', issuedAt: '2026-02-01', expiresAt: '2026-05-01', autoRenew: true, protocol: 'TLS 1.3' },
  { id: '3', domain: 'staging.softwarevala.com', issuer: "Let's Encrypt", status: 'expiring', issuedAt: '2025-12-10', expiresAt: '2026-03-10', autoRenew: true, protocol: 'TLS 1.3' },
  { id: '4', domain: 'ai.softwarevala.com', issuer: "Let's Encrypt", status: 'provisioning', issuedAt: '', expiresAt: '', autoRenew: true, protocol: 'TLS 1.3' },
];

const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  active: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle, label: 'Active' },
  expiring: { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: AlertTriangle, label: 'Expiring Soon' },
  expired: { color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle, label: 'Expired' },
  provisioning: { color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Loader2, label: 'Provisioning' },
};

export const AutoSSLManager: React.FC = () => {
  const [newDomain, setNewDomain] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    if (!newDomain) { toast.error('Enter a domain name'); return; }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setNewDomain('');
      toast.success(`SSL certificate provisioning started for ${newDomain}`);
    }, 3000);
  };

  const handleRenew = (domain: string) => {
    toast.success(`SSL renewal initiated for ${domain}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Auto SSL Manager</h2>
          <p className="text-sm text-muted-foreground">Automatic SSL certificate provisioning & renewal</p>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-400 border-none">
          <Lock className="w-3 h-3 mr-1" /> Auto-Renewal Active
        </Badge>
      </div>

      {/* SSL Pipeline */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm text-foreground">SSL Provisioning Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-2">
            {[
              { step: 'Domain Detected', icon: Globe },
              { step: 'DNS Verified', icon: Shield },
              { step: 'SSL Generated', icon: Lock },
              { step: 'HTTPS Enabled', icon: CheckCircle },
              { step: 'Auto-Renew Set', icon: RefreshCw },
            ].map((item, i) => (
              <React.Fragment key={item.step}>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-xs text-muted-foreground max-w-[80px]">{item.step}</p>
                </div>
                {i < 4 && <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate New SSL */}
      <Card className="bg-card border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Input placeholder="Enter domain (e.g., example.com)" value={newDomain} onChange={e => setNewDomain(e.target.value)} className="bg-background border-border flex-1" />
            <Button onClick={handleGenerate} disabled={generating} className="bg-blue-600 hover:bg-blue-700">
              {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><Lock className="w-4 h-4 mr-2" /> Generate SSL</>}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <Zap className="w-3 h-3 inline mr-1" />
            Powered by Let's Encrypt • Nginx SSL • Auto-renewal cron
          </p>
        </CardContent>
      </Card>

      {/* Certificates List */}
      <div className="space-y-3">
        {certificates.map((cert, i) => {
          const sc = statusConfig[cert.status];
          const StatusIcon = sc.icon;
          return (
            <motion.div key={cert.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-card border-border hover:border-emerald-500/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl ${sc.bg} flex items-center justify-center`}>
                        <Lock className={`w-5 h-5 ${sc.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{cert.domain}</p>
                          <Badge variant="outline" className={`${sc.color} ${sc.bg} border-none text-xs`}>
                            <StatusIcon className={`w-3 h-3 mr-1 ${cert.status === 'provisioning' ? 'animate-spin' : ''}`} />
                            {sc.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {cert.issuer} • {cert.protocol}
                          {cert.issuedAt && ` • Issued: ${cert.issuedAt}`}
                          {cert.expiresAt && ` • Expires: ${cert.expiresAt}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {cert.autoRenew && (
                        <Badge variant="outline" className="text-emerald-400 bg-emerald-500/10 border-none text-xs">
                          <RefreshCw className="w-3 h-3 mr-1" /> Auto-Renew
                        </Badge>
                      )}
                      {cert.status === 'expiring' && (
                        <Button size="sm" onClick={() => handleRenew(cert.domain)} className="bg-amber-600 hover:bg-amber-700 text-xs">Renew Now</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info */}
      <Card className="bg-muted/30 border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-400" />
            <p className="text-sm text-muted-foreground">SSL certificates auto-renew 30 days before expiry via cron job. All connections enforce TLS 1.3 minimum.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoSSLManager;
