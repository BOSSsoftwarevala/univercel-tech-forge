/**
 * FRANCHISE OWNER - ORDER MANAGEMENT
 * Step-by-step order placement with pricing engine
 */

import React, { useState } from 'react';
import { 
  ShoppingCart, Package, Globe, Server, Layers, Upload,
  FileText, CreditCard, CheckCircle, ChevronRight, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

type OrderStep = 'product' | 'details' | 'requirements' | 'pricing' | 'checkout';

const orders = [
  { id: 'ORD-2024-001', product: 'Business CRM', type: 'Software', status: 'Active', date: 'Jan 15, 2024', amount: '₹45,000' },
  { id: 'ORD-2024-002', product: 'example.com', type: 'Domain', status: 'Active', date: 'Jan 12, 2024', amount: '₹1,200' },
  { id: 'ORD-2024-003', product: 'Pro Hosting', type: 'Hosting', status: 'Pending', date: 'Jan 10, 2024', amount: '₹8,500' },
  { id: 'ORD-2024-004', product: 'E-Commerce Suite', type: 'Combo', status: 'Delivered', date: 'Jan 05, 2024', amount: '₹85,000' },
];

export function FOOrderManagement() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<OrderStep>('product');
  const [orderData, setOrderData] = useState({
    productType: '',
    softwareName: '',
    demoUrl: '',
    liveUrl: '',
    preferredDomain: '',
    hostingPlan: '',
    requirements: '',
    basePrice: 0,
    discount: 0,
    commission: 0,
    platformFee: 0,
    finalAmount: 0,
  });

  const steps: { id: OrderStep; label: string; icon: React.ElementType }[] = [
    { id: 'product', label: 'Product Type', icon: Package },
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'requirements', label: 'Requirements', icon: FileText },
    { id: 'pricing', label: 'Pricing', icon: CreditCard },
    { id: 'checkout', label: 'Checkout', icon: CheckCircle },
  ];

  const handleProductSelect = (type: string) => {
    let basePrice = 0;
    switch (type) {
      case 'software': basePrice = 45000; break;
      case 'domain': basePrice = 1200; break;
      case 'hosting': basePrice = 8500; break;
      case 'combo': basePrice = 85000; break;
    }
    const discount = basePrice * 0.15; // 15% franchise discount
    const commission = basePrice * 0.10; // 10% commission
    const platformFee = basePrice * 0.05; // Hidden platform fee
    const finalAmount = basePrice - discount;

    setOrderData({
      ...orderData,
      productType: type,
      basePrice,
      discount,
      commission,
      platformFee,
      finalAmount,
    });
    setCurrentStep('details');
  };

  const handlePlaceOrder = () => {
    toast({
      title: "Order Placed Successfully!",
      description: `Order ID: ORD-2024-${Math.floor(Math.random() * 1000)} created. Invoice generated.`,
    });
    setDialogOpen(false);
    setCurrentStep('product');
    setOrderData({
      productType: '',
      softwareName: '',
      demoUrl: '',
      liveUrl: '',
      preferredDomain: '',
      hostingPlan: '',
      requirements: '',
      basePrice: 0,
      discount: 0,
      commission: 0,
      platformFee: 0,
      finalAmount: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            Order Management
          </h1>
          <p className="text-muted-foreground">Place New Orders • Track Status • View History</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Place New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Place New Order
              </DialogTitle>
            </DialogHeader>

            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    currentStep === step.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <step.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                  {idx < steps.length - 1 && <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />}
                </div>
              ))}
            </div>

            {/* Step Content */}
            {currentStep === 'product' && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { type: 'software', label: 'Software', icon: Package, desc: 'CRM, ERP, Custom Apps' },
                  { type: 'domain', label: 'Domain', icon: Globe, desc: '.com, .in, .net' },
                  { type: 'hosting', label: 'Hosting', icon: Server, desc: 'Shared, VPS, Dedicated' },
                  { type: 'combo', label: 'Combo Pack', icon: Layers, desc: 'Full Package Deal' },
                ].map((item) => (
                  <Card 
                    key={item.type}
                    onClick={() => handleProductSelect(item.type)}
                    className="cursor-pointer hover:border-primary/50 transition-all"
                  >
                    <CardContent className="p-4 text-center">
                      <item.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold">{item.label}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {currentStep === 'details' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Software Name</Label>
                    <Input 
                      placeholder="e.g., Business CRM Pro"
                      value={orderData.softwareName}
                      onChange={(e) => setOrderData({ ...orderData, softwareName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Demo URL (Auto-fetch)</Label>
                    <Input placeholder="https://demo.example.com" value={orderData.demoUrl} onChange={(e) => setOrderData({ ...orderData, demoUrl: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Final Live URL</Label>
                    <Input placeholder="https://client.example.com" value={orderData.liveUrl} onChange={(e) => setOrderData({ ...orderData, liveUrl: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Domain</Label>
                    <Input placeholder="clientbusiness.com" value={orderData.preferredDomain} onChange={(e) => setOrderData({ ...orderData, preferredDomain: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Hosting Plan</Label>
                  <Select value={orderData.hostingPlan} onValueChange={(v) => setOrderData({ ...orderData, hostingPlan: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hosting plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (5GB, 1 Site)</SelectItem>
                      <SelectItem value="pro">Pro (20GB, 5 Sites)</SelectItem>
                      <SelectItem value="business">Business (100GB, Unlimited)</SelectItem>
                      <SelectItem value="dedicated">Dedicated Server</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Logo Upload</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click or drag to upload client logo</p>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => setCurrentStep('product')}>Back</Button>
                  <Button onClick={() => setCurrentStep('requirements')}>Continue</Button>
                </div>
              </div>
            )}

            {currentStep === 'requirements' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Client Requirements / Custom Wishes *</Label>
                  <Textarea 
                    placeholder="Describe the client's specific requirements, customizations needed, special features, integrations, etc. (Minimum 100 words required)"
                    className="min-h-[200px]"
                    value={orderData.requirements}
                    onChange={(e) => setOrderData({ ...orderData, requirements: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Word count: {orderData.requirements.split(/\s+/).filter(Boolean).length} / 100 minimum
                  </p>
                </div>
                {orderData.requirements.split(/\s+/).filter(Boolean).length < 100 && (
                  <div className="flex items-center gap-2 text-amber-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>Please enter at least 100 words before proceeding</span>
                  </div>
                )}
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => setCurrentStep('details')}>Back</Button>
                  <Button 
                    onClick={() => setCurrentStep('pricing')}
                    disabled={orderData.requirements.split(/\s+/).filter(Boolean).length < 10}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 'pricing' && (
              <div className="space-y-4">
                <Card className="bg-card/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Pricing Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span>Base Price</span>
                      <span className="font-medium">₹{orderData.basePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border text-emerald-500">
                      <span>Franchise Discount (15%)</span>
                      <span className="font-medium">-₹{orderData.discount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border text-blue-500">
                      <span>Your Commission (10%)</span>
                      <span className="font-medium">+₹{orderData.commission.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-3 text-lg font-bold">
                      <span>Final Payable Amount</span>
                      <span>₹{orderData.finalAmount.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => setCurrentStep('requirements')}>Back</Button>
                  <Button onClick={() => setCurrentStep('checkout')}>Proceed to Checkout</Button>
                </div>
              </div>
            )}

            {currentStep === 'checkout' && (
              <div className="space-y-4">
                <Card className="bg-gradient-to-r from-primary/10 to-emerald-500/10 border-primary/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Wallet className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-semibold">Wallet Balance: ₹2,45,680</h3>
                        <p className="text-sm text-muted-foreground">Sufficient balance for this order</p>
                      </div>
                    </div>
                    <div className="flex justify-between py-3 text-lg font-bold border-t border-border">
                      <span>Amount to Deduct</span>
                      <span>₹{orderData.finalAmount.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Invoice will be auto-generated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Developer task will be auto-created</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Commission will be credited on delivery</span>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => setCurrentStep('pricing')}>Back</Button>
                  <Button onClick={handlePlaceOrder} className="bg-emerald-600 hover:bg-emerald-700">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Confirm & Pay ₹{orderData.finalAmount.toLocaleString()}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: '156', color: 'text-blue-500' },
          { label: 'Active', value: '89', color: 'text-emerald-500' },
          { label: 'Pending', value: '12', color: 'text-amber-500' },
          { label: 'Delivered', value: '55', color: 'text-purple-500' },
        ].map((stat, idx) => (
          <Card key={idx} className="bg-card/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders List */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{order.product}</p>
                    <p className="text-sm text-muted-foreground">{order.id} • {order.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{order.type}</Badge>
                  <Badge variant={
                    order.status === 'Active' ? 'default' :
                    order.status === 'Delivered' ? 'secondary' : 'outline'
                  }>
                    {order.status}
                  </Badge>
                  <span className="font-medium">{order.amount}</span>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Missing Wallet import
import { Wallet } from 'lucide-react';
