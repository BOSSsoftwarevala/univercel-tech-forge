import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Percent,
  Save,
  Upload,
  Mail,
  Phone,
  MapPin,
  Globe,
  CreditCard,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AccountingSettings: React.FC = () => {
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Settings</h3>
          <p className="text-sm text-slate-500">Manage your business and application settings</p>
        </div>
        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="profile" className="gap-2">
            <Building2 className="w-4 h-4" />
            Shop Profile
          </TabsTrigger>
          <TabsTrigger value="tax" className="gap-2">
            <Percent className="w-4 h-4" />
            Tax Settings
          </TabsTrigger>
          <TabsTrigger value="invoice" className="gap-2">
            <FileText className="w-4 h-4" />
            Invoice Settings
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Payment
          </TabsTrigger>
        </TabsList>

        {/* Shop Profile */}
        <TabsContent value="profile" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900">Business Information</CardTitle>
                <CardDescription>Update your business details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input defaultValue="ABC Trading Company" />
                  </div>
                  <div className="space-y-2">
                    <Label>Legal Name</Label>
                    <Input defaultValue="ABC Trading Co. Pvt. Ltd." />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>GSTIN</Label>
                    <Input defaultValue="29ABCDE1234F1Z5" />
                  </div>
                  <div className="space-y-2">
                    <Label>PAN</Label>
                    <Input defaultValue="ABCDE1234F" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Business Type</Label>
                  <Select defaultValue="trading">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trading">Trading</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900">Logo</CardTitle>
                <CardDescription>Upload your business logo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-xl mx-auto flex items-center justify-center mb-4">
                    <Building2 className="w-10 h-10 text-slate-400" />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </Button>
                  <p className="text-xs text-slate-500 mt-2">PNG, JPG up to 2MB</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    Phone
                  </Label>
                  <Input defaultValue="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    Email
                  </Label>
                  <Input defaultValue="contact@abctrading.com" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-400" />
                    Website
                  </Label>
                  <Input defaultValue="www.abctrading.com" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  Address
                </Label>
                <Textarea 
                  defaultValue="123, Business Park, Main Road, Bangalore - 560001, Karnataka, India" 
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Settings */}
        <TabsContent value="tax" className="mt-6">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">Tax Configuration</CardTitle>
              <CardDescription>Configure tax settings for your invoices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Enable Tax</p>
                  <p className="text-sm text-slate-500">Apply tax on all invoices</p>
                </div>
                <Switch checked={taxEnabled} onCheckedChange={setTaxEnabled} />
              </div>

              {taxEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Default Tax Rate</Label>
                      <Select defaultValue="18">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No Tax (0%)</SelectItem>
                          <SelectItem value="5">GST 5%</SelectItem>
                          <SelectItem value="12">GST 12%</SelectItem>
                          <SelectItem value="18">GST 18%</SelectItem>
                          <SelectItem value="28">GST 28%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tax Type</Label>
                      <Select defaultValue="inclusive">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inclusive">Inclusive</SelectItem>
                          <SelectItem value="exclusive">Exclusive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                    <p className="text-sm text-emerald-700">
                      <strong>Note:</strong> Tax rates can be overridden at the invoice level if needed.
                    </p>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoice Settings */}
        <TabsContent value="invoice" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900">Invoice Numbering</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Invoice Prefix</Label>
                  <Input defaultValue="INV-" />
                </div>
                <div className="space-y-2">
                  <Label>Next Invoice Number</Label>
                  <Input type="number" defaultValue="157" />
                </div>
                <div className="space-y-2">
                  <Label>Number Padding</Label>
                  <Select defaultValue="4">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 digits (001)</SelectItem>
                      <SelectItem value="4">4 digits (0001)</SelectItem>
                      <SelectItem value="5">5 digits (00001)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg">
                  <p className="text-sm text-slate-600">Preview: <strong>INV-0157</strong></p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900">Invoice Defaults</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Due Days</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Due on Receipt</SelectItem>
                      <SelectItem value="7">Net 7</SelectItem>
                      <SelectItem value="15">Net 15</SelectItem>
                      <SelectItem value="30">Net 30</SelectItem>
                      <SelectItem value="45">Net 45</SelectItem>
                      <SelectItem value="60">Net 60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Terms & Conditions</Label>
                  <Textarea 
                    defaultValue="1. Payment is due within 30 days.&#10;2. Late payments attract 2% interest per month.&#10;3. Goods once sold cannot be returned." 
                    className="min-h-[120px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="mt-6">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">Bank Details</CardTitle>
              <CardDescription>These details will appear on your invoices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input defaultValue="HDFC Bank" />
                </div>
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Input defaultValue="MG Road, Bangalore" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input defaultValue="50100123456789" />
                </div>
                <div className="space-y-2">
                  <Label>IFSC Code</Label>
                  <Input defaultValue="HDFC0001234" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Account Holder Name</Label>
                  <Input defaultValue="ABC Trading Co. Pvt. Ltd." />
                </div>
                <div className="space-y-2">
                  <Label>UPI ID</Label>
                  <Input defaultValue="abctrading@hdfcbank" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">Payment Methods</CardTitle>
              <CardDescription>Enable payment methods for your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Cash', enabled: true },
                  { name: 'Bank Transfer', enabled: true },
                  { name: 'UPI', enabled: true },
                  { name: 'Credit/Debit Card', enabled: false },
                  { name: 'Cheque', enabled: true },
                ].map((method) => (
                  <div key={method.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">{method.name}</span>
                    <Switch defaultChecked={method.enabled} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountingSettings;
