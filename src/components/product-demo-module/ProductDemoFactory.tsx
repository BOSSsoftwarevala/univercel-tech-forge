/**
 * DEMO FACTORY - Bulk demo generation
 */
import React, { useState } from 'react';
import { Factory, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export const ProductDemoFactory: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('5');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedProduct) { toast.error('Select a product'); return; }
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsGenerating(false);
    toast.success(`${quantity} demos generated successfully!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2"><Factory className="w-5 h-5 text-violet-400" />Demo Factory</h1>
        <p className="text-sm text-muted-foreground">Bulk generate demos with AI cloning</p>
      </div>
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-violet-400"><Sparkles className="w-4 h-4" /><span className="text-sm font-medium">AI Demo Generator</span></div>
          <div className="grid grid-cols-3 gap-4">
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger><SelectValue placeholder="Select Product" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="school-erp">School ERP Pro</SelectItem>
                <SelectItem value="hospital">Hospital Management</SelectItem>
                <SelectItem value="pos">Restaurant POS</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" min="1" max="50" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" />
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-violet-600 hover:bg-violet-700">
              {isGenerating ? 'Generating...' : 'Generate Demos'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
