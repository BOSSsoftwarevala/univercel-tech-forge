import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, Calendar, Target, TrendingUp, Clock, 
  CheckCircle, AlertCircle, Play, Pause, Users,
  ChevronRight, Filter, Search, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const campaigns = [
  {
    id: 1,
    name: 'Winter Sale Mega Push',
    type: 'seasonal',
    category: 'E-Commerce',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    targetClicks: 15000,
    achievedClicks: 12450,
    targetConversions: 750,
    achievedConversions: 612,
    bonus: 5000,
    bonusUnlocked: true
  },
  {
    id: 2,
    name: 'New Year SaaS Launch',
    type: 'launch',
    category: 'CRM Software',
    status: 'active',
    startDate: '2024-01-05',
    endDate: '2024-02-05',
    targetClicks: 10000,
    achievedClicks: 4280,
    targetConversions: 500,
    achievedConversions: 198,
    bonus: 3000,
    bonusUnlocked: false
  },
  {
    id: 3,
    name: 'HR Platform Promotion',
    type: 'promotion',
    category: 'HR Management',
    status: 'paused',
    startDate: '2024-01-10',
    endDate: '2024-02-10',
    targetClicks: 8000,
    achievedClicks: 2100,
    targetConversions: 400,
    achievedConversions: 95,
    bonus: 2000,
    bonusUnlocked: false
  },
  {
    id: 4,
    name: 'Q4 Closing Special',
    type: 'special',
    category: 'All Products',
    status: 'completed',
    startDate: '2023-12-01',
    endDate: '2023-12-31',
    targetClicks: 20000,
    achievedClicks: 22500,
    targetConversions: 1000,
    achievedConversions: 1150,
    bonus: 10000,
    bonusUnlocked: true
  }
];

const availableCampaigns = [
  {
    id: 5,
    name: 'Valentine\'s Day Promo',
    type: 'seasonal',
    category: 'E-Commerce',
    startDate: '2024-02-01',
    endDate: '2024-02-14',
    estimatedEarnings: '₹15,000-25,000',
    difficulty: 'medium'
  },
  {
    id: 6,
    name: 'Budget Software Push',
    type: 'promotion',
    category: 'Accounting',
    startDate: '2024-02-01',
    endDate: '2024-03-31',
    estimatedEarnings: '₹8,000-12,000',
    difficulty: 'easy'
  }
];

const statusConfig = {
  active: { label: 'Active', icon: Play, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  paused: { label: 'Paused', icon: Pause, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
};

const InfluencerCampaignHub = () => {
  const [activeTab, setActiveTab] = useState<'joined' | 'available'>('joined');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCampaigns = campaigns.filter(c => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/20">
              <Megaphone className="w-6 h-6 text-violet-400" />
            </div>
            Campaign Hub
          </h2>
          <p className="text-slate-400 mt-1">Manage your campaigns and discover new opportunities</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('joined')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'joined'
              ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          My Campaigns ({campaigns.length})
        </button>
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'available'
              ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Available ({availableCampaigns.length})
        </button>
      </div>

      {activeTab === 'joined' && (
        <>
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns..."
                className="pl-9 bg-slate-800/50 border-slate-700"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campaign Cards */}
          <div className="grid grid-cols-2 gap-4">
            {filteredCampaigns.map((campaign, index) => {
              const StatusIcon = statusConfig[campaign.status as keyof typeof statusConfig].icon;
              const clickProgress = (campaign.achievedClicks / campaign.targetClicks) * 100;
              const conversionProgress = (campaign.achievedConversions / campaign.targetConversions) * 100;

              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white mb-1">{campaign.name}</h3>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline" className="text-slate-400">
                          {campaign.category}
                        </Badge>
                        <Badge className={statusConfig[campaign.status as keyof typeof statusConfig].color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[campaign.status as keyof typeof statusConfig].label}
                        </Badge>
                      </div>
                    </div>
                    {campaign.bonusUnlocked && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <Sparkles className="w-3 h-3 mr-1" />
                        +₹{campaign.bonus.toLocaleString()}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <Calendar className="w-3 h-3" />
                    <span>{campaign.startDate} → {campaign.endDate}</span>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400">Clicks</span>
                        <span className="text-white">{campaign.achievedClicks.toLocaleString()} / {campaign.targetClicks.toLocaleString()}</span>
                      </div>
                      <Progress value={Math.min(clickProgress, 100)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400">Conversions</span>
                        <span className="text-cyan-400">{campaign.achievedConversions} / {campaign.targetConversions}</span>
                      </div>
                      <Progress value={Math.min(conversionProgress, 100)} className="h-2" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-violet-400" />
                      <span className="text-sm text-slate-400">
                        {conversionProgress >= 100 ? 'Target reached!' : `${Math.round(100 - conversionProgress)}% to target`}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'available' && (
        <div className="space-y-4">
          <p className="text-slate-400">Join new campaigns to expand your earnings</p>
          
          {availableCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-white">{campaign.name}</h3>
                    <Badge variant="outline" className="text-slate-400">{campaign.category}</Badge>
                    <Badge className={
                      campaign.difficulty === 'easy' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }>
                      {campaign.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {campaign.startDate} → {campaign.endDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      Est. earnings: {campaign.estimatedEarnings}
                    </span>
                  </div>
                </div>
                <Button 
                  className="bg-gradient-to-r from-violet-500 to-cyan-500"
                  onClick={() => toast.success(`Joined "${campaign.name}" campaign!`, {
                    description: `Estimated earnings: ${campaign.estimatedEarnings}`
                  })}
                >
                  Join Campaign
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InfluencerCampaignHub;