import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, Search, CheckCircle, XCircle, Clock, 
  FileText, MapPin, Instagram, Youtube, Twitter,
  Filter, Download, MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const applications = [
  { id: 1, name: 'Priya Sharma', email: 'priya@email.com', platform: 'Instagram', followers: '125K', niche: 'Tech', region: 'Mumbai', status: 'pending', verified: false, date: '2024-01-15' },
  { id: 2, name: 'Rahul Verma', email: 'rahul@email.com', platform: 'YouTube', followers: '500K', niche: 'Finance', region: 'Delhi', status: 'approved', verified: true, date: '2024-01-14' },
  { id: 3, name: 'Sneha Patel', email: 'sneha@email.com', platform: 'Twitter', followers: '80K', niche: 'Lifestyle', region: 'Bangalore', status: 'pending', verified: false, date: '2024-01-13' },
  { id: 4, name: 'Amit Kumar', email: 'amit@email.com', platform: 'Instagram', followers: '250K', niche: 'Food', region: 'Chennai', status: 'rejected', verified: false, date: '2024-01-12' },
  { id: 5, name: 'Neha Singh', email: 'neha@email.com', platform: 'YouTube', followers: '1.2M', niche: 'Tech', region: 'Hyderabad', status: 'approved', verified: true, date: '2024-01-11' },
];

const stats = [
  { label: 'Total Applications', value: '1,247', change: '+23%', color: 'purple' },
  { label: 'Pending Review', value: '156', change: '-5%', color: 'yellow' },
  { label: 'Approved', value: '892', change: '+18%', color: 'green' },
  { label: 'Rejected', value: '199', change: '-12%', color: 'red' },
];

const InfluencerOnboarding = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram': return Instagram;
      case 'YouTube': return Youtube;
      case 'Twitter': return Twitter;
      default: return Instagram;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Influencer Onboarding Console</h2>
          <p className="text-slate-400 mt-1">Review applications, verify identities, and approve influencers</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Influencer
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl bg-slate-800/50 border border-${stat.color}-500/20 backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">{stat.label}</span>
              <span className={`text-xs ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name, email, or niche..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-600/50"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={statusFilter === status ? 'bg-purple-500 text-white' : ''}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Applications Table */}
      <div className="rounded-xl bg-slate-800/30 border border-slate-700/50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Applicant</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Platform</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Followers</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Niche</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Region</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {applications.map((app, index) => {
              const PlatformIcon = getPlatformIcon(app.platform);
              return (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-700/20 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white flex items-center gap-2">
                          {app.name}
                          {app.verified && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <div className="text-sm text-slate-400">{app.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <PlatformIcon className="w-4 h-4 text-purple-400" />
                      <span className="text-slate-300">{app.platform}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-300 font-medium">{app.followers}</td>
                  <td className="px-4 py-4">
                    <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                      {app.niche}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {app.region}
                    </div>
                  </td>
                  <td className="px-4 py-4">{getStatusBadge(app.status)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {app.status === 'pending' && (
                        <>
                          <Button size="sm" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 h-8">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 h-8">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" className="h-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InfluencerOnboarding;
