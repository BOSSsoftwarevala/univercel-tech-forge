import React from 'react';
import { 
  Star, Clock, Zap, Code2, MessageSquare, Shield, 
  CheckCircle, AlertTriangle, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

export function PrimeUserScreen() {
  const isDark = true;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Star className="h-6 w-6 text-amber-500" />
            Prime User Dashboard
          </h1>
          <p className="text-muted-foreground">PRIME***042 • Premium Access</p>
        </div>
        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-lg px-4 py-2">
          <Star className="h-4 w-4 mr-2" />
          PRIME MEMBER
        </Badge>
      </div>

      {/* Priority Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <span className="font-semibold">Response Time SLA</span>
          </div>
          <h3 className="text-3xl font-bold text-amber-500">2 Hours</h3>
          <p className="text-sm text-muted-foreground">Guaranteed response</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="h-5 w-5 text-purple-500" />
            <span className="font-semibold">Dedicated Developer</span>
          </div>
          <h3 className="text-xl font-bold">DEV***089</h3>
          <p className="text-sm text-emerald-500 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Available Now
          </p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-cyan-500" />
            <span className="font-semibold">Priority Level</span>
          </div>
          <h3 className="text-3xl font-bold text-cyan-500">#1</h3>
          <p className="text-sm text-muted-foreground">In queue priority</p>
        </div>
      </div>

      {/* Priority Request Form */}
      <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          Priority Request Form
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Request Type</label>
            <div className="flex flex-wrap gap-2">
              {['Bug Fix', 'New Feature', 'Urgent Support', 'Customization'].map((type) => (
                <Badge key={type} variant="outline" className="cursor-pointer hover:bg-amber-500/20">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Description</label>
            <Textarea placeholder="Describe your request in detail..." rows={4} />
          </div>
          <div className="flex items-center gap-4">
            <Button className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500">
              <Plus className="h-4 w-4 mr-2" />
              Submit Priority Request
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Developer
            </Button>
          </div>
        </div>
      </div>

      {/* Faster Timer Preview */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-cyan-500" />
            Active Request Timer
          </h3>
          <Badge className="bg-emerald-500">Priority Processing</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Bug Fix #REQ-2847</span>
              <Badge variant="outline" className="text-xs">In Progress</Badge>
            </div>
            <div className="text-2xl font-bold font-mono text-cyan-500 mb-2">01:23:45</div>
            <Progress value={65} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">Est. completion: 35 min</p>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Feature #REQ-2846</span>
              <Badge variant="outline" className="text-xs">Queued</Badge>
            </div>
            <div className="text-2xl font-bold font-mono text-muted-foreground mb-2">--:--:--</div>
            <Progress value={0} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">Waiting in queue</p>
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
        <h3 className="font-semibold mb-4">Recent Requests</h3>
        <div className="space-y-3">
          {[
            { id: 'REQ-2845', title: 'Dashboard customization', status: 'completed', time: '2 hours ago' },
            { id: 'REQ-2844', title: 'API integration fix', status: 'completed', time: 'Yesterday' },
            { id: 'REQ-2843', title: 'Report generation', status: 'completed', time: '2 days ago' },
          ].map((req) => (
            <div key={req.id} className={`p-3 rounded-lg flex items-center justify-between ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{req.id}</Badge>
                    <span className="font-medium">{req.title}</span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{req.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
