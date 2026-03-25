import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, Settings, Download, Calculator, FileText, 
  TrendingUp, AlertTriangle, CheckCircle, DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';

interface PayrollRecord {
  id: string;
  employee: string;
  employeeId: string;
  department: string;
  basic: number;
  hra: number;
  allowances: number;
  grossSalary: number;
  pf: number;
  tax: number;
  deductions: number;
  netSalary: number;
  status: 'processed' | 'pending' | 'hold';
}

const payrollData: PayrollRecord[] = [
  { id: '1', employee: 'Rajesh Kumar', employeeId: 'EMP001', department: 'Engineering', basic: 80000, hra: 32000, allowances: 15000, grossSalary: 127000, pf: 9600, tax: 18000, deductions: 27600, netSalary: 99400, status: 'processed' },
  { id: '2', employee: 'Priya Sharma', employeeId: 'EMP002', department: 'HR', basic: 60000, hra: 24000, allowances: 10000, grossSalary: 94000, pf: 7200, tax: 10000, deductions: 17200, netSalary: 76800, status: 'processed' },
  { id: '3', employee: 'Amit Verma', employeeId: 'EMP003', department: 'Sales', basic: 55000, hra: 22000, allowances: 8000, grossSalary: 85000, pf: 6600, tax: 8000, deductions: 14600, netSalary: 70400, status: 'pending' },
  { id: '4', employee: 'Neha Gupta', employeeId: 'EMP004', department: 'Marketing', basic: 50000, hra: 20000, allowances: 7000, grossSalary: 77000, pf: 6000, tax: 6000, deductions: 12000, netSalary: 65000, status: 'hold' },
];

const salaryComponents = [
  { name: 'Basic', value: 45, color: '#8b5cf6' },
  { name: 'HRA', value: 25, color: '#3b82f6' },
  { name: 'Allowances', value: 15, color: '#10b981' },
  { name: 'Bonus', value: 10, color: '#f59e0b' },
  { name: 'Others', value: 5, color: '#6366f1' },
];

const deductionRules = [
  { name: 'Provident Fund (PF)', percentage: '12%', description: 'Employee + Employer contribution' },
  { name: 'Professional Tax', amount: '₹200/month', description: 'State-specific tax' },
  { name: 'Income Tax (TDS)', percentage: 'As per slab', description: 'Based on annual income' },
  { name: 'ESI', percentage: '0.75%', description: 'If gross < ₹21,000' },
  { name: 'Loan Recovery', amount: 'Variable', description: 'If applicable' },
];

const statusConfig = {
  processed: { label: 'Processed', color: 'bg-emerald-100 text-emerald-700' },
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  hold: { label: 'On Hold', color: 'bg-red-100 text-red-700' },
};

export default function CorporatePayroll() {
  const [selectedMonth, setSelectedMonth] = useState('january_2025');

  const totalPayroll = payrollData.reduce((sum, p) => sum + p.netSalary, 0);
  const totalDeductions = payrollData.reduce((sum, p) => sum + p.deductions, 0);
  const processedCount = payrollData.filter(p => p.status === 'processed').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Wallet className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Payroll</p>
                <p className="text-xl font-bold text-slate-900">₹{(totalPayroll / 100000).toFixed(1)}L</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Deductions</p>
                <p className="text-xl font-bold text-slate-900">₹{(totalDeductions / 100000).toFixed(1)}L</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Processed</p>
                <p className="text-xl font-bold text-slate-900">{processedCount}/{payrollData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Pending Review</p>
                <p className="text-xl font-bold text-slate-900">{payrollData.length - processedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payroll" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="payroll" className="gap-2">
              <Wallet className="w-4 h-4" />
              Payroll Processing
            </TabsTrigger>
            <TabsTrigger value="structure" className="gap-2">
              <Calculator className="w-4 h-4" />
              Salary Structure
            </TabsTrigger>
            <TabsTrigger value="compliance" className="gap-2">
              <FileText className="w-4 h-4" />
              Tax & Compliance
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="january_2025">January 2025</SelectItem>
                <SelectItem value="december_2024">December 2024</SelectItem>
                <SelectItem value="november_2024">November 2024</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Payroll Processing Tab */}
        <TabsContent value="payroll">
          <Card className="border-0 shadow-md">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Employee</TableHead>
                    <TableHead className="font-semibold">Basic</TableHead>
                    <TableHead className="font-semibold">HRA</TableHead>
                    <TableHead className="font-semibold">Allowances</TableHead>
                    <TableHead className="font-semibold">Gross</TableHead>
                    <TableHead className="font-semibold">Deductions</TableHead>
                    <TableHead className="font-semibold">Net Salary</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollData.map((record, index) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">{record.employee}</p>
                          <p className="text-xs text-slate-500">{record.employeeId} • {record.department}</p>
                        </div>
                      </TableCell>
                      <TableCell>₹{record.basic.toLocaleString()}</TableCell>
                      <TableCell>₹{record.hra.toLocaleString()}</TableCell>
                      <TableCell>₹{record.allowances.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">₹{record.grossSalary.toLocaleString()}</TableCell>
                      <TableCell className="text-red-600">-₹{record.deductions.toLocaleString()}</TableCell>
                      <TableCell className="font-bold text-emerald-600">₹{record.netSalary.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={statusConfig[record.status].color}>
                          {statusConfig[record.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="w-3 h-3" />
                          Payslip
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Salary Structure Tab */}
        <TabsContent value="structure">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Salary Components Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salaryComponents}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {salaryComponents.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {salaryComponents.map((comp) => (
                    <div key={comp.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: comp.color }} />
                      <span className="text-sm text-slate-600">{comp.name}</span>
                      <span className="text-sm font-medium ml-auto">{comp.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Deduction Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {deductionRules.map((rule, index) => (
                  <motion.div
                    key={rule.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{rule.name}</p>
                        <p className="text-sm text-slate-500">{rule.description}</p>
                      </div>
                      <Badge variant="outline" className="font-mono">
                        {rule.percentage || rule.amount}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-violet-500" />
                  Statutory Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'PF Returns', due: 'Jan 15, 2025', status: 'pending' },
                  { name: 'ESI Returns', due: 'Jan 15, 2025', status: 'pending' },
                  { name: 'TDS Filing', due: 'Jan 7, 2025', status: 'completed' },
                  { name: 'PT Payment', due: 'Jan 10, 2025', status: 'completed' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">Due: {item.due}</p>
                    </div>
                    <Badge className={item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                      {item.status === 'completed' ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-violet-500" />
                  Tax Slab Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { range: 'Up to ₹2.5L', rate: '0%' },
                  { range: '₹2.5L - ₹5L', rate: '5%' },
                  { range: '₹5L - ₹7.5L', rate: '10%' },
                  { range: '₹7.5L - ₹10L', rate: '15%' },
                  { range: '₹10L - ₹12.5L', rate: '20%' },
                  { range: 'Above ₹12.5L', rate: '30%' },
                ].map((slab, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                    <span className="text-slate-600">{slab.range}</span>
                    <span className="font-mono font-medium text-slate-900">{slab.rate}</span>
                  </div>
                ))}
                <p className="text-xs text-slate-400 mt-2">* New Tax Regime FY 2024-25</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
