import React, { useState } from 'react';
import { 
  UserPlus, Users, Briefcase, Calendar, Mail, Phone, MapPin,
  Search, Filter, Star, Clock, CheckCircle, XCircle, FileText,
  GraduationCap, Award, TrendingUp, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockCandidates = [
  { id: 'CAN-001', name: 'John D***', role: 'Full Stack Developer', status: 'interview', score: 85, applied: '2024-01-12', experience: '5 years' },
  { id: 'CAN-002', name: 'Sarah M***', role: 'UI/UX Designer', status: 'screening', score: 78, applied: '2024-01-14', experience: '3 years' },
  { id: 'CAN-003', name: 'Mike R***', role: 'DevOps Engineer', status: 'offer', score: 92, applied: '2024-01-08', experience: '7 years' },
  { id: 'CAN-004', name: 'Emma L***', role: 'Full Stack Developer', status: 'rejected', score: 45, applied: '2024-01-10', experience: '1 year' },
];

const openPositions = [
  { id: 'POS-001', title: 'Senior Full Stack Developer', department: 'Engineering', applicants: 24, status: 'active', priority: 'high' },
  { id: 'POS-002', title: 'UI/UX Designer', department: 'Design', applicants: 12, status: 'active', priority: 'medium' },
  { id: 'POS-003', title: 'DevOps Engineer', department: 'Infrastructure', applicants: 8, status: 'filled', priority: 'high' },
  { id: 'POS-004', title: 'Marketing Manager', department: 'Marketing', applicants: 15, status: 'active', priority: 'low' },
];

const teamMembers = [
  { id: 'EMP-001', name: 'DEV***042', role: 'Developer', department: 'Engineering', joined: '2023-06-15', status: 'active' },
  { id: 'EMP-002', name: 'DES***018', role: 'Designer', department: 'Design', joined: '2023-08-20', status: 'active' },
  { id: 'EMP-003', name: 'CSM***001', role: 'CS Manager', department: 'Support', joined: '2023-04-10', status: 'active' },
];

const hiringMetrics = [
  { label: 'Open Positions', value: 12, icon: Briefcase, color: 'cyan' },
  { label: 'Active Candidates', value: 48, icon: Users, color: 'violet' },
  { label: 'Interviews This Week', value: 8, icon: Calendar, color: 'amber' },
  { label: 'Offers Pending', value: 3, icon: FileText, color: 'emerald' },
];

export function HRHiringScreen() {
  const [activeTab, setActiveTab] = useState('candidates');
  const isDark = true;

  const statusColors = {
    screening: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    interview: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    offer: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    hired: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    filled: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };

  const priorityColors = {
    low: 'text-slate-400',
    medium: 'text-amber-400',
    high: 'text-red-400',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-orange-500" />
            HR & Hiring
          </h1>
          <p className="text-muted-foreground">Recruitment, team management, and onboarding</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1 text-cyan-500 border-cyan-500">
            <Briefcase className="h-3 w-3" />
            {openPositions.filter(p => p.status === 'active').length} Open Roles
          </Badge>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-amber-500">
            <UserPlus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-4">
        {hiringMetrics.map((metric) => (
          <div 
            key={metric.label}
            className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center bg-${metric.color}-500/20`}>
                <metric.icon className={`h-5 w-5 text-${metric.color}-400`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="candidates" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Candidates
            <Badge variant="outline" className="text-[10px]">{mockCandidates.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="positions" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Open Positions
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Team Directory
          </TabsTrigger>
          <TabsTrigger value="onboarding" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Onboarding
          </TabsTrigger>
        </TabsList>

        {/* Candidates View */}
        <TabsContent value="candidates" className="mt-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search candidates..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Status
            </Button>
          </div>

          <div className="space-y-3">
            {mockCandidates.map((candidate) => (
              <div 
                key={candidate.id}
                className={`p-4 rounded-xl border transition-all hover:border-orange-500/50 ${
                  isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      candidate.score >= 80 ? 'bg-emerald-500/20' :
                      candidate.score >= 60 ? 'bg-amber-500/20' : 'bg-red-500/20'
                    }`}>
                      <span className={`font-bold ${
                        candidate.score >= 80 ? 'text-emerald-400' :
                        candidate.score >= 60 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {candidate.score}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{candidate.id}</Badge>
                        <h3 className="font-semibold">{candidate.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{candidate.role}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {candidate.experience}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Applied: {candidate.applied}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColors[candidate.status as keyof typeof statusColors]}>
                      {candidate.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      View Profile
                    </Button>
                    {candidate.status !== 'rejected' && candidate.status !== 'offer' && (
                      <Button size="sm" className="bg-gradient-to-r from-orange-500 to-amber-500">
                        Schedule Interview
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Open Positions View */}
        <TabsContent value="positions" className="mt-4">
          <div className="space-y-3">
            {openPositions.map((position) => (
              <div 
                key={position.id}
                className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                      <Briefcase className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{position.title}</h3>
                        <Star className={`h-4 w-4 ${priorityColors[position.priority as keyof typeof priorityColors]}`} />
                      </div>
                      <p className="text-sm text-muted-foreground">{position.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-lg font-bold">{position.applicants}</p>
                      <p className="text-xs text-muted-foreground">Applicants</p>
                    </div>
                    <Badge className={statusColors[position.status as keyof typeof statusColors]}>
                      {position.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Applicants
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Team Directory View */}
        <TabsContent value="team" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <div 
                key={member.id}
                className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center bg-orange-500/20`}>
                    <Users className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Department</span>
                    <span>{member.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Joined</span>
                    <span>{member.joined}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Onboarding View */}
        <TabsContent value="onboarding" className="mt-4">
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-violet-500" />
              Onboarding Pipeline
            </h3>
            <div className="flex items-center justify-between mb-6">
              {['Offer Accepted', 'Documentation', 'Setup & Access', 'Training', 'Complete'].map((step, idx) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      idx <= 2 ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}>
                      {idx <= 2 ? <CheckCircle className="h-5 w-5 text-white" /> : <span className="text-sm">{idx + 1}</span>}
                    </div>
                    <span className="text-xs mt-2 text-center max-w-[80px]">{step}</span>
                  </div>
                  {idx < 4 && (
                    <div className={`flex-1 h-1 mx-2 ${idx < 2 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Mike R*** - DevOps Engineer</h4>
                  <p className="text-sm text-muted-foreground">Starting: January 20, 2024</p>
                </div>
                <Badge className="bg-cyan-500/20 text-cyan-400">In Progress</Badge>
              </div>
              <Progress value={60} className="h-2 mt-3" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
