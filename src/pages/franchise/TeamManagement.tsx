import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, UserPlus, Activity, Clock, Target, 
  Phone, Mail, MoreVertical, TrendingUp, Award
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const TeamManagement = () => {
  const teamMembers = [
    { 
      id: 1, name: 'Rahul Sharma', role: 'Sales Executive', status: 'online',
      leads: 45, conversions: 12, performance: 92, phone: '+91 98765 43210'
    },
    { 
      id: 2, name: 'Priya Patel', role: 'Lead Manager', status: 'online',
      leads: 38, conversions: 15, performance: 98, phone: '+91 98765 43211'
    },
    { 
      id: 3, name: 'Amit Kumar', role: 'Sales Executive', status: 'offline',
      leads: 32, conversions: 8, performance: 78, phone: '+91 98765 43212'
    },
    { 
      id: 4, name: 'Sneha Reddy', role: 'Support Agent', status: 'busy',
      leads: 28, conversions: 10, performance: 85, phone: '+91 98765 43213'
    },
  ];

  const recentActivities = [
    { member: 'Rahul Sharma', action: 'Converted lead #1234', time: '5 min ago', type: 'success' },
    { member: 'Priya Patel', action: 'Added new lead from website', time: '12 min ago', type: 'info' },
    { member: 'Amit Kumar', action: 'Scheduled demo for client', time: '25 min ago', type: 'info' },
    { member: 'Sneha Reddy', action: 'Resolved support ticket #567', time: '1 hour ago', type: 'success' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Management</h1>
          <p className="text-slate-400 mt-1">Manage your team members and track performance</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Members</p>
                <p className="text-xl font-bold text-white">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Online Now</p>
                <p className="text-xl font-bold text-white">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Avg Performance</p>
                <p className="text-xl font-bold text-white">88%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Conversions</p>
                <p className="text-xl font-bold text-white">45</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="bg-slate-800/50 border border-indigo-500/20">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="activity">Live Activity</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card className="bg-slate-800/50 border-indigo-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Team Members</CardTitle>
                  <CardDescription>Manage and monitor your team</CardDescription>
                </div>
                <Input 
                  placeholder="Search members..." 
                  className="w-64 bg-slate-900/50 border-indigo-500/30"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                          member.status === 'online' ? 'bg-emerald-500' : 
                          member.status === 'busy' ? 'bg-orange-500' : 'bg-slate-500'
                        }`} />
                      </div>
                      <div>
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-slate-400 text-sm">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-white font-bold">{member.leads}</p>
                        <p className="text-slate-400 text-xs">Leads</p>
                      </div>
                      <div className="text-center">
                        <p className="text-emerald-400 font-bold">{member.conversions}</p>
                        <p className="text-slate-400 text-xs">Conversions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-indigo-400 font-bold">{member.performance}%</p>
                        <p className="text-slate-400 text-xs">Score</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-slate-800 border-indigo-500/30">
                          <DropdownMenuItem className="text-slate-300 hover:text-white">
                            <Phone className="w-4 h-4 mr-2" /> Call
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-slate-300 hover:text-white">
                            <Mail className="w-4 h-4 mr-2" /> Message
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-slate-300 hover:text-white">
                            <Activity className="w-4 h-4 mr-2" /> View Activity
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="bg-slate-800/50 border-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-white">Live Activity Feed</CardTitle>
              <CardDescription>Real-time updates from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/50"
                  >
                    <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                    <div className="flex-1">
                      <p className="text-white">
                        <span className="font-medium">{activity.member}</span>
                        <span className="text-slate-400 mx-2">—</span>
                        {activity.action}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-sm">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="bg-slate-800/50 border-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-white">Performance Leaderboard</CardTitle>
              <CardDescription>Top performers this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.sort((a, b) => b.performance - a.performance).map((member, idx) => (
                  <div 
                    key={member.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-slate-900/50"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                      idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                      idx === 1 ? 'bg-slate-400/20 text-slate-300' :
                      idx === 2 ? 'bg-orange-600/20 text-orange-400' :
                      'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {idx + 1}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-white font-medium">{member.name}</p>
                      <p className="text-slate-400 text-sm">{member.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {idx === 0 && <Award className="w-5 h-5 text-yellow-400" />}
                      <span className="text-xl font-bold text-white">{member.performance}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagement;
