import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Plus, Trash2, Copy, Save, Send, Eye, Pause, Play, CheckCircle,
  DollarSign, Target, Users, Calendar, Sparkles, TrendingUp,
  AlertTriangle, BarChart3, Loader2, X, ChevronRight, Settings,
  Facebook, Youtube, Mail, MessageSquare, Globe, Smartphone
} from 'lucide-react';

type CampaignStatus = 'draft' | 'review' | 'approved' | 'live' | 'paused' | 'closed';
type ChannelType = 'google' | 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'whatsapp' | 'sms' | 'email' | 'native';

interface Campaign {
  id: string;
  name: string;
  channel: ChannelType;
  status: CampaignStatus;
  budget_daily: number;
  budget_monthly: number;
  budget_spent: number;
  start_date: string;
  end_date: string;
  target_audience: string;
  kpi_target: string;
  ab_testing_enabled: boolean;
  variants: CampaignVariant[];
  created_at: string;
}

interface CampaignVariant {
  id: string;
  name: string;
  headline: string;
  description: string;
  cta: string;
  impressions: number;
  clicks: number;
  conversions: number;
  is_winner: boolean;
}

const channelIcons: Record<ChannelType, React.ElementType> = {
  google: Globe,
  facebook: Facebook,
  instagram: Facebook,
  linkedin: Globe,
  youtube: Youtube,
  whatsapp: MessageSquare,
  sms: Smartphone,
  email: Mail,
  native: Globe,
};

const channelColors: Record<ChannelType, string> = {
  google: 'bg-blue-500',
  facebook: 'bg-blue-600',
  instagram: 'bg-pink-500',
  linkedin: 'bg-blue-700',
  youtube: 'bg-red-600',
  whatsapp: 'bg-green-500',
  sms: 'bg-purple-500',
  email: 'bg-orange-500',
  native: 'bg-slate-500',
};

const statusConfig: Record<CampaignStatus, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: 'Draft', color: 'bg-slate-500/20 text-slate-400', icon: Settings },
  review: { label: 'In Review', color: 'bg-yellow-500/20 text-yellow-400', icon: Eye },
  approved: { label: 'Approved', color: 'bg-blue-500/20 text-blue-400', icon: CheckCircle },
  live: { label: 'Live', color: 'bg-green-500/20 text-green-400', icon: Play },
  paused: { label: 'Paused', color: 'bg-orange-500/20 text-orange-400', icon: Pause },
  closed: { label: 'Closed', color: 'bg-red-500/20 text-red-400', icon: X },
};

const MMCampaignBuilder: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'CMP001',
      name: 'Summer Sale 2025',
      channel: 'facebook',
      status: 'live',
      budget_daily: 500,
      budget_monthly: 15000,
      budget_spent: 4250,
      start_date: '2025-06-01',
      end_date: '2025-06-30',
      target_audience: 'Age 25-45, Business Owners',
      kpi_target: '10,000 leads',
      ab_testing_enabled: true,
      variants: [
        { id: 'V1', name: 'Variant A', headline: 'Save 50% Today!', description: 'Limited time offer', cta: 'Shop Now', impressions: 125000, clicks: 8750, conversions: 350, is_winner: true },
        { id: 'V2', name: 'Variant B', headline: 'Biggest Sale Ever', description: 'Dont miss out', cta: 'Get Deal', impressions: 125000, clicks: 6250, conversions: 225, is_winner: false },
      ],
      created_at: new Date().toISOString(),
    },
    {
      id: 'CMP002',
      name: 'Q3 Lead Generation',
      channel: 'google',
      status: 'draft',
      budget_daily: 300,
      budget_monthly: 9000,
      budget_spent: 0,
      start_date: '2025-07-01',
      end_date: '2025-09-30',
      target_audience: 'Enterprise Decision Makers',
      kpi_target: '500 MQLs',
      ab_testing_enabled: false,
      variants: [],
      created_at: new Date().toISOString(),
    },
  ]);

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiOptimizing, setAiOptimizing] = useState(false);

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    channel: 'facebook' as ChannelType,
    budget_daily: 100,
    budget_monthly: 3000,
    start_date: '',
    end_date: '',
    target_audience: '',
    kpi_target: '',
    ab_testing_enabled: false,
  });

  const handleCreateCampaign = useCallback(async () => {
    if (!newCampaign.name || !newCampaign.start_date) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const campaign: Campaign = {
        id: `CMP${String(campaigns.length + 1).padStart(3, '0')}`,
        ...newCampaign,
        status: 'draft',
        budget_spent: 0,
        variants: [],
        created_at: new Date().toISOString(),
      };

      setCampaigns(prev => [...prev, campaign]);
      setShowCreateModal(false);
      setNewCampaign({
        name: '',
        channel: 'facebook',
        budget_daily: 100,
        budget_monthly: 3000,
        start_date: '',
        end_date: '',
        target_audience: '',
        kpi_target: '',
        ab_testing_enabled: false,
      });
      toast.success('Campaign created as draft');
    } catch (error) {
      toast.error('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  }, [newCampaign, campaigns.length]);

  const handleStatusChange = (campaignId: string, newStatus: CampaignStatus) => {
    setCampaigns(prev => prev.map(c => 
      c.id === campaignId ? { ...c, status: newStatus } : c
    ));
    toast.success(`Campaign status changed to ${newStatus}`);
  };

  const handleAIOptimize = async (campaignId: string) => {
    setAiOptimizing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate AI optimization
      setCampaigns(prev => prev.map(c => {
        if (c.id === campaignId && c.ab_testing_enabled && c.variants.length > 0) {
          const sorted = [...c.variants].sort((a, b) => b.conversions - a.conversions);
          return {
            ...c,
            variants: sorted.map((v, i) => ({ ...v, is_winner: i === 0 })),
          };
        }
        return c;
      }));

      toast.success('AI optimization complete - budget redistributed to winning variant');
    } catch (error) {
      toast.error('Optimization failed');
    } finally {
      setAiOptimizing(false);
    }
  };

  const handleDuplicateCampaign = (campaign: Campaign) => {
    const duplicate: Campaign = {
      ...campaign,
      id: `CMP${String(campaigns.length + 1).padStart(3, '0')}`,
      name: `${campaign.name} (Copy)`,
      status: 'draft',
      budget_spent: 0,
      created_at: new Date().toISOString(),
    };
    setCampaigns(prev => [...prev, duplicate]);
    toast.success('Campaign duplicated');
  };

  const getBudgetProgress = (spent: number, total: number) => {
    return Math.min((spent / total) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-400" />
            Campaign Builder
          </h2>
          <p className="text-slate-400 text-sm">Full lifecycle campaign management with A/B testing</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-5 gap-4">
        {(['draft', 'review', 'approved', 'live', 'paused'] as CampaignStatus[]).map(status => {
          const config = statusConfig[status];
          const count = campaigns.filter(c => c.status === status).length;
          const Icon = config.icon;
          return (
            <Card key={status} className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-bold text-white">{count}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">{config.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        {campaigns.map(campaign => {
          const ChannelIcon = channelIcons[campaign.channel];
          const StatusConfig = statusConfig[campaign.status];
          const budgetPercent = getBudgetProgress(campaign.budget_spent, campaign.budget_monthly);

          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/30 transition-colors">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${channelColors[campaign.channel]}`}>
                        <ChannelIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white flex items-center gap-2">
                          {campaign.name}
                          {campaign.ab_testing_enabled && (
                            <Badge variant="outline" className="text-xs">A/B</Badge>
                          )}
                        </h3>
                        <p className="text-sm text-slate-400">{campaign.channel} • {campaign.target_audience}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge className={StatusConfig.color}>
                            <StatusConfig.icon className="w-3 h-3 mr-1" />
                            {StatusConfig.label}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {campaign.start_date} → {campaign.end_date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {campaign.status === 'draft' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(campaign.id, 'review')}>
                          <Send className="w-3 h-3 mr-1" /> Submit
                        </Button>
                      )}
                      {campaign.status === 'review' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(campaign.id, 'approved')}>
                          <CheckCircle className="w-3 h-3 mr-1" /> Approve
                        </Button>
                      )}
                      {campaign.status === 'approved' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange(campaign.id, 'live')}>
                          <Play className="w-3 h-3 mr-1" /> Go Live
                        </Button>
                      )}
                      {campaign.status === 'live' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleStatusChange(campaign.id, 'paused')}>
                            <Pause className="w-3 h-3 mr-1" /> Pause
                          </Button>
                          {campaign.ab_testing_enabled && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAIOptimize(campaign.id)}
                              disabled={aiOptimizing}
                            >
                              {aiOptimizing ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                              AI Optimize
                            </Button>
                          )}
                        </>
                      )}
                      {campaign.status === 'paused' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange(campaign.id, 'live')}>
                          <Play className="w-3 h-3 mr-1" /> Resume
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => handleDuplicateCampaign(campaign)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedCampaign(campaign)}>
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Budget Progress */}
                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">Budget Spent</span>
                      <span className="text-xs text-white">
                        ${campaign.budget_spent.toLocaleString()} / ${campaign.budget_monthly.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={budgetPercent} 
                      className="h-2"
                    />
                    {budgetPercent >= 90 && (
                      <div className="flex items-center gap-1 mt-2 text-yellow-400 text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        Budget nearly exhausted
                      </div>
                    )}
                  </div>

                  {/* A/B Testing Results */}
                  {campaign.ab_testing_enabled && campaign.variants.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      <p className="text-xs text-slate-400 mb-3">A/B Test Variants</p>
                      <div className="grid grid-cols-2 gap-3">
                        {campaign.variants.map(variant => (
                          <div 
                            key={variant.id} 
                            className={`p-3 rounded-lg ${variant.is_winner ? 'bg-green-500/10 border border-green-500/30' : 'bg-slate-900/50'}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-white text-sm">{variant.name}</span>
                              {variant.is_winner && (
                                <Badge className="bg-green-500/20 text-green-400 text-xs">Winner</Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mb-2">{variant.headline}</p>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div>
                                <p className="text-sm font-bold text-white">{(variant.impressions/1000).toFixed(0)}K</p>
                                <p className="text-[10px] text-slate-500">Impressions</p>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white">{((variant.clicks/variant.impressions)*100).toFixed(1)}%</p>
                                <p className="text-[10px] text-slate-500">CTR</p>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-emerald-400">{variant.conversions}</p>
                                <p className="text-[10px] text-slate-500">Conversions</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Create Campaign Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Create Campaign</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowCreateModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Campaign Name *</Label>
                  <Input
                    value={newCampaign.name}
                    onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    placeholder="e.g., Summer Sale 2025"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>

                <div>
                  <Label>Channel</Label>
                  <Select
                    value={newCampaign.channel}
                    onValueChange={(v: ChannelType) => setNewCampaign({ ...newCampaign, channel: v })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Ads</SelectItem>
                      <SelectItem value="facebook">Facebook / Instagram</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="native">Native Ads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Daily Budget ($)</Label>
                    <Input
                      type="number"
                      value={newCampaign.budget_daily}
                      onChange={e => setNewCampaign({ ...newCampaign, budget_daily: Number(e.target.value) })}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div>
                    <Label>Monthly Budget ($)</Label>
                    <Input
                      type="number"
                      value={newCampaign.budget_monthly}
                      onChange={e => setNewCampaign({ ...newCampaign, budget_monthly: Number(e.target.value) })}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date *</Label>
                    <Input
                      type="date"
                      value={newCampaign.start_date}
                      onChange={e => setNewCampaign({ ...newCampaign, start_date: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={newCampaign.end_date}
                      onChange={e => setNewCampaign({ ...newCampaign, end_date: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <Label>Target Audience</Label>
                  <Input
                    value={newCampaign.target_audience}
                    onChange={e => setNewCampaign({ ...newCampaign, target_audience: e.target.value })}
                    placeholder="e.g., Age 25-45, Business Owners"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>

                <div>
                  <Label>KPI Target</Label>
                  <Input
                    value={newCampaign.kpi_target}
                    onChange={e => setNewCampaign({ ...newCampaign, kpi_target: e.target.value })}
                    placeholder="e.g., 10,000 leads"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Enable A/B Testing</Label>
                  <Switch
                    checked={newCampaign.ab_testing_enabled}
                    onCheckedChange={v => setNewCampaign({ ...newCampaign, ab_testing_enabled: v })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700" 
                    onClick={handleCreateCampaign}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                    Create Campaign
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MMCampaignBuilder;
