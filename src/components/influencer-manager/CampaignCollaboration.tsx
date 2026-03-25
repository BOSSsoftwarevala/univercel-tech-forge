import { motion } from 'framer-motion';
import { 
  Users, Calendar, MapPin, Megaphone, Plus,
  Clock, CheckCircle, Star, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const campaigns = [
  { 
    id: 1, 
    name: 'Diwali Mega Sale', 
    type: 'Joint Promotion',
    influencers: 45,
    region: 'Pan India',
    startDate: '2024-10-15',
    endDate: '2024-11-15',
    status: 'active',
    budget: 500000,
    conversions: 12340
  },
  { 
    id: 2, 
    name: 'Tech Launch Event', 
    type: 'Regional Event',
    influencers: 12,
    region: 'Bangalore',
    startDate: '2024-01-20',
    endDate: '2024-01-25',
    status: 'upcoming',
    budget: 150000,
    conversions: 0
  },
  { 
    id: 3, 
    name: 'Summer Fashion Week', 
    type: 'Group Campaign',
    influencers: 28,
    region: 'Mumbai, Delhi',
    startDate: '2024-03-01',
    endDate: '2024-03-15',
    status: 'planning',
    budget: 300000,
    conversions: 0
  },
];

const influencerGroups = [
  { name: 'Tech Reviewers', members: 34, avgRating: 4.8 },
  { name: 'Fashion Influencers', members: 56, avgRating: 4.6 },
  { name: 'Finance Experts', members: 23, avgRating: 4.9 },
  { name: 'Lifestyle Creators', members: 89, avgRating: 4.5 },
];

const CampaignCollaboration = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Upcoming</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Planning</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Campaign Collaboration Desk</h2>
          <p className="text-slate-400 mt-1">Manage influencer groups, joint promotions, and regional events</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Campaigns List */}
        <div className="col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-pink-400" />
              Collaborative Campaigns
            </h3>
            <div className="space-y-4">
              {campaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white">{campaign.name}</h4>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <span className="text-xs text-slate-400">{campaign.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">₹{(campaign.budget / 100000).toFixed(1)}L</div>
                      <span className="text-xs text-slate-400">Budget</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span className="text-slate-300">{campaign.influencers} influencers</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-pink-400" />
                      <span className="text-slate-300">{campaign.region}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-300">{campaign.startDate}</span>
                    </div>
                    {campaign.conversions > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">{campaign.conversions.toLocaleString()} conv</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Manage Team</Button>
                    {campaign.status === 'active' && (
                      <Button size="sm" className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                        Track Performance
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Auto Scheduling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              Auto-Scheduled Posts
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center text-xs text-slate-400 mb-2">{day}</div>
              ))}
              {[...Array(28)].map((_, i) => {
                const hasPost = Math.random() > 0.6;
                const postCount = hasPost ? Math.floor(Math.random() * 5) + 1 : 0;
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                      hasPost 
                        ? postCount > 3 
                          ? 'bg-purple-500/40 text-white' 
                          : 'bg-purple-500/20 text-purple-400'
                        : 'bg-slate-900/30 text-slate-500'
                    }`}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Influencer Groups */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Influencer Groups
              </h3>
              <Button size="sm" variant="ghost">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {influencerGroups.map((group) => (
                <div
                  key={group.name}
                  className="p-3 rounded-lg bg-slate-900/30 border border-slate-700/30 hover:border-purple-500/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white font-medium">{group.name}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-slate-400">{group.avgRating}</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{group.members} members</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Regional Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pink-400" />
              Upcoming Regional Events
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Mumbai Meetup', date: 'Jan 25', attendees: 45 },
                { name: 'Delhi Workshop', date: 'Feb 5', attendees: 32 },
                { name: 'Bangalore Launch', date: 'Feb 15', attendees: 28 },
              ].map((event) => (
                <div
                  key={event.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30"
                >
                  <div>
                    <div className="text-sm text-white">{event.name}</div>
                    <div className="text-xs text-slate-400">{event.date}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-purple-400">
                    <Users className="w-3 h-3" />
                    {event.attendees}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Collaboration Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Active Campaigns</span>
                <span className="text-white font-medium">8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Scheduled Posts</span>
                <span className="text-white font-medium">234</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Participating Influencers</span>
                <span className="text-white font-medium">156</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Reach</span>
                <span className="text-emerald-400 font-medium">2.4M</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCollaboration;
