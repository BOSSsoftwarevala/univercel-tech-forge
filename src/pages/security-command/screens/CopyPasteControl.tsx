import React from 'react';
import { Copy, ClipboardX, Keyboard, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CopyPasteControl: React.FC = () => {
  const controlStatus = [
    { label: 'Copy Blocked', status: true, description: 'All copy operations intercepted and blocked' },
    { label: 'Paste Blocked', status: true, description: 'All paste operations intercepted and blocked' },
    { label: 'Cut Blocked', status: true, description: 'All cut operations intercepted and blocked' },
    { label: 'Keyboard Intercept', status: true, description: 'Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A blocked' },
    { label: 'Context Menu Disabled', status: true, description: 'Right-click menu completely disabled' },
    { label: 'Drag & Drop Disabled', status: true, description: 'All drag operations prevented' },
  ];

  const recentAttempts = [
    { time: '3 min ago', role: 'Franchise', action: 'Copy attempt', ip: '192.168.1.***' },
    { time: '7 min ago', role: 'Developer', action: 'Ctrl+A attempt', ip: '10.0.0.***' },
    { time: '15 min ago', role: 'Reseller', action: 'Paste attempt', ip: '172.16.0.***' },
    { time: '22 min ago', role: 'Support', action: 'Drag attempt', ip: '192.168.2.***' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Copy / Paste Control</h2>
        <p className="text-slate-400">Clipboard operations are blocked globally across all roles and screens</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {controlStatus.map((control, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {control.status ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                  <span className="font-medium text-white">{control.label}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={control.status ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'}
                >
                  {control.status ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-sm text-slate-400">{control.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scope Information */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Copy className="h-5 w-5 text-blue-400" />
            Enforcement Scope
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900/50 rounded-lg">
              <h4 className="font-medium text-white mb-2">All Roles</h4>
              <p className="text-sm text-slate-400">
                Copy/paste blocking applies to all 28 roles including Master Admin view
              </p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg">
              <h4 className="font-medium text-white mb-2">All Screens</h4>
              <p className="text-sm text-slate-400">
                Every page, dashboard, and component has clipboard protection enabled
              </p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg">
              <h4 className="font-medium text-white mb-2">Exception: Forms</h4>
              <p className="text-sm text-slate-400">
                Text input and textarea fields allow typing but not paste operations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Blocked Attempts */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ClipboardX className="h-5 w-5 text-red-400" />
            Recent Blocked Attempts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Time</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Action</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">IP (Masked)</th>
                </tr>
              </thead>
              <tbody>
                {recentAttempts.map((attempt, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-slate-300">{attempt.time}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {attempt.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-red-400">{attempt.action}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-sm">{attempt.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* No Manual Override Notice */}
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <div className="flex items-center gap-2 text-yellow-400">
          <Keyboard className="h-5 w-5" />
          <span className="font-medium">No Manual Override Available</span>
        </div>
        <p className="text-sm text-yellow-300/80 mt-1">
          Copy/paste controls cannot be disabled. This is a core security feature enforced at the system level.
        </p>
      </div>
    </div>
  );
};

export default CopyPasteControl;
