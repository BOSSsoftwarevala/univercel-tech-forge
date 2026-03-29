import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Activity, Clock, Phone, Mail, MessageSquare, Calendar,
  Eye, MousePointer, FileText, TrendingUp, Filter, RefreshCw
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LeadActivity = () => {
  const [filterMember, setFilterMember] = useState('all');

  const activities = [
    { 
      id: 1, member: 'Rahul Sharma', lead: 'TechCorp Solutions', 
      action: 'Called client', type: 'call', time: '2 min ago',
      details: 'Discussed project requirements, follow-up scheduled for tomorrow',
      status: 'completed'
    },
    { 
      id: 2, member: 'Priya Patel', lead: 'StartUp Hub', 
      action: 'Sent proposal email', type: 'email', time: '15 min ago',
      details: 'Sent detailed proposal with pricing for mobile app development',
      status: 'completed'
    },
    { 
      id: 3, member: 'Amit Kumar', lead: 'Digital Innovations', 
      action: 'Viewing lead profile', type: 'view', time: 'Just now',
      details: 'Currently reviewing lead details and history',
      status: 'in_progress'
    },
    { 
      id: 4, member: 'Sneha Reddy', lead: 'E-Commerce Plus', 
      action: 'Scheduled demo', type: 'meeting', time: '30 min ago',
      details: 'Product demo scheduled for Dec 23, 3:00 PM',
      status: 'completed'
    },
    { 
      id: 5, member: 'Rahul Sharma', lead: 'Cloud Systems', 
      action: 'Added notes', type: 'note', time: '1 hour ago',
      details: 'Client interested in cloud migration, budget approved',
      status: 'completed'
    },
    { 
      id: 6, member: 'Priya Patel', lead: 'RetailMax', 
      action: 'WhatsApp message sent', type: 'message', time: '1.5 hours ago',
      details: 'Shared case study and testimonials',
      status: 'completed'
    },
  ];

  const teamStats = [
    { member: 'Rahul Sharma', calls: 12, emails: 8, meetings: 3, conversions: 2, online: true },
    { member: 'Priya Patel', calls: 8, emails: 15, meetings: 5, conversions: 3, online: true },
    { member: 'Amit Kumar', calls: 6, emails: 5, meetings: 2, conversions: 1, online: true },
    { member: 'Sneha Reddy', calls: 10, emails: 12, meetings: 4, conversions: 2, online: false },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4 text-emerald-400" />;
      case 'email': return <Mail className="w-4 h-4 text-indigo-400" />;
      case 'meeting': return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'view': return <Eye className="w-4 h-4 text-orange-400" />;
      case 'note': return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-pink-400" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Lead Activity Tracker</h1>
          <p className="text-slate-400 mt-1">Monitor team's lead engagement in real-time</p>
        </div>
        <Button variant="outline" className="border-indigo-500/30 text-indigo-300">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Calls Today</p>
                <p className="text-xl font-bold text-white">36</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Emails Sent</p>
                <p className="text-xl font-bold text-white">40</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Meetings</p>
                <p className="text-xl font-bold text-white">14</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Conversions</p>
                <p className="text-xl font-bold text-white">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Activity Feed */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-indigo-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Live Activity Feed
                  </CardTitle>
                  <CardDescription>Real-time lead engagement updates</CardDescription>
                </div>
                <div className="flex gap-3">
                  <Select value={filterMember} onValueChange={setFilterMember}>
                    <SelectTrigger className="w-40 bg-slate-900/50 border-indigo-500/30">
                      <SelectValue placeholder="Filter by member" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-indigo-500/30">
                      <SelectItem value="all">All Members</SelectItem>
                      <SelectItem value="rahul">Rahul Sharma</SelectItem>
                      <SelectItem value="priya">Priya Patel</SelectItem>
                      <SelectItem value="amit">Amit Kumar</SelectItem>
                      <SelectItem value="sneha">Sneha Reddy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {activities.map((activity) => (
                  <div 
                    key={activity.id}
                    className={`p-4 rounded-lg border transition-all ${
                      activity.status === 'in_progress' 
                        ? 'bg-indigo-500/10 border-indigo-500/30 animate-pulse' 
                        : 'bg-slate-900/50 border-transparent hover:border-indigo-500/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-white font-medium">
                            {activity.member}
                            <span className="text-slate-400 font-normal mx-2">—</span>
                            {activity.action}
                          </p>
                          <div className="flex items-center gap-1 text-slate-400 text-sm">
                            <Clock className="w-3 h-3" />
                            {activity.time}
                          </div>
                        </div>
                        <p className="text-indigo-400 text-sm mt-1">Lead: {activity.lead}</p>
                        <p className="text-slate-400 text-sm mt-1">{activity.details}</p>
                        {activity.status === 'in_progress' && (
                          <Badge className="mt-2 bg-orange-500/20 text-orange-400">In Progress</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Performance */}
        <div>
          <Card className="bg-slate-800/50 border-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-white">Team Performance</CardTitle>
              <CardDescription>Today's activity summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamStats.map((member, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-lg bg-slate-900/50"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs">
                            {member.member.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                          member.online ? 'bg-emerald-500' : 'bg-slate-500'
                        }`} />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{member.member}</p>
                        <p className="text-slate-400 text-xs">{member.online ? 'Online' : 'Offline'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="text-white font-bold">{member.calls}</p>
                        <p className="text-slate-500 text-xs">Calls</p>
                      </div>
                      <div>
                        <p className="text-white font-bold">{member.emails}</p>
                        <p className="text-slate-500 text-xs">Emails</p>
                      </div>
                      <div>
                        <p className="text-white font-bold">{member.meetings}</p>
                        <p className="text-slate-500 text-xs">Meets</p>
                      </div>
                      <div>
                        <p className="text-emerald-400 font-bold">{member.conversions}</p>
                        <p className="text-slate-500 text-xs">Won</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeadActivity;
