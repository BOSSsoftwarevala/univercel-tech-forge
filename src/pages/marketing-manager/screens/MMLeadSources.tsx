import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSystemActions } from '@/hooks/useSystemActions';
import {
  Globe,
  Facebook,
  Smartphone,
  MessageSquare,
  FileSpreadsheet,
  Upload,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Loader2,
  Link2,
  Zap,
  Plus,
  Settings,
} from 'lucide-react';

interface LeadSource {
  id: string;
  name: string;
  type: string;
  icon: React.ReactNode;
  connected: boolean;
  leads_today: number;
  leads_total: number;
  conversion_rate: number;
  last_sync: string | null;
  status: 'active' | 'paused' | 'error';
}

const MMLeadSources: React.FC = () => {
  const { actions, executeAction, isLoading } = useSystemActions();
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);

  useEffect(() => {
    fetchLeadSources();
  }, []);

  const fetchLeadSources = async () => {
    setLoading(true);
    // Mock lead sources data
    const mockSources: LeadSource[] = [
      {
        id: '1',
        name: 'Website Forms',
        type: 'website',
        icon: <Globe className="w-5 h-5" />,
        connected: true,
        leads_today: 23,
        leads_total: 1456,
        conversion_rate: 12.5,
        last_sync: new Date().toISOString(),
        status: 'active',
      },
      {
        id: '2',
        name: 'Facebook Lead Ads',
        type: 'facebook',
        icon: <Facebook className="w-5 h-5" />,
        connected: true,
        leads_today: 45,
        leads_total: 2890,
        conversion_rate: 8.2,
        last_sync: new Date().toISOString(),
        status: 'active',
      },
      {
        id: '3',
        name: 'Google Ads',
        type: 'google',
        icon: <Globe className="w-5 h-5" />,
        connected: true,
        leads_today: 34,
        leads_total: 1823,
        conversion_rate: 15.3,
        last_sync: new Date().toISOString(),
        status: 'active',
      },
      {
        id: '4',
        name: 'Landing Pages',
        type: 'landing',
        icon: <Globe className="w-5 h-5" />,
        connected: true,
        leads_today: 18,
        leads_total: 945,
        conversion_rate: 22.1,
        last_sync: new Date().toISOString(),
        status: 'active',
      },
      {
        id: '5',
        name: 'Chatbot',
        type: 'chatbot',
        icon: <MessageSquare className="w-5 h-5" />,
        connected: false,
        leads_today: 0,
        leads_total: 0,
        conversion_rate: 0,
        last_sync: null,
        status: 'paused',
      },
      {
        id: '6',
        name: 'WhatsApp Business',
        type: 'whatsapp',
        icon: <Smartphone className="w-5 h-5" />,
        connected: true,
        leads_today: 56,
        leads_total: 3421,
        conversion_rate: 18.7,
        last_sync: new Date().toISOString(),
        status: 'active',
      },
      {
        id: '7',
        name: 'API Import',
        type: 'api',
        icon: <Link2 className="w-5 h-5" />,
        connected: true,
        leads_today: 12,
        leads_total: 567,
        conversion_rate: 25.4,
        last_sync: new Date().toISOString(),
        status: 'active',
      },
      {
        id: '8',
        name: 'CSV Import',
        type: 'csv',
        icon: <FileSpreadsheet className="w-5 h-5" />,
        connected: true,
        leads_today: 0,
        leads_total: 234,
        conversion_rate: 5.2,
        last_sync: new Date(Date.now() - 86400000).toISOString(),
        status: 'active',
      },
    ];

    setSources(mockSources);
    setLoading(false);
  };

  const handleSync = useCallback(async (sourceId: string, sourceName: string) => {
    setSyncing(sourceId);
    try {
      await executeAction({
        module: 'marketing',
        action: 'sync',
        entityType: 'LeadSource',
        entityId: sourceId,
        entityName: sourceName,
        successMessage: `${sourceName} synced successfully`
      });
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSources(prev => prev.map(s => 
        s.id === sourceId 
          ? { ...s, last_sync: new Date().toISOString(), leads_today: s.leads_today + Math.floor(Math.random() * 5) }
          : s
      ));
    } finally {
      setSyncing(null);
    }
  }, [executeAction]);

  const toggleSource = useCallback((sourceId: string, sourceName: string, connected: boolean) => {
    if (connected) {
      actions.enable('marketing', 'LeadSource', sourceId, sourceName);
    } else {
      actions.disable('marketing', 'LeadSource', sourceId, sourceName);
    }
    setSources(prev => prev.map(s => 
      s.id === sourceId 
        ? { ...s, connected, status: connected ? 'active' : 'paused' }
        : s
    ));
  }, [actions]);

  const handleAddSource = useCallback(() => {
    actions.create('marketing', 'LeadSource', { type: 'new' }, 'New Lead Source');
  }, [actions]);

  const handleRefreshAll = useCallback(() => {
    actions.refresh('marketing', 'LeadSources');
    fetchLeadSources();
  }, [actions]);

  const handleConfigureRules = useCallback(() => {
    actions.update('marketing', 'LeadPipelineRules', 'config', { action: 'configure' });
  }, [actions]);

  const handleViewSource = useCallback((sourceId: string, sourceName: string) => {
    actions.read('marketing', 'LeadSource', sourceId, sourceName);
  }, [actions]);

  const totalLeadsToday = sources.reduce((sum, s) => sum + s.leads_today, 0);
  const totalLeads = sources.reduce((sum, s) => sum + s.leads_total, 0);
  const avgConversion = sources.filter(s => s.connected).length > 0
    ? sources.filter(s => s.connected).reduce((sum, s) => sum + s.conversion_rate, 0) / sources.filter(s => s.connected).length
    : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 gap-1"><CheckCircle2 className="w-3 h-3" />Active</Badge>;
      case 'paused':
        return <Badge variant="secondary" className="gap-1"><XCircle className="w-3 h-3" />Paused</Badge>;
      case 'error':
        return <Badge variant="destructive" className="gap-1"><AlertTriangle className="w-3 h-3" />Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <Zap className="w-6 h-6 text-emerald-400" />
            Lead Sources
          </h2>
          <p className="text-slate-400 text-sm">Connect and manage all lead capture channels</p>
        </div>
        <Button onClick={fetchLeadSources} variant="outline" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh All
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-white">{totalLeadsToday}</div>
            <p className="text-xs text-slate-400">Leads Today</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-emerald-400">{totalLeads.toLocaleString()}</div>
            <p className="text-xs text-slate-400">Total Leads</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-400">{sources.filter(s => s.connected).length}</div>
            <p className="text-xs text-slate-400">Active Sources</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-400">{avgConversion.toFixed(1)}%</div>
            <p className="text-xs text-slate-400">Avg Conversion</p>
          </CardContent>
        </Card>
      </div>

      {/* Lead Sources Grid */}
      <div className="grid grid-cols-2 gap-4">
        {sources.map(source => (
          <Card key={source.id} className={`bg-slate-800/50 border-slate-700 ${!source.connected ? 'opacity-60' : ''}`}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${source.connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                    {source.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{source.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(source.status)}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={source.connected}
                  onCheckedChange={(checked) => toggleSource(source.id, source.name, checked)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-400">Today</p>
                  <p className="text-lg font-bold text-white">{source.leads_today}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Total</p>
                  <p className="text-lg font-bold text-white">{source.leads_total.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Conv. Rate</p>
                  <p className="text-lg font-bold text-emerald-400">{source.conversion_rate}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                <p className="text-xs text-slate-400">
                  {source.last_sync 
                    ? `Last sync: ${new Date(source.last_sync).toLocaleTimeString()}`
                    : 'Never synced'}
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSync(source.id, source.name)}
                    disabled={!source.connected || syncing === source.id}
                  >
                    {syncing === source.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3 h-3" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Connection */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Pipeline Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium">Auto-sync to Lead Manager</p>
                <p className="text-sm text-slate-400">All leads automatically flow to the lead pipeline</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
              <Button variant="outline" size="sm">
                Configure Rules
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CSV Import Section */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Bulk Import
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
            <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-slate-500" />
            <p className="text-slate-400 mb-4">Drop CSV or Excel file here to import leads</p>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Select File
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MMLeadSources;
