import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Eye,
  Send,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const gstrSummary = {
  gstr1: {
    b2b: 4256000,
    b2c: 1245000,
    exports: 850000,
    nilRated: 125000,
    advances: 45000,
    total: 6521000,
  },
  gstr3b: {
    outputTax: 1173780,
    inputTax: 845230,
    reverseCharge: 28500,
    netPayable: 357050,
  },
};

const filingHistory = [
  { id: 1, return: 'GSTR-1', period: 'Nov 2024', filedOn: '2024-12-10', arn: 'AA2411234567890', status: 'filed' },
  { id: 2, return: 'GSTR-3B', period: 'Nov 2024', filedOn: '2024-12-18', arn: 'AA2411987654321', status: 'filed' },
  { id: 3, return: 'GSTR-1', period: 'Oct 2024', filedOn: '2024-11-11', arn: 'AA2410123456789', status: 'filed' },
  { id: 4, return: 'GSTR-3B', period: 'Oct 2024', filedOn: '2024-11-20', arn: 'AA2410987654321', status: 'filed' },
  { id: 5, return: 'GSTR-9', period: 'FY 2022-23', filedOn: '2024-03-28', arn: 'AA2403123456789', status: 'filed' },
];

const taxLiability = [
  { rate: '5%', taxableValue: 850000, cgst: 21250, sgst: 21250, igst: 0, cess: 0, total: 42500 },
  { rate: '12%', taxableValue: 1250000, cgst: 75000, sgst: 75000, igst: 0, cess: 0, total: 150000 },
  { rate: '18%', taxableValue: 3850000, cgst: 346500, sgst: 346500, igst: 0, cess: 0, total: 693000 },
  { rate: '28%', taxableValue: 571000, cgst: 79940, sgst: 79940, igst: 0, cess: 28550, total: 188430 },
];

const ComplianceReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('gst-summary');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Compliance Reports</h2>
          <p className="text-slate-500">GST summaries and tax return ready reports</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="dec-2024">
            <SelectTrigger className="w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dec-2024">December 2024</SelectItem>
              <SelectItem value="nov-2024">November 2024</SelectItem>
              <SelectItem value="oct-2024">October 2024</SelectItem>
              <SelectItem value="q3-2024">Q3 FY24-25</SelectItem>
              <SelectItem value="fy-2024">FY 2024-25</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Turnover</p>
                <p className="text-2xl font-bold text-slate-900">₹65.21L</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Output Tax</p>
                <p className="text-2xl font-bold text-emerald-600">₹11.74L</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Input Tax Credit</p>
                <p className="text-2xl font-bold text-blue-600">₹8.45L</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <PieChart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Net Payable</p>
                <p className="text-2xl font-bold text-amber-600">₹3.57L</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="gst-summary">GST Summary</TabsTrigger>
          <TabsTrigger value="gstr1">GSTR-1 Report</TabsTrigger>
          <TabsTrigger value="gstr3b">GSTR-3B Report</TabsTrigger>
          <TabsTrigger value="filing-history">Filing History</TabsTrigger>
        </TabsList>

        {/* GST Summary */}
        <TabsContent value="gst-summary" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GSTR-1 Summary */}
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-slate-900">GSTR-1 Summary</CardTitle>
                  <Badge className="bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Ready
                  </Badge>
                </div>
                <CardDescription>Outward supplies summary for December 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">B2B Invoices</span>
                    <span className="font-semibold">₹{(gstrSummary.gstr1.b2b / 100000).toFixed(2)}L</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">B2C (Large)</span>
                    <span className="font-semibold">₹{(gstrSummary.gstr1.b2c / 100000).toFixed(2)}L</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Exports</span>
                    <span className="font-semibold">₹{(gstrSummary.gstr1.exports / 100000).toFixed(2)}L</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Nil Rated / Exempt</span>
                    <span className="font-semibold">₹{(gstrSummary.gstr1.nilRated / 100000).toFixed(2)}L</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                      <span className="font-medium text-indigo-900">Total Outward Supplies</span>
                      <span className="font-bold text-indigo-600">₹{(gstrSummary.gstr1.total / 100000).toFixed(2)}L</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1 gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                  <Button className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* GSTR-3B Summary */}
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-slate-900">GSTR-3B Summary</CardTitle>
                  <Badge className="bg-amber-100 text-amber-700">
                    <Clock className="w-3 h-3 mr-1" />
                    Due: Jan 20
                  </Badge>
                </div>
                <CardDescription>Tax liability summary for December 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="text-sm text-emerald-700">Output Tax Liability</span>
                    <span className="font-semibold text-emerald-700">₹{(gstrSummary.gstr3b.outputTax / 100000).toFixed(2)}L</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-700">Input Tax Credit Available</span>
                    <span className="font-semibold text-blue-700">₹{(gstrSummary.gstr3b.inputTax / 100000).toFixed(2)}L</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm text-purple-700">Reverse Charge Liability</span>
                    <span className="font-semibold text-purple-700">₹{(gstrSummary.gstr3b.reverseCharge / 1000).toFixed(2)}K</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white">
                      <span className="font-medium">Net Tax Payable</span>
                      <span className="text-xl font-bold">₹{(gstrSummary.gstr3b.netPayable / 100000).toFixed(2)}L</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1 gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                  <Button className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <Send className="w-4 h-4" />
                    File Return
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tax Rate Wise Breakup */}
          <Card className="mt-6 bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">Tax Rate-wise Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Rate</TableHead>
                    <TableHead className="text-right">Taxable Value</TableHead>
                    <TableHead className="text-right">CGST</TableHead>
                    <TableHead className="text-right">SGST</TableHead>
                    <TableHead className="text-right">IGST</TableHead>
                    <TableHead className="text-right">Cess</TableHead>
                    <TableHead className="text-right">Total Tax</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxLiability.map((row) => (
                    <TableRow key={row.rate}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">{row.rate}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">₹{row.taxableValue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">₹{row.cgst.toLocaleString()}</TableCell>
                      <TableCell className="text-right">₹{row.sgst.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-slate-400">{row.igst > 0 ? `₹${row.igst.toLocaleString()}` : '-'}</TableCell>
                      <TableCell className="text-right">{row.cess > 0 ? `₹${row.cess.toLocaleString()}` : '-'}</TableCell>
                      <TableCell className="text-right font-semibold text-indigo-600">₹{row.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-slate-50 font-semibold">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">₹65,21,000</TableCell>
                    <TableCell className="text-right">₹5,22,690</TableCell>
                    <TableCell className="text-right">₹5,22,690</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">₹28,550</TableCell>
                    <TableCell className="text-right text-indigo-600">₹10,73,930</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GSTR-1 Report */}
        <TabsContent value="gstr1" className="mt-6">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">GSTR-1 - Outward Supplies Report</CardTitle>
              <CardDescription>Detailed report for GST portal filing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">Generate detailed GSTR-1 report with all invoice data</p>
                <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                  <Download className="w-4 h-4" />
                  Generate GSTR-1 JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GSTR-3B Report */}
        <TabsContent value="gstr3b" className="mt-6">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">GSTR-3B - Monthly Summary Return</CardTitle>
              <CardDescription>Self-declaration of tax liability and ITC</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">Generate GSTR-3B summary for portal filing</p>
                <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                  <Download className="w-4 h-4" />
                  Generate GSTR-3B
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Filing History */}
        <TabsContent value="filing-history" className="mt-6">
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">Filing History</CardTitle>
              <CardDescription>View past return filings and acknowledgements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Return Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Filed On</TableHead>
                    <TableHead>ARN</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filingHistory.map((filing) => (
                    <TableRow key={filing.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">{filing.return}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">{filing.period}</TableCell>
                      <TableCell>{filing.filedOn}</TableCell>
                      <TableCell className="font-mono text-sm text-slate-500">{filing.arn}</TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Filed
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-indigo-600">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceReports;
