import { motion } from 'framer-motion';
import { Building2, CheckCircle, Clock, XCircle, Ban, TrendingUp, Users, DollarSign } from 'lucide-react';
import type { Franchise } from '@/pages/FranchiseManagement';

interface FranchiseStatsProps {
  franchises: Franchise[];
}

const FranchiseStats = ({ franchises }: FranchiseStatsProps) => {
  const stats = {
    total: franchises.length,
    active: franchises.filter(f => f.status === 'active').length,
    pending: franchises.filter(f => f.status === 'pending').length,
    suspended: franchises.filter(f => f.status === 'suspended').length,
    terminated: franchises.filter(f => f.status === 'terminated').length,
    totalSales: franchises.reduce((sum, f) => sum + f.totalSales, 0),
    avgCommission: franchises.length > 0 
      ? franchises.reduce((sum, f) => sum + f.commission, 0) / franchises.length 
      : 0
  };

  const statCards = [
    {
      label: 'Total Franchises',
      value: stats.total,
      icon: <Building2 className="w-5 h-5" />,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30'
    },
    {
      label: 'Active',
      value: stats.active,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-neon-green',
      bgColor: 'bg-neon-green/10',
      borderColor: 'border-neon-green/30'
    },
    {
      label: 'Pending Approval',
      value: stats.pending,
      icon: <Clock className="w-5 h-5" />,
      color: 'text-neon-orange',
      bgColor: 'bg-neon-orange/10',
      borderColor: 'border-neon-orange/30'
    },
    {
      label: 'Suspended',
      value: stats.suspended,
      icon: <Ban className="w-5 h-5" />,
      color: 'text-neon-red',
      bgColor: 'bg-neon-red/10',
      borderColor: 'border-neon-red/30'
    },
    {
      label: 'Total Sales',
      value: `₹${(stats.totalSales / 100000).toFixed(1)}L`,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-neon-teal',
      bgColor: 'bg-neon-teal/10',
      borderColor: 'border-neon-teal/30'
    },
    {
      label: 'Avg Commission',
      value: `${stats.avgCommission.toFixed(1)}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-neon-purple',
      bgColor: 'bg-neon-purple/10',
      borderColor: 'border-neon-purple/30'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`glass-panel p-4 border ${stat.borderColor}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-mono font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FranchiseStats;
