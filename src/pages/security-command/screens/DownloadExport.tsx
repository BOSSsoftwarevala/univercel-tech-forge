import React from 'react';
import { Download, FileX, Printer, FileSpreadsheet, FileText, Lock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DownloadExport: React.FC = () => {
  const blockedFormats = [
    { format: 'CSV', icon: FileSpreadsheet, blocked: true },
    { format: 'PDF', icon: FileText, blocked: true },
    { format: 'XLS/XLSX', icon: FileSpreadsheet, blocked: true },
    { format: 'JSON', icon: FileText, blocked: true },
    { format: 'Print', icon: Printer, blocked: true },
    { format: 'Save As', icon: Download, blocked: true },
  ];

  const recentBlocks = [
    { time: '5 min ago', role: 'Franchise', action: 'CSV Export attempt', result: 'Blocked' },
    { time: '12 min ago', role: 'Developer', action: 'Print attempt (Ctrl+P)', result: 'Blocked' },
    { time: '28 min ago', role: 'Finance', action: 'PDF download attempt', result: 'Blocked' },
    { time: '45 min ago', role: 'Reseller', action: 'Save page attempt', result: 'Blocked' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Download & Export</h2>
        <p className="text-slate-400">File download and export controls are enforced system-wide</p>
      </div>

      {/* Blocked Formats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {blockedFormats.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="bg-slate-800/50 border-red-500/30">
              <CardContent className="p-4 text-center">
                <div className="relative inline-block mb-2">
                  <Icon className="h-8 w-8 text-slate-400" />
                  <FileX className="h-4 w-4 text-red-400 absolute -bottom-1 -right-1" />
                </div>
                <p className="text-white font-medium">{item.format}</p>
                <Badge variant="outline" className="border-red-500/50 text-red-400 mt-2">
                  Blocked
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Export Policy */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-400" />
            Export Prevention Policy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-white">Blocked Actions</h4>
              <ul className="space-y-2">
                {[
                  'File download buttons disabled',
                  'Browser "Save As" blocked',
                  'Print dialog prevented',
                  'Export to spreadsheet blocked',
                  'API data extraction blocked',
                  'Clipboard export blocked',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-slate-300">
                    <FileX className="h-4 w-4 text-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-white">Technical Implementation</h4>
              <ul className="space-y-2">
                {[
                  'Download attribute removed from links',
                  'Blob URL creation blocked',
                  'File API restricted',
                  '@media print rules disabled',
                  'Ctrl+S intercepted',
                  'Right-click save disabled',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-slate-300">
                    <Lock className="h-4 w-4 text-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Blocked Attempts */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download className="h-5 w-5 text-red-400" />
            Recent Blocked Export Attempts
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
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {recentBlocks.map((block, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-slate-300">{block.time}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {block.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-white">{block.action}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="border-red-500/50 text-red-400">
                        {block.result}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Master Admin Exception Notice */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <div className="flex items-center gap-2 text-amber-400">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Master Admin Exception</span>
        </div>
        <p className="text-sm text-amber-300/80 mt-1">
          Master Admin can view approval screens for export requests. Actual exports require 
          separate offline approval process with audit trail.
        </p>
      </div>
    </div>
  );
};

export default DownloadExport;
