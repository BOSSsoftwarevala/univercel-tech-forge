import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Phone, 
  MapPin, 
  Wallet,
  MoreVertical,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  balance: number;
  totalPurchases: number;
  lastPurchase: string;
}

const initialCustomers: Customer[] = [
  { id: 1, name: 'Sharma Electronics', phone: '+91 98765 43210', email: 'sharma@email.com', address: 'MG Road, Delhi', balance: 15000, totalPurchases: 125000, lastPurchase: 'Dec 30, 2025' },
  { id: 2, name: 'Gupta Traders', phone: '+91 87654 32109', email: 'gupta@email.com', address: 'Nehru Place, Delhi', balance: 0, totalPurchases: 85000, lastPurchase: 'Dec 28, 2025' },
  { id: 3, name: 'Singh & Sons', phone: '+91 76543 21098', email: 'singh@email.com', address: 'Karol Bagh, Delhi', balance: 22000, totalPurchases: 210000, lastPurchase: 'Dec 25, 2025' },
  { id: 4, name: 'Patel Enterprises', phone: '+91 65432 10987', email: 'patel@email.com', address: 'Connaught Place, Delhi', balance: 8500, totalPurchases: 95000, lastPurchase: 'Dec 20, 2025' },
  { id: 5, name: 'Kumar Industries', phone: '+91 54321 09876', email: 'kumar@email.com', address: 'Lajpat Nagar, Delhi', balance: 0, totalPurchases: 180000, lastPurchase: 'Dec 15, 2025' },
  { id: 6, name: 'Verma Supplies', phone: '+91 43210 98765', email: 'verma@email.com', address: 'Saket, Delhi', balance: 35000, totalPurchases: 320000, lastPurchase: 'Dec 10, 2025' },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.phone) {
      setCustomers([
        ...customers,
        {
          id: customers.length + 1,
          ...newCustomer,
          balance: 0,
          totalPurchases: 0,
          lastPurchase: 'Never',
        },
      ]);
      setNewCustomer({ name: '', phone: '', email: '', address: '' });
      setIsAddOpen(false);
    }
  };

  const handleDeleteCustomer = (id: number) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  const totalBalance = customers.reduce((sum, c) => sum + c.balance, 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Total Customers</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{customers.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Pending Balance</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">₹{totalBalance.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">With Due Balance</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{customers.filter(c => c.balance > 0).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Add */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-slate-200 h-11"
          />
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-11">
              <Plus className="w-5 h-5 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-slate-800">Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-slate-700">Customer Name *</Label>
                <Input
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="Enter customer name"
                  className="mt-1.5 bg-white border-slate-200"
                />
              </div>
              <div>
                <Label className="text-slate-700">Phone Number *</Label>
                <Input
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="mt-1.5 bg-white border-slate-200"
                />
              </div>
              <div>
                <Label className="text-slate-700">Email</Label>
                <Input
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="customer@email.com"
                  className="mt-1.5 bg-white border-slate-200"
                />
              </div>
              <div>
                <Label className="text-slate-700">Address</Label>
                <Input
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  placeholder="Enter address"
                  className="mt-1.5 bg-white border-slate-200"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleAddCustomer}>
                  Add Customer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Customer List */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left py-4 px-5 text-sm font-medium text-slate-500">Customer</th>
                  <th className="text-left py-4 px-5 text-sm font-medium text-slate-500">Contact</th>
                  <th className="text-left py-4 px-5 text-sm font-medium text-slate-500">Address</th>
                  <th className="text-right py-4 px-5 text-sm font-medium text-slate-500">Balance Due</th>
                  <th className="text-right py-4 px-5 text-sm font-medium text-slate-500">Total Purchases</th>
                  <th className="text-center py-4 px-5 text-sm font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-5">
                      <p className="font-medium text-slate-800">{customer.name}</p>
                      <p className="text-sm text-slate-500">Last: {customer.lastPurchase}</p>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Phone className="w-4 h-4" />
                        {customer.phone}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{customer.email}</p>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        {customer.address}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <span className={`font-semibold ${customer.balance > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                        ₹{customer.balance.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right text-slate-800 font-medium">
                      ₹{customer.totalPurchases.toLocaleString()}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCustomers.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-slate-500">No customers found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
