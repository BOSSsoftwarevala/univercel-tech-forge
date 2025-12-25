import React from 'react';
import { Smartphone, Key, MapPin, AlertTriangle, Fingerprint, MonitorSmartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DeviceSessionBinding: React.FC = () => {
  const boundDevices = [
    { 
      id: 'DEV-001',
      fingerprint: 'a7f3b2c1d4e5...',
      device: 'Chrome on Windows 11',
      lastActive: '2 min ago',
      location: 'Mumbai, IN',
      status: 'active'
    },
    { 
      id: 'DEV-002',
      fingerprint: 'b8g4c3d2e6f7...',
      device: 'Safari on macOS',
      lastActive: '15 min ago',
      location: 'Delhi, IN',
      status: 'active'
    },
    { 
      id: 'DEV-003',
      fingerprint: 'c9h5d4e3f7g8...',
      device: 'Firefox on Ubuntu',
      lastActive: '1 hour ago',
      location: 'Bangalore, IN',
      status: 'idle'
    },
  ];

  const sessionTokens = [
    { token: 'tok_abc123...', created: '10 min ago', expires: '24 hours', status: 'valid' },
    { token: 'tok_def456...', created: '2 hours ago', expires: '22 hours', status: 'valid' },
    { token: 'tok_ghi789...', created: '5 hours ago', expires: '19 hours', status: 'valid' },
  ];

  const locationAlerts = [
    { time: '5 min ago', from: 'Mumbai, IN', to: 'Singapore, SG', role: 'Developer', severity: 'high' },
    { time: '1 hour ago', from: 'Delhi, IN', to: 'Dubai, AE', role: 'Franchise', severity: 'medium' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Device & Session Binding</h2>
        <p className="text-slate-400">Device fingerprints, session tokens, and location monitoring</p>
      </div>

      {/* Device Fingerprints */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-blue-400" />
            Bound Device Fingerprints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Device ID</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Fingerprint</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Device</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Last Active</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Location</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {boundDevices.map((device, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-slate-300 font-mono">{device.id}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-sm">{device.fingerprint}</td>
                    <td className="py-3 px-4 text-white">{device.device}</td>
                    <td className="py-3 px-4 text-slate-300">{device.lastActive}</td>
                    <td className="py-3 px-4 text-slate-300">{device.location}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant="outline" 
                        className={device.status === 'active' ? 'border-green-500/50 text-green-400' : 'border-yellow-500/50 text-yellow-400'}
                      >
                        {device.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Session Tokens */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Key className="h-5 w-5 text-purple-400" />
            Active Session Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Token</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Created</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Expires In</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {sessionTokens.map((session, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-slate-400 font-mono text-sm">{session.token}</td>
                    <td className="py-3 px-4 text-slate-300">{session.created}</td>
                    <td className="py-3 px-4 text-slate-300">{session.expires}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="border-green-500/50 text-green-400">
                        {session.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Location Jump Alerts */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-400" />
            Location Jump Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Time</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">From</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">To</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Severity</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {locationAlerts.map((alert, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-slate-300">{alert.time}</td>
                    <td className="py-3 px-4 text-white">{alert.from}</td>
                    <td className="py-3 px-4 text-red-400">{alert.to}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {alert.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant="outline" 
                        className={alert.severity === 'high' ? 'border-red-500/50 text-red-400' : 'border-yellow-500/50 text-yellow-400'}
                      >
                        {alert.severity}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10">
                          Flag Session
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                          Force Logout
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

      {/* Concurrent Login Detection */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MonitorSmartphone className="h-5 w-5 text-orange-400" />
            Concurrent Login Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-green-400">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">No Concurrent Login Violations Detected</span>
            </div>
            <p className="text-sm text-green-300/80 mt-1">
              All sessions are bound to unique device fingerprints. Duplicate logins are automatically terminated.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceSessionBinding;
