/**
 * ANALYTICS & LOGS SCREEN
 * Chat transcripts, AI confidence, errors
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search,
  Download,
  MessageSquare,
  Brain,
  AlertTriangle,
  Star,
  Clock,
  User,
  Bot,
  Filter,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface Transcript {
  id: string;
  user: string;
  summary: string;
  date: string;
  duration: string;
  satisfaction: 'positive' | 'negative' | 'neutral';
  resolvedBy: 'bot' | 'human';
}

interface AILog {
  id: string;
  query: string;
  confidence: number;
  response: string;
  time: string;
}

interface ErrorLog {
  id: string;
  type: string;
  message: string;
  time: string;
  resolved: boolean;
}

const transcripts: Transcript[] = [
  { id: '1', user: 'Sarah J.', summary: 'Password reset request - Resolved', date: 'Today, 10:32 AM', duration: '4 min', satisfaction: 'positive', resolvedBy: 'bot' },
  { id: '2', user: 'Rahul S.', summary: 'Billing inquiry - Transferred to agent', date: 'Today, 10:15 AM', duration: '12 min', satisfaction: 'neutral', resolvedBy: 'human' },
  { id: '3', user: 'Emma W.', summary: 'Product question - Resolved', date: 'Today, 09:45 AM', duration: '3 min', satisfaction: 'positive', resolvedBy: 'bot' },
  { id: '4', user: 'Carlos G.', summary: 'Complaint about service', date: 'Yesterday', duration: '18 min', satisfaction: 'negative', resolvedBy: 'human' },
];

const aiLogs: AILog[] = [
  { id: '1', query: 'How do I reset my password?', confidence: 98, response: 'Password reset instructions sent', time: '10:32 AM' },
  { id: '2', query: 'What are your business hours?', confidence: 95, response: 'Business hours information provided', time: '10:28 AM' },
  { id: '3', query: 'I want to cancel my subscription', confidence: 72, response: 'Transferred to human agent', time: '10:15 AM' },
  { id: '4', query: 'asdfghjkl', confidence: 12, response: 'Asked for clarification', time: '10:10 AM' },
];

const errorLogs: ErrorLog[] = [
  { id: '1', type: 'API Timeout', message: 'Translation service timeout after 5s', time: '09:45 AM', resolved: false },
  { id: '2', type: 'Rate Limit', message: 'API rate limit reached (1000 req/min)', time: '09:30 AM', resolved: true },
  { id: '3', type: 'Connection', message: 'WebSocket disconnection detected', time: 'Yesterday', resolved: true },
];

export const CBAnalyticsLogs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics & Logs</h1>
          <p className="text-slate-500 text-sm mt-1">Review conversations and monitor performance</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Chats', value: '1,247', icon: MessageSquare, color: 'blue' },
          { label: 'Avg Confidence', value: '91%', icon: Brain, color: 'violet' },
          { label: 'Positive Feedback', value: '94%', icon: ThumbsUp, color: 'emerald' },
          { label: 'Errors Today', value: '3', icon: AlertTriangle, color: 'orange' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="bg-white border-slate-200 shadow-sm rounded-xl">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="transcripts" className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <TabsList className="bg-slate-100">
            <TabsTrigger value="transcripts">💬 Chat Transcripts</TabsTrigger>
            <TabsTrigger value="ai-logs">🤖 AI Confidence</TabsTrigger>
            <TabsTrigger value="errors">⚠️ Error Logs</TabsTrigger>
            <TabsTrigger value="feedback">⭐ Feedback</TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
        </div>

        {/* Transcripts Tab */}
        <TabsContent value="transcripts">
          <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {transcripts.map((t) => (
                  <div key={t.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                          {t.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-slate-800">{t.user}</span>
                            <Badge variant="outline" className={`text-[10px] ${
                              t.resolvedBy === 'bot' 
                                ? 'bg-blue-50 text-blue-700' 
                                : 'bg-emerald-50 text-emerald-700'
                            }`}>
                              {t.resolvedBy === 'bot' ? <Bot className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                              {t.resolvedBy}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600">{t.summary}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {t.date}
                            </span>
                            <span>• {t.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {t.satisfaction === 'positive' && <ThumbsUp className="w-4 h-4 text-emerald-500" />}
                        {t.satisfaction === 'negative' && <ThumbsDown className="w-4 h-4 text-red-500" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Logs Tab */}
        <TabsContent value="ai-logs">
          <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {aiLogs.map((log) => (
                  <div key={log.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">"{log.query}"</p>
                        <p className="text-sm text-slate-500 mt-1">→ {log.response}</p>
                        <span className="text-xs text-slate-400 mt-2 block">{log.time}</span>
                      </div>
                      <div className="ml-4">
                        <div className={`text-center px-3 py-2 rounded-lg ${
                          log.confidence >= 90 ? 'bg-emerald-50' :
                          log.confidence >= 60 ? 'bg-amber-50' : 'bg-red-50'
                        }`}>
                          <p className={`text-lg font-bold ${
                            log.confidence >= 90 ? 'text-emerald-600' :
                            log.confidence >= 60 ? 'text-amber-600' : 'text-red-600'
                          }`}>{log.confidence}%</p>
                          <p className="text-[10px] text-slate-500">confidence</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Errors Tab */}
        <TabsContent value="errors">
          <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {errorLogs.map((err) => (
                  <div key={err.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        err.resolved ? 'bg-emerald-100' : 'bg-red-100'
                      }`}>
                        <AlertTriangle className={`w-5 h-5 ${
                          err.resolved ? 'text-emerald-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">{err.type}</span>
                          <Badge variant="outline" className={`text-[10px] ${
                            err.resolved ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {err.resolved ? 'Resolved' : 'Active'}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500">{err.message}</p>
                        <span className="text-xs text-slate-400">{err.time}</span>
                      </div>
                    </div>
                    {!err.resolved && (
                      <Button size="sm" variant="outline">Mark Resolved</Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-emerald-600" />
                  Positive Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['Fast response time!', 'Very helpful bot', 'Solved my issue quickly'].map((fb, idx) => (
                  <div key={idx} className="p-3 bg-emerald-50 rounded-lg text-sm text-emerald-800">
                    "{fb}"
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ThumbsDown className="w-5 h-5 text-red-600" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['Bot didn\'t understand my question', 'Took too long to connect to agent'].map((fb, idx) => (
                  <div key={idx} className="p-3 bg-red-50 rounded-lg text-sm text-red-800">
                    "{fb}"
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
