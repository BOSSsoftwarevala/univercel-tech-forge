import React, { useState } from 'react';
import { 
  Plus, 
  Search,
  Calendar,
  Filter,
  TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Expense {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: string;
  paymentMethod: string;
  notes?: string;
}

const categories = [
  { name: 'Rent & Utilities', color: 'bg-blue-500' },
  { name: 'Inventory', color: 'bg-green-500' },
  { name: 'Salaries', color: 'bg-purple-500' },
  { name: 'Marketing', color: 'bg-amber-500' },
  { name: 'Travel', color: 'bg-pink-500' },
  { name: 'Office Supplies', color: 'bg-cyan-500' },
  { name: 'Maintenance', color: 'bg-orange-500' },
  { name: 'Miscellaneous', color: 'bg-slate-400' },
];

const initialExpenses: Expense[] = [
  { id: 1, description: 'Office Rent - January', category: 'Rent & Utilities', amount: 25000, date: 'Jan 01, 2026', paymentMethod: 'Bank Transfer' },
  { id: 2, description: 'Electricity Bill', category: 'Rent & Utilities', amount: 3200, date: 'Dec 30, 2025', paymentMethod: 'UPI' },
  { id: 3, description: 'Stock Purchase - Electronics', category: 'Inventory', amount: 45000, date: 'Dec 28, 2025', paymentMethod: 'Bank Transfer' },
  { id: 4, description: 'Staff Salary - December', category: 'Salaries', amount: 85000, date: 'Dec 28, 2025', paymentMethod: 'Bank Transfer' },
  { id: 5, description: 'Google Ads Campaign', category: 'Marketing', amount: 8000, date: 'Dec 25, 2025', paymentMethod: 'Credit Card' },
  { id: 6, description: 'Client Meeting - Travel', category: 'Travel', amount: 2500, date: 'Dec 22, 2025', paymentMethod: 'Cash' },
  { id: 7, description: 'Printer Paper & Ink', category: 'Office Supplies', amount: 1800, date: 'Dec 20, 2025', paymentMethod: 'Cash' },
  { id: 8, description: 'AC Servicing', category: 'Maintenance', amount: 3500, date: 'Dec 18, 2025', paymentMethod: 'UPI' },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    category: '',
    amount: '',
    paymentMethod: 'Cash',
    notes: '',
  });

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.category && newExpense.amount) {
      setExpenses([
        {
          id: expenses.length + 1,
          description: newExpense.description,
          category: newExpense.category,
          amount: Number(newExpense.amount),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          paymentMethod: newExpense.paymentMethod,
          notes: newExpense.notes,
        },
        ...expenses,
      ]);
      setNewExpense({ description: '', category: '', amount: '', paymentMethod: 'Cash', notes: '' });
      setIsAddOpen(false);
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categoryTotals = categories.map(cat => ({
    ...cat,
    total: expenses.filter(e => e.category === cat.name).reduce((sum, e) => sum + e.amount, 0),
  })).filter(cat => cat.total > 0).sort((a, b) => b.total - a.total);

  const getCategoryColor = (categoryName: string) => {
    return categories.find(c => c.name === categoryName)?.color || 'bg-slate-400';
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Expenses (Month)</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">₹{totalExpenses.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-red-50">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Today's Expenses</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">₹28,200</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">This Week</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">₹73,200</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Total Entries</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{expenses.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search & Add */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-200 h-11"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48 bg-white border-slate-200 h-11">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white h-11">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-slate-800">Add New Expense</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label className="text-slate-700">Description *</Label>
                    <Input
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      placeholder="What was this expense for?"
                      className="mt-1.5 bg-white border-slate-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-700">Category *</Label>
                      <Select 
                        value={newExpense.category} 
                        onValueChange={(v) => setNewExpense({ ...newExpense, category: v })}
                      >
                        <SelectTrigger className="mt-1.5 bg-white border-slate-200">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {categories.map(cat => (
                            <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-700">Amount *</Label>
                      <Input
                        type="number"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                        placeholder="₹0"
                        className="mt-1.5 bg-white border-slate-200"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-700">Payment Method</Label>
                    <Select 
                      value={newExpense.paymentMethod} 
                      onValueChange={(v) => setNewExpense({ ...newExpense, paymentMethod: v })}
                    >
                      <SelectTrigger className="mt-1.5 bg-white border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Debit Card">Debit Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-700">Notes (Optional)</Label>
                    <Textarea
                      value={newExpense.notes}
                      onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                      placeholder="Any additional notes..."
                      className="mt-1.5 bg-white border-slate-200"
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setIsAddOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleAddExpense}>
                      Add Expense
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Expense List */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {filteredExpenses.map((expense) => (
                  <div key={expense.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-3 h-3 rounded-full mt-1.5 ${getCategoryColor(expense.category)}`} />
                        <div>
                          <p className="font-medium text-slate-800">{expense.description}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-slate-500">{expense.category}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-sm text-slate-500">{expense.paymentMethod}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">-₹{expense.amount.toLocaleString()}</p>
                        <p className="text-sm text-slate-500 mt-1">{expense.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredExpenses.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-slate-500">No expenses found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Category Summary */}
        <div>
          <Card className="bg-white border-slate-200 shadow-sm sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">By Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryTotals.map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                      <span className="text-sm text-slate-600">{cat.name}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-800">₹{cat.total.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${cat.color} rounded-full`} 
                      style={{ width: `${(cat.total / totalExpenses) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-700">Total</span>
                  <span className="text-lg font-bold text-slate-800">₹{totalExpenses.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
