import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Download, 
  Filter,
  Users,
  Building2,
  Megaphone,
  Code,
  Calendar
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

const CommissionLedger = () => {
  const [roleFilter, setRoleFilter] = useState("all");

  const commissionRules = [
    { role: "Reseller", rate: "15%", icon: Users, color: "text-blue-600", bgColor: "bg-blue-100" },
    { role: "Franchise", rate: "40-60%", icon: Building2, color: "text-purple-600", bgColor: "bg-purple-100" },
    { role: "Influencer", rate: "CPC + Conv", icon: Megaphone, color: "text-pink-600", bgColor: "bg-pink-100" },
    { role: "Developer", rate: "Task-based", icon: Code, color: "text-cyan-600", bgColor: "bg-cyan-100" },
  ];

  const commissionData = [
    { month: "Jul", reseller: 3200, franchise: 8500, influencer: 1200, developer: 4800 },
    { month: "Aug", reseller: 3800, franchise: 9200, influencer: 1400, developer: 5200 },
    { month: "Sep", reseller: 4100, franchise: 10500, influencer: 1600, developer: 5800 },
    { month: "Oct", reseller: 4500, franchise: 11200, influencer: 1900, developer: 6200 },
    { month: "Nov", reseller: 5200, franchise: 12800, influencer: 2100, developer: 6800 },
    { month: "Dec", reseller: 5800, franchise: 14200, influencer: 2400, developer: 7200 },
  ];

  const ledgerEntries = [
    {
      id: "COM-2035-1247",
      recipient: "John Smith",
      role: "Reseller",
      sale: "Lifetime License - ABC Corp",
      saleAmount: 249,
      commission: 37.35,
      rate: "15%",
      status: "released",
      date: "2035-12-18",
    },
    {
      id: "COM-2035-1246",
      recipient: "Mumbai Franchise",
      role: "Franchise",
      sale: "SaaS Bundle - Regional",
      saleAmount: 4380,
      commission: 1752,
      rate: "40%",
      status: "pending",
      date: "2035-12-18",
    },
    {
      id: "COM-2035-1245",
      recipient: "Sarah Influencer",
      role: "Influencer",
      sale: "Referral Conversion",
      saleAmount: 249,
      commission: 24.90,
      rate: "10% conv",
      status: "released",
      date: "2035-12-17",
    },
    {
      id: "COM-2035-1244",
      recipient: "Dev Team Alpha",
      role: "Developer",
      sale: "Task #4521 - API Module",
      saleAmount: null,
      commission: 150,
      rate: "Fixed",
      status: "processing",
      date: "2035-12-17",
    },
    {
      id: "COM-2035-1243",
      recipient: "Delhi Franchise",
      role: "Franchise",
      sale: "Premium Tier - Q4 Share",
      saleAmount: 12300,
      commission: 6150,
      rate: "50%",
      status: "on_hold",
      date: "2035-12-16",
    },
    {
      id: "COM-2035-1242",
      recipient: "Mike Reseller",
      role: "Reseller",
      sale: "Lifetime License - XYZ Ltd",
      saleAmount: 249,
      commission: 37.35,
      rate: "15%",
      status: "released",
      date: "2035-12-16",
    },
  ];

  const totals = {
    reseller: 24580,
    franchise: 89420,
    influencer: 8940,
    developer: 45670,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Commission Ledger</h1>
          <p className="text-slate-500 text-sm">Complete commission tracking with auto-allocation</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            This Month
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Commission Rules */}
      <div className="grid grid-cols-4 gap-4">
        {commissionRules.map((rule, index) => (
          <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${rule.bgColor} dark:bg-opacity-20`}>
                  <rule.icon className={`w-5 h-5 ${rule.color}`} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{rule.role}</p>
                  <p className={`text-sm font-medium ${rule.color}`}>{rule.rate}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500">Total Earned</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  ${totals[rule.role.toLowerCase() as keyof typeof totals]?.toLocaleString() || 0}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Commission Chart */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Commission Distribution (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={commissionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Legend />
              <Bar dataKey="reseller" name="Reseller" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="franchise" name="Franchise" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="influencer" name="Influencer" fill="#ec4899" radius={[4, 4, 0, 0]} />
              <Bar dataKey="developer" name="Developer" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Ledger Table */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Commission Entries</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Search entries..." className="pl-9 w-64" />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="reseller">Reseller</SelectItem>
                  <SelectItem value="franchise">Franchise</SelectItem>
                  <SelectItem value="influencer">Influencer</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Recipient</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Sale/Task</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Sale Amount</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Commission</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Rate</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {ledgerEntries
                  .filter(e => roleFilter === "all" || e.role.toLowerCase() === roleFilter)
                  .map((entry, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">{entry.id}</td>
                      <td className="py-3 px-4 text-sm font-medium text-slate-900 dark:text-white">{entry.recipient}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-xs">{entry.role}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{entry.sale}</td>
                      <td className="py-3 px-4 text-sm text-right text-slate-600 dark:text-slate-400">
                        {entry.saleAmount ? `$${entry.saleAmount.toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-semibold text-cyan-600">
                        ${entry.commission.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-center text-slate-500">{entry.rate}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={`text-xs ${
                          entry.status === 'released' ? 'bg-cyan-100 text-cyan-700' :
                          entry.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          entry.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {entry.status.replace('_', ' ')}
                        </Badge>
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

export default CommissionLedger;
