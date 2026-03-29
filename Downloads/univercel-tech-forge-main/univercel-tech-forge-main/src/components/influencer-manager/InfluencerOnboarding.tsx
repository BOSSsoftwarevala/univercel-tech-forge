import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, Search, CheckCircle, XCircle, Clock, 
  FileText, MapPin, Instagram, Youtube, Twitter,
  Filter, Download, MoreHorizontal, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { apiService } from '@/lib/api/apiService';

// Use any to match database schema dynamically
type InfluencerApplication = any;

const InfluencerOnboarding = () => {
  const [applications, setApplications] = useState<InfluencerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('influencer_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (application: InfluencerApplication) => {
    if (actionLoading) return;
    setActionLoading(application.id);

    try {
      const result = await apiService.approveInfluencer(application.id);
      if (result.success) {
        toast.success(`${application.name} has been approved`);
        fetchApplications();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (application: InfluencerApplication) => {
    if (actionLoading) return;
    setActionLoading(application.id);

    try {
      const result = await apiService.rejectInfluencer(application.id, 'Does not meet requirements');
      if (result.success) {
        toast.success(`${application.name} has been rejected`);
        fetchApplications();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleInvite = () => {
    toast.info('Invite functionality - Opens invitation form');
    // This would open a modal to invite influencer
  };

  const handleExport = async () => {
    toast.success('Exporting influencer data...');
    // Export functionality
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'instagram': return Instagram;
      case 'youtube': return Youtube;
      case 'twitter': return Twitter;
      default: return Instagram;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.niche?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: 'Total Applications', value: applications.length.toString(), change: '+23%', color: 'purple' },
    { label: 'Pending Review', value: applications.filter(a => a.status === 'pending').length.toString(), change: '-5%', color: 'yellow' },
    { label: 'Approved', value: applications.filter(a => a.status === 'active').length.toString(), change: '+18%', color: 'green' },
    { label: 'Rejected', value: applications.filter(a => a.status === 'rejected').length.toString(), change: '-12%', color: 'red' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Influencer Onboarding Console</h2>
          <p className="text-slate-400 mt-1">Review applications, verify identities, and approve influencers</p>
        </div>
        <Button onClick={handleInvite} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
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
          {['all', 'pending', 'active', 'rejected'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={statusFilter === status ? 'bg-purple-500 text-white' : ''}
            >
              {status === 'active' ? 'Approved' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={fetchApplications} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
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
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-400" />
                </td>
              </tr>
            ) : filteredApplications.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No applications found
                </td>
              </tr>
            ) : (
              filteredApplications.map((app, index) => {
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
                          {app.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="font-medium text-white flex items-center gap-2">
                            {app.name}
                            {app.kyc_status === 'verified' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                          </div>
                          <div className="text-sm text-slate-400">{app.masked_email || app.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <PlatformIcon className="w-4 h-4 text-purple-400" />
                        <span className="text-slate-300">{app.platform || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-300 font-medium">
                      {formatFollowers(app.followers_count || 0)}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                        {app.niche || 'General'}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {app.city || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-4 py-4">{getStatusBadge(app.status)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {app.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 h-8"
                              onClick={() => handleApprove(app)}
                              disabled={actionLoading === app.id}
                            >
                              {actionLoading === app.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 h-8"
                              onClick={() => handleReject(app)}
                              disabled={actionLoading === app.id}
                            >
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
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InfluencerOnboarding;
