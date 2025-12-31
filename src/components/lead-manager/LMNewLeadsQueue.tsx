import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Inbox, 
  Clock, 
  Globe,
  User,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Shield,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface NewLead {
  id: string;
  email: string;
  phone: string;
  source: 'frontend' | 'reseller' | 'influencer' | 'franchise' | 'api';
  sourceId: string;
  createdAt: string;
  aiSpamScore: number;
  completeness: number;
  country: string;
  interest: string;
}

const mockLeads: NewLead[] = [
  {
    id: 'LD-001',
    email: 'j***@example.com',
    phone: '+91-98***45',
    source: 'frontend',
    sourceId: 'WEB-FORM',
    createdAt: '2035-01-15 10:30',
    aiSpamScore: 12,
    completeness: 95,
    country: 'India',
    interest: 'Enterprise Plan'
  },
  {
    id: 'LD-002',
    email: 's***@company.com',
    phone: '+1-555***89',
    source: 'reseller',
    sourceId: 'RSL-7823',
    createdAt: '2035-01-15 10:15',
    aiSpamScore: 8,
    completeness: 100,
    country: 'USA',
    interest: 'Pro Plan'
  },
  {
    id: 'LD-003',
    email: 'b***@test.org',
    phone: '+44-782***12',
    source: 'influencer',
    sourceId: 'INF-3421',
    createdAt: '2035-01-15 09:45',
    aiSpamScore: 45,
    completeness: 70,
    country: 'UK',
    interest: 'Basic Plan'
  },
  {
    id: 'LD-004',
    email: 'm***@biz.com',
    phone: '+91-99***78',
    source: 'franchise',
    sourceId: 'FRC-1234',
    createdAt: '2035-01-15 09:30',
    aiSpamScore: 5,
    completeness: 100,
    country: 'India',
    interest: 'Enterprise Plan'
  },
  {
    id: 'LD-005',
    email: 'a***@corp.net',
    phone: '+49-171***34',
    source: 'api',
    sourceId: 'API-HUBSPOT',
    createdAt: '2035-01-15 09:00',
    aiSpamScore: 78,
    completeness: 60,
    country: 'Germany',
    interest: 'Demo Request'
  }
];

const getSourceBadge = (source: string) => {
  const colors: Record<string, string> = {
    frontend: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    reseller: 'bg-green-500/20 text-green-400 border-green-500/30',
    influencer: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    franchise: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    api: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
  };
  return <Badge className={colors[source] || 'bg-gray-500/20 text-gray-400'}>{source.toUpperCase()}</Badge>;
};

const getSpamBadge = (score: number) => {
  if (score >= 60) return <Badge variant="destructive" className="text-xs">High Spam Risk</Badge>;
  if (score >= 30) return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Medium Risk</Badge>;
  return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Low Risk</Badge>;
};

export const LMNewLeadsQueue: React.FC = () => {
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  const handleQualify = (lead: NewLead) => {
    if (lead.completeness < 80) {
      toast.error('Lead completeness too low', {
        description: 'Required fields must be above 80% complete'
      });
      return;
    }
    toast.success(`Lead ${lead.id} qualified`, {
      description: 'Moved to Qualified Leads queue'
    });
    console.log('[LEAD-MANAGER] Lead qualified:', lead.id);
  };

  const handleReject = (lead: NewLead) => {
    toast.error(`Lead ${lead.id} rejected`, {
      description: 'Rejection reason logged'
    });
    console.log('[LEAD-MANAGER] Lead rejected:', lead.id);
  };

  const highRiskCount = mockLeads.filter(l => l.aiSpamScore >= 60).length;

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Inbox className="h-5 w-5 text-primary" />
            New Leads Queue
            <Badge variant="secondary" className="ml-2">{mockLeads.length}</Badge>
          </CardTitle>
          {highRiskCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {highRiskCount} High Risk
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {mockLeads.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border rounded-lg p-3 ${
                lead.aiSpamScore >= 60
                  ? 'bg-red-500/5 border-red-500/30'
                  : lead.aiSpamScore >= 30
                  ? 'bg-yellow-500/5 border-yellow-500/30'
                  : 'bg-muted/30 border-border/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-sm">{lead.id}</span>
                    {getSourceBadge(lead.source)}
                    {getSpamBadge(lead.aiSpamScore)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Source: {lead.sourceId} • {lead.country}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {lead.completeness}% Complete
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {lead.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {lead.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {lead.interest}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {lead.createdAt}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-1 text-xs">
                  <Sparkles className="h-3 w-3 text-purple-400" />
                  <span className="text-muted-foreground">AI Spam Score:</span>
                  <span className={`font-mono ${
                    lead.aiSpamScore >= 60 ? 'text-red-400' : 
                    lead.aiSpamScore >= 30 ? 'text-yellow-400' : 'text-green-400'
                  }`}>{lead.aiSpamScore}%</span>
                </div>
                <Button
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleQualify(lead)}
                  disabled={lead.completeness < 80}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Qualify
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-7 text-xs"
                  onClick={() => handleReject(lead)}
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Reject
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            <Shield className="h-3 w-3 inline mr-1" />
            No lead without source • Anonymous leads BLOCKED
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
