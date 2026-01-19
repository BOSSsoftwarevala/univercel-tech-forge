/**
 * PLACE ORDER SCREEN
 * Select Software, License, Territory, Domain, Logo, Submit
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Package,
  Globe,
  Upload,
  CreditCard,
  CheckCircle,
  ArrowRight,
  Wallet,
} from 'lucide-react';

const steps = [
  { id: 1, label: 'Select Software', icon: Package },
  { id: 2, label: 'License & Territory', icon: Globe },
  { id: 3, label: 'Domain & Branding', icon: Upload },
  { id: 4, label: 'Review & Submit', icon: CheckCircle },
];

const softwareOptions = [
  { id: 'school', name: 'School Management Pro', price: 2999 },
  { id: 'erp', name: 'Enterprise ERP Suite', price: 4999 },
  { id: 'crm', name: 'CRM Ultimate', price: 1999 },
  { id: 'hrm', name: 'HR Management Plus', price: 1499 },
];

const licenseTypes = [
  { id: 'basic', name: 'Basic License', users: '1-50', price: 0 },
  { id: 'pro', name: 'Pro License', users: '51-200', price: 500 },
  { id: 'enterprise', name: 'Enterprise License', users: 'Unlimited', price: 1500 },
];

export function FOPlaceOrderScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSoftware, setSelectedSoftware] = useState('');
  const [selectedLicense, setSelectedLicense] = useState('');
  const [territory, setTerritory] = useState('');
  const [domain, setDomain] = useState('');

  const walletBalance = 45200;
  const estimatedTotal = 2999;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Place New Order</h1>
          <p className="text-muted-foreground">Configure and submit your software order</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <Wallet className="h-4 w-4 text-emerald-400" />
          <span className="text-sm">Balance: </span>
          <span className="font-bold text-emerald-400">${walletBalance.toLocaleString()}</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className={`text-sm ${isActive ? 'font-semibold' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-emerald-500' : 'bg-muted'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Software</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {softwareOptions.map((software) => (
                  <div
                    key={software.id}
                    onClick={() => setSelectedSoftware(software.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedSoftware === software.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{software.name}</p>
                        <p className="text-2xl font-bold text-primary">${software.price}</p>
                      </div>
                      {selectedSoftware === software.id && (
                        <CheckCircle className="h-6 w-6 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">License Type & Territory</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {licenseTypes.map((license) => (
                  <div
                    key={license.id}
                    onClick={() => setSelectedLicense(license.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedLicense === license.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-semibold">{license.name}</p>
                    <p className="text-sm text-muted-foreground">Users: {license.users}</p>
                    <p className="text-lg font-bold text-primary mt-2">
                      {license.price === 0 ? 'Included' : `+$${license.price}`}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label>Select Territory</Label>
                <Select value={territory} onValueChange={setTerritory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your territory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north">North Region</SelectItem>
                    <SelectItem value="south">South Region</SelectItem>
                    <SelectItem value="east">East Region</SelectItem>
                    <SelectItem value="west">West Region</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Domain & Branding</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Add Domain</Label>
                  <Input
                    placeholder="e.g., client.yourdomain.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Upload Client Logo</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Review Order</h3>
              <div className="space-y-3 p-4 rounded-lg bg-muted/30">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Software</span>
                  <span className="font-medium">School Management Pro</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">License</span>
                  <span className="font-medium">Pro License (+$500)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Territory</span>
                  <span className="font-medium">North Region</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Domain</span>
                  <span className="font-medium">{domain || 'Not specified'}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Franchise Discount</span>
                  <span className="font-medium text-emerald-400">-15% Applied</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary">${estimatedTotal.toLocaleString()}</span>
                </div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400">
                Will be deducted from wallet automatically
              </Badge>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            {currentStep < 4 ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)} className="gap-2">
                Next Step
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button className="gap-2 bg-emerald-500 hover:bg-emerald-600">
                <CreditCard className="h-4 w-4" />
                Submit Order
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FOPlaceOrderScreen;
