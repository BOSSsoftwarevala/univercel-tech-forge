/**
 * RESELLER SALES MANAGEMENT
 * Categories: New Orders, In-Progress, Approved, Rejected, Completed
 * Actions: Upload payment proof, View status, Message support, Track progress
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Upload,
  Eye,
  MessageSquare,
  IndianRupee,
  Calendar,
  Package,
} from 'lucide-react';
import { toast } from 'sonner';

const orderStatuses = [
  { id: 'all', label: 'All Orders', icon: ShoppingCart },
  { id: 'new', label: 'New', icon: Clock, color: 'blue' },
  { id: 'in-progress', label: 'In-Progress', icon: Truck, color: 'amber' },
  { id: 'approved', label: 'Approved', icon: CheckCircle, color: 'emerald' },
  { id: 'rejected', label: 'Rejected', icon: XCircle, color: 'red' },
  { id: 'completed', label: 'Completed', icon: Package, color: 'green' },
];

const orders = [
  {
    id: 'ORD-2024-001',
    product: 'School ERP Pro',
    client: 'ABC School',
    amount: '₹75,000',
    commission: '₹15,000',
    status: 'in-progress',
    progress: 45,
    date: '2024-01-15',
    paymentProof: true,
  },
  {
    id: 'ORD-2024-002',
    product: 'Hospital HMS',
    client: 'City Hospital',
    amount: '₹1,20,000',
    commission: '₹24,000',
    status: 'new',
    progress: 0,
    date: '2024-01-18',
    paymentProof: false,
  },
  {
    id: 'ORD-2024-003',
    product: 'Retail POS',
    client: 'Super Mart',
    amount: '₹35,000',
    commission: '₹7,000',
    status: 'approved',
    progress: 100,
    date: '2024-01-10',
    paymentProof: true,
  },
  {
    id: 'ORD-2024-004',
    product: 'Business ERP',
    client: 'XYZ Corp',
    amount: '₹95,000',
    commission: '₹19,000',
    status: 'completed',
    progress: 100,
    date: '2024-01-05',
    paymentProof: true,
  },
  {
    id: 'ORD-2024-005',
    product: 'Real Estate CRM',
    client: 'Dream Homes',
    amount: '₹55,000',
    commission: '₹11,000',
    status: 'rejected',
    progress: 0,
    date: '2024-01-12',
    paymentProof: true,
    rejectReason: 'Payment verification failed',
  },
];

export function RSSalesScreen() {
  const [activeStatus, setActiveStatus] = useState('all');
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter(
    (order) => activeStatus === 'all' || order.status === activeStatus
  );

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-500/20 text-blue-400',
      'in-progress': 'bg-amber-500/20 text-amber-400',
      approved: 'bg-emerald-500/20 text-emerald-400',
      rejected: 'bg-red-500/20 text-red-400',
      completed: 'bg-green-500/20 text-green-400',
    };
    return colors[status] || 'bg-slate-500/20 text-slate-400';
  };

  const handleUploadPayment = (orderId: string) => {
    toast.success(`Payment proof uploaded for ${orderId}`);
  };

  const handleSendSupport = () => {
    if (supportMessage.trim()) {
      toast.success('Message sent to support');
      setSupportDialogOpen(false);
      setSupportMessage('');
    }
  };

  const stats = [
    { label: 'Total Orders', value: orders.length, color: 'emerald' },
    { label: 'In Progress', value: orders.filter((o) => o.status === 'in-progress').length, color: 'amber' },
    { label: 'Completed', value: orders.filter((o) => o.status === 'completed').length, color: 'green' },
    { label: 'Total Value', value: '₹3,80,000', color: 'blue' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Sales Management</h1>
        <p className="text-sm text-slate-400">Track and manage your orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Status Tabs */}
      <Tabs value={activeStatus} onValueChange={setActiveStatus}>
        <TabsList className="bg-slate-900/50 border border-slate-800 flex-wrap h-auto">
          {orderStatuses.map((status) => {
            const Icon = status.icon;
            return (
              <TabsTrigger
                key={status.id}
                value={status.id}
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <Icon className="h-4 w-4 mr-1" />
                {status.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-white font-bold">{order.id}</p>
                      <Badge className={getStatusBadge(order.status)}>
                        {order.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-slate-300 mt-1">{order.product}</p>
                    <p className="text-xs text-slate-400">{order.client}</p>
                  </div>

                  {/* Amount & Commission */}
                  <div className="text-right">
                    <p className="text-white font-bold">{order.amount}</p>
                    <p className="text-xs text-emerald-400">Commission: {order.commission}</p>
                    <p className="text-xs text-slate-500 flex items-center justify-end gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      {order.date}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!order.paymentProof && order.status === 'new' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                        onClick={() => handleUploadPayment(order.id)}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Upload Proof
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-white"
                      onClick={() => {
                        setSelectedOrder(order.id);
                        setSupportDialogOpen(true);
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar for in-progress orders */}
                {order.status === 'in-progress' && (
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span>Development Progress</span>
                      <span>{order.progress}%</span>
                    </div>
                    <Progress value={order.progress} className="h-2 bg-slate-800" />
                  </div>
                )}

                {/* Reject Reason */}
                {order.status === 'rejected' && order.rejectReason && (
                  <div className="mt-3 pt-3 border-t border-slate-800">
                    <p className="text-xs text-red-400">
                      Reason: {order.rejectReason}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Support Dialog */}
      <Dialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Message Support - {selectedOrder}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={supportMessage}
            onChange={(e) => setSupportMessage(e.target.value)}
            placeholder="Describe your issue or question..."
            className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
          />
          <DialogFooter>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSendSupport}>
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
