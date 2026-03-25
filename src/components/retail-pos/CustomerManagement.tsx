import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Phone,
  User,
  ShoppingBag,
  Calendar,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const sampleCustomers = [
  { id: '1', name: 'Rahul Sharma', phone: '9876543210', totalPurchases: 15, totalSpent: 4520, lastVisit: '2024-01-15' },
  { id: '2', name: 'Priya Patel', phone: '9876543211', totalPurchases: 28, totalSpent: 8750, lastVisit: '2024-01-14' },
  { id: '3', name: 'Amit Kumar', phone: '9876543212', totalPurchases: 8, totalSpent: 2340, lastVisit: '2024-01-13' },
  { id: '4', name: 'Sunita Devi', phone: '9876543213', totalPurchases: 42, totalSpent: 12500, lastVisit: '2024-01-15' },
  { id: '5', name: 'Vikram Singh', phone: '9876543214', totalPurchases: 19, totalSpent: 5680, lastVisit: '2024-01-12' },
  { id: '6', name: 'Meera Reddy', phone: '9876543215', totalPurchases: 6, totalSpent: 1890, lastVisit: '2024-01-10' },
];

export const CustomerManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<typeof sampleCustomers[0] | null>(null);

  const filteredCustomers = sampleCustomers.filter(
    c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         c.phone.includes(searchQuery)
  );

  const purchaseHistory = [
    { id: '1', date: '2024-01-15', items: 5, total: 458, paymentMethod: 'Cash' },
    { id: '2', date: '2024-01-10', items: 3, total: 285, paymentMethod: 'UPI' },
    { id: '3', date: '2024-01-05', items: 8, total: 672, paymentMethod: 'Card' },
    { id: '4', date: '2023-12-28', items: 4, total: 324, paymentMethod: 'Cash' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
          <p className="text-slate-500">Manage customer records</p>
        </div>
        <Button 
          size="lg" 
          className="h-14 px-6 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-lg"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Customer List */}
        <div className="flex-1">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-white border-slate-200 rounded-xl"
            />
          </div>

          {/* Add Customer Form */}
          {showAddForm && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Customer</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Customer Name</label>
                  <Input placeholder="Enter full name" className="h-12 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Phone Number</label>
                  <Input placeholder="10-digit mobile number" className="h-12 rounded-xl" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-600 mb-2">Address (Optional)</label>
                  <Input placeholder="Enter address" className="h-12 rounded-xl" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" className="h-12 px-6 rounded-xl" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button className="h-12 px-6 bg-emerald-500 hover:bg-emerald-600 rounded-xl">
                  Save Customer
                </Button>
              </div>
            </div>
          )}

          {/* Customers Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="h-14 text-slate-600 font-semibold">Customer</TableHead>
                  <TableHead className="h-14 text-slate-600 font-semibold">Phone</TableHead>
                  <TableHead className="h-14 text-slate-600 font-semibold text-center">Purchases</TableHead>
                  <TableHead className="h-14 text-slate-600 font-semibold text-right">Total Spent</TableHead>
                  <TableHead className="h-14 text-slate-600 font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow 
                    key={customer.id} 
                    className={`hover:bg-slate-50 cursor-pointer ${selectedCustomer?.id === customer.id ? 'bg-emerald-50' : ''}`}
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="font-medium text-slate-800">{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {customer.phone}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                        {customer.totalPurchases}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600">
                      ₹{customer.totalSpent.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-slate-100">
                          <Eye className="w-4 h-4 text-slate-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-slate-100">
                          <Edit2 className="w-4 h-4 text-slate-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Customer Details Panel */}
        {selectedCustomer && (
          <div className="w-96 bg-white rounded-xl border border-slate-200 p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">{selectedCustomer.name}</h3>
              <p className="text-slate-500">{selectedCustomer.phone}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <ShoppingBag className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-800">{selectedCustomer.totalPurchases}</p>
                <p className="text-sm text-slate-500">Total Orders</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <span className="text-2xl">₹</span>
                <p className="text-2xl font-bold text-emerald-600">{selectedCustomer.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-slate-500">Total Spent</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <Calendar className="w-4 h-4" />
              <span>Last visit: {selectedCustomer.lastVisit}</span>
            </div>

            <h4 className="font-semibold text-slate-800 mb-3">Recent Purchases</h4>
            <div className="space-y-2">
              {purchaseHistory.map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">{purchase.items} items</p>
                    <p className="text-sm text-slate-500">{purchase.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">₹{purchase.total}</p>
                    <p className="text-xs text-slate-400">{purchase.paymentMethod}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-slate-500 text-sm mb-1">Total Customers</p>
          <p className="text-2xl font-bold text-slate-800">156</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-slate-500 text-sm mb-1">Active Today</p>
          <p className="text-2xl font-bold text-emerald-500">24</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-slate-500 text-sm mb-1">New This Month</p>
          <p className="text-2xl font-bold text-blue-500">18</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-slate-500 text-sm mb-1">Repeat Rate</p>
          <p className="text-2xl font-bold text-slate-800">68%</p>
        </div>
      </div>
    </div>
  );
};
