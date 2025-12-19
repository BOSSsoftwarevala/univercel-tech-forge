import { motion } from 'framer-motion';
import { User, Star, TrendingUp, Clock } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  score: number;
  tasks: number;
  avgTime: string;
  status: 'excellent' | 'good' | 'needs-improvement';
}

const teamMembers: TeamMember[] = [
  { id: '1', name: 'Rajesh Kumar', role: 'Senior Developer', score: 98, tasks: 47, avgTime: '2.3h', status: 'excellent' },
  { id: '2', name: 'Priya Sharma', role: 'Sales Lead', score: 94, tasks: 89, avgTime: '1.8h', status: 'excellent' },
  { id: '3', name: 'Amit Patel', role: 'Support Agent', score: 87, tasks: 156, avgTime: '0.5h', status: 'good' },
  { id: '4', name: 'Neha Singh', role: 'Marketing', score: 82, tasks: 34, avgTime: '4.2h', status: 'good' },
  { id: '5', name: 'Vikram Mehta', role: 'Developer', score: 73, tasks: 28, avgTime: '5.1h', status: 'needs-improvement' },
];

const TeamPerformance = ({ delay = 0 }: { delay?: number }) => {
  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'excellent': return 'bg-neon-green text-neon-green';
      case 'good': return 'bg-neon-cyan text-neon-cyan';
      case 'needs-improvement': return 'bg-neon-orange text-neon-orange';
    }
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-neon-green to-neon-teal';
    if (score >= 75) return 'from-neon-cyan to-neon-blue';
    return 'from-neon-orange to-neon-red';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="glass-panel p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Team Performance</h3>
        <span className="text-xs text-muted-foreground">Top 5 this week</span>
      </div>

      <div className="space-y-3">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + (index * 0.05) }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors"
          >
            {/* Rank */}
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-mono font-bold text-muted-foreground">
              {index + 1}
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-neon-teal/30 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground truncate">{member.name}</span>
                {member.status === 'excellent' && <Star className="w-3 h-3 text-neon-orange fill-neon-orange" />}
              </div>
              <span className="text-xs text-muted-foreground">{member.role}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                <span>{member.tasks}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{member.avgTime}</span>
              </div>
            </div>

            {/* Score */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${member.score}%` }}
                  transition={{ delay: delay + (index * 0.1), duration: 0.5 }}
                  className={`h-full rounded-full bg-gradient-to-r ${getScoreGradient(member.score)}`}
                />
              </div>
              <span className={`font-mono text-xs font-bold ${
                member.score >= 90 ? 'text-neon-green' : 
                member.score >= 75 ? 'text-neon-cyan' : 'text-neon-orange'
              }`}>
                {member.score}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TeamPerformance;