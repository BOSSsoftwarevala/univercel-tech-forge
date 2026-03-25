/**
 * COMPLIANCE & TAX SECTION
 * GST/VAT, TDS, Country-wise Tax, Audit Reports
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Scale,
  FileCheck,
  FileMinus,
  Globe,
  FileSpreadsheet,
  Search,
  Download,
  Eye,
  Calculator,
  CheckCircle
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';

interface ComplianceTaxProps {
  activeView: FinanceView;
}

const ComplianceTax: React.FC<ComplianceTaxProps> = ({ activeView }) => {
  const getTitle = () => {
    switch (activeView) {
      case 'tax_gst_vat': return 'GST / VAT';
      case 'tax_tds': return 'TDS / Withholding';
      case 'tax_country_wise': return 'Country-wise Tax';
      case 'tax_audit_reports': return 'Audit Ready Reports';
      default: return 'Compliance & Tax';
    }
  };

  const taxRecords = [
    { id: 'TAX001', type: 'GST', period: 'Jan 2024', collected: '₹15,00,000', paid: '₹12,00,000', pending: '₹3,00,000', dueDate: '20 Feb 2024', status: 'Pending' },
    { id: 'TAX002', type: 'TDS', period: 'Dec 2023', collected: '₹2,50,000', paid: '₹2,50,000', pending: '₹0', dueDate: '07 Jan 2024', status: 'Filed' },
    { id: 'TAX003', type: 'VAT', period: 'Q4 2023', collected: '₹8,00,000', paid: '₹8,00,000', pending: '₹0', dueDate: '31 Jan 2024', status: 'Filed' },
    { id: 'TAX004', type: 'GST', period: 'Dec 2023', collected: '₹18,00,000', paid: '₹18,00,000', pending: '₹0', dueDate: '20 Jan 2024', status: 'Filed' },
  ];

  const countryTax = [
    { country: 'India', taxType: 'GST', rate: '18%', collected: '₹45L', status: 'Compliant' },
    { country: 'USA', taxType: 'Sales Tax', rate: 'Varies', collected: '$12K', status: 'Compliant' },
    { country: 'UK', taxType: 'VAT', rate: '20%', collected: '£8K', status: 'Compliant' },
    { country: 'UAE', taxType: 'VAT', rate: '5%', collected: 'AED 15K', status: 'Review' },
    { country: 'Singapore', taxType: 'GST', rate: '9%', collected: 'SGD 5K', status: 'Compliant' },
  ];

  const auditReports = [
    { id: 'AUD001', name: 'Annual Tax Report 2023', type: 'Annual', generated: '15 Jan 2024', status: 'Ready' },
    { id: 'AUD002', name: 'GST Reconciliation Q4', type: 'Quarterly', generated: '10 Jan 2024', status: 'Ready' },
    { id: 'AUD003', name: 'TDS Compliance Report', type: 'Monthly', generated: '05 Jan 2024', status: 'Ready' },
    { id: 'AUD004', name: 'International Tax Summary', type: 'Quarterly', generated: '01 Jan 2024', status: 'Ready' },
  ];

  const stats = [
    { label: 'Total Tax Collected', value: '₹43.5L', icon: Calculator },
    { label: 'Tax Filed', value: '₹40.5L', icon: FileCheck },
    { label: 'Pending Filing', value: '₹3L', icon: FileMinus },
    { label: 'Compliance Rate', value: '98%', icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Scale className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getTitle()}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tax compliance and reporting</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button size="sm" className="gap-2">
            <FileCheck className="w-4 h-4" />
            File Return
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Country-wise Tax (for tax_country_wise view) */}
      {activeView === 'tax_country_wise' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              Country-wise Tax Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-3 font-medium">Country</th>
                    <th className="pb-3 font-medium">Tax Type</th>
                    <th className="pb-3 font-medium">Rate</th>
                    <th className="pb-3 font-medium">Collected</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {countryTax.map((tax, index) => (
                    <tr key={index} className="text-sm">
                      <td className="py-3 font-medium text-slate-900 dark:text-white">{tax.country}</td>
                      <td className="py-3 text-slate-500">{tax.taxType}</td>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{tax.rate}</td>
                      <td className="py-3 text-slate-900 dark:text-white">{tax.collected}</td>
                      <td className="py-3">
                        <Badge variant={tax.status === 'Compliant' ? 'default' : 'secondary'}>{tax.status}</Badge>
                      </td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit Reports (for tax_audit_reports view) */}
      {activeView === 'tax_audit_reports' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
              Audit Ready Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{report.name}</p>
                      <p className="text-xs text-slate-500">Generated: {report.generated}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{report.type}</Badge>
                    <Badge variant="default">{report.status}</Badge>
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
      )}

      {/* Tax Records Table */}
      {(activeView === 'tax_gst_vat' || activeView === 'tax_tds') && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search tax records..." className="pl-10" />
          </div>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Tax Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                      <th className="pb-3 font-medium">ID</th>
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium">Period</th>
                      <th className="pb-3 font-medium">Collected</th>
                      <th className="pb-3 font-medium">Paid</th>
                      <th className="pb-3 font-medium">Pending</th>
                      <th className="pb-3 font-medium">Due Date</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {taxRecords.map((record) => (
                      <tr key={record.id} className="text-sm">
                        <td className="py-3 font-mono text-slate-600 dark:text-slate-300">{record.id}</td>
                        <td className="py-3">
                          <Badge variant="outline">{record.type}</Badge>
                        </td>
                        <td className="py-3 text-slate-900 dark:text-white">{record.period}</td>
                        <td className="py-3 text-slate-900 dark:text-white">{record.collected}</td>
                        <td className="py-3 text-emerald-600">{record.paid}</td>
                        <td className="py-3 text-amber-600">{record.pending}</td>
                        <td className="py-3 text-slate-500">{record.dueDate}</td>
                        <td className="py-3">
                          <Badge variant={record.status === 'Filed' ? 'default' : 'secondary'}>{record.status}</Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Download className="w-4 h-4" />
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
        </>
      )}
    </div>
  );
};

export default ComplianceTax;
