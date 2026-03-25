/**
 * FRANCHISE OWNER - AUTO INVOICE SYSTEM
 * Auto-generated invoices with logo, GST, PDF/Image
 */

import React from 'react';
import { 
  FileText, Download, Mail, Eye, Printer,
  CheckCircle, Clock, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const invoices = [
  { 
    id: 'INV-2024-001', 
    orderId: 'ORD-2024-156', 
    client: 'Rajesh Industries', 
    product: 'Business CRM Pro',
    amount: '₹45,000',
    gst: '₹8,100',
    total: '₹53,100',
    status: 'Paid',
    date: 'Jan 18, 2024',
    emailSent: true
  },
  { 
    id: 'INV-2024-002', 
    orderId: 'ORD-2024-155', 
    client: 'Sharma Enterprises', 
    product: 'E-Commerce Suite',
    amount: '₹85,000',
    gst: '₹15,300',
    total: '₹1,00,300',
    status: 'Pending',
    date: 'Jan 17, 2024',
    emailSent: true
  },
  { 
    id: 'INV-2024-003', 
    orderId: 'ORD-2024-154', 
    client: 'Kumar Trading Co.', 
    product: 'Domain + Hosting Pack',
    amount: '₹9,700',
    gst: '₹1,746',
    total: '₹11,446',
    status: 'Paid',
    date: 'Jan 16, 2024',
    emailSent: true
  },
  { 
    id: 'INV-2024-004', 
    orderId: 'ORD-2024-153', 
    client: 'Patel Solutions', 
    product: 'HR Management System',
    amount: '₹55,000',
    gst: '₹9,900',
    total: '₹64,900',
    status: 'Overdue',
    date: 'Jan 10, 2024',
    emailSent: true
  },
];

const stats = [
  { label: 'Total Invoices', value: '156', color: 'text-blue-500' },
  { label: 'Paid', value: '142', color: 'text-emerald-500' },
  { label: 'Pending', value: '11', color: 'text-amber-500' },
  { label: 'Overdue', value: '3', color: 'text-red-500' },
];

export function FOInvoiceScreen() {
  const { toast } = useToast();

  const handleDownload = (invoiceId: string, format: 'pdf' | 'image') => {
    toast({
      title: `Downloading ${format.toUpperCase()}`,
      description: `${invoiceId}.${format} is being prepared...`,
    });
  };

  const handleResendEmail = (invoiceId: string) => {
    toast({
      title: "Email Sent",
      description: `Invoice ${invoiceId} has been resent to the client.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Auto Invoice System
          </h1>
          <p className="text-muted-foreground">Auto-generated • GST Included • PDF + Image Format</p>
        </div>
        <Badge variant="outline" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          Auto Email Enabled
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="bg-card/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Invoice List */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="p-4 bg-background/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      invoice.status === 'Paid' ? 'bg-emerald-500/10' :
                      invoice.status === 'Pending' ? 'bg-amber-500/10' : 'bg-red-500/10'
                    }`}>
                      <FileText className={`h-5 w-5 ${
                        invoice.status === 'Paid' ? 'text-emerald-500' :
                        invoice.status === 'Pending' ? 'text-amber-500' : 'text-red-500'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{invoice.id}</p>
                      <p className="text-sm text-muted-foreground">{invoice.orderId} • {invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      invoice.status === 'Paid' ? 'default' :
                      invoice.status === 'Pending' ? 'secondary' : 'destructive'
                    }>
                      {invoice.status === 'Paid' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {invoice.status === 'Pending' && <Clock className="h-3 w-3 mr-1" />}
                      {invoice.status === 'Overdue' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {invoice.status}
                    </Badge>
                    {invoice.emailSent && (
                      <Badge variant="outline" className="gap-1">
                        <Mail className="h-3 w-3" />
                        Sent
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Client</p>
                    <p className="font-medium">{invoice.client}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Product</p>
                    <p className="font-medium">{invoice.product}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">GST (18%)</p>
                    <p className="font-medium">{invoice.gst}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-bold text-primary">{invoice.total}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleDownload(invoice.id, 'pdf')}>
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDownload(invoice.id, 'image')}>
                    <Download className="h-4 w-4 mr-1" />
                    Image
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline">
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleResendEmail(invoice.id)}>
                    <Mail className="h-4 w-4 mr-1" />
                    Resend
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invoice Info */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">Invoice Auto-Generation Active</h3>
              <p className="text-sm text-muted-foreground">
                Invoices include: Franchise Logo • Client Details • Product Details • GST/Tax • Commission Split
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
