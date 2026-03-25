import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import {
  Warehouse,
  Package,
  Key,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Settings,
  Bell,
  Sparkles,
} from 'lucide-react';

interface InventoryItem {
  id: string;
  product_name: string;
  stock_type: 'unlimited' | 'limited' | 'license';
  total_stock: number;
  available_stock: number;
  reserved: number;
  low_threshold: number;
  auto_restock: boolean;
  status: 'healthy' | 'low' | 'critical';
  ai_forecast?: string;
}

const mockInventory: InventoryItem[] = [
  { id: '1', product_name: 'CRM Enterprise', stock_type: 'license', total_stock: 500, available_stock: 342, reserved: 58, low_threshold: 50, auto_restock: true, status: 'healthy', ai_forecast: 'Demand expected to increase by 15% next month' },
  { id: '2', product_name: 'HR Management Pro', stock_type: 'license', total_stock: 200, available_stock: 45, reserved: 10, low_threshold: 40, auto_restock: true, status: 'low', ai_forecast: 'Consider restocking within 2 weeks' },
  { id: '3', product_name: 'Inventory Tracker', stock_type: 'license', total_stock: 100, available_stock: 12, reserved: 5, low_threshold: 20, auto_restock: false, status: 'critical', ai_forecast: 'Urgent: Stock will deplete in 5 days' },
  { id: '4', product_name: 'POS System', stock_type: 'unlimited', total_stock: 999, available_stock: 999, reserved: 0, low_threshold: 0, auto_restock: false, status: 'healthy' },
  { id: '5', product_name: 'Accounting Suite', stock_type: 'license', total_stock: 300, available_stock: 187, reserved: 23, low_threshold: 30, auto_restock: true, status: 'healthy' },
];

const PMInventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);

  const stats = {
    totalProducts: inventory.length,
    healthy: inventory.filter(i => i.status === 'healthy').length,
    lowStock: inventory.filter(i => i.status === 'low').length,
    critical: inventory.filter(i => i.status === 'critical').length,
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive'; icon: React.ElementType }> = {
      healthy: { variant: 'default', icon: Package },
      low: { variant: 'secondary', icon: AlertTriangle },
      critical: { variant: 'destructive', icon: AlertTriangle },
    };
    const { variant, icon: Icon } = config[status] || config.healthy;
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const getStockPercentage = (item: InventoryItem) => {
    if (item.stock_type === 'unlimited') return 100;
    return Math.round((item.available_stock / item.total_stock) * 100);
  };

  const handleRestock = (itemId: string) => {
    setInventory(inventory.map(i => 
      i.id === itemId 
        ? { ...i, available_stock: i.total_stock, status: 'healthy' as const }
        : i
    ));
    toast.success('Inventory restocked');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Warehouse className="w-6 h-6 text-orange-500" />
            Inventory
          </h1>
          <p className="text-muted-foreground text-sm">Track stock, licenses, and allocations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Alerts
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
              <p className="text-xs text-muted-foreground">Total Products</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.healthy}</p>
              <p className="text-xs text-muted-foreground">Healthy Stock</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.lowStock}</p>
              <p className="text-xs text-muted-foreground">Low Stock</p>
            </div>
          </CardContent>
        </Card>
        <Card className={stats.critical > 0 ? 'border-destructive' : ''}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">{stats.critical}</p>
              <p className="text-xs text-muted-foreground">Critical</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Forecast Banner */}
      {stats.critical > 0 && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="p-4 flex items-center gap-4">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <div className="flex-1">
              <p className="font-medium text-amber-500">AI Inventory Alert</p>
              <p className="text-sm text-muted-foreground">
                {stats.critical} product(s) need immediate restocking. AI forecasts suggest increased demand.
              </p>
            </div>
            <Button variant="outline" size="sm">
              View Forecast
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Reserved</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Auto-Restock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id} className={item.status === 'critical' ? 'bg-destructive/5' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        {item.stock_type === 'license' ? (
                          <Key className="w-5 h-5 text-primary" />
                        ) : (
                          <Package className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        {item.ai_forecast && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            AI: {item.ai_forecast.substring(0, 40)}...
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.stock_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-24">
                      <Progress 
                        value={getStockPercentage(item)} 
                        className={`h-2 ${item.status === 'critical' ? '[&>div]:bg-destructive' : item.status === 'low' ? '[&>div]:bg-amber-500' : ''}`}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {getStockPercentage(item)}%
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-bold">
                      {item.stock_type === 'unlimited' ? '∞' : item.available_stock}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {item.stock_type !== 'unlimited' && ` / ${item.total_stock}`}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono">{item.reserved}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <Badge variant={item.auto_restock ? 'default' : 'outline'}>
                      {item.auto_restock ? 'ON' : 'OFF'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {item.status !== 'healthy' && item.stock_type !== 'unlimited' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRestock(item.id)}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Restock
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PMInventory;
