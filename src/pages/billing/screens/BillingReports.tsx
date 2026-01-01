import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, Calendar, TrendingUp, FileText, Clock } from 'lucide-react';

const reports = [
  { name: 'Revenue Report', desc: 'Monthly revenue breakdown', icon: TrendingUp },
  { name: 'Invoice Aging', desc: 'Outstanding invoice analysis', icon: Clock },
  { name: 'Tax Report', desc: 'Tax collected by region', icon: FileText },
  { name: 'Payment Success', desc: 'Payment gateway performance', icon: BarChart3 },
];

const BillingReports = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-emerald-400" />
        Reports
      </h2>
      <p className="text-slate-400">Financial reports and analytics</p>
    </div>

    <div className="grid grid-cols-2 gap-4">
      {reports.map((report) => (
        <Card key={report.name} className="bg-slate-900/50 border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer">
          <CardContent className="p-6">
            <report.icon className="w-10 h-10 text-emerald-400 mb-4" />
            <h3 className="font-semibold text-white text-lg">{report.name}</h3>
            <p className="text-sm text-slate-400 mt-1">{report.desc}</p>
            <Button variant="outline" size="sm" className="mt-4 border-slate-600">
              <Download className="w-3 h-3 mr-2" />
              Generate
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default BillingReports;
