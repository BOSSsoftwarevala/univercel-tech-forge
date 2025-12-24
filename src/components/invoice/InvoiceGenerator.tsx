import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Send, Check, Signature, Smartphone,
  Building2, Calendar, DollarSign, User, Mail, Phone,
  MapPin, QrCode, Shield, Loader2, Printer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  status: 'draft' | 'pending' | 'signed' | 'paid';
}

interface InvoiceGeneratorProps {
  userRole?: string;
  userId?: string;
  onInvoiceCreated?: (invoice: InvoiceData) => void;
}

const InvoiceGenerator = ({ userRole = 'franchise', userId, onInvoiceCreated }: InvoiceGeneratorProps) => {
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now().toString(36).toUpperCase()}`,
    invoiceDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    items: [{ id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }],
    subtotal: 0,
    taxRate: 18,
    taxAmount: 0,
    total: 0,
    notes: '',
    status: 'draft'
  });

  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'signature' | 'otp' | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Calculate totals when items change
  const calculateTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * invoice.taxRate) / 100;
    const total = subtotal + taxAmount;
    setInvoice(prev => ({ ...prev, items, subtotal, taxAmount, total }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setInvoice(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = invoice.items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    });
    calculateTotals(updatedItems);
  };

  const removeItem = (id: string) => {
    if (invoice.items.length > 1) {
      const updatedItems = invoice.items.filter(item => item.id !== id);
      calculateTotals(updatedItems);
    }
  };

  // Signature canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setSignature(dataUrl);
    setIsSigned(true);
    setVerificationMethod('signature');
    setShowSignatureDialog(false);
    setInvoice(prev => ({ ...prev, status: 'signed' }));
    toast.success('Invoice signed successfully!');
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }
    
    setIsVerifying(true);
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo, accept any 6-digit OTP
    setIsSigned(true);
    setVerificationMethod('otp');
    setShowOTPDialog(false);
    setInvoice(prev => ({ ...prev, status: 'signed' }));
    toast.success('Invoice verified with OTP!');
    setIsVerifying(false);
  };

  const sendOTP = async () => {
    toast.success('OTP sent to your registered email/phone');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Invoice Preview Card */}
      <Card className="bg-white dark:bg-slate-900 border-border/50 overflow-hidden" ref={invoiceRef}>
        <CardContent className="p-0">
          {/* Invoice Header with Logo */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border/50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Software Vala Logo */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">SV</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Software Vala</h1>
                  <p className="text-sm text-muted-foreground">Enterprise Solutions</p>
                  <p className="text-xs text-muted-foreground mt-1">GSTIN: 27XXXXX1234X1ZX</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold text-primary">INVOICE</h2>
                <p className="text-sm font-mono text-muted-foreground mt-1">{invoice.invoiceNumber}</p>
                <Badge 
                  className={`mt-2 ${
                    invoice.status === 'signed' ? 'bg-green-500/20 text-green-600' :
                    invoice.status === 'paid' ? 'bg-blue-500/20 text-blue-600' :
                    'bg-amber-500/20 text-amber-600'
                  }`}
                >
                  {invoice.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bill To */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Bill To</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Client Name</Label>
                  <Input
                    value={invoice.clientName}
                    onChange={(e) => setInvoice(prev => ({ ...prev, clientName: e.target.value }))}
                    placeholder="Enter client name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input
                    type="email"
                    value={invoice.clientEmail}
                    onChange={(e) => setInvoice(prev => ({ ...prev, clientEmail: e.target.value }))}
                    placeholder="client@email.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Phone</Label>
                  <Input
                    value={invoice.clientPhone}
                    onChange={(e) => setInvoice(prev => ({ ...prev, clientPhone: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Address</Label>
                  <Textarea
                    value={invoice.clientAddress}
                    onChange={(e) => setInvoice(prev => ({ ...prev, clientAddress: e.target.value }))}
                    placeholder="Enter billing address"
                    className="mt-1 h-20"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Invoice Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Invoice Date</Label>
                  <Input
                    type="date"
                    value={invoice.invoiceDate}
                    onChange={(e) => setInvoice(prev => ({ ...prev, invoiceDate: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Due Date</Label>
                  <Input
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Tax Rate (%)</Label>
                <Select 
                  value={invoice.taxRate.toString()} 
                  onValueChange={(val) => {
                    const taxRate = parseFloat(val);
                    const taxAmount = (invoice.subtotal * taxRate) / 100;
                    setInvoice(prev => ({ 
                      ...prev, 
                      taxRate,
                      taxAmount,
                      total: prev.subtotal + taxAmount
                    }));
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0% (No Tax)</SelectItem>
                    <SelectItem value="5">5% GST</SelectItem>
                    <SelectItem value="12">12% GST</SelectItem>
                    <SelectItem value="18">18% GST</SelectItem>
                    <SelectItem value="28">28% GST</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* QR Code */}
              <div className="flex items-center justify-end">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <QRCodeSVG 
                    value={`upi://pay?pa=softwarevala@upi&pn=SoftwareVala&am=${invoice.total}&cu=INR&tn=${invoice.invoiceNumber}`}
                    size={80}
                    level="M"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="px-6 pb-6">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Items</h3>
            <div className="border border-border/50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Description</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase w-24">Qty</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase w-32">Unit Price</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase w-32">Total</th>
                    <th className="px-4 py-3 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Item description"
                          className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="border-0 bg-transparent p-0 h-auto text-center focus-visible:ring-0"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="border-0 bg-transparent p-0 h-auto text-right focus-visible:ring-0"
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        ₹{item.total.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          ×
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-2 bg-muted/30">
                <Button variant="ghost" size="sm" onClick={addItem} className="text-primary">
                  + Add Item
                </Button>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mt-4">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{invoice.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({invoice.taxRate}%)</span>
                  <span>₹{invoice.taxAmount.toLocaleString('en-IN')}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{invoice.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="px-6 pb-6">
            <Label className="text-xs">Notes</Label>
            <Textarea
              value={invoice.notes}
              onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Payment terms, bank details, or any additional notes..."
              className="mt-1 h-20"
            />
          </div>

          {/* Signature Section */}
          {(isSigned || signature) && (
            <div className="px-6 pb-6">
              <div className="flex items-end justify-between border-t border-border/50 pt-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Verified via {verificationMethod === 'signature' ? 'Digital Signature' : 'OTP'}</p>
                  {signature && (
                    <img src={signature} alt="Signature" className="h-16 border-b-2 border-foreground" />
                  )}
                  {verificationMethod === 'otp' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">OTP Verified</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Authorized Signatory</p>
                  <p className="text-xs text-muted-foreground">Software Vala</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-muted/30 px-6 py-4 text-center text-xs text-muted-foreground border-t border-border/50">
            <p>Thank you for your business! | Contact: support@softwarevala.com | www.softwarevala.com</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowSignatureDialog(true)}
          disabled={isSigned}
        >
          <Signature className="w-4 h-4 mr-2" />
          Sign with Signature
        </Button>
        <Button 
          variant="outline"
          onClick={() => {
            setShowOTPDialog(true);
            sendOTP();
          }}
          disabled={isSigned}
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Verify with OTP
        </Button>
        <Button 
          className="bg-primary"
          onClick={() => {
            if (!isSigned) {
              toast.error('Please sign or verify the invoice first');
              return;
            }
            toast.success('Invoice sent to client!');
            onInvoiceCreated?.(invoice);
          }}
        >
          <Send className="w-4 h-4 mr-2" />
          Send Invoice
        </Button>
      </div>

      {/* Signature Dialog */}
      <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Signature className="w-5 h-5" />
              Digital Signature
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Draw your signature below to authorize this invoice
            </p>
            <div className="border-2 border-dashed border-border rounded-lg p-2 bg-white">
              <canvas
                ref={canvasRef}
                width={350}
                height={150}
                className="w-full cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={clearSignature}>
              Clear
            </Button>
            <Button onClick={saveSignature}>
              <Check className="w-4 h-4 mr-2" />
              Save Signature
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OTP Dialog */}
      <Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              OTP Verification
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Enter the 6-digit code sent to your registered email/phone
            </p>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button 
              variant="link" 
              className="w-full text-sm"
              onClick={sendOTP}
            >
              Resend OTP
            </Button>
          </div>
          <DialogFooter>
            <Button 
              className="w-full"
              onClick={verifyOTP}
              disabled={isVerifying || otp.length !== 6}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Verify & Sign
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceGenerator;
