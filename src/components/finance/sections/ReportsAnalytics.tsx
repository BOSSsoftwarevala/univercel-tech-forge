/**
 * REPORTS & ANALYTICS SECTION
 * Daily, Monthly, Yearly Reports, Export
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3,
  Calendar,
  Download,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  RefreshCw
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';

interface ReportsAnalyticsProps {
  activeView: FinanceView;
}

const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({ activeView }) => {
  const getTitle = () => {
    switch (activeView) {
      case 'report_daily': return 'Daily Finance Report';
      case 'report_monthly': return 'Monthly Report';
      case 'report_yearly': return 'Yearly Report';
      case 'report_export': return 'Export Reports';
      default: return 'Reports & Analytics';
    }
  };

  const dailyMetrics = [
    { label: 'Revenue', value: '₹4,56,789', change: '+12.5%', trend: 'up' },
    { label: 'Expenses', value: '₹1,23,456', change: '+5.2%', trend: 'up' },
    { label: 'Net Profit', value: '₹3,33,333', change: '+15.8%', trend: 'up' },
    { label: 'Transactions', value: '1,234', change: '+8.3%', trend: 'up' },
  ];

  const reports = [
    { id: 'RPT001', name: 'Daily Summary - 15 Jan', type: 'Daily', generated: '15 Jan 2024 11:59 PM', size: '2.4 MB', format: 'PDF' },
    { id: 'RPT002', name: 'Weekly Summary - Week 2', type: 'Weekly', generated: '14 Jan 2024 11:59 PM', size: '5.8 MB', format: 'PDF' },
    { id: 'RPT003', name: 'Monthly Report - Dec 2023', type: 'Monthly', generated: '01 Jan 2024 12:00 AM', size: '12.3 MB', format: 'Excel' },
    { id: 'RPT004', name: 'Quarterly Report - Q4 2023', type: 'Quarterly', generated: '01 Jan 2024 12:00 AM', size: '28.5 MB', format: 'PDF' },
    { id: 'RPT005', name: 'Annual Report - 2023', type: 'Annual', generated: '01 Jan 2024 12:00 AM', size: '156.2 MB', format: 'PDF' },
  ];

  const exportFormats = [
    { format: 'PDF', description: 'Portable Document Format', icon: FileSpreadsheet },
    { format: 'Excel', description: 'Microsoft Excel (.xlsx)', icon: FileSpreadsheet },
    { format: 'CSV', description: 'Comma Separated Values', icon: FileSpreadsheet },
    { format: 'JSON', description: 'JavaScript Object Notation', icon: FileSpreadsheet },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getTitle()}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Financial reports and analytics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Daily/Monthly Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {dailyMetrics.map((metric, index) => (
          <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500">{metric.label}</span>
                <Badge 
                  variant={metric.trend === 'up' ? 'default' : 'destructive'} 
                  className="text-[10px]"
                >
                  {metric.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {metric.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Placeholder */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Revenue vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="text-center text-slate-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Interactive chart will render here</p>
              <p className="text-xs">Connect to real data for live visualization</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options (for report_export view) */}
      {activeView === 'report_export' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Export Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {exportFormats.map((format) => {
                const Icon = format.icon;
                return (
                  <div 
                    key={format.format} 
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-slate-900 dark:text-white">{format.format}</span>
                    </div>
                    <p className="text-xs text-slate-500">{format.description}</p>
                    <Button variant="outline" size="sm" className="mt-3 w-full gap-1">
                      <Download className="w-3 h-3" />
                      Export as {format.format}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Reports */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Generated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{report.name}</p>
                    <p className="text-xs text-slate-500">Generated: {report.generated}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{report.type}</Badge>
                  <span className="text-xs text-slate-500">{report.size}</span>
                  <Badge variant="secondary">{report.format}</Badge>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="w-3 h-3" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsAnalytics;
