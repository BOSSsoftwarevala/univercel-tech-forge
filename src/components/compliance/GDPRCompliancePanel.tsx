import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  FileText, 
  Users, 
  Globe, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Lock,
  Trash2,
  Download,
  Eye,
  FileSignature,
  Scale,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ComplianceItem {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'partial' | 'non-compliant' | 'review';
  category: string;
  lastAudit: string;
  nextAudit: string;
  automationEnabled: boolean;
}

const mockCompliance: ComplianceItem[] = [
  {
    id: '1',
    name: 'Data Processing Agreement',
    description: 'Valid DPA with all data processors',
    status: 'compliant',
    category: 'gdpr',
    lastAudit: '2024-01-15',
    nextAudit: '2024-07-15',
    automationEnabled: true
  },
  {
    id: '2',
    name: 'Consent Management',
    description: 'User consent capture and tracking',
    status: 'compliant',
    category: 'gdpr',
    lastAudit: '2024-01-20',
    nextAudit: '2024-04-20',
    automationEnabled: true
  },
  {
    id: '3',
    name: 'Right to Erasure',
    description: 'Automated data deletion workflows',
    status: 'partial',
    category: 'gdpr',
    lastAudit: '2024-01-10',
    nextAudit: '2024-04-10',
    automationEnabled: true
  },
  {
    id: '4',
    name: 'Multi-Region Tax Compliance',
    description: 'Tax engine configured for all operating regions',
    status: 'compliant',
    category: 'tax',
    lastAudit: '2024-01-05',
    nextAudit: '2024-02-05',
    automationEnabled: true
  },
  {
    id: '5',
    name: 'Digital Signature Verification',
    description: 'eIDAS compliant signature validation',
    status: 'compliant',
    category: 'legal',
    lastAudit: '2024-01-18',
    nextAudit: '2024-07-18',
    automationEnabled: false
  },
  {
    id: '6',
    name: 'Contract Lifecycle Management',
    description: 'Automated contract workflows and approvals',
    status: 'review',
    category: 'legal',
    lastAudit: '2024-01-22',
    nextAudit: '2024-04-22',
    automationEnabled: true
  },
  {
    id: '7',
    name: 'Cross-Border Data Guard',
    description: 'Data transfer compliance monitoring',
    status: 'compliant',
    category: 'data',
    lastAudit: '2024-01-12',
    nextAudit: '2024-04-12',
    automationEnabled: true
  },
  {
    id: '8',
    name: 'Vendor Compliance Rating',
    description: 'Third-party vendor compliance tracking',
    status: 'partial',
    category: 'vendor',
    lastAudit: '2024-01-08',
    nextAudit: '2024-03-08',
    automationEnabled: false
  }
];

const GDPRCompliancePanel = () => {
  const [items, setItems] = useState<ComplianceItem[]>(mockCompliance);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const toggleAutomation = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, automationEnabled: !item.automationEnabled } : item
    ));
  };

  const getStatusColor = (status: ComplianceItem['status']) => {
    switch (status) {
      case 'compliant': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'partial': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'non-compliant': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'review': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getStatusIcon = (status: ComplianceItem['status']) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4" />;
      case 'partial': return <AlertTriangle className="h-4 w-4" />;
      case 'non-compliant': return <AlertTriangle className="h-4 w-4" />;
      case 'review': return <Eye className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'gdpr': return <Shield className="h-4 w-4" />;
      case 'tax': return <Building className="h-4 w-4" />;
      case 'legal': return <Scale className="h-4 w-4" />;
      case 'data': return <Globe className="h-4 w-4" />;
      case 'vendor': return <Users className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const complianceScore = Math.round(
    (items.filter(i => i.status === 'compliant').length / items.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Compliance Score</p>
                  <p className="text-3xl font-bold text-green-400">{complianceScore}%</p>
                </div>
                <Shield className="h-10 w-10 text-green-400" />
              </div>
              <Progress value={complianceScore} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Data Requests</p>
                  <p className="text-3xl font-bold text-blue-400">24</p>
                </div>
                <Users className="h-10 w-10 text-blue-400" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">This month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Regions</p>
                  <p className="text-3xl font-bold text-purple-400">12</p>
                </div>
                <Globe className="h-10 w-10 text-purple-400" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Countries</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-orange-500/20 to-amber-600/20 border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Audits</p>
                  <p className="text-3xl font-bold text-orange-400">3</p>
                </div>
                <Clock className="h-10 w-10 text-orange-400" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Next 30 days</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <Card className="backdrop-blur-xl bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Quick Compliance Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: <Trash2 className="h-5 w-5" />, label: 'Process Erasure', color: 'text-red-400' },
              { icon: <Download className="h-5 w-5" />, label: 'Data Export', color: 'text-blue-400' },
              { icon: <FileSignature className="h-5 w-5" />, label: 'Sign Contract', color: 'text-green-400' },
              { icon: <Eye className="h-5 w-5" />, label: 'View Consents', color: 'text-purple-400' },
              { icon: <Lock className="h-5 w-5" />, label: 'Privacy Shield', color: 'text-orange-400' },
              { icon: <Scale className="h-5 w-5" />, label: 'Legal Review', color: 'text-cyan-400' }
            ].map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <span className={action.color}>{action.icon}</span>
                  <span className="text-xs">{action.label}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Items */}
      <Card className="backdrop-blur-xl bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Compliance Management
              </CardTitle>
              <CardDescription>
                Track and manage regulatory compliance across all jurisdictions
              </CardDescription>
            </div>
            <Button>Run Compliance Audit</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="gdpr">GDPR</TabsTrigger>
              <TabsTrigger value="tax">Tax</TabsTrigger>
              <TabsTrigger value="legal">Legal</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="vendor">Vendor</TabsTrigger>
            </TabsList>

            <div className="space-y-3">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`border ${getStatusColor(item.status)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${getStatusColor(item.status)}`}>
                            {getCategoryIcon(item.category)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{item.name}</h4>
                              <Badge className={getStatusColor(item.status)}>
                                {getStatusIcon(item.status)}
                                <span className="ml-1 capitalize">{item.status}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Last Audit: {item.lastAudit}</span>
                              <span>Next Audit: {item.nextAudit}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Auto</span>
                            <Switch
                              checked={item.automationEnabled}
                              onCheckedChange={() => toggleAutomation(item.id)}
                            />
                          </div>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GDPRCompliancePanel;
