import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  ArrowRight,
  Utensils
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Table {
  id: string;
  name: string;
  seats: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentOrder?: {
    orderId: string;
    guests: number;
    startTime: string;
    items: number;
    total: number;
  };
  reservation?: {
    name: string;
    time: string;
    guests: number;
  };
}

const sampleTables: Table[] = [
  { id: 'T1', name: 'Table 1', seats: 2, status: 'available' },
  { 
    id: 'T2', 
    name: 'Table 2', 
    seats: 4, 
    status: 'occupied',
    currentOrder: {
      orderId: 'ORD-1001',
      guests: 3,
      startTime: '12:30 PM',
      items: 5,
      total: 1250,
    }
  },
  { id: 'T3', name: 'Table 3', seats: 4, status: 'cleaning' },
  { 
    id: 'T4', 
    name: 'Table 4', 
    seats: 6, 
    status: 'reserved',
    reservation: {
      name: 'Sharma Family',
      time: '1:00 PM',
      guests: 5,
    }
  },
  { 
    id: 'T5', 
    name: 'Table 5', 
    seats: 2, 
    status: 'occupied',
    currentOrder: {
      orderId: 'ORD-1003',
      guests: 2,
      startTime: '12:45 PM',
      items: 3,
      total: 680,
    }
  },
  { id: 'T6', name: 'Table 6', seats: 8, status: 'available' },
  { id: 'T7', name: 'Table 7', seats: 4, status: 'available' },
  { 
    id: 'T8', 
    name: 'Table 8', 
    seats: 6, 
    status: 'occupied',
    currentOrder: {
      orderId: 'ORD-1005',
      guests: 4,
      startTime: '11:45 AM',
      items: 8,
      total: 2100,
    }
  },
  { id: 'T9', name: 'Table 9', seats: 2, status: 'available' },
  { 
    id: 'T10', 
    name: 'Table 10', 
    seats: 4, 
    status: 'reserved',
    reservation: {
      name: 'Birthday Party',
      time: '1:30 PM',
      guests: 4,
    }
  },
  { id: 'T11', name: 'Table 11', seats: 4, status: 'available' },
  { id: 'T12', name: 'Table 12', seats: 8, status: 'available' },
];

export const TableManagement: React.FC = () => {
  const [tables] = useState<Table[]>(sampleTables);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredTables = tables.filter(t => filter === 'all' || t.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'from-green-600 to-green-700 border-green-500';
      case 'occupied': return 'from-orange-600 to-red-600 border-orange-500';
      case 'reserved': return 'from-blue-600 to-blue-700 border-blue-500';
      case 'cleaning': return 'from-yellow-600 to-yellow-700 border-yellow-500';
      default: return 'from-zinc-600 to-zinc-700 border-zinc-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle2 className="w-5 h-5" />;
      case 'occupied': return <Utensils className="w-5 h-5" />;
      case 'reserved': return <Clock className="w-5 h-5" />;
      case 'cleaning': return <AlertCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  const stats = {
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    cleaning: tables.filter(t => t.status === 'cleaning').length,
  };

  return (
    <div className="h-full flex bg-zinc-950">
      {/* Tables Grid */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">Table Management</h1>
            <Button className="bg-orange-500 hover:bg-orange-600 rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add Reservation
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={() => setFilter('available')}
              className={cn(
                "p-3 rounded-xl border transition-all",
                filter === 'available' ? "border-green-500 bg-green-500/20" : "border-zinc-800 bg-zinc-900"
              )}
            >
              <p className="text-green-400 text-2xl font-bold">{stats.available}</p>
              <p className="text-zinc-400 text-sm">Available</p>
            </button>
            <button
              onClick={() => setFilter('occupied')}
              className={cn(
                "p-3 rounded-xl border transition-all",
                filter === 'occupied' ? "border-orange-500 bg-orange-500/20" : "border-zinc-800 bg-zinc-900"
              )}
            >
              <p className="text-orange-400 text-2xl font-bold">{stats.occupied}</p>
              <p className="text-zinc-400 text-sm">Occupied</p>
            </button>
            <button
              onClick={() => setFilter('reserved')}
              className={cn(
                "p-3 rounded-xl border transition-all",
                filter === 'reserved' ? "border-blue-500 bg-blue-500/20" : "border-zinc-800 bg-zinc-900"
              )}
            >
              <p className="text-blue-400 text-2xl font-bold">{stats.reserved}</p>
              <p className="text-zinc-400 text-sm">Reserved</p>
            </button>
            <button
              onClick={() => setFilter(filter === 'all' ? 'cleaning' : 'all')}
              className={cn(
                "p-3 rounded-xl border transition-all",
                filter === 'cleaning' ? "border-yellow-500 bg-yellow-500/20" : "border-zinc-800 bg-zinc-900"
              )}
            >
              <p className="text-yellow-400 text-2xl font-bold">{stats.cleaning}</p>
              <p className="text-zinc-400 text-sm">Cleaning</p>
            </button>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-4 gap-4">
            {filteredTables.map((table) => (
              <button
                key={table.id}
                onClick={() => setSelectedTable(table)}
                className={cn(
                  "relative p-4 rounded-2xl border-2 text-left transition-all hover:scale-105",
                  "bg-gradient-to-br",
                  getStatusColor(table.status),
                  selectedTable?.id === table.id && "ring-2 ring-white"
                )}
              >
                {/* Status Icon */}
                <div className="absolute top-3 right-3 text-white/80">
                  {getStatusIcon(table.status)}
                </div>

                {/* Table Info */}
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-white">{table.name}</h3>
                  <div className="flex items-center gap-1 text-white/70 text-sm">
                    <Users className="w-4 h-4" />
                    {table.seats} seats
                  </div>
                </div>

                {/* Status specific content */}
                {table.status === 'occupied' && table.currentOrder && (
                  <div className="bg-black/20 rounded-lg p-2 text-sm">
                    <p className="text-white/90 font-medium">{table.currentOrder.orderId}</p>
                    <p className="text-white/70">{table.currentOrder.guests} guests • {table.currentOrder.items} items</p>
                    <p className="text-white font-bold">₹{table.currentOrder.total}</p>
                  </div>
                )}

                {table.status === 'reserved' && table.reservation && (
                  <div className="bg-black/20 rounded-lg p-2 text-sm">
                    <p className="text-white/90 font-medium">{table.reservation.name}</p>
                    <p className="text-white/70">{table.reservation.time} • {table.reservation.guests} guests</p>
                  </div>
                )}

                {table.status === 'available' && (
                  <div className="text-white/60 text-sm">
                    Ready for guests
                  </div>
                )}

                {table.status === 'cleaning' && (
                  <div className="text-white/60 text-sm">
                    Being prepared...
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Details Panel */}
      {selectedTable && (
        <div className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col">
          <div className={cn(
            "p-4 bg-gradient-to-br text-white",
            getStatusColor(selectedTable.status)
          )}>
            <h2 className="text-2xl font-bold">{selectedTable.name}</h2>
            <p className="text-white/80 capitalize">{selectedTable.status}</p>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-xl p-4">
                <h3 className="text-sm font-medium text-zinc-500 mb-2">Table Info</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Capacity</span>
                    <span className="text-white">{selectedTable.seats} seats</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Status</span>
                    <span className="text-white capitalize">{selectedTable.status}</span>
                  </div>
                </div>
              </div>

              {selectedTable.currentOrder && (
                <div className="bg-zinc-800 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-zinc-500 mb-2">Current Order</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Order ID</span>
                      <span className="text-white">{selectedTable.currentOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Guests</span>
                      <span className="text-white">{selectedTable.currentOrder.guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Started</span>
                      <span className="text-white">{selectedTable.currentOrder.startTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Items</span>
                      <span className="text-white">{selectedTable.currentOrder.items}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-zinc-700">
                      <span className="text-zinc-400">Total</span>
                      <span className="text-orange-400 font-bold">₹{selectedTable.currentOrder.total}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedTable.reservation && (
                <div className="bg-zinc-800 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-zinc-500 mb-2">Reservation</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Name</span>
                      <span className="text-white">{selectedTable.reservation.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Time</span>
                      <span className="text-white">{selectedTable.reservation.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Guests</span>
                      <span className="text-white">{selectedTable.reservation.guests}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-zinc-800 space-y-2">
            {selectedTable.status === 'available' && (
              <Button className="w-full bg-orange-500 hover:bg-orange-600 rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Start Order
              </Button>
            )}
            {selectedTable.status === 'occupied' && (
              <>
                <Button className="w-full bg-green-600 hover:bg-green-700 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Generate Bill
                </Button>
                <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 rounded-xl">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Transfer Table
                </Button>
              </>
            )}
            {selectedTable.status === 'reserved' && (
              <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl">
                <Users className="w-4 h-4 mr-2" />
                Seat Guests
              </Button>
            )}
            {selectedTable.status === 'cleaning' && (
              <Button className="w-full bg-green-600 hover:bg-green-700 rounded-xl">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark Available
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
