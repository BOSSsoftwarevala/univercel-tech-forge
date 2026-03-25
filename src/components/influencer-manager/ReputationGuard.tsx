import { motion } from 'framer-motion';
import { 
  Shield, AlertTriangle, MessageCircle, TrendingDown,
  Eye, Ban, CheckCircle, Star, ThumbsDown, ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const reputationAlerts = [
  { 
    id: 1, 
    influencer: 'user_xyz', 
    type: 'Negative Review',
    platform: 'Twitter',
    sentiment: -0.8,
    content: 'The product quality was disappointing and customer service was unresponsive...',
    timestamp: '10 min ago',
    status: 'new'
  },
  { 
    id: 2, 
    influencer: 'promo_acc', 
    type: 'Brand Misuse',
    platform: 'Instagram',
    sentiment: -0.6,
    content: 'Unauthorized use of brand logo in promotional content...',
    timestamp: '1 hour ago',
    status: 'reviewing'
  },
  { 
    id: 3, 
    influencer: 'test_user', 
    type: 'Spam Reports',
    platform: 'YouTube',
    sentiment: -0.9,
    content: 'Multiple spam reports received for aggressive promotional tactics...',
    timestamp: '3 hours ago',
    status: 'suspended'
  },
];

const sentimentOverview = [
  { platform: 'Instagram', positive: 78, neutral: 15, negative: 7 },
  { platform: 'YouTube', positive: 82, neutral: 12, negative: 6 },
  { platform: 'Twitter', positive: 65, neutral: 20, negative: 15 },
  { platform: 'LinkedIn', positive: 89, neutral: 8, negative: 3 },
];

const ReputationGuard = () => {
  const getSentimentColor = (sentiment: number) => {
    if (sentiment < -0.5) return 'text-red-400';
    if (sentiment < 0) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'suspended':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Suspended</Badge>;
      case 'reviewing':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Reviewing</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">New</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Reputation Management Guard</h2>
          <p className="text-slate-400 mt-1">Monitor social mentions, filter negative feedback, and protect brand image</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Eye className="w-4 h-4 mr-2" />
          Run Full Scan
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Brand Mentions', value: '12,450', change: '+8%', icon: MessageCircle, color: 'purple' },
          { label: 'Positive Sentiment', value: '78%', change: '+3%', icon: ThumbsUp, color: 'emerald' },
          { label: 'Negative Alerts', value: '23', change: '-5', icon: AlertTriangle, color: 'red' },
          { label: 'Suspended Accounts', value: '8', change: '+2', icon: Ban, color: 'orange' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              <span className={`text-xs ${
                stat.change.startsWith('+') && stat.color !== 'red' && stat.color !== 'orange' 
                  ? 'text-emerald-400' 
                  : stat.change.startsWith('-') && (stat.color === 'red' || stat.color === 'orange')
                  ? 'text-emerald-400'
                  : 'text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Reputation Alerts */}
        <div className="col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-red-500/20 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Active Reputation Alerts
              </h3>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                {reputationAlerts.length} Active
              </Badge>
            </div>

            <div className="space-y-4">
              {reputationAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        alert.sentiment < -0.7 ? 'bg-red-500/20' : 'bg-yellow-500/20'
                      }`}>
                        <ThumbsDown className={`w-5 h-5 ${
                          alert.sentiment < -0.7 ? 'text-red-400' : 'text-yellow-400'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{alert.type}</span>
                          {getStatusBadge(alert.status)}
                        </div>
                        <div className="text-xs text-slate-400">
                          @{alert.influencer} • {alert.platform} • {alert.timestamp}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-medium ${getSentimentColor(alert.sentiment)}`}>
                        Sentiment: {alert.sentiment.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 mb-3 line-clamp-2">{alert.content}</p>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      AI Response
                    </Button>
                    {alert.status !== 'suspended' && (
                      <Button size="sm" className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
                        <Ban className="w-4 h-4 mr-1" />
                        Suspend
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sentiment by Platform */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Sentiment by Platform
            </h3>
            <div className="space-y-4">
              {sentimentOverview.map((platform) => (
                <div key={platform.platform}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white">{platform.platform}</span>
                    <span className="text-emerald-400">{platform.positive}% positive</span>
                  </div>
                  <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden flex">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${platform.positive}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-emerald-500"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${platform.neutral}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-slate-500"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${platform.negative}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-red-500"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-4 text-xs">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded" />
                Positive
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-slate-500 rounded" />
                Neutral
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded" />
                Negative
              </span>
            </div>
          </motion.div>

          {/* AI Response Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
          >
            <h3 className="text-lg font-semibold text-white mb-4">AI Response Templates</h3>
            <div className="space-y-2">
              {[
                'Apologetic Response',
                'Clarification Template',
                'Escalation Notice',
                'Resolution Offer',
              ].map((template) => (
                <div
                  key={template}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900/30 hover:bg-slate-900/50 transition-colors cursor-pointer"
                >
                  <span className="text-sm text-slate-300">{template}</span>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Emergency Suspension */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-red-500/20"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Ban className="w-5 h-5 text-red-400" />
              Emergency Actions
            </h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10">
                Freeze All Suspicious Accounts
              </Button>
              <Button variant="outline" className="w-full border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
                Pause Promotional Content
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReputationGuard;
