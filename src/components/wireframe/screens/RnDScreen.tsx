import React, { useState } from 'react';
import { 
  Lightbulb, Beaker, Rocket, FileText, MessageSquare, Search, Filter,
  ThumbsUp, ThumbsDown, Clock, CheckCircle, AlertCircle, TrendingUp,
  Calendar, Users, Star, Sparkles, ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockSuggestions = [
  { id: 'S-001', title: 'AI-powered lead scoring', submittedBy: 'DEV***042', votes: 24, status: 'under_review', priority: 'high' },
  { id: 'S-002', title: 'Mobile app for franchises', submittedBy: 'FRA***018', votes: 18, status: 'approved', priority: 'medium' },
  { id: 'S-003', title: 'Blockchain payment integration', submittedBy: 'DEV***089', votes: 12, status: 'research', priority: 'low' },
  { id: 'S-004', title: 'Voice command for dashboards', submittedBy: 'CLI***034', votes: 31, status: 'under_review', priority: 'high' },
  { id: 'S-005', title: 'Multi-language support', submittedBy: 'RES***056', votes: 45, status: 'approved', priority: 'critical' },
];

const roadmapItems = [
  { quarter: 'Q1 2024', items: [
    { title: 'Multi-language Support', status: 'in_progress', progress: 75 },
    { title: 'Advanced Analytics', status: 'completed', progress: 100 },
  ]},
  { quarter: 'Q2 2024', items: [
    { title: 'Mobile Franchise App', status: 'planned', progress: 0 },
    { title: 'AI Lead Scoring', status: 'in_progress', progress: 30 },
  ]},
  { quarter: 'Q3 2024', items: [
    { title: 'Voice Commands', status: 'planned', progress: 0 },
    { title: 'Real-time Collaboration', status: 'planned', progress: 0 },
  ]},
];

const researchProjects = [
  { id: 'R-001', title: 'GPT-5 Integration Feasibility', lead: 'RND***001', status: 'active', daysLeft: 14 },
  { id: 'R-002', title: 'Blockchain for Payments', lead: 'RND***002', status: 'paused', daysLeft: 30 },
  { id: 'R-003', title: 'Edge Computing Benefits', lead: 'RND***001', status: 'completed', daysLeft: 0 },
];

export function RnDScreen() {
  const [activeTab, setActiveTab] = useState('suggestions');
  const isDark = true;

  const statusColors = {
    under_review: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    research: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    in_progress: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    planned: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    active: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    paused: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };

  const priorityColors = {
    low: 'text-slate-400',
    medium: 'text-cyan-400',
    high: 'text-amber-400',
    critical: 'text-red-400',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-sky-500" />
            R&D Innovation Lab
          </h1>
          <p className="text-muted-foreground">Suggestions, roadmap, and research projects</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            {mockSuggestions.length} Suggestions
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 text-emerald-500 border-emerald-500">
            <Rocket className="h-3 w-3" />
            {researchProjects.filter(r => r.status === 'active').length} Active Projects
          </Badge>
          <Button className="bg-gradient-to-r from-sky-500 to-violet-500">
            <Lightbulb className="h-4 w-4 mr-2" />
            Submit Idea
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Suggestions
            <Badge variant="outline" className="text-[10px]">{mockSuggestions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Roadmap
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center gap-2">
            <Beaker className="h-4 w-4" />
            Research
            <Badge variant="outline" className="text-[10px]">{researchProjects.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Team Chat
          </TabsTrigger>
        </TabsList>

        {/* Suggestions View */}
        <TabsContent value="suggestions" className="mt-4">
          {/* Search & Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search suggestions..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Status
            </Button>
          </div>

          {/* Suggestions List */}
          <div className="space-y-3">
            {mockSuggestions.map((suggestion) => (
              <div 
                key={suggestion.id}
                className={`p-4 rounded-xl border transition-all hover:border-sky-500/50 ${
                  isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Vote Section */}
                    <div className={`flex flex-col items-center p-2 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsUp className="h-4 w-4 text-emerald-500" />
                      </Button>
                      <span className="font-bold text-lg">{suggestion.votes}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsDown className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    {/* Content */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{suggestion.id}</Badge>
                        <Badge className={statusColors[suggestion.status as keyof typeof statusColors]}>
                          {suggestion.status.replace('_', ' ')}
                        </Badge>
                        <Star className={`h-4 w-4 ${priorityColors[suggestion.priority as keyof typeof priorityColors]}`} />
                      </div>
                      <h3 className="font-semibold text-lg">{suggestion.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Submitted by {suggestion.submittedBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Discuss
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-sky-500 to-violet-500">
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Roadmap View */}
        <TabsContent value="roadmap" className="mt-4">
          <div className="grid grid-cols-3 gap-4">
            {roadmapItems.map((quarter) => (
              <div 
                key={quarter.quarter}
                className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}
              >
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-sky-500" />
                  {quarter.quarter}
                </h3>
                <div className="space-y-3">
                  {quarter.items.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-lg border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{item.title}</span>
                        <Badge className={statusColors[item.status as keyof typeof statusColors]}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <Progress value={item.progress} className="h-1.5" />
                      <p className="text-xs text-muted-foreground mt-1">{item.progress}% complete</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Research View */}
        <TabsContent value="research" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {researchProjects.map((project) => (
              <div 
                key={project.id}
                className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-cyan-500" />
                    <Badge variant="outline">{project.id}</Badge>
                  </div>
                  <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                    {project.status}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Lead: {project.lead}
                  </span>
                  {project.status !== 'completed' && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {project.daysLeft} days left
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="h-3 w-3 mr-1" />
                    View Report
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-cyan-500 to-sky-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    Open Project
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Team Chat View */}
        <TabsContent value="chat" className="mt-4">
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-violet-500" />
                R&D Team Chat
              </h3>
              <Badge variant="outline">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                3 online
              </Badge>
            </div>
            <div className={`h-64 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-violet-500 mb-2" />
                <p className="text-muted-foreground">Team discussion area</p>
                <p className="text-sm text-violet-400">Masked identities for privacy</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Input placeholder="Type a message..." className="flex-1" />
              <Button className="bg-gradient-to-r from-violet-500 to-sky-500">Send</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Ideas', value: mockSuggestions.length, icon: Lightbulb, color: 'sky' },
          { label: 'Approved', value: mockSuggestions.filter(s => s.status === 'approved').length, icon: CheckCircle, color: 'emerald' },
          { label: 'In Research', value: researchProjects.filter(r => r.status === 'active').length, icon: Beaker, color: 'cyan' },
          { label: 'Shipped', value: 12, icon: Rocket, color: 'violet' },
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
