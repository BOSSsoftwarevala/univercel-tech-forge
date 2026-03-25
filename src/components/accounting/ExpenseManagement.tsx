import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Wallet,
  Building,
  Car,
  Utensils,
  Zap,
  Phone,
  MoreHorizontal,
  Receipt,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const categories = [
  { id: 'rent', name: 'Rent', icon: Building, color: 'bg-purple-100 text-purple-600', amount: 25000 },
  { id: 'utilities', name: 'Utilities', icon: Zap, color: 'bg-yellow-100 text-yellow-600', amount: 8500 },
  { id: 'transport', name: 'Transport', icon: Car, color: 'bg-blue-100 text-blue-600', amount: 12000 },
  { id: 'food', name: 'Food & Meals', icon: Utensils, color: 'bg-orange-100 text-orange-600', amount: 6500 },
  { id: 'phone', name: 'Phone & Internet', icon: Phone, color: 'bg-green-100 text-green-600', amount: 3500 },
  { id: 'misc', name: 'Miscellaneous', icon: MoreHorizontal, color: 'bg-slate-100 text-slate-600', amount: 4200 },
];

const recentExpenses = [
  { id: 1, desc: 'Office Rent - January', category: 'Rent', amount: 25000, date: '2024-01-05', paymentMode: 'Bank' },
  { id: 2, desc: 'Electricity Bill', category: 'Utilities', amount: 4500, date: '2024-01-10', paymentMode: 'Bank' },
  { id: 3, desc: 'Fuel for delivery', category: 'Transport', amount: 3000, date: '2024-01-12', paymentMode: 'Cash' },
  { id: 4, desc: 'Team Lunch', category: 'Food & Meals', amount: 2500, date: '2024-01-13', paymentMode: 'Cash' },
  { id: 5, desc: 'Internet Bill', category: 'Phone & Internet', amount: 1500, date: '2024-01-14', paymentMode: 'Bank' },
  { id: 6, desc: 'Office Supplies', category: 'Miscellaneous', amount: 1800, date: '2024-01-15', paymentMode: 'Cash' },
];

const ExpenseManagement: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const totalExpenses = categories.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Expense Management</h3>
          <p className="text-sm text-slate-500">Track and categorize your business expenses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Record New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Enter expense description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" defaultValue="2024-01-15" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea placeholder="Add any additional notes..." />
              </div>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Save Expense
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Expenses</p>
                <p className="text-2xl font-bold text-slate-900">₹{totalExpenses.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Receipt className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Cash Expenses</p>
                <p className="text-2xl font-bold text-slate-900">₹7,300</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Bank Expenses</p>
                <p className="text-2xl font-bold text-slate-900">₹31,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-900">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const percentage = ((category.amount / totalExpenses) * 100).toFixed(1);
              
              return (
                <motion.div
                  key={category.id}
                  className="p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
                  whileHover={{ y: -2 }}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="font-medium text-slate-900 mt-3 text-sm">{category.name}</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">₹{category.amount.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{percentage}%</p>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Expenses Table */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-900">Recent Expenses</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search expenses..." className="pl-9 w-64" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Payment Mode</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-900">{expense.desc}</p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                        {expense.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{expense.date}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={
                        expense.paymentMode === 'Cash' 
                          ? 'border-emerald-200 text-emerald-700' 
                          : 'border-blue-200 text-blue-700'
                      }>
                        {expense.paymentMode}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-red-600">
                      -₹{expense.amount.toLocaleString()}
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

export default ExpenseManagement;
