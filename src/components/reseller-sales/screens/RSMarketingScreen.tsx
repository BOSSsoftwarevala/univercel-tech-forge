/**
 * RESELLER MARKETING TOOLS (LIMITED)
 * ALLOWED: Product Posters, AI Caption Generator, Lead Form Generator, Shareable Links
 * NOT ALLOWED: SEO Panel, Campaign Control, Ad Spend Control
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Image,
  Sparkles,
  FileText,
  Link2,
  Download,
  Copy,
  RefreshCw,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';

const posters = [
  { id: 1, name: 'School ERP Banner', type: 'Social Media', size: '1080x1080' },
  { id: 2, name: 'Hospital HMS Poster', type: 'WhatsApp', size: '800x800' },
  { id: 3, name: 'Retail POS Flyer', type: 'Print', size: 'A4' },
  { id: 4, name: 'Business ERP Ad', type: 'Facebook', size: '1200x628' },
];

const products = [
  { id: 'school', name: 'School ERP Pro' },
  { id: 'hospital', name: 'Hospital HMS' },
  { id: 'retail', name: 'Retail POS' },
  { id: 'business', name: 'Business ERP' },
];

export function RSMarketingScreen() {
  const [activeTab, setActiveTab] = useState('posters');
  const [captionProduct, setCaptionProduct] = useState('');
  const [captionTone, setCaptionTone] = useState('professional');
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [formName, setFormName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [generatedFormLink, setGeneratedFormLink] = useState('');

  const handleGenerateCaption = async () => {
    if (!captionProduct) {
      toast.error('Please select a product');
      return;
    }
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const captions: Record<string, Record<string, string>> = {
      professional: {
        school: '🎓 Transform your school with our comprehensive ERP solution. Streamline admissions, fee collection, and academic management. #SchoolERP #EdTech #DigitalEducation',
        hospital: '🏥 Revolutionize patient care with Hospital HMS. From OPD to pharmacy, manage everything seamlessly. #HealthTech #HospitalManagement',
        retail: '🛒 Boost your retail business with smart POS. Real-time inventory, GST-ready billing, and more! #RetailTech #POS',
        business: '💼 Take your business to the next level with our all-in-one ERP solution. #BusinessGrowth #ERP',
      },
      casual: {
        school: 'Hey educators! 👋 Ready to make school management super easy? Check out our School ERP! 🚀',
        hospital: 'Running a hospital is tough! 😅 Let our HMS handle the chaos while you focus on patients! 💪',
        retail: 'Shop owners, life just got easier! 🎉 POS that actually works the way you want!',
        business: 'Business management giving you headaches? 🤯 Our ERP is the cure you need! 💊',
      },
    };
    setGeneratedCaption(captions[captionTone][captionProduct] || 'Amazing software for your business needs!');
    setIsGenerating(false);
  };

  const handleGenerateForm = () => {
    if (!formName || !selectedProduct) {
      toast.error('Please fill all fields');
      return;
    }
    const link = `https://softwarevala.com/lead/${selectedProduct}/${formName.toLowerCase().replace(/\s+/g, '-')}`;
    setGeneratedFormLink(link);
    toast.success('Lead form generated!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const shareableLinks = products.map((p) => ({
    ...p,
    link: `https://softwarevala.com/r/YOUR-CODE/${p.id}`,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Marketing Tools</h1>
        <p className="text-sm text-slate-400">Grow your sales with these tools</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="posters" className="data-[state=active]:bg-emerald-600">
            <Image className="h-4 w-4 mr-1" />
            Posters
          </TabsTrigger>
          <TabsTrigger value="captions" className="data-[state=active]:bg-emerald-600">
            <Sparkles className="h-4 w-4 mr-1" />
            AI Captions
          </TabsTrigger>
          <TabsTrigger value="forms" className="data-[state=active]:bg-emerald-600">
            <FileText className="h-4 w-4 mr-1" />
            Lead Forms
          </TabsTrigger>
          <TabsTrigger value="links" className="data-[state=active]:bg-emerald-600">
            <Link2 className="h-4 w-4 mr-1" />
            Share Links
          </TabsTrigger>
        </TabsList>

        {/* Posters Tab */}
        <TabsContent value="posters" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posters.map((poster, index) => (
              <motion.div
                key={poster.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-lg flex items-center justify-center mb-4">
                      <Image className="h-12 w-12 text-emerald-400" />
                    </div>
                    <p className="text-white font-medium">{poster.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                          {poster.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                          {poster.size}
                        </Badge>
                      </div>
                      <Button size="sm" variant="ghost" className="text-emerald-400">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* AI Captions Tab */}
        <TabsContent value="captions" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                AI Caption Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Select Product</label>
                  <Select value={captionProduct} onValueChange={setCaptionProduct}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Choose product" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Tone</label>
                  <Select value={captionTone} onValueChange={setCaptionTone}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleGenerateCaption}
                disabled={isGenerating}
                className="bg-emerald-600 hover:bg-emerald-700 w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Caption
                  </>
                )}
              </Button>

              {generatedCaption && (
                <div className="p-4 rounded-lg bg-slate-800 border border-emerald-500/30">
                  <p className="text-white mb-3">{generatedCaption}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-emerald-500/30 text-emerald-400"
                    onClick={() => copyToClipboard(generatedCaption)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lead Forms Tab */}
        <TabsContent value="forms" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Lead Form Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Form Name</label>
                  <Input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., School Lead Form"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Product</label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleGenerateForm} className="bg-emerald-600 hover:bg-emerald-700">
                Generate Form Link
              </Button>

              {generatedFormLink && (
                <div className="p-4 rounded-lg bg-slate-800 border border-emerald-500/30">
                  <p className="text-xs text-slate-400 mb-2">Your Lead Form Link:</p>
                  <div className="flex items-center gap-2">
                    <Input
                      value={generatedFormLink}
                      readOnly
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      className="border-emerald-500/30 text-emerald-400"
                      onClick={() => copyToClipboard(generatedFormLink)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Share Links Tab */}
        <TabsContent value="links" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Shareable Product Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shareableLinks.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
                  >
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-xs text-slate-400 truncate max-w-xs">{item.link}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-white"
                        onClick={() => copyToClipboard(item.link)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-emerald-400"
                        onClick={() => {
                          copyToClipboard(item.link);
                          toast.success('Link copied! Ready to share');
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
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
