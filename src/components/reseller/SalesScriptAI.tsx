import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, MessageSquare, Languages, Lightbulb, Copy, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

const categories = ['POS System', 'School ERP', 'Hospital Management', 'Restaurant Software', 'CRM System'];
const languages = ['Hindi', 'English', 'Marathi', 'Tamil', 'Telugu', 'Bengali'];

const objectionHandlers = [
  { objection: '"It\'s too expensive"', response: 'I understand budget is important. Let me show you how this investment pays for itself within 3 months through increased efficiency...' },
  { objection: '"We already have a system"', response: 'That\'s great! Many of our successful clients upgraded from existing solutions. Would you be open to a quick comparison to see if there are gaps we can fill?' },
  { objection: '"Need to think about it"', response: 'Of course! What specific aspects would you like to consider? I can provide more information on those points...' },
];

const pitchTemplates = [
  { name: 'Opening Hook', template: 'Good morning! I noticed your business could benefit from streamlined operations. Do you have 2 minutes to hear how similar businesses increased their revenue by 40%?' },
  { name: 'Value Proposition', template: 'Our [PRODUCT] helps businesses like yours save 5+ hours daily on manual tasks, reduce errors by 90%, and increase customer satisfaction.' },
  { name: 'Closing Statement', template: 'Based on what you\'ve shared, I believe this solution is perfect for your needs. Shall I set up a personalized demo this week?' },
];

export const SalesScriptAI = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [generatedPitch, setGeneratedPitch] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePitch = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedPitch(`नमस्ते! मैं Software Vala से बोल रहा हूं। क्या आपके पास 2 मिनट हैं?

मैंने देखा कि आपका ${selectedCategory || 'business'} काफी अच्छा चल रहा है। हमारा सॉफ्टवेयर आपकी daily operations को 50% तक faster बना सकता है।

क्या आप एक free demo देखना चाहेंगे?`);
      setIsGenerating(false);
      toast({ title: "Script Generated!", description: "AI has created your personalized pitch" });
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Script copied to clipboard" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-foreground">AI Sales Script Generator</h2>
          <p className="text-sm text-muted-foreground">Auto-generate pitches in multiple languages</p>
        </div>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="bg-secondary/30">
          <TabsTrigger value="generator">Pitch Generator</TabsTrigger>
          <TabsTrigger value="objections">Objection Handling</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="comparison">Product Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="glass-panel border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Bot className="w-5 h-5 text-neon-blue" />
                  AI Pitch Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Product Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-secondary/30 border-border/30">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Output Language</label>
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
                  onClick={generatePitch}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate AI Pitch'}
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-panel border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-foreground">
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-neon-blue" />
                    Generated Script
                  </span>
                  {generatedPitch && (
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generatedPitch)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedPitch ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 rounded-lg bg-secondary/20 border border-border/30"
                  >
                    <p className="text-sm text-foreground whitespace-pre-line">{generatedPitch}</p>
                  </motion.div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Generate a pitch to see it here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="objections" className="space-y-4">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Lightbulb className="w-5 h-5 text-neon-orange" />
                Objection Handling Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {objectionHandlers.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-secondary/20 border border-border/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="destructive">{item.objection}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(item.response)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.response}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="text-foreground">Ready-to-Use Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pitchTemplates.map((template, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-secondary/20 border border-border/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="border-neon-blue/30 text-neon-blue">{template.name}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(template.template)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-foreground">{template.template}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="text-foreground">Product Comparison Helper</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left p-3 text-muted-foreground">Feature</th>
                      <th className="text-center p-3 text-neon-blue">Our Solution</th>
                      <th className="text-center p-3 text-muted-foreground">Competitors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['24/7 Support', 'Custom Branding', 'Multi-language', 'Offline Mode', 'Free Training'].map((feature, i) => (
                      <tr key={feature} className="border-b border-border/30">
                        <td className="p-3 text-foreground">{feature}</td>
                        <td className="p-3 text-center text-neon-green">✓</td>
                        <td className="p-3 text-center text-neon-red">{i % 2 === 0 ? '✗' : '✓'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
