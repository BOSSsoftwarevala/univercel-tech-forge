import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Percent, Globe, FileText, Download } from 'lucide-react';

const taxRules = [
  { country: 'India', code: 'IN', taxName: 'GST', rate: 18, status: 'active' },
  { country: 'United States', code: 'US', taxName: 'Sales Tax', rate: 8.5, status: 'active' },
  { country: 'United Kingdom', code: 'GB', taxName: 'VAT', rate: 20, status: 'active' },
  { country: 'Germany', code: 'DE', taxName: 'VAT', rate: 19, status: 'active' },
];

const TaxesScreen = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <Percent className="w-6 h-6 text-emerald-400" />
        Taxes & Compliance
      </h2>
      <p className="text-slate-400">Manage tax rules and compliance settings</p>
    </div>

    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg text-white">Country Tax Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {taxRules.map((rule) => (
            <div key={rule.code} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-medium text-white">{rule.country}</p>
                  <p className="text-sm text-slate-400">{rule.taxName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-emerald-500/20 text-emerald-400">{rule.rate}%</Badge>
                <Button variant="outline" size="sm" className="border-slate-600">Edit</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <div className="flex gap-4">
      <Button variant="outline" className="border-slate-600">
        <FileText className="w-4 h-4 mr-2" />
        Tax Report
      </Button>
      <Button variant="outline" className="border-slate-600">
        <Download className="w-4 h-4 mr-2" />
        Export Compliance
      </Button>
    </div>
  </div>
);

export default TaxesScreen;
