import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, Award, Trophy, Medal, Star, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const performanceMetrics = [
  { label: 'Conversion Rate', value: '18%', target: '25%', progress: 72 },
  { label: 'Demo-to-Sale Ratio', value: '1:4', target: '1:3', progress: 75 },
  { label: 'Monthly Commission', value: '₹78K', target: '₹1L', progress: 78 },
  { label: 'Active Leads', value: '34', target: '50', progress: 68 },
];

const leaderboard = [
  { rank: 1, name: 'Amit S.', commission: '₹1.45L', badge: 'Gold', icon: Crown },
  { rank: 2, name: 'Priya K.', commission: '₹1.22L', badge: 'Gold', icon: Trophy },
  { rank: 3, name: 'Rahul M.', commission: '₹98K', badge: 'Silver', icon: Medal },
  { rank: 4, name: 'You', commission: '₹78K', badge: 'Silver', icon: Star, isUser: true },
  { rank: 5, name: 'Neha P.', commission: '₹65K', badge: 'Silver', icon: Star },
];

const achievements = [
  { name: 'First Sale', earned: true, icon: '🎯' },
  { name: '10 Conversions', earned: true, icon: '🏆' },
  { name: '₹1L Commission', earned: false, icon: '💰' },
  { name: 'Gold Tier', earned: false, icon: '👑' },
  { name: 'Top 3 Reseller', earned: false, icon: '🥇' },
];

const milestones = [
  { name: 'Bronze Tier', requirement: '₹25K', status: 'completed' },
  { name: 'Silver Tier', requirement: '₹50K', status: 'current' },
  { name: 'Gold Tier', requirement: '₹1L', status: 'locked' },
  { name: 'Platinum Tier', requirement: '₹2L', status: 'locked' },
];

export const ResellerPerformanceBoard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-foreground">Performance Board</h2>
          <p className="text-sm text-muted-foreground">Track your progress and achievements</p>
        </div>
        <Badge className="bg-gradient-to-r from-neon-blue to-primary text-background px-4 py-2">
          <Award className="w-4 h-4 mr-2" />
          Silver Reseller
        </Badge>
      </div>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-panel border-border/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                  <span className="text-xs text-muted-foreground">Target: {metric.target}</span>
                </div>
                <p className="text-2xl font-mono font-bold text-foreground mb-2">{metric.value}</p>
                <Progress value={metric.progress} className="h-2" />
                <p className="text-xs text-right text-muted-foreground mt-1">{metric.progress}%</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <Card className="glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Trophy className="w-5 h-5 text-neon-orange" />
              Monthly Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaderboard.map((user, index) => (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  user.isUser 
                    ? 'bg-neon-blue/10 border border-neon-blue/30' 
                    : 'bg-secondary/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    user.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                    user.rank === 2 ? 'bg-gray-300/20 text-gray-300' :
                    user.rank === 3 ? 'bg-orange-600/20 text-orange-600' :
                    'bg-secondary/50 text-muted-foreground'
                  }`}>
                    <span className="font-mono font-bold text-sm">#{user.rank}</span>
                  </div>
                  <div>
                    <p className={`font-medium ${user.isUser ? 'text-neon-blue' : 'text-foreground'}`}>
                      {user.name}
                    </p>
                    <Badge variant="outline" className="text-xs">{user.badge}</Badge>
                  </div>
                </div>
                <p className="font-mono font-bold text-foreground">{user.commission}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements & Milestones */}
        <div className="space-y-6">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Star className="w-5 h-5 text-neon-purple" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.name}
                    className={`px-4 py-2 rounded-full border ${
                      achievement.earned
                        ? 'bg-neon-green/10 border-neon-green/30'
                        : 'bg-secondary/20 border-border/30 opacity-50'
                    }`}
                    whileHover={{ scale: achievement.earned ? 1.05 : 1 }}
                  >
                    <span className="mr-2">{achievement.icon}</span>
                    <span className={`text-sm ${achievement.earned ? 'text-neon-green' : 'text-muted-foreground'}`}>
                      {achievement.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Target className="w-5 h-5 text-neon-blue" />
                Seller Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.name}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    milestone.status === 'completed' ? 'bg-neon-green/10 border border-neon-green/30' :
                    milestone.status === 'current' ? 'bg-neon-blue/10 border border-neon-blue/30' :
                    'bg-secondary/20 border border-border/30 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      milestone.status === 'completed' ? 'bg-neon-green text-background' :
                      milestone.status === 'current' ? 'bg-neon-blue text-background' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {milestone.status === 'completed' ? '✓' : index + 1}
                    </div>
                    <span className={`font-medium ${
                      milestone.status === 'locked' ? 'text-muted-foreground' : 'text-foreground'
                    }`}>{milestone.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{milestone.requirement}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
