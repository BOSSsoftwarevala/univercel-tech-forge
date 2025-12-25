import React from 'react';
import { Camera, Video, Monitor, AlertTriangle, Eye, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ScreenshotRecording: React.FC = () => {
  const detectionStatus = [
    { label: 'Screenshot Detection', status: 'active', icon: Camera },
    { label: 'Screen Recording Detection', status: 'active', icon: Video },
    { label: 'OS-Level Capture Alerts', status: 'active', icon: Monitor },
    { label: 'PrintScreen Key Block', status: 'active', icon: Camera },
  ];

  const incidents = [
    { 
      id: 'INC-001', 
      time: '10 min ago', 
      type: 'Screenshot', 
      role: 'Developer', 
      device: 'Windows 11',
      status: 'pending',
      severity: 'medium'
    },
    { 
      id: 'INC-002', 
      time: '25 min ago', 
      type: 'Recording', 
      role: 'Franchise', 
      device: 'macOS',
      status: 'escalated',
      severity: 'high'
    },
    { 
      id: 'INC-003', 
      time: '1 hour ago', 
      type: 'Tab Switch', 
      role: 'Reseller', 
      device: 'Linux',
      status: 'reviewed',
      severity: 'low'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Screenshot & Recording</h2>
        <p className="text-slate-400">Detection and prevention of screen capture attempts</p>
      </div>

      {/* Detection Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {detectionStatus.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Icon className="h-5 w-5 text-green-400" />
                  </div>
                  <Badge variant="outline" className="border-green-500/50 text-green-400">
                    {item.status}
                  </Badge>
                </div>
                <p className="text-white font-medium">{item.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detection Methods */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-400" />
            Detection Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-slate-300">PrintScreen key interception</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-slate-300">Tab visibility change detection</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-slate-300">Window focus loss monitoring</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-slate-300">CSS print media blocking</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-slate-300">DevTools screenshot prevention</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-slate-300">Browser extension detection</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incidents Table */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Screenshot/Recording Incidents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">ID</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Time</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Device</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Severity</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-slate-300 font-mono">{incident.id}</td>
                    <td className="py-3 px-4 text-slate-300">{incident.time}</td>
                    <td className="py-3 px-4 text-white">{incident.type}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {incident.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{incident.device}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant="outline" 
                        className={
                          incident.severity === 'high' ? 'border-red-500/50 text-red-400' :
                          incident.severity === 'medium' ? 'border-yellow-500/50 text-yellow-400' :
                          'border-blue-500/50 text-blue-400'
                        }
                      >
                        {incident.severity}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                          Review
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                          Escalate
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScreenshotRecording;
