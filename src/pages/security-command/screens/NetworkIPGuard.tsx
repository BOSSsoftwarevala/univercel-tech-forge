import React from 'react';
import { Globe, Shield, Ban, AlertTriangle, MapPin, Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const NetworkIPGuard: React.FC = () => {
  const whitelistedIPs = [
    { ip: '192.168.1.0/24', label: 'Office Network', added: '2 months ago' },
    { ip: '10.0.0.0/16', label: 'VPN Range', added: '1 month ago' },
    { ip: '203.45.67.***', label: 'Admin Access', added: '2 weeks ago' },
  ];

  const blacklistedIPs = [
    { ip: '185.234.***.*', reason: 'Brute force attempts', blocked: '3 days ago' },
    { ip: '91.243.***.*', reason: 'Bot activity', blocked: '1 week ago' },
    { ip: '45.134.***.*', reason: 'Suspicious location', blocked: '2 weeks ago' },
  ];

  const vpnProxyDetections = [
    { time: '10 min ago', ip: '104.28.***.*', type: 'VPN', provider: 'NordVPN', action: 'Flagged' },
    { time: '25 min ago', ip: '162.158.***.*', type: 'Proxy', provider: 'Cloudflare', action: 'Allowed' },
    { time: '1 hour ago', ip: '198.41.***.*', type: 'VPN', provider: 'ExpressVPN', action: 'Blocked' },
  ];

  const countryMismatches = [
    { time: '15 min ago', expected: 'India', detected: 'Russia', role: 'Developer', severity: 'critical' },
    { time: '45 min ago', expected: 'India', detected: 'China', role: 'Franchise', severity: 'high' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Network & IP Guard</h2>
        <p className="text-slate-400">IP whitelist/blacklist, VPN detection, and geo-verification</p>
      </div>

      {/* IP Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Whitelist */}
        <Card className="bg-slate-800/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              IP Whitelist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {whitelistedIPs.map((ip, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div>
                    <span className="font-mono text-green-300">{ip.ip}</span>
                    <p className="text-sm text-slate-400">{ip.label}</p>
                  </div>
                  <Badge variant="outline" className="border-green-500/50 text-green-400">
                    {ip.added}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Blacklist */}
        <Card className="bg-slate-800/50 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Ban className="h-5 w-5 text-red-400" />
              IP Blacklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {blacklistedIPs.map((ip, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div>
                    <span className="font-mono text-red-300">{ip.ip}</span>
                    <p className="text-sm text-slate-400">{ip.reason}</p>
                  </div>
                  <Badge variant="outline" className="border-red-500/50 text-red-400">
                    {ip.blocked}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* VPN/Proxy Detection */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wifi className="h-5 w-5 text-purple-400" />
            VPN / Proxy Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Time</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">IP</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Provider</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {vpnProxyDetections.map((detection, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-slate-300">{detection.time}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{detection.ip}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                        {detection.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-white">{detection.provider}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant="outline" 
                        className={
                          detection.action === 'Blocked' ? 'border-red-500/50 text-red-400' :
                          detection.action === 'Flagged' ? 'border-yellow-500/50 text-yellow-400' :
                          'border-green-500/50 text-green-400'
                        }
                      >
                        {detection.action}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Country Mismatch Alerts */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-400" />
            Country Mismatch Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Time</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Expected</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Detected</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Severity</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {countryMismatches.map((mismatch, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-slate-300">{mismatch.time}</td>
                    <td className="py-3 px-4 text-green-400">{mismatch.expected}</td>
                    <td className="py-3 px-4 text-red-400">{mismatch.detected}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {mismatch.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant="outline" 
                        className={mismatch.severity === 'critical' ? 'border-red-500/50 text-red-400' : 'border-orange-500/50 text-orange-400'}
                      >
                        {mismatch.severity}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                          Block IP
                        </Button>
                        <Button size="sm" variant="outline" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10">
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

export default NetworkIPGuard;
