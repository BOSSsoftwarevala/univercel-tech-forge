import { motion } from 'framer-motion';
import { 
  Users, UserPlus, GraduationCap, Clock, TrendingUp, 
  Calendar, Award, Target, CheckCircle, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const HRDashboard = () => {
  const stats = [
    { label: 'Total Employees', value: '156', change: '+5', icon: Users, color: 'violet' },
    { label: 'Open Positions', value: '8', change: '+2', icon: UserPlus, color: 'cyan' },
    { label: 'In Training', value: '23', change: '-3', icon: GraduationCap, color: 'amber' },
    { label: 'Pending Reviews', value: '12', change: '+4', icon: Clock, color: 'emerald' },
  ];

  const recentHires = [
    { name: 'Anjali Verma', role: 'Frontend Developer', date: '2024-01-15', department: 'Engineering' },
    { name: 'Rajesh Kumar', role: 'Sales Executive', date: '2024-01-12', department: 'Sales' },
    { name: 'Priya Sharma', role: 'HR Associate', date: '2024-01-10', department: 'Human Resources' },
  ];

  const pendingApprovals = [
    { type: 'Hiring Request', candidate: 'Vikram Singh', position: 'DevOps Engineer', requester: 'Tech Lead', priority: 'high' },
    { type: 'Training Enrollment', candidate: 'Team Alpha', position: 'AWS Certification', requester: 'Project Manager', priority: 'medium' },
    { type: 'Hiring Request', candidate: 'Neha Patel', position: 'UX Designer', requester: 'Design Lead', priority: 'high' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">HR Dashboard</h2>
        <p className="text-slate-400">Overview of human resources and hiring activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50 hover:border-violet-500/30 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-${stat.color}-500/20`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                  </div>
                  <Badge variant="outline" className={`text-${stat.color}-400 border-${stat.color}-500/30`}>
                    {stat.change}
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Pending Approvals
              <Badge className="ml-2 bg-amber-500/20 text-amber-400">{pendingApprovals.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingApprovals.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${
                        item.priority === 'high' ? 'border-red-500/30 text-red-400' : 'border-amber-500/30 text-amber-400'
                      }`}>
                        {item.priority}
                      </Badge>
                      <span className="text-sm text-violet-400">{item.type}</span>
                    </div>
                    <h4 className="font-medium text-white mt-1">{item.candidate}</h4>
                    <p className="text-sm text-slate-400">{item.position}</p>
                    <p className="text-xs text-slate-500 mt-1">Requested by: {item.requester}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm hover:bg-emerald-500/30 transition-colors">
                      Approve
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Hires */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-400" />
              Recent Hires
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentHires.map((hire, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <span className="text-violet-400 font-medium">
                      {hire.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm">{hire.name}</h4>
                    <p className="text-xs text-slate-400">{hire.role}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                      {hire.department}
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">{hire.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-violet-400" />
            Hiring Goals by Department
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { dept: 'Engineering', target: 10, filled: 7, color: 'violet' },
              { dept: 'Sales', target: 5, filled: 3, color: 'emerald' },
              { dept: 'Marketing', target: 3, filled: 2, color: 'cyan' },
              { dept: 'Support', target: 4, filled: 4, color: 'amber' },
            ].map((dept, index) => (
              <motion.div
                key={dept.dept}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">{dept.dept}</span>
                  <span className={`text-sm text-${dept.color}-400`}>
                    {dept.filled}/{dept.target}
                  </span>
                </div>
                <Progress value={(dept.filled / dept.target) * 100} className="h-2" />
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>{dept.target - dept.filled} remaining</span>
                  <span>{Math.round((dept.filled / dept.target) * 100)}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRDashboard;
