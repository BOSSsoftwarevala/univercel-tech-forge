import { useState } from "react";
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Printer,
  Building2,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const invoices = [
  {
    id: "INV-2024-001",
    customer: "ABC Corp",
    branch: "Mumbai - HQ",
    amount: "₹45,200",
    tax: "₹8,136",
    total: "₹53,336",
    date: "2024-01-15",
    status: "paid",
  },
  {
    id: "INV-2024-002",
    customer: "XYZ Ltd",
    branch: "Delhi Branch",
    amount: "₹28,500",
    tax: "₹5,130",
    total: "₹33,630",
    date: "2024-01-14",
    status: "pending",
  },
  {
    id: "INV-2024-003",
    customer: "Tech Solutions",
    branch: "Bangalore Branch",
    amount: "₹72,000",
    tax: "₹12,960",
    total: "₹84,960",
    date: "2024-01-13",
    status: "paid",
  },
  {
    id: "INV-2024-004",
    customer: "Global Traders",
    branch: "Chennai Branch",
    amount: "₹15,800",
    tax: "₹2,844",
    total: "₹18,644",
    date: "2024-01-12",
    status: "overdue",
  },
  {
    id: "INV-2024-005",
    customer: "Smart Industries",
    branch: "Kolkata Branch",
    amount: "₹38,900",
    tax: "₹7,002",
    total: "₹45,902",
    date: "2024-01-11",
    status: "paid",
  },
];

const consolidatedStats = [
  {
    title: "Total Revenue",
    value: "₹48,25,000",
    change: "+18.2%",
    type: "positive",
  },
  {
    title: "Pending Amount",
    value: "₹5,82,000",
    change: "-8.5%",
    type: "positive",
  },
  {
    title: "Total Invoices",
    value: "342",
    change: "+12",
    type: "positive",
  },
  {
    title: "Tax Collected",
    value: "₹8,68,500",
    change: "+15.3%",
    type: "positive",
  },
];

export default function CentralBilling() {
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = branchFilter === "all" || inv.branch === branchFilter;
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesBranch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Central Billing</h1>
          <p className="text-slate-500 mt-1">Manage invoices across all branches</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Plus className="h-4 w-4" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Customer Name</Label>
                    <Input placeholder="Enter customer name" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Branch</Label>
                    <Select>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="mumbai">Mumbai - HQ</SelectItem>
                        <SelectItem value="delhi">Delhi Branch</SelectItem>
                        <SelectItem value="bangalore">Bangalore Branch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Items</Label>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-12 gap-2">
                      <Input className="col-span-5" placeholder="Item description" />
                      <Input className="col-span-2" placeholder="Qty" type="number" />
                      <Input className="col-span-3" placeholder="Rate" type="number" />
                      <Button variant="outline" size="icon" className="col-span-2">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Tax Type</Label>
                    <Select>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select tax" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="gst18">GST 18%</SelectItem>
                        <SelectItem value="gst12">GST 12%</SelectItem>
                        <SelectItem value="gst5">GST 5%</SelectItem>
                        <SelectItem value="none">No Tax</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Due Date</Label>
                    <Input type="date" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Create Invoice</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="invoices">All Invoices</TabsTrigger>
          <TabsTrigger value="consolidated">Consolidated Report</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          {/* Filters */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search invoices..."
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px] bg-white">
                    <Filter className="h-4 w-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Table */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
                        Invoice
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
                        Customer
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
                        Branch
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
                        Amount
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
                        Tax
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
                        Total
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-500">
                        Date
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
                    {filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-slate-400" />
                            <span className="font-medium text-blue-600">{inv.id}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-900">{inv.customer}</td>
                        <td className="py-4 px-4 text-slate-600">{inv.branch}</td>
                        <td className="py-4 px-4 text-slate-900">{inv.amount}</td>
                        <td className="py-4 px-4 text-slate-600">{inv.tax}</td>
                        <td className="py-4 px-4 font-semibold text-slate-900">{inv.total}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            {new Date(inv.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            className={
                              inv.status === "paid"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                : inv.status === "pending"
                                ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                : "bg-red-100 text-red-700 hover:bg-red-100"
                            }
                          >
                            {inv.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consolidated" className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {consolidatedStats.map((stat) => (
              <Card key={stat.title} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <div className="flex items-end justify-between mt-2">
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <div className="flex items-center gap-1">
                      {stat.type === "positive" ? (
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={
                          stat.type === "positive" ? "text-emerald-600" : "text-red-600"
                        }
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Branch-wise Summary */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Branch-wise Revenue Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { branch: "Mumbai - HQ", revenue: "₹12,45,000", invoices: 85, percent: 85 },
                  { branch: "Delhi Branch", revenue: "₹9,82,000", invoices: 72, percent: 68 },
                  { branch: "Bangalore Branch", revenue: "₹8,56,000", invoices: 65, percent: 60 },
                  { branch: "Chennai Branch", revenue: "₹7,24,000", invoices: 58, percent: 52 },
                  { branch: "Kolkata Branch", revenue: "₹6,18,000", invoices: 42, percent: 45 },
                ].map((item) => (
                  <div key={item.branch} className="flex items-center gap-4">
                    <div className="w-40 font-medium text-slate-900">{item.branch}</div>
                    <div className="flex-1">
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-28 text-right font-semibold text-slate-900">
                      {item.revenue}
                    </div>
                    <div className="w-20 text-right text-sm text-slate-500">
                      {item.invoices} invoices
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
