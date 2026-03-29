import React, { useState } from 'react';
import { 
  HeartHandshake, Users, MessageSquare, TrendingUp, AlertCircle, CheckCircle,
  Star, Clock, Phone, Mail, Search, Filter, BarChart3, ThumbsUp, ThumbsDown,
  Calendar, ArrowUpRight, FileText, Smile, Frown, Meh
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockCases = [
  { id: 'CS-001', client: 'CLI***042', issue: 'Payment integration not working', severity: 'high', status: 'open', assignedTo: 'CSM***001', created: '2h ago' },
  { id: 'CS-002', client: 'CLI***018', issue: 'Need training on new features', severity: 'medium', status: 'in_progress', assignedTo: 'CSM***002', created: '1d ago' },
  { id: 'CS-003', client: 'CLI***089', issue: 'Slow dashboard loading', severity: 'low', status: 'resolved', assignedTo: 'CSM***001', created: '3d ago' },
  { id: 'CS-004', client: 'CLI***034', issue: 'Feature request for reports', severity: 'low', status: 'open', assignedTo: null, created: '5h ago' },
];

const mockFeedback = [
  { id: 1, client: 'CLI***042', nps: 9, csat: 4.5, comment: 'Great support team!', date: '2024-01-15' },
  { id: 2, client: 'CLI***018', nps: 7, csat: 3.8, comment: 'Response time could be better', date: '2024-01-14' },
  { id: 3, client: 'CLI***089', nps: 10, csat: 5.0, comment: 'Exceeded expectations!', date: '2024-01-13' },
  { id: 4, client: 'CLI***034', nps: 4, csat: 2.5, comment: 'Issue took too long to resolve', date: '2024-01-12' },
];

const healthScores = [
  { client: 'CLI***042', score: 85, trend: 'up', lastContact: '2 days ago', riskLevel: 'healthy' },
  { client: 'CLI***018', score: 62, trend: 'down', lastContact: '1 week ago', riskLevel: 'at_risk' },
  { client: 'CLI***089', score: 92, trend: 'up', lastContact: '1 day ago', riskLevel: 'healthy' },
  { client: 'CLI***034', score: 45, trend: 'down', lastContact: '2 weeks ago', riskLevel: 'critical' },
];

export function ClientSuccessScreen() {
  const [activeTab, setActiveTab] = useState('cases');
  const isDark = true;

  const severityColors = {
    low: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const statusColors = {
    open: 'bg-amber-500/20 text-amber-400',
    in_progress: 'bg-cyan-500/20 text-cyan-400',
    resolved: 'bg-emerald-500/20 text-emerald-400',
    closed: 'bg-slate-500/20 text-slate-400',
  };

  const riskColors = {
    healthy: 'text-emerald-400',
    at_risk: 'text-amber-400',
    critical: 'text-red-400',
  };

  const getNPSIcon = (score: number) => {
    if (score >= 9) return <Smile className="h-4 w-4 text-emerald-400" />;
    if (score >= 7) return <Meh className="h-4 w-4 text-amber-400" />;
    return <Frown className="h-4 w-4 text-red-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HeartHandshake className="h-6 w-6 text-pink-500" />
            Client Success
          </h1>
          <p className="text-muted-foreground">Support cases, feedback, and client health</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1 text-amber-500 border-amber-500">
            <AlertCircle className="h-3 w-3" />
            {mockCases.filter(c => c.status === 'open').length} Open Cases
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 text-emerald-500 border-emerald-500">
            <Star className="h-3 w-3" />
            NPS: 7.5
          </Badge>
          <Button className="bg-gradient-to-r from-pink-500 to-rose-500">
            + New Case
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="cases" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Support Cases
            <Badge variant="outline" className="text-[10px]">{mockCases.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <ThumbsUp className="h-4 w-4" />
            Feedback & NPS
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Client Health
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Communication
          </TabsTrigger>
        </TabsList>

        {/* Support Cases View */}
        <TabsContent value="cases" className="mt-4">
          {/* Search & Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search cases..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Status
            </Button>
          </div>

          {/* Cases List */}
          <div className="space-y-3">
            {mockCases.map((caseItem) => (
              <div 
                key={caseItem.id}
                className={`p-4 rounded-xl border transition-all hover:border-pink-500/50 ${
                  isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <Badge variant="outline" className="text-xs">{caseItem.id}</Badge>
                      <Badge className={severityColors[caseItem.severity as keyof typeof severityColors]}>
                        {caseItem.severity}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold">{caseItem.issue}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {caseItem.client}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {caseItem.created}
                        </span>
                        {caseItem.assignedTo && (
                          <span className="flex items-center gap-1">
                            <HeartHandshake className="h-3 w-3" />
                            {caseItem.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColors[caseItem.status as keyof typeof statusColors]}>
                      {caseItem.status.replace('_', ' ')}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-pink-500 to-rose-500">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Feedback & NPS View */}
        <TabsContent value="feedback" className="mt-4">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-amber-500" />
                <span className="text-sm text-muted-foreground">Average NPS</span>
              </div>
              <div className="text-3xl font-bold text-amber-400">7.5</div>
              <Progress value={75} className="h-2 mt-2" />
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <ThumbsUp className="h-5 w-5 text-emerald-500" />
                <span className="text-sm text-muted-foreground">CSAT Score</span>
              </div>
              <div className="text-3xl font-bold text-emerald-400">4.2/5</div>
              <Progress value={84} className="h-2 mt-2" />
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-cyan-500" />
                <span className="text-sm text-muted-foreground">Response Rate</span>
              </div>
              <div className="text-3xl font-bold text-cyan-400">68%</div>
              <Progress value={68} className="h-2 mt-2" />
            </div>
          </div>

          <div className="space-y-3">
            {mockFeedback.map((feedback) => (
              <div 
                key={feedback.id}
                className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getNPSIcon(feedback.nps)}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{feedback.client}</span>
                        <Badge variant="outline" className="text-xs">{feedback.date}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">"{feedback.comment}"</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">NPS</p>
                      <p className={`font-bold ${feedback.nps >= 9 ? 'text-emerald-400' : feedback.nps >= 7 ? 'text-amber-400' : 'text-red-400'}`}>
                        {feedback.nps}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">CSAT</p>
                      <p className="font-bold text-cyan-400">{feedback.csat}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Client Health View */}
        <TabsContent value="health" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {healthScores.map((client) => (
              <div 
                key={client.client}
                className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      client.riskLevel === 'healthy' ? 'bg-emerald-500/20' :
                      client.riskLevel === 'at_risk' ? 'bg-amber-500/20' : 'bg-red-500/20'
                    }`}>
                      <span className={`text-lg font-bold ${riskColors[client.riskLevel as keyof typeof riskColors]}`}>
                        {client.score}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{client.client}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Last contact: {client.lastContact}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${
                    client.riskLevel === 'healthy' ? 'bg-emerald-500/20 text-emerald-400' :
                    client.riskLevel === 'at_risk' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {client.riskLevel.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-muted-foreground">Health Score</span>
                  <TrendingUp className={`h-4 w-4 ${client.trend === 'up' ? 'text-emerald-400' : 'text-red-400 rotate-180'}`} />
                </div>
                <Progress value={client.score} className="h-2" />
                <div className="flex items-center gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-3 w-3 mr-1" />
                    Schedule Call
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Communication View */}
        <TabsContent value="communication" className="mt-4">
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-pink-500" />
                Client Communication Hub
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-1" />
                  Send Email
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  Schedule
                </Button>
              </div>
            </div>
            <div className={`h-48 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-pink-500 mb-2" />
                <p className="text-muted-foreground">Communication timeline</p>
                <p className="text-sm text-pink-400">All client interactions in one place</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Clients', value: '156', icon: Users, color: 'pink' },
          { label: 'Open Cases', value: mockCases.filter(c => c.status === 'open').length, icon: AlertCircle, color: 'amber' },
          { label: 'Resolved Today', value: '8', icon: CheckCircle, color: 'emerald' },
          { label: 'Avg Response', value: '2.4h', icon: Clock, color: 'cyan' },
        ].map((stat) => (
          <div key={stat.label} className={`p-3 rounded-xl border text-center ${isDark ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-gray-200'}`}>
            <stat.icon className={`h-5 w-5 text-${stat.color}-500 mx-auto mb-1`} />
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
