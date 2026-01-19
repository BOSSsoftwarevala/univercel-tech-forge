import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Send, FileText, BarChart3, Plus } from "lucide-react";

interface EmailSMSMarketingProps { activeView: string; }

const EmailSMSMarketing = ({ activeView }: EmailSMSMarketingProps) => {
  const campaigns = [
    { name: "Welcome Series", type: "email", sent: 12450, opened: 45.2, clicked: 12.3 },
    { name: "Product Update", type: "email", sent: 8900, opened: 38.5, clicked: 8.7 },
    { name: "Flash Sale Alert", type: "sms", sent: 5600, opened: 0, clicked: 15.2 },
    { name: "WhatsApp Promo", type: "whatsapp", sent: 3400, opened: 0, clicked: 22.4 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Email & SMS Marketing</h3>
        <Button size="sm" className="bg-teal-600 hover:bg-teal-700"><Plus className="w-4 h-4 mr-1" />New Campaign</Button>
      </div>
      <div className="grid gap-4">
        {campaigns.map((c, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {c.type === 'email' ? <Mail className="w-8 h-8 text-teal-400" /> : c.type === 'sms' ? <MessageSquare className="w-8 h-8 text-blue-400" /> : <Send className="w-8 h-8 text-emerald-400" />}
                  <div>
                    <h4 className="font-medium text-white">{c.name}</h4>
                    <p className="text-xs text-slate-400">{c.sent.toLocaleString()} sent</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-teal-500/20 text-teal-400">{c.type.toUpperCase()}</Badge>
                  {c.opened > 0 && <div className="text-center"><p className="text-sm font-bold text-white">{c.opened}%</p><p className="text-xs text-slate-400">Opened</p></div>}
                  <div className="text-center"><p className="text-sm font-bold text-emerald-400">{c.clicked}%</p><p className="text-xs text-slate-400">CTR</p></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmailSMSMarketing;
