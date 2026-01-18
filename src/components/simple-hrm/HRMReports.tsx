import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Users, Clock, Wallet, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const attendanceSummary = [
  { department: 'Engineering', total: 8, present: 7, absent: 1, late: 0, rate: '87.5%' },
  { department: 'Human Resources', total: 3, present: 3, absent: 0, late: 0, rate: '100%' },
  { department: 'Finance', total: 4, present: 3, absent: 0, late: 1, rate: '75%' },
  { department: 'Sales', total: 6, present: 5, absent: 1, late: 0, rate: '83.3%' },
  { department: 'Design', total: 3, present: 3, absent: 0, late: 0, rate: '100%' },
];

const salarySummary = [
  { department: 'Engineering', employees: 8, totalSalary: 400000, avgSalary: 50000 },
  { department: 'Human Resources', employees: 3, totalSalary: 120000, avgSalary: 40000 },
  { department: 'Finance', employees: 4, totalSalary: 160000, avgSalary: 40000 },
  { department: 'Sales', employees: 6, totalSalary: 210000, avgSalary: 35000 },
  { department: 'Design', employees: 3, totalSalary: 126000, avgSalary: 42000 },
];

const reportTypes = [
  { id: 'attendance', label: 'Attendance Report', icon: Clock, description: 'Daily/Monthly attendance summary' },
  { id: 'salary', label: 'Salary Report', icon: Wallet, description: 'Department-wise salary breakdown' },
  { id: 'leave', label: 'Leave Report', icon: Calendar, description: 'Leave balance and usage' },
  { id: 'employee', label: 'Employee Report', icon: Users, description: 'Employee master data' },
];

export default function HRMReports() {
  const [selectedMonth, setSelectedMonth] = useState('december_2024');
  const [activeReport, setActiveReport] = useState('attendance');

  const handleDownload = (reportType: string) => {
    const reportNames: Record<string, string> = {
      attendance: 'Attendance_Report',
      salary: 'Salary_Report', 
      leave: 'Leave_Report',
      employee: 'Employee_Report'
    };
    
    const fileName = `${reportNames[reportType] || 'Report'}_${selectedMonth}.pdf`;
    
    // Create downloadable content
    const content = `Report: ${reportType}\nPeriod: ${selectedMonth}\nGenerated: ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          const isActive = activeReport === report.id;

          return (
            <motion.div
              key={report.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all border-2 ${
                  isActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border/50 hover:border-primary/30'
                }`}
                onClick={() => setActiveReport(report.id)}
              >
                <CardContent className="p-5 text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-foreground">{report.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Report Content */}
      {activeReport === 'attendance' && (
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Attendance Summary - December 2024
            </CardTitle>
            <Button onClick={() => handleDownload('attendance')} className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-semibold text-muted-foreground">Department</th>
                    <th className="text-center p-4 font-semibold text-muted-foreground">Total</th>
                    <th className="text-center p-4 font-semibold text-muted-foreground">Present</th>
                    <th className="text-center p-4 font-semibold text-muted-foreground">Absent</th>
                    <th className="text-center p-4 font-semibold text-muted-foreground">Late</th>
                    <th className="text-center p-4 font-semibold text-muted-foreground">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceSummary.map((row, index) => (
                    <motion.tr
                      key={row.department}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-muted/50"
                    >
                      <td className="p-4 font-medium text-foreground text-lg">{row.department}</td>
                      <td className="p-4 text-center text-lg">{row.total}</td>
                      <td className="p-4 text-center text-lg text-emerald-600 font-semibold">{row.present}</td>
                      <td className="p-4 text-center text-lg text-red-600">{row.absent}</td>
                      <td className="p-4 text-center text-lg text-amber-600">{row.late}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          parseFloat(row.rate) >= 90 
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : parseFloat(row.rate) >= 75
                              ? 'bg-amber-500/10 text-amber-600'
                              : 'bg-red-500/10 text-red-600'
                        }`}>
                          {row.rate}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeReport === 'salary' && (
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Salary Summary - December 2024
            </CardTitle>
            <Button onClick={() => handleDownload('salary')} className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-semibold text-muted-foreground">Department</th>
                    <th className="text-center p-4 font-semibold text-muted-foreground">Employees</th>
                    <th className="text-right p-4 font-semibold text-muted-foreground">Total Salary</th>
                    <th className="text-right p-4 font-semibold text-muted-foreground">Avg Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {salarySummary.map((row, index) => (
                    <motion.tr
                      key={row.department}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-muted/50"
                    >
                      <td className="p-4 font-medium text-foreground text-lg">{row.department}</td>
                      <td className="p-4 text-center text-lg">{row.employees}</td>
                      <td className="p-4 text-right text-lg font-semibold text-primary">
                        ₹{row.totalSalary.toLocaleString()}
                      </td>
                      <td className="p-4 text-right text-lg">
                        ₹{row.avgSalary.toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                  <tr className="bg-muted/50 font-semibold">
                    <td className="p-4 text-lg">Total</td>
                    <td className="p-4 text-center text-lg">
                      {salarySummary.reduce((sum, r) => sum + r.employees, 0)}
                    </td>
                    <td className="p-4 text-right text-xl text-primary">
                      ₹{salarySummary.reduce((sum, r) => sum + r.totalSalary, 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-right text-lg">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {(activeReport === 'leave' || activeReport === 'employee') && (
        <Card className="border-border/50 p-12 text-center">
          <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {activeReport === 'leave' ? 'Leave Report' : 'Employee Report'}
          </h3>
          <p className="text-muted-foreground mb-6">
            Click below to generate and download the report
          </p>
          <Button size="lg" onClick={() => handleDownload(activeReport)} className="gap-2">
            <Download className="w-5 h-5" />
            Generate Report
          </Button>
        </Card>
      )}
    </div>
  );
}
