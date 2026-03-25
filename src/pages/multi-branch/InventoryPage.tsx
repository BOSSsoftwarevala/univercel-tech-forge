import { useState } from "react";
import {
  Package,
  Search,
  Filter,
  AlertTriangle,
  TrendingDown,
  Building2,
  ArrowUpDown,
  MoreVertical,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const inventoryItems = [
  {
    id: 1,
    name: "Office Chairs",
    sku: "FRN-001",
    branch: "Mumbai - HQ",
    stock: 45,
    minStock: 20,
    maxStock: 100,
    price: "₹8,500",
    status: "in_stock",
  },
  {
    id: 2,
    name: "Laptops Dell i7",
    sku: "ELC-002",
    branch: "Delhi Branch",
    stock: 8,
    minStock: 15,
    maxStock: 50,
    price: "₹65,000",
    status: "low_stock",
  },
  {
    id: 3,
    name: "Printer Paper A4",
    sku: "SUP-003",
    branch: "Bangalore Branch",
    stock: 200,
    minStock: 100,
    maxStock: 500,
    price: "₹450",
    status: "in_stock",
  },
  {
    id: 4,
    name: "Wireless Mouse",
    sku: "ELC-004",
    branch: "Chennai Branch",
    stock: 3,
    minStock: 25,
    maxStock: 100,
    price: "₹1,200",
    status: "critical",
  },
  {
    id: 5,
    name: "Monitor 24 inch",
    sku: "ELC-005",
    branch: "Kolkata Branch",
    stock: 12,
    minStock: 10,
    maxStock: 40,
    price: "₹18,500",
    status: "low_stock",
  },
];

const lowStockAlerts = [
  {
    item: "Wireless Mouse",
    branch: "Chennai Branch",
    current: 3,
    minimum: 25,
    severity: "critical",
    lastOrdered: "2024-01-10",
  },
  {
    item: "Laptops Dell i7",
    branch: "Delhi Branch",
    current: 8,
    minimum: 15,
    severity: "warning",
    lastOrdered: "2024-01-05",
  },
  {
    item: "Monitor 24 inch",
    branch: "Kolkata Branch",
    current: 12,
    minimum: 10,
    severity: "warning",
    lastOrdered: "2024-01-08",
  },
  {
    item: "USB Cables",
    branch: "Mumbai - HQ",
    current: 15,
    minimum: 50,
    severity: "warning",
    lastOrdered: "2024-01-12",
  },
];

const branchStock = [
  { branch: "Mumbai - HQ", items: 245, value: "₹28,50,000", lowStock: 3 },
  { branch: "Delhi Branch", items: 198, value: "₹22,30,000", lowStock: 5 },
  { branch: "Bangalore Branch", items: 176, value: "₹18,75,000", lowStock: 2 },
  { branch: "Chennai Branch", items: 142, value: "₹15,20,000", lowStock: 8 },
  { branch: "Kolkata Branch", items: 118, value: "₹12,80,000", lowStock: 4 },
];

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = branchFilter === "all" || item.branch === branchFilter;
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-500 mt-1">Track stock across all branches</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync Stock
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Items</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">879</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Value</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">₹97.5L</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">22</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Branches</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">5</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stock" className="space-y-6">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="stock">Stock Overview</TabsTrigger>
          <TabsTrigger value="alerts">Low Stock Alerts</TabsTrigger>
          <TabsTrigger value="branches">Branch-wise Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="space-y-4">
          {/* Filters */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-slate-50"
                  />
                </div>
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <Building2 className="h-4 w-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Branch" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="all">All Branches</SelectItem>
                    <SelectItem value="Mumbai - HQ">Mumbai - HQ</SelectItem>
                    <SelectItem value="Delhi Branch">Delhi Branch</SelectItem>
                    <SelectItem value="Bangalore Branch">Bangalore Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
                        Item
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
                        SKU
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
                        Branch
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
                        Stock Level
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
                        Price
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
                        Status
                      </th>
                      <th className="text-right py-4 px-4 text-sm font-medium text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                              <Package className="h-5 w-5 text-slate-600" />
                            </div>
                            <span className="font-medium text-slate-900">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600 font-mono text-sm">{item.sku}</td>
                        <td className="py-4 px-4 text-slate-600">{item.branch}</td>
                        <td className="py-4 px-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{item.stock}</span>
                              <span className="text-slate-400">/ {item.maxStock}</span>
                            </div>
                            <Progress
                              value={(item.stock / item.maxStock) * 100}
                              className={`h-1.5 ${
                                item.status === "critical"
                                  ? "[&>div]:bg-red-500"
                                  : item.status === "low_stock"
                                  ? "[&>div]:bg-amber-500"
                                  : ""
                              }`}
                            />
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-900">{item.price}</td>
                        <td className="py-4 px-4">
                          <Badge
                            className={
                              item.status === "in_stock"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                : item.status === "low_stock"
                                ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                : "bg-red-100 text-red-700 hover:bg-red-100"
                            }
                          >
                            {item.status === "in_stock"
                              ? "In Stock"
                              : item.status === "low_stock"
                              ? "Low Stock"
                              : "Critical"}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white z-50" align="end">
                              <DropdownMenuItem className="cursor-pointer">
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                Update Stock
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                Transfer Stock
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      alert.severity === "critical"
                        ? "bg-red-50 border-red-200"
                        : "bg-amber-50 border-amber-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            alert.severity === "critical" ? "bg-red-100" : "bg-amber-100"
                          }`}
                        >
                          <AlertTriangle
                            className={`h-5 w-5 ${
                              alert.severity === "critical" ? "text-red-600" : "text-amber-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{alert.item}</p>
                          <p className="text-sm text-slate-500">{alert.branch}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          {alert.current} / {alert.minimum}
                        </p>
                        <p className="text-xs text-slate-500">Last ordered: {alert.lastOrdered}</p>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Reorder
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {branchStock.map((branch) => (
              <Card key={branch.branch} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{branch.branch}</p>
                      <p className="text-sm text-slate-500">{branch.items} items</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Total Value</span>
                      <span className="font-semibold text-slate-900">{branch.value}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Low Stock Items</span>
                      <Badge
                        className={
                          branch.lowStock > 5
                            ? "bg-red-100 text-red-700 hover:bg-red-100"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                        }
                      >
                        {branch.lowStock} alerts
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
