/**
 * ORDERS & DELIVERY SCREEN
 * Active Orders, Completed Orders, Build/Deploy Status
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package,
  CheckCircle,
  Clock,
  Download,
  AlertTriangle,
  Eye,
  Rocket,
  Wrench,
} from 'lucide-react';

const activeOrders = [
  {
    id: 'ORD-2024-001',
    software: 'School Management Pro',
    client: 'ABC School',
    date: '2024-01-15',
    buildStatus: 75,
    deployStatus: 0,
    status: 'building',
  },
  {
    id: 'ORD-2024-002',
    software: 'CRM Ultimate',
    client: 'XYZ Corp',
    date: '2024-01-12',
    buildStatus: 100,
    deployStatus: 50,
    status: 'deploying',
  },
];

const completedOrders = [
  {
    id: 'ORD-2023-089',
    software: 'Enterprise ERP Suite',
    client: 'Tech Solutions',
    date: '2023-12-20',
    deliveredDate: '2023-12-25',
    amount: 4999,
  },
  {
    id: 'ORD-2023-088',
    software: 'HR Management Plus',
    client: 'Global Inc',
    date: '2023-12-15',
    deliveredDate: '2023-12-18',
    amount: 1499,
  },
];

export function FOOrdersScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Orders & Delivery</h1>
        <p className="text-muted-foreground">Track your orders and delivery status</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Orders</p>
              <p className="text-xl font-bold">2</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Building</p>
              <p className="text-xl font-bold">1</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Rocket className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Deploying</p>
              <p className="text-xl font-bold">1</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="text-xl font-bold">45</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="completed">Completed Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeOrders.map((order) => (
            <Card key={order.id} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm">{order.id}</span>
                      <Badge
                        className={
                          order.status === 'building'
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-purple-500/20 text-purple-400'
                        }
                      >
                        {order.status === 'building' ? 'Building' : 'Deploying'}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg">{order.software}</h3>
                    <p className="text-sm text-muted-foreground">Client: {order.client}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Raise Issue
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Build Status</span>
                      <span className="font-medium">{order.buildStatus}%</span>
                    </div>
                    <Progress value={order.buildStatus} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Deployment Status</span>
                      <span className="font-medium">{order.deployStatus}%</span>
                    </div>
                    <Progress value={order.deployStatus} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedOrders.map((order) => (
            <Card key={order.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{order.id}</span>
                        <Badge className="bg-emerald-500/20 text-emerald-400">Delivered</Badge>
                      </div>
                      <p className="font-semibold">{order.software}</p>
                      <p className="text-sm text-muted-foreground">Client: {order.client}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">${order.amount}</p>
                    <p className="text-xs text-muted-foreground">Delivered: {order.deliveredDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-3 w-3" />
                      Invoice
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FOOrdersScreen;
