import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const PayoutManager = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");

  const payouts = [
    {
      id: "PAY-2035-0891",
      recipient: "John Smith",
      role: "Reseller",
      amount: 1247.50,
      commission: "15%",
      source: "12 sales this month",
      status: "pending",
      requestedAt: "2035-12-18 14:23",
      gateway: "PayPal",
    },
    {
      id: "PAY-2035-0890",
      recipient: "Mumbai Franchise",
      role: "Franchise",
      amount: 4820.00,
      commission: "40%",
      source: "Q4 revenue share",
      status: "approved",
      requestedAt: "2035-12-18 11:15",
      gateway: "Razorpay",
    },
    {
      id: "PAY-2035-0889",
      recipient: "Sarah Tech",
      role: "Developer",
      amount: 890.00,
      commission: "Task-based",
      source: "8 tasks completed",
      status: "processing",
      requestedAt: "2035-12-17 16:45",
      gateway: "Stripe",
    },
    {
      id: "PAY-2035-0888",
      recipient: "Alex Influencer",
      role: "Influencer",
      amount: 523.40,
      commission: "CPC + Conv",
      source: "2,450 clicks, 12 conversions",
      status: "pending",
      requestedAt: "2035-12-17 09:30",
      gateway: "PayPal",
    },
    {
      id: "PAY-2035-0887",
      recipient: "Delhi Franchise",
      role: "Franchise",
      amount: 6150.00,
      commission: "50%",
      source: "Premium tier share",
      status: "on_hold",
      requestedAt: "2035-12-16 18:20",
      gateway: "Razorpay",
    },
    {
      id: "PAY-2035-0886",
      recipient: "Mike Developer",
      role: "Developer",
      amount: 450.00,
      commission: "Task-based",
      source: "5 tasks - 1 penalty",
      status: "cleared",
      requestedAt: "2035-12-16 12:00",
      gateway: "Stripe",
    },
  ];

  const stats = [
    { label: "Pending Payouts", value: "$34,521", count: 23, color: "text-yellow-600" },
    { label: "Processing", value: "$12,847", count: 8, color: "text-blue-600" },
    { label: "Cleared Today", value: "$8,420", count: 15, color: "text-cyan-600" },
    { label: "On Hold", value: "$6,150", count: 2, color: "text-red-600" },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      approved: "bg-cyan-100 text-cyan-700 border-cyan-300",
      processing: "bg-blue-100 text-blue-700 border-blue-300",
      cleared: "bg-slate-100 text-slate-700 border-slate-300",
      on_hold: "bg-red-100 text-red-700 border-red-300",
    };
    return styles[status] || styles.pending;
  };

  const handleApprove = (id: string) => {
    toast({
      title: "Payout Approved",
      description: `Payout ${id} has been approved and queued for processing.`,
    });
  };

  const handleReject = (id: string) => {
    toast({
      title: "Payout Rejected",
      description: `Payout ${id} has been rejected.`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payout Manager</h1>
          <p className="text-slate-500 text-sm">Approve, process, and track all commission payouts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <div className="flex items-end justify-between mt-1">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <Badge variant="secondary" className="text-xs">{stat.count} items</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search by ID, recipient, or role..." className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          {["all", "pending", "approved", "processing", "on_hold", "cleared"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className={filter === f ? "bg-cyan-600 hover:bg-cyan-700" : ""}
            >
              {f.charAt(0).toUpperCase() + f.slice(1).replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      {/* Payouts Table */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Payout Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payouts
              .filter((p) => filter === "all" || p.status === filter)
              .map((payout, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-sm font-medium">
                      {payout.recipient.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900 dark:text-white">{payout.recipient}</p>
                        <Badge variant="outline" className="text-xs">{payout.role}</Badge>
                      </div>
                      <p className="text-xs text-slate-500">{payout.id} • {payout.source}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">${payout.amount.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">{payout.commission} • {payout.gateway}</p>
                    </div>

                    <Badge className={`${getStatusBadge(payout.status)} border`}>
                      {payout.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                      {payout.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {payout.status === "on_hold" && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {payout.status.replace("_", " ")}
                    </Badge>

                    <div className="flex items-center gap-2">
                      {payout.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-cyan-600 border-cyan-300 hover:bg-cyan-50"
                            onClick={() => handleApprove(payout.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            onClick={() => handleReject(payout.id)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Put on Hold</DropdownMenuItem>
                          <DropdownMenuItem>Download Invoice</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayoutManager;
