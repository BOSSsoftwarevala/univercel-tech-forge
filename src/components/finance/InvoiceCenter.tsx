import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Download, 
  FileText,
  Eye,
  Send,
  Printer,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InvoiceCenter = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const invoiceStats = [
    { label: "Total Invoices", value: "1,247", color: "text-slate-600" },
    { label: "Paid", value: "1,189", color: "text-cyan-600" },
    { label: "Pending", value: "45", color: "text-yellow-600" },
    { label: "Overdue", value: "13", color: "text-red-600" },
  ];

  const invoices = [
    {
      id: "INV-2035-001247",
      client: "ABC Corporation",
      email: "billing@abccorp.com",
      type: "Lifetime License",
      amount: 249,
      tax: 44.82,
      total: 293.82,
      status: "paid",
      date: "2035-12-18",
      dueDate: "2035-12-18",
      gstNumber: "GSTIN-ABC123456",
    },
    {
      id: "INV-2035-001246",
      client: "XYZ Technologies",
      email: "accounts@xyz.tech",
      type: "SaaS Annual",
      amount: 730,
      tax: 131.40,
      total: 861.40,
      status: "pending",
      date: "2035-12-17",
      dueDate: "2035-12-24",
      gstNumber: "GSTIN-XYZ789012",
    },
    {
      id: "INV-2035-001245",
      client: "DEF Industries",
      email: "finance@def.ind",
      type: "Lifetime License",
      amount: 249,
      tax: 44.82,
      total: 293.82,
      status: "paid",
      date: "2035-12-17",
      dueDate: "2035-12-17",
      gstNumber: null,
    },
    {
      id: "INV-2035-001244",
      client: "GHI Solutions",
      email: "pay@ghi.sol",
      type: "SaaS Annual",
      amount: 730,
      tax: 131.40,
      total: 861.40,
      status: "overdue",
      date: "2035-12-10",
      dueDate: "2035-12-15",
      gstNumber: "GSTIN-GHI345678",
    },
    {
      id: "INV-2035-001243",
      client: "JKL Enterprises",
      email: "billing@jkl.ent",
      type: "Lifetime License",
      amount: 249,
      tax: 0,
      total: 249,
      status: "paid",
      date: "2035-12-15",
      dueDate: "2035-12-15",
      gstNumber: null,
    },
  ];

  const handleDownload = (id: string) => {
    toast({
      title: "Downloading Invoice",
      description: `Invoice ${id} is being downloaded as PDF.`,
    });
  };

  const handleSend = (id: string, email: string) => {
    toast({
      title: "Invoice Sent",
      description: `Invoice ${id} has been sent to ${email}.`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4 text-cyan-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "overdue":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: "bg-cyan-100 text-cyan-700 border-cyan-300",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      overdue: "bg-red-100 text-red-700 border-red-300",
    };
    return styles[status] || "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Invoice Center</h1>
          <p className="text-slate-500 text-sm">Generate, manage, and track all invoices with GST/VAT support</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-cyan-600 hover:bg-cyan-700">
            <Plus className="w-4 h-4 mr-2" />
            Generate Invoice
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {invoiceStats.map((stat, index) => (
          <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <FileText className={`w-8 h-8 ${stat.color} opacity-20`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search by invoice ID, client name..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Invoice List */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-slate-200 dark:bg-slate-700">
                    <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900 dark:text-white">{invoice.id}</p>
                      {invoice.gstNumber && (
                        <Badge variant="outline" className="text-xs">GST</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{invoice.client}</p>
                    <p className="text-xs text-slate-500">{invoice.type} • {invoice.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Subtotal: ${invoice.amount}</p>
                    {invoice.tax > 0 && (
                      <p className="text-xs text-slate-400">Tax: ${invoice.tax.toFixed(2)}</p>
                    )}
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      ${invoice.total.toFixed(2)}
                    </p>
                  </div>

                  <Badge className={`${getStatusBadge(invoice.status)} border flex items-center gap-1`}>
                    {getStatusIcon(invoice.status)}
                    {invoice.status}
                  </Badge>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(invoice.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSend(invoice.id, invoice.email)}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <Printer className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invoice Number Sequence Info */}
      <Card className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-300">Invoice Sequencing</p>
              <p className="text-sm text-slate-500">Next invoice number: INV-2035-001248</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>Format: INV-YYYY-NNNNNN</span>
              <span>•</span>
              <span>Auto-generated</span>
              <span>•</span>
              <span>Immutable</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceCenter;
