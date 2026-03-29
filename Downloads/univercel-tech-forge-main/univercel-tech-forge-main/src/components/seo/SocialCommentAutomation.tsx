import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageCircle, Heart, Share2, Users, TrendingUp,
  Facebook, Instagram, Twitter, Linkedin, Youtube,
  Bot, Clock, RefreshCw, Plus, ArrowUpRight, Settings,
  ThumbsUp, MessageSquare, Eye, Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SocialCommentAutomation = () => {
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);

  const socialStats = [
    { label: "Comments Replied", value: "2,847", change: "+24%", platform: "all", icon: MessageCircle },
    { label: "Engagement Rate", value: "4.8%", change: "+0.6%", platform: "all", icon: Heart },
    { label: "Posts Scheduled", value: "48", change: "+12", platform: "all", icon: Clock },
    { label: "Followers Gained", value: "+1,284", change: "+18%", platform: "all", icon: Users },
  ];

  const platforms = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-400", followers: "28.4K", engagement: "5.2%", pendingComments: 24 },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-400", followers: "45.2K", engagement: "3.8%", pendingComments: 18 },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-500", followers: "12.8K", engagement: "6.4%", pendingComments: 8 },
    { id: "twitter", name: "Twitter/X", icon: Twitter, color: "text-slate-300", followers: "8.9K", engagement: "2.1%", pendingComments: 32 },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-400", followers: "15.2K", engagement: "4.5%", pendingComments: 45 },
  ];

  const recentComments = [
    { id: 1, platform: "Instagram", user: "@tech_lover_india", comment: "This software looks amazing! How do I get a demo?", aiReply: "Thank you! 🙏 You can book a free demo at softwarevala.com/demo. Our team will reach out within 24 hours!", time: "5 min ago", status: "replied" },
    { id: 2, platform: "LinkedIn", user: "Rahul Sharma", comment: "Great insights on digital transformation. What industries do you serve?", aiReply: null, time: "12 min ago", status: "pending" },
    { id: 3, platform: "Facebook", user: "Priya Technologies", comment: "Can you integrate with our existing CRM?", aiReply: "Absolutely! We support 50+ CRM integrations including Salesforce, HubSpot, and Zoho. DM us for details! 📩", time: "25 min ago", status: "replied" },
    { id: 4, platform: "YouTube", user: "@business_guru", comment: "Excellent tutorial! Can you make one on API integrations?", aiReply: null, time: "1 hour ago", status: "pending" },
  ];

  const automationRules = [
    { id: 1, trigger: "Contains 'demo'", action: "Send demo link", platform: "All", status: "active", triggered: 142 },
    { id: 2, trigger: "Contains 'price'", action: "Send pricing page", platform: "All", status: "active", triggered: 89 },
    { id: 3, trigger: "Positive sentiment", action: "Thank & engage", platform: "Instagram", status: "active", triggered: 256 },
    { id: 4, trigger: "Question detected", action: "Flag for review", platform: "LinkedIn", status: "active", triggered: 45 },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram": return <Instagram className="w-4 h-4 text-pink-400" />;
      case "facebook": return <Facebook className="w-4 h-4 text-blue-400" />;
      case "linkedin": return <Linkedin className="w-4 h-4 text-blue-500" />;
      case "twitter": return <Twitter className="w-4 h-4 text-slate-300" />;
      case "youtube": return <Youtube className="w-4 h-4 text-red-400" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl border border-pink-500/30">
              <MessageCircle className="h-6 w-6 text-pink-400" />
            </div>
            Social & Comment Automation
          </h1>
          <p className="text-muted-foreground mt-1">AI-powered social media engagement & comment replies</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-pink-500/20">
            <Bot className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-slate-400">AI Auto-Reply</span>
            <Switch checked={autoReplyEnabled} onCheckedChange={setAutoReplyEnabled} />
          </div>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Post
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {socialStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-pink-500/20 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-pink-500/10 rounded-lg">
                    <stat.icon className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-400">
                    <ArrowUpRight className="w-4 h-4" />
                    {stat.change}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Platforms Overview */}
      <Card className="bg-slate-900/50 border-pink-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-pink-300">Connected Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {platforms.map((platform) => (
              <motion.div
                key={platform.id}
                className="p-4 bg-slate-800/30 rounded-lg border border-pink-500/10 hover:border-pink-500/30 transition-all text-center"
                whileHover={{ y: -5 }}
              >
                <platform.icon className={`w-8 h-8 mx-auto ${platform.color}`} />
                <h4 className="font-medium text-white mt-2">{platform.name}</h4>
                <p className="text-lg font-bold text-cyan-400">{platform.followers}</p>
                <p className="text-xs text-muted-foreground">Engagement: {platform.engagement}</p>
                {platform.pendingComments > 0 && (
                  <Badge className="mt-2 bg-orange-500/20 text-orange-400">{platform.pendingComments} pending</Badge>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Comments */}
        <Card className="bg-slate-900/50 border-pink-500/20 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-pink-300">Recent Comments</CardTitle>
              <Button variant="ghost" size="sm" className="text-pink-400">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentComments.map((comment) => (
              <motion.div
                key={comment.id}
                className="p-3 bg-slate-800/30 rounded-lg border border-pink-500/10"
                whileHover={{ x: 5 }}
              >
                <div className="flex items-start gap-3">
                  {getPlatformIcon(comment.platform)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white text-sm">{comment.user}</span>
                      <span className="text-xs text-muted-foreground">{comment.time}</span>
                    </div>
                    <p className="text-sm text-slate-300 mt-1">{comment.comment}</p>
                    {comment.aiReply && (
                      <div className="mt-2 p-2 bg-green-500/10 rounded border border-green-500/20">
                        <p className="text-xs text-green-400 flex items-center gap-1">
                          <Bot className="w-3 h-3" /> AI Reply:
                        </p>
                        <p className="text-sm text-slate-300">{comment.aiReply}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={comment.status === "replied" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                        {comment.status}
                      </Badge>
                      {comment.status === "pending" && (
                        <Button variant="ghost" size="sm" className="text-xs text-pink-400">
                          <Zap className="w-3 h-3 mr-1" />
                          Auto-Reply
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Automation Rules */}
        <Card className="bg-slate-900/50 border-pink-500/20 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-pink-300">Automation Rules</CardTitle>
              <Button variant="outline" size="sm" className="border-pink-500/30 text-pink-400">
                <Plus className="w-4 h-4 mr-1" />
                Add Rule
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {automationRules.map((rule) => (
              <motion.div
                key={rule.id}
                className="p-3 bg-slate-800/30 rounded-lg border border-pink-500/10"
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">IF: {rule.trigger}</p>
                    <p className="text-xs text-pink-400 mt-1">→ THEN: {rule.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">Platform: {rule.platform}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{rule.triggered}x</span>
                    <Badge className="bg-green-500/20 text-green-400">{rule.status}</Badge>
                    <Switch checked={rule.status === "active"} />
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SocialCommentAutomation;
