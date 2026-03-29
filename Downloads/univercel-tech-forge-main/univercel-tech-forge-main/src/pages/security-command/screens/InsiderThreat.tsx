import React from 'react';
import { UserX, Brain, AlertTriangle, Flag, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const InsiderThreat: React.FC = () => {
  const behaviorAnomalies = [
    { 
      id: 'THR-001',
      role: 'Developer',
      maskedId: 'DEV-****234',
      behavior: 'Excessive access attempts',
      riskScore: 85,
      confidence: 92,
      status: 'flagged'
    },
    { 
      id: 'THR-002',
      role: 'Franchise',
      maskedId: 'FRA-****567',
      behavior: 'Unusual data access pattern',
      riskScore: 67,
      confidence: 78,
      status: 'monitoring'
    },
    { 
      id: 'THR-003',
      role: 'Reseller',
      maskedId: 'RES-****890',
      behavior: 'Repeated login failures',
      riskScore: 45,
      confidence: 88,
      status: 'cleared'
    },
  ];

  const aiSignals = [
    { type: 'Behavior Deviation', count: 12, trend: 'up' },
    { type: 'Access Anomalies', count: 8, trend: 'stable' },
    { type: 'Pattern Violations', count: 3, trend: 'down' },
    { type: 'Time Anomalies', count: 5, trend: 'up' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Insider Threat</h2>
        <p className="text-slate-400">AI-powered detection of abnormal role behavior and access patterns</p>
      </div>

      {/* AI Signal Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {aiSignals.map((signal, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Brain className="h-5 w-5 text-purple-400" />
                <TrendingUp className={`h-4 w-4 ${
                  signal.trend === 'up' ? 'text-red-400' :
                  signal.trend === 'down' ? 'text-green-400' :
                  'text-yellow-400'
                }`} />
              </div>
              <p className="text-2xl font-bold text-white">{signal.count}</p>
              <p className="text-sm text-slate-400">{signal.type}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Behavior Anomalies Table */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserX className="h-5 w-5 text-red-400" />
            Detected Behavior Anomalies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {behaviorAnomalies.map((anomaly, index) => (
              <div key={index} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400">{anomaly.id}</span>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          {anomaly.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">ID: {anomaly.maskedId}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={
                      anomaly.status === 'flagged' ? 'border-red-500/50 text-red-400' :
                      anomaly.status === 'monitoring' ? 'border-yellow-500/50 text-yellow-400' :
                      'border-green-500/50 text-green-400'
                    }
                  >
                    {anomaly.status}
                  </Badge>
                </div>

                <p className="text-white mb-4">{anomaly.behavior}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-400">Risk Score</span>
                      <span className={`text-sm font-medium ${
                        anomaly.riskScore >= 70 ? 'text-red-400' :
                        anomaly.riskScore >= 40 ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>{anomaly.riskScore}%</span>
                    </div>
                    <Progress 
                      value={anomaly.riskScore} 
                      className={`h-2 ${
                        anomaly.riskScore >= 70 ? '[&>div]:bg-red-500' :
                        anomaly.riskScore >= 40 ? '[&>div]:bg-yellow-500' :
                        '[&>div]:bg-green-500'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-400">AI Confidence</span>
                      <span className="text-sm font-medium text-purple-400">{anomaly.confidence}%</span>
                    </div>
                    <Progress value={anomaly.confidence} className="h-2 [&>div]:bg-purple-500" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10">
                    <Flag className="h-3 w-3 mr-1" />
                    Flag
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Escalate
                  </Button>
                  <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                    <Activity className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Detection Methods */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            AI Detection Signals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Abnormal access time patterns',
              'Unusual data volume access',
              'Repeated permission escalation attempts',
              'Login from suspicious locations',
              'Bulk data query patterns',
              'Credential sharing indicators',
              'Session hijacking attempts',
              'Role permission abuse',
              'After-hours activity spikes',
            ].map((signal, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <Brain className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-purple-200">{signal}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsiderThreat;
