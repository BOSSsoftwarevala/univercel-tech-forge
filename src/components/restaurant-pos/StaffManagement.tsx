import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  User,
  ChefHat,
  Wallet,
  Clock,
  MoreVertical,
  Phone,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Staff {
  id: string;
  name: string;
  role: 'cashier' | 'kitchen' | 'waiter' | 'manager';
  phone: string;
  email: string;
  status: 'active' | 'on-break' | 'off-duty';
  shift: string;
  ordersToday?: number;
  salestoday?: number;
}

const staffMembers: Staff[] = [
  { id: '1', name: 'Rajesh Kumar', role: 'manager', phone: '9876543210', email: 'rajesh@resto.com', status: 'active', shift: '9 AM - 6 PM' },
  { id: '2', name: 'Priya Sharma', role: 'cashier', phone: '9876543211', email: 'priya@resto.com', status: 'active', shift: '10 AM - 7 PM', ordersToday: 45, salestoday: 28500 },
  { id: '3', name: 'Mohammed Ali', role: 'kitchen', phone: '9876543212', email: 'ali@resto.com', status: 'active', shift: '8 AM - 4 PM', ordersToday: 62 },
  { id: '4', name: 'Sunita Devi', role: 'waiter', phone: '9876543213', email: 'sunita@resto.com', status: 'on-break', shift: '11 AM - 8 PM', ordersToday: 28 },
  { id: '5', name: 'Vikram Singh', role: 'kitchen', phone: '9876543214', email: 'vikram@resto.com', status: 'active', shift: '12 PM - 9 PM', ordersToday: 38 },
  { id: '6', name: 'Anita Patel', role: 'waiter', phone: '9876543215', email: 'anita@resto.com', status: 'active', shift: '10 AM - 7 PM', ordersToday: 35 },
  { id: '7', name: 'Ramesh Yadav', role: 'cashier', phone: '9876543216', email: 'ramesh@resto.com', status: 'off-duty', shift: '6 PM - 11 PM' },
];

export const StaffManagement: React.FC = () => {
  const [staff] = useState<Staff[]>(staffMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredStaff = staff.filter(s => {
    if (roleFilter !== 'all' && s.role !== roleFilter) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'manager': return '👔';
      case 'cashier': return '💵';
      case 'kitchen': return '👨‍🍳';
      case 'waiter': return '🍽️';
      default: return '👤';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager': return 'bg-purple-500';
      case 'cashier': return 'bg-green-500';
      case 'kitchen': return 'bg-orange-500';
      case 'waiter': return 'bg-blue-500';
      default: return 'bg-zinc-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'on-break': return 'bg-yellow-500';
      case 'off-duty': return 'bg-zinc-500';
      default: return 'bg-zinc-500';
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">Staff Management</h1>
          <Button className="bg-orange-500 hover:bg-orange-600 rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-700 text-white rounded-xl"
            />
          </div>
          <div className="flex gap-1 bg-zinc-900 rounded-xl p-1">
            {['all', 'manager', 'cashier', 'kitchen', 'waiter'].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all",
                  roleFilter === role 
                    ? "bg-orange-500 text-white" 
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 grid grid-cols-4 gap-3">
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-zinc-400 text-sm">Active</span>
          </div>
          <p className="text-2xl font-bold text-white">{staff.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-400" />
            </div>
            <span className="text-zinc-400 text-sm">On Break</span>
          </div>
          <p className="text-2xl font-bold text-white">{staff.filter(s => s.status === 'on-break').length}</p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-orange-400" />
            </div>
            <span className="text-zinc-400 text-sm">Kitchen Staff</span>
          </div>
          <p className="text-2xl font-bold text-white">{staff.filter(s => s.role === 'kitchen').length}</p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-zinc-400 text-sm">Today's Sales</span>
          </div>
          <p className="text-2xl font-bold text-white">₹{staff.reduce((sum, s) => sum + (s.salestoday || 0), 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-3 gap-4">
          {filteredStaff.map((member) => (
            <div
              key={member.id}
              className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
            >
              <div className={cn("h-2", getRoleColor(member.role))} />
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl">
                      {getRoleIcon(member.role)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{member.name}</h3>
                      <p className="text-sm text-zinc-500 capitalize">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      getStatusColor(member.status)
                    )} />
                    <button className="p-1 text-zinc-500 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Phone className="w-4 h-4" />
                    {member.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Clock className="w-4 h-4" />
                    {member.shift}
                  </div>
                </div>

                {(member.ordersToday !== undefined || member.salestoday !== undefined) && (
                  <div className="pt-3 border-t border-zinc-800 grid grid-cols-2 gap-3">
                    {member.ordersToday !== undefined && (
                      <div className="bg-zinc-800 rounded-lg p-2 text-center">
                        <p className="text-lg font-bold text-white">{member.ordersToday}</p>
                        <p className="text-xs text-zinc-500">Orders</p>
                      </div>
                    )}
                    {member.salestoday !== undefined && (
                      <div className="bg-zinc-800 rounded-lg p-2 text-center">
                        <p className="text-lg font-bold text-orange-400">₹{member.salestoday.toLocaleString()}</p>
                        <p className="text-xs text-zinc-500">Sales</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
