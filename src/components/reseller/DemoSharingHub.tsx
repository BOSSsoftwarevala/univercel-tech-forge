import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, Copy, QrCode, Eye, Share2, Globe, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const categories = [
  { id: 'pos', name: 'POS System', clicks: 156, conversions: 23 },
  { id: 'school', name: 'School ERP', clicks: 98, conversions: 12 },
  { id: 'hospital', name: 'Hospital Management', clicks: 67, conversions: 8 },
  { id: 'restaurant', name: 'Restaurant Software', clicks: 45, conversions: 5 },
  { id: 'crm', name: 'CRM System', clicks: 34, conversions: 4 },
];

const languages = ['Hindi', 'English', 'Marathi', 'Tamil', 'Telugu'];

const recentLinks = [
  { id: 1, category: 'POS System', language: 'Hindi', clicks: 45, created: '2 hours ago' },
  { id: 2, category: 'School ERP', language: 'English', clicks: 23, created: '1 day ago' },
  { id: 3, category: 'Hospital', language: 'Marathi', clicks: 12, created: '3 days ago' },
];

export const DemoSharingHub = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const generateLink = () => {
    if (!selectedCategory) {
      toast({ title: "Select Category", description: "Please select a product category", variant: "destructive" });
      return;
    }
    const link = `https://demo.softwarevala.com/${selectedCategory}?lang=${selectedLanguage || 'en'}&ref=RS789`;
    setGeneratedLink(link);
    toast({ title: "Link Generated!", description: "Your demo link is ready to share" });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({ title: "Copied!", description: "Link copied to clipboard" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-foreground">Demo Sharing Hub</h2>
          <p className="text-sm text-muted-foreground">Generate and track demo links</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Link Generator */}
        <Card className="glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Link2 className="w-5 h-5 text-neon-blue" />
              Generate Demo Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Product Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-secondary/30 border-border/30">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Language (Auto-translate)</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="bg-secondary/30 border-border/30">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang} value={lang.toLowerCase()}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-neon-blue to-primary text-background"
              onClick={generateLink}
            >
              <Link2 className="w-4 h-4 mr-2" />
              Generate Link
            </Button>

            {generatedLink && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-neon-green/10 border border-neon-green/30"
              >
                <p className="text-xs text-muted-foreground mb-2">Your Demo Link:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-neon-green truncate">{generatedLink}</code>
                  <Button size="sm" variant="ghost" onClick={copyLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* QR Code Generator */}
        <Card className="glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <QrCode className="w-5 h-5 text-neon-blue" />
              QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="w-40 h-40 rounded-xl bg-secondary/30 border border-border/30 flex items-center justify-center">
              {generatedLink ? (
                <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-background" />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center">Generate a link first</p>
              )}
            </div>
            <Button variant="outline" className="w-full border-neon-blue/30" disabled={!generatedLink}>
              Download QR Code
            </Button>
          </CardContent>
        </Card>

        {/* Click Tracking Stats */}
        <Card className="glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Eye className="w-5 h-5 text-neon-blue" />
              Click Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.slice(0, 4).map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/20"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.clicks} clicks</p>
                </div>
                <Badge variant="outline" className="border-neon-green/30 text-neon-green">
                  {cat.conversions} sales
                </Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Links */}
      <Card className="glass-panel border-border/30">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Demo Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentLinks.map((link, index) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-border/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-neon-blue" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{link.category}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe className="w-3 h-3" />
                    {link.language}
                    <span>•</span>
                    {link.created}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">{link.clicks} clicks</Badge>
                <Button variant="ghost" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
