import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Megaphone, QrCode, MessageSquare, Share2, Copy, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

const creatives = [
  { id: 1, name: 'POS Diwali Offer', type: 'Banner', size: '1080x1080', category: 'POS System' },
  { id: 2, name: 'School ERP Features', type: 'Carousel', size: '1080x1080', category: 'School ERP' },
  { id: 3, name: 'Restaurant Software Demo', type: 'Video', size: '1920x1080', category: 'Restaurant' },
  { id: 4, name: 'CRM Benefits Poster', type: 'Poster', size: '1200x1500', category: 'CRM' },
];

const socialTemplates = [
  { platform: 'WhatsApp', template: '🚀 Transform your business with our advanced {PRODUCT}! Get a FREE demo today. Click: {LINK}' },
  { platform: 'Facebook', template: 'Looking for a reliable {PRODUCT}? Our solution has helped 500+ businesses grow. Schedule your demo now! 📈' },
  { platform: 'Instagram', template: '✨ Modern {PRODUCT} for modern businesses! DM us for exclusive offers. #BusinessGrowth #Technology' },
];

const smsTemplates = [
  { name: 'Demo Invitation', template: 'Hi! Your FREE {PRODUCT} demo is ready. Click {LINK} to view. Limited time offer!' },
  { name: 'Follow-up', template: 'Hi! Just checking if you had a chance to see the {PRODUCT} demo. Any questions? Reply to connect.' },
  { name: 'Offer Alert', template: '🎉 Special offer! Get 20% off on {PRODUCT} this week. Book demo now: {LINK}' },
];

export const MarketingToolkit = () => {
  const copyTemplate = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Template copied to clipboard" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-foreground">Marketing Toolkit</h2>
          <p className="text-sm text-muted-foreground">Ready-made creatives and templates</p>
        </div>
      </div>

      <Tabs defaultValue="creatives" className="space-y-6">
        <TabsList className="bg-secondary/30">
          <TabsTrigger value="creatives">Creatives</TabsTrigger>
          <TabsTrigger value="social">Social Templates</TabsTrigger>
          <TabsTrigger value="sms">SMS/WhatsApp</TabsTrigger>
          <TabsTrigger value="qr">QR Codes</TabsTrigger>
        </TabsList>

        <TabsContent value="creatives">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Image className="w-5 h-5 text-neon-blue" />
                Ready-Made Creatives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {creatives.map((creative, index) => (
                  <motion.div
                    key={creative.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-secondary/20 border border-border/30 hover:border-neon-blue/30 transition-all cursor-pointer"
                  >
                    <div className="w-full h-32 rounded-lg bg-gradient-to-br from-neon-blue/20 to-primary/20 flex items-center justify-center mb-3">
                      <Image className="w-8 h-8 text-neon-blue" />
                    </div>
                    <p className="font-medium text-foreground text-sm mb-1">{creative.name}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">{creative.type}</Badge>
                      <span className="text-xs text-muted-foreground">{creative.size}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full border-neon-blue/30">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Share2 className="w-5 h-5 text-neon-blue" />
                Social Posting Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {socialTemplates.map((template, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-secondary/20 border border-border/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="border-neon-blue/30 text-neon-blue">
                      {template.platform}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => copyTemplate(template.template)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-foreground">{template.template}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Replace {'{PRODUCT}'} and {'{LINK}'} with your content
                  </p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <MessageSquare className="w-5 h-5 text-neon-blue" />
                SMS/WhatsApp Preset Lines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {smsTemplates.map((template, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-secondary/20 border border-border/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{template.name}</span>
                    <Button variant="ghost" size="sm" onClick={() => copyTemplate(template.template)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.template}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <QrCode className="w-5 h-5 text-neon-blue" />
                QR Code Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="w-48 h-48 rounded-xl bg-white flex items-center justify-center mb-4">
                <QrCode className="w-36 h-36 text-background" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">Your personalized demo QR code</p>
              <div className="flex gap-2">
                <Button variant="outline" className="border-neon-blue/30">
                  <Download className="w-4 h-4 mr-2" />
                  Download PNG
                </Button>
                <Button variant="outline" className="border-neon-blue/30">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
