import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Download, FileText, CheckCircle, Clock, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'paid' | 'pending' | 'processing';
  paidDate: string | null;
}

const payrollData: PayrollRecord[] = [
  { id: '1', employeeId: '1', employeeName: 'Rahul Kumar', department: 'Engineering', basicSalary: 45000, allowances: 5000, deductions: 2500, netSalary: 47500, status: 'paid', paidDate: '2024-12-28' },
  { id: '2', employeeId: '2', employeeName: 'Priya Singh', department: 'Human Resources', basicSalary: 40000, allowances: 5000, deductions: 2000, netSalary: 43000, status: 'paid', paidDate: '2024-12-28' },
  { id: '3', employeeId: '3', employeeName: 'Amit Sharma', department: 'Finance', basicSalary: 35000, allowances: 5000, deductions: 1800, netSalary: 38200, status: 'pending', paidDate: null },
  { id: '4', employeeId: '4', employeeName: 'Neha Gupta', department: 'Design', basicSalary: 38000, allowances: 4000, deductions: 2000, netSalary: 40000, status: 'processing', paidDate: null },
  { id: '5', employeeId: '5', employeeName: 'Vikram Patel', department: 'Sales', basicSalary: 32000, allowances: 3000, deductions: 1500, netSalary: 33500, status: 'pending', paidDate: null },
];

const statusConfig = {
  paid: { label: 'Paid', color: 'text-emerald-600 bg-emerald-500/10', icon: CheckCircle },
  pending: { label: 'Pending', color: 'text-amber-600 bg-amber-500/10', icon: Clock },
  processing: { label: 'Processing', color: 'text-blue-600 bg-blue-500/10', icon: Clock },
};

export default function HRMPayroll() {
  const [selectedMonth, setSelectedMonth] = useState('december_2024');
  const [payroll] = useState<PayrollRecord[]>(payrollData);

  const totalPayroll = payroll.reduce((sum, p) => sum + p.netSalary, 0);
  const paidCount = payroll.filter(p => p.status === 'paid').length;
  const pendingCount = payroll.filter(p => p.status === 'pending').length;

  const handleDownloadPayslip = (employeeId: string) => {
    console.log('Download payslip for:', employeeId);
  };

  const handleGenerateAll = () => {
    console.log('Generate all payslips');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[200px] h-12 text-base">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="december_2024">December 2024</SelectItem>
            <SelectItem value="november_2024">November 2024</SelectItem>
            <SelectItem value="october_2024">October 2024</SelectItem>
          </SelectContent>
        </Select>

        <Button size="lg" onClick={handleGenerateAll} className="gap-2">
          <FileText className="w-5 h-5" />
          Generate All Payslips
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Payroll</p>
                <p className="text-2xl font-bold text-foreground">₹{totalPayroll.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold text-foreground">{paidCount} employees</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground">{pendingCount} employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll List */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Employee Payroll</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payroll.map((record, index) => {
              const StatusIcon = statusConfig[record.status].icon;

              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-5 bg-muted/50 rounded-lg"
                >
                  <div className="flex flex-col lg:flex-row gap-4 justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-primary font-medium">
                          {record.employeeName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{record.employeeName}</h3>
                        <p className="text-muted-foreground">{record.department}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Basic</p>
                        <p className="font-semibold text-foreground">₹{record.basicSalary.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Allowances</p>
                        <p className="font-semibold text-emerald-600">+₹{record.allowances.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Deductions</p>
                        <p className="font-semibold text-red-600">-₹{record.deductions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Net Salary</p>
                        <p className="text-xl font-bold text-primary">₹{record.netSalary.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={statusConfig[record.status].color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[record.status].label}
                      </Badge>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleDownloadPayslip(record.employeeId)}
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Payslip
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
