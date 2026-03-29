import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Image, AlertTriangle, CheckCircle, Eye, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface TrademarkAsset {
  id: string;
  name: string;
  type: 'logo' | 'brand_name' | 'slogan' | 'design';
  registrationNumber: string;
  status: 'protected' | 'pending' | 'expired';
  expiryDate: string;
  violations: number;
}

interface MisuseAlert {
  id: string;
  assetId: string;
  assetName: string;
  detectedIn: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  aiConfidence: number;
  detectedAt: string;
}

const mockAssets: TrademarkAsset[] = [
  { id: 'TM-001', name: 'Primary Logo', type: 'logo', registrationNumber: 'TM-2024-001234', status: 'protected', expiryDate: '2034-06-15', violations: 2 },
  { id: 'TM-002', name: 'Brand Name', type: 'brand_name', registrationNumber: 'TM-2024-001235', status: 'protected', expiryDate: '2034-06-15', violations: 0 },
  { id: 'TM-003', name: 'Tagline', type: 'slogan', registrationNumber: 'TM-2024-001236', status: 'pending', expiryDate: '-', violations: 1 },
];

const mockMisuses: MisuseAlert[] = [
  { id: 'MU-001', assetId: 'TM-001', assetName: 'Primary Logo', detectedIn: 'Partner Page: RSL-4521', severity: 'high', description: 'Logo used without proper license attribution', aiConfidence: 94, detectedAt: '2024-01-15T08:00:00Z' },
  { id: 'MU-002', assetId: 'TM-001', assetName: 'Primary Logo', detectedIn: 'Demo: DM-7823', severity: 'medium', description: 'Modified logo version detected', aiConfidence: 87, detectedAt: '2024-01-14T16:30:00Z' },
  { id: 'MU-003', assetId: 'TM-003', assetName: 'Tagline', detectedIn: 'Content: CNT-1122', severity: 'low', description: 'Similar tagline usage in marketing material', aiConfidence: 72, detectedAt: '2024-01-14T14:00:00Z' },
];

const LMTrademarkMonitor: React.FC = () => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'protected': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-red-500/20 text-red-400';
    }
  };

  const handleInvestigate = (misuse: MisuseAlert) => {
    console.log('[LEGAL_MANAGER] Trademark misuse investigated:', {
      timestamp: new Date().toISOString(),
      action: 'misuse_investigated',
      misuseId: misuse.id,
      assetId: misuse.assetId
    });
    toast.info('Investigation logged');
  };

  const handleRecommendAction = (misuse: MisuseAlert) => {
    console.log('[LEGAL_MANAGER] Trademark action recommended:', {
      timestamp: new Date().toISOString(),
      action: 'action_recommended',
      misuseId: misuse.id,
      recommendation: 'Takedown notice'
    });
    toast.success('Action recommended to Admin');
  };

  return (
    <div className="space-y-6">
      {/* Registered Assets */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Registered Trademarks & IP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {mockAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Image className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{asset.name}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="outline" className="text-xs">{asset.type.replace('_', ' ')}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={getStatusColor(asset.status)}>{asset.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reg #:</span>
                    <span className="font-mono text-xs">{asset.registrationNumber}</span>
                  </div>
                  {asset.violations > 0 && (
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <span className="text-muted-foreground">Violations:</span>
                      <Badge variant="destructive">{asset.violations}</Badge>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI-Detected Misuse */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              AI-Detected Misuse
            </CardTitle>
            <Badge variant="destructive">{mockMisuses.length} Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockMisuses.map((misuse, index) => (
              <motion.div
                key={misuse.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-mono text-sm text-muted-foreground">{misuse.id}</span>
                      <Badge className={getSeverityColor(misuse.severity)}>{misuse.severity}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {misuse.aiConfidence}% AI confidence
                      </Badge>
                    </div>
                    <p className="font-medium mb-1">Asset: {misuse.assetName}</p>
                    <p className="text-sm text-muted-foreground mb-1">{misuse.description}</p>
                    <p className="text-xs text-muted-foreground">Detected in: {misuse.detectedIn}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleInvestigate(misuse)}
                      className="gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      Investigate
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleRecommendAction(misuse)}
                      className="gap-1"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      Recommend
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LMTrademarkMonitor;
