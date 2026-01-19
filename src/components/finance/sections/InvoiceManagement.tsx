/**
 * INVOICE MANAGEMENT SECTION
 * Generate, Auto, Franchise, Reseller, Tax, Credit/Debit Notes
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText,
  FilePlus,
  RefreshCw,
  Building2,
  Users,
  FileCheck,
  FileMinus,
  Search,
  Download,
  Eye,
  Send,
  Printer
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';

interface InvoiceManagementProps {
  activeView: FinanceView;
}

const InvoiceManagement: React.FC<InvoiceManagementProps> = ({ activeView }) => {
  const getTitle = () => {
    switch (activeView) {
      case 'invoice_generate': return 'Generate Invoice';
      case 'invoice_auto': return 'Auto Invoice';
      case 'invoice_franchise': return 'Franchise Invoices';
      case 'invoice_reseller': return 'Reseller Invoices';
      case 'invoice_tax': return 'Tax Invoices';
      case 'invoice_credit_note': return 'Credit Notes';
      case 'invoice_debit_note': return 'Debit Notes';
      default: return 'Invoice Management';
    }
  };

  const invoices = [
    { id: 'INV-2024-001', client: 'Delhi Franchise', amount: '₹1,50,000', date: '15 Jan 2024', dueDate: '30 Jan 2024', status: 'Paid', type: 'Franchise' },
    { id: 'INV-2024-002', client: 'Mumbai Reseller', amount: '₹75,000', date: '14 Jan 2024', dueDate: '29 Jan 2024', status: 'Pending', type: 'Reseller' },
    { id: 'INV-2024-003', client: 'Bangalore Franchise', amount: '₹2,00,000', date: '13 Jan 2024', dueDate: '28 Jan 2024', status: 'Overdue', type: 'Tax' },
    { id: 'INV-2024-004', client: 'Chennai Reseller', amount: '₹50,000', date: '12 Jan 2024', dueDate: '27 Jan 2024', status: 'Paid', type: 'Reseller' },
    { id: 'INV-2024-005', client: 'Pune Franchise', amount: '₹1,25,000', date: '11 Jan 2024', dueDate: '26 Jan 2024', status: 'Partial', type: 'Franchise' },
  ];

  const stats = [
    { label: 'Total Invoiced', value: '₹12.5L', color: 'blue' },
    { label: 'Paid', value: '₹8.2L', color: 'emerald' },
    { label: 'Pending', value: '₹3.1L', color: 'amber' },
    { label: 'Overdue', value: '₹1.2L', color: 'red' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getTitle()}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Create and manage invoices</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="gap-2">
            <FilePlus className="w-4 h-4" />
            New Invoice
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Auto Generate
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search invoices by ID, client, or amount..." className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export All
        </Button>
      </div>

      {/* Generate Invoice Form (for invoice_generate view) */}
      {activeView === 'invoice_generate' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Create New Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Client Type</label>
                <select className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                  <option>Select type</option>
                  <option>Franchise</option>
                  <option>Reseller</option>
                  <option>User</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Client Name</label>
                <Input placeholder="Enter client name" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Amount</label>
                <Input placeholder="₹0.00" type="number" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Due Date</label>
                <Input type="date" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Description</label>
                <Input placeholder="Invoice description..." />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="gap-2">
                <FilePlus className="w-4 h-4" />
                Generate Invoice
              </Button>
              <Button variant="outline" className="gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoices Table */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 font-medium">Invoice ID</th>
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Due Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="text-sm">
                    <td className="py-3 font-mono text-blue-600">{invoice.id}</td>
                    <td className="py-3 font-medium text-slate-900 dark:text-white">{invoice.client}</td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-xs">{invoice.type}</Badge>
                    </td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">{invoice.amount}</td>
                    <td className="py-3 text-slate-500">{invoice.date}</td>
                    <td className="py-3 text-slate-500">{invoice.dueDate}</td>
                    <td className="py-3">
                      <Badge 
                        variant={
                          invoice.status === 'Paid' ? 'default' : 
                          invoice.status === 'Overdue' ? 'destructive' : 
                          'secondary'
                        }
                        className="text-xs"
                      >
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Printer className="w-4 h-4" />
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

export default InvoiceManagement;
