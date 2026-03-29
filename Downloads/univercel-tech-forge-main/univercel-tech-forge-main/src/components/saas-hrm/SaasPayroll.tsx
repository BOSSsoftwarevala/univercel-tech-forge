import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Download,
  Send,
  FileText,
  Building,
  Calculator,
  TrendingUp,
  Users,
  Calendar,
  Check,
  Clock,
  AlertCircle,
  Filter,
  Search,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const payrollSummary = {
  totalPayroll: 285000,
  processed: 245000,
  pending: 40000,
  employees: 156,
  processingRate: 86
};

const employeePayroll = [
  { id: '1', name: 'Sarah Johnson', avatar: 'SJ', department: 'Engineering', baseSalary: 8500, bonus: 1200, deductions: 850, netPay: 8850, status: 'processed' },
  { id: '2', name: 'Mike Chen', avatar: 'MC', department: 'Sales', baseSalary: 7200, bonus: 2500, deductions: 720, netPay: 8980, status: 'processed' },
  { id: '3', name: 'Emma Davis', avatar: 'ED', department: 'Marketing', baseSalary: 6800, bonus: 500, deductions: 680, netPay: 6620, status: 'pending' },
  { id: '4', name: 'Alex Wilson', avatar: 'AW', department: 'HR', baseSalary: 6200, bonus: 0, deductions: 620, netPay: 5580, status: 'pending' },
  { id: '5', name: 'Lisa Brown', avatar: 'LB', department: 'Finance', baseSalary: 7500, bonus: 800, deductions: 750, netPay: 7550, status: 'processed' },
];

const recentPayslips = [
  { id: '1', period: 'December 2025', generatedAt: 'Jan 1, 2026', employees: 156, total: 275000, status: 'completed' },
  { id: '2', period: 'November 2025', generatedAt: 'Dec 1, 2025', employees: 152, total: 268000, status: 'completed' },
  { id: '3', period: 'October 2025', generatedAt: 'Nov 1, 2025', employees: 148, total: 262000, status: 'completed' },
];

const SaasPayroll: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('january-2026');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Automated Payroll</h1>
          <p className="text-slate-500 mt-1">Calculate salaries and generate payslips automatically</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="january-2026">January 2026</SelectItem>
              <SelectItem value="december-2025">December 2025</SelectItem>
              <SelectItem value="november-2025">November 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-200">
            <Calculator className="w-4 h-4 mr-2" />
            Run Payroll
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: 'Total Payroll', value: `$${(payrollSummary.totalPayroll / 1000).toFixed(0)}K`, icon: DollarSign, color: 'violet' },
          { title: 'Processed', value: `$${(payrollSummary.processed / 1000).toFixed(0)}K`, icon: Check, color: 'emerald' },
          { title: 'Pending', value: `$${(payrollSummary.pending / 1000).toFixed(0)}K`, icon: Clock, color: 'amber' },
          { title: 'Employees', value: payrollSummary.employees, icon: Users, color: 'blue' },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Processing Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900">Payroll Processing</h3>
                <p className="text-sm text-slate-500">January 2026 payroll cycle</p>
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-0">In Progress</Badge>
            </div>
            <Progress value={payrollSummary.processingRate} className="h-3" />
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-slate-500">{payrollSummary.processingRate}% Complete</span>
              <span className="text-sm text-slate-500">134 of 156 processed</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="employees" className="space-y-6">
        <TabsList className="bg-white/80 border border-slate-200/60 p-1">
          <TabsTrigger value="employees" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            Employee Payroll
          </TabsTrigger>
          <TabsTrigger value="payslips" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            Payslip History
          </TabsTrigger>
          <TabsTrigger value="bank" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            Bank Export
          </TabsTrigger>
        </TabsList>

        {/* Employee Payroll */}
        <TabsContent value="employees">
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Employee Salary Details</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search employees..." className="pl-10" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-slate-100">
                      <th className="pb-4 text-sm font-medium text-slate-500">Employee</th>
                      <th className="pb-4 text-sm font-medium text-slate-500">Department</th>
                      <th className="pb-4 text-sm font-medium text-slate-500 text-right">Base Salary</th>
                      <th className="pb-4 text-sm font-medium text-slate-500 text-right">Bonus</th>
                      <th className="pb-4 text-sm font-medium text-slate-500 text-right">Deductions</th>
                      <th className="pb-4 text-sm font-medium text-slate-500 text-right">Net Pay</th>
                      <th className="pb-4 text-sm font-medium text-slate-500">Status</th>
                      <th className="pb-4 text-sm font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeePayroll.map((emp, index) => (
                      <motion.tr
                        key={emp.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-slate-50"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9">
                              <AvatarFallback className="bg-gradient-to-br from-violet-100 to-purple-100 text-violet-700 text-sm">
                                {emp.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-slate-900">{emp.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-slate-600">{emp.department}</td>
                        <td className="py-4 text-right text-slate-900">${emp.baseSalary.toLocaleString()}</td>
                        <td className="py-4 text-right text-emerald-600">+${emp.bonus.toLocaleString()}</td>
                        <td className="py-4 text-right text-red-600">-${emp.deductions.toLocaleString()}</td>
                        <td className="py-4 text-right font-semibold text-slate-900">${emp.netPay.toLocaleString()}</td>
                        <td className="py-4">
                          <Badge className={emp.status === 'processed' 
                            ? 'bg-emerald-100 text-emerald-700 border-0' 
                            : 'bg-amber-100 text-amber-700 border-0'
                          }>
                            {emp.status}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payslip History */}
        <TabsContent value="payslips">
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Payslip History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayslips.map((payslip, index) => (
                  <motion.div
                    key={payslip.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-violet-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{payslip.period}</h4>
                        <p className="text-sm text-slate-500">Generated on {payslip.generatedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">${(payslip.total / 1000).toFixed(0)}K</p>
                        <p className="text-sm text-slate-500">{payslip.employees} employees</p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 border-0">{payslip.status}</Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Excel
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bank Export */}
        <TabsContent value="bank">
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Bank Export</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Export for Bank Transfer</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                  Generate bank-compatible files for bulk salary transfers. Supports major banking formats.
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    NACHA Format
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    CSV Export
                  </Button>
                  <Button className="bg-gradient-to-r from-violet-500 to-purple-600">
                    <Send className="w-4 h-4 mr-2" />
                    Direct Transfer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SaasPayroll;
