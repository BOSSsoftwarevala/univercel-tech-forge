import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Code,
  Target,
  LifeBuoy,
  Building,
  Share2,
  Star,
  Globe,
  Wallet,
  Heart,
  Shield,
  Send,
  Mic,
  MicOff,
  AlertTriangle,
  MessageSquare,
  Users,
  Bell,
  Radio,
  Lock,
  Volume2,
  VolumeX,
  Settings,
  Search,
  Phone,
  X,
  Bot,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Eye,
  EyeOff,
  Pause,
  TrendingUp,
  Scale,
  Monitor,
  Hash,
  ArrowUpRight,
  ShieldAlert,
  FileText,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  processMessage,
  maskUserName,
  getMessageBubbleClass,
  getViolationAction,
  generateWatermark,
  analyzeSentiment,
  getSentimentColor,
  getSentimentBg,
  channelCategories,
  roleChannelAccess,
  SentimentScore,
} from "@/utils/chatSecurity";

// Role icon components
const roleIcons: Record<string, React.ComponentType<any>> = {
  super_admin: Crown,
  developer: Code,
  sales: Target,
  support: LifeBuoy,
  franchise: Building,
  reseller: Share2,
  influencer: Star,
  seo: Globe,
  finance: Wallet,
  client_success: Heart,
  task_manager: TrendingUp,
  legal: Scale,
  demo_manager: Monitor,
  hr: Users,
};

interface Channel {
  id: string;
  name: string;
  category: string;
  type: "role_based" | "direct" | "broadcast" | "system";
  unread: number;
  description: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isLocked?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderRole: string;
  senderMaskedName: string;
  senderRegion: string;
  content: string;
  messageType: "text" | "voice_note" | "ai_reply" | "system";
  isFlagged: boolean;
  flagReason?: string;
  sentiment: { score: SentimentScore; emoji: string };
  createdAt: string;
  isEncrypted: boolean;
}

interface OnlineUser {
  id: string;
  role: string;
  maskedName: string;
  region: string;
  isOnline: boolean;
  isMuted: boolean;
  sentimentAvg: SentimentScore;
  violationCount: number;
}

// Mock data with category-locked channels
const mockChannels: Channel[] = [
  { id: "1", name: "Developer Tasks", category: "developer", type: "role_based", unread: 2, description: "Tasks & Code Only", lastMessage: "Task #4521 completed", lastMessageTime: "2m" },
  { id: "2", name: "Sales Pipeline", category: "sales", type: "role_based", unread: 5, description: "Leads & Closures Only", lastMessage: "New lead from Dubai", lastMessageTime: "8m" },
  { id: "3", name: "Support Tickets", category: "support", type: "role_based", unread: 3, description: "Tickets Only", lastMessage: "Ticket #892 resolved", lastMessageTime: "15m" },
  { id: "4", name: "Finance Hub", category: "finance", type: "role_based", unread: 1, description: "Payouts & Commissions", lastMessage: "Payout approved", lastMessageTime: "1h" },
  { id: "5", name: "General Work", category: "general", type: "role_based", unread: 0, description: "Work Discussion", lastMessage: "Team update", lastMessageTime: "2h" },
  { id: "6", name: "Super Admin Broadcast", category: "broadcast", type: "broadcast", unread: 1, description: "System Announcements", lastMessage: "Security update", lastMessageTime: "4h", isLocked: true },
  { id: "7", name: "System Alerts", category: "system", type: "system", unread: 2, description: "Auto-generated Alerts", lastMessage: "Violation detected", lastMessageTime: "30m" },
];

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "admin1",
    senderRole: "super_admin",
    senderMaskedName: "A***",
    senderRegion: "India",
    content: "Welcome to Software Vala Internal Chat Hub. All messages are encrypted and logged for compliance.",
    messageType: "system",
    isFlagged: false,
    sentiment: { score: "neutral", emoji: "📢" },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isEncrypted: true,
  },
  {
    id: "2",
    senderId: "dev1",
    senderRole: "developer",
    senderMaskedName: "R***",
    senderRegion: "East Africa",
    content: "Task #4521 completed. Ready for code review.",
    messageType: "text",
    isFlagged: false,
    sentiment: { score: "positive", emoji: "😊" },
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    isEncrypted: true,
  },
  {
    id: "3",
    senderId: "sales1",
    senderRole: "sales",
    senderMaskedName: "S***",
    senderRegion: "UAE",
    content: "New franchise lead from Dubai. High priority closure expected.",
    messageType: "text",
    isFlagged: false,
    sentiment: { score: "positive", emoji: "😊" },
    createdAt: new Date(Date.now() - 900000).toISOString(),
    isEncrypted: true,
  },
  {
    id: "4",
    senderId: "bot",
    senderRole: "super_admin",
    senderMaskedName: "AI Assistant",
    senderRegion: "System",
    content: "Reminder: All contact details are automatically masked. Attempting to share personal information will be flagged.",
    messageType: "ai_reply",
    isFlagged: false,
    sentiment: { score: "neutral", emoji: "🤖" },
    createdAt: new Date(Date.now() - 300000).toISOString(),
    isEncrypted: true,
  },
];

const mockOnlineUsers: OnlineUser[] = [
  { id: "1", role: "super_admin", maskedName: "👑 BOSS-01", region: "India", isOnline: true, isMuted: false, sentimentAvg: "positive", violationCount: 0 },
  { id: "2", role: "developer", maskedName: "EMP-042", region: "East Africa", isOnline: true, isMuted: false, sentimentAvg: "neutral", violationCount: 0 },
  { id: "3", role: "sales", maskedName: "SLS-00123", region: "UAE", isOnline: true, isMuted: false, sentimentAvg: "positive", violationCount: 0 },
  { id: "4", role: "support", maskedName: "SUP-00456", region: "UK", isOnline: false, isMuted: false, sentimentAvg: "neutral", violationCount: 1 },
  { id: "5", role: "franchise", maskedName: "FRN-0789", region: "Kenya", isOnline: true, isMuted: true, sentimentAvg: "negative", violationCount: 2 },
  { id: "6", role: "finance", maskedName: "MGT-02", region: "Singapore", isOnline: true, isMuted: false, sentimentAvg: "neutral", violationCount: 0 },
];

const SecureChatHub = () => {
  const [channels] = useState<Channel[]>(mockChannels);
  const [activeChannel, setActiveChannel] = useState<Channel>(mockChannels[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [onlineUsers] = useState<OnlineUser[]>(mockOnlineUsers);
  const [messageInput, setMessageInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [violationCount, setViolationCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatFrozen, setIsChatFrozen] = useState(false);
  const [showSuperAdminPanel, setShowSuperAdminPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Current user mock
  const currentUser = {
    id: "current",
    role: "super_admin", // Change to test different roles
    maskedName: "Y***",
    region: "India",
    isTaskActive: false,
  };

  const isSuperAdmin = currentUser.role === "super_admin";
  const watermark = generateWatermark(currentUser.id);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Anti-leak protection
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.warning("🔒 Right-click disabled for security");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "p" || e.key === "s")) ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
        toast.warning("🔒 Copy/Print/Save disabled for security");
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.warning("🔒 Copying is disabled");
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("copy", handleCopy);
    };
  }, []);

  const handleSendMessage = () => {
    if (!messageInput.trim() || isChatFrozen) return;

    const { processedText, violations, isMasked, sentiment, isOffTopic } = processMessage(
      messageInput,
      activeChannel.category
    );

    if (violations.length > 0) {
      const newViolationCount = violationCount + 1;
      setViolationCount(newViolationCount);

      const action = getViolationAction(newViolationCount);
      setWarningMessage(action.message);
      setShowWarning(true);

      if (action.level === 3) {
        toast.error("Account suspended. Contact Super Admin.");
        return;
      }

      if (action.level === 2) {
        toast.warning("You have been muted for 30 minutes");
        return;
      }
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderRole: currentUser.role,
      senderMaskedName: currentUser.maskedName,
      senderRegion: currentUser.region,
      content: processedText,
      messageType: "text",
      isFlagged: violations.length > 0,
      flagReason: violations.join(", "),
      sentiment: { score: sentiment.score, emoji: sentiment.emoji },
      createdAt: new Date().toISOString(),
      isEncrypted: true,
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");

    if (soundEnabled && currentUser.role !== "developer") {
      // Play sound
    }
  };

  const getRoleIconComponent = (role: string) => {
    const IconComponent = roleIcons[role] || Shield;
    return <IconComponent className="w-4 h-4" />;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getChannelIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      developer: <Code className="w-4 h-4 text-cyan-400" />,
      sales: <Target className="w-4 h-4 text-emerald-400" />,
      support: <LifeBuoy className="w-4 h-4 text-amber-400" />,
      finance: <Wallet className="w-4 h-4 text-green-400" />,
      general: <Hash className="w-4 h-4 text-slate-400" />,
      broadcast: <Radio className="w-4 h-4 text-rose-400" />,
      system: <AlertCircle className="w-4 h-4 text-orange-400" />,
    };
    return icons[category] || <MessageSquare className="w-4 h-4" />;
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 relative overflow-hidden select-none">
      {/* Security Watermark */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 150px, rgba(6,182,212,0.1) 150px, rgba(6,182,212,0.1) 300px)`,
        }} />
        <div className="absolute bottom-2 right-2 text-[8px] text-cyan-500/30 font-mono">{watermark}</div>
      </div>

      {/* Frozen Overlay */}
      {isChatFrozen && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <Pause className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Chat System Frozen</h2>
            <p className="text-slate-400">Super Admin has temporarily frozen all communications.</p>
          </div>
        </div>
      )}

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md p-6 rounded-xl bg-slate-900 border border-red-500/50 shadow-xl shadow-red-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Security Violation</h3>
                  <p className="text-sm text-slate-400">Level {violationCount}/3 - Logged for audit</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-4">{warningMessage}</p>
              <Button
                onClick={() => setShowWarning(false)}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50"
              >
                I Understand
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-14 bg-slate-900/80 backdrop-blur-xl border-b border-cyan-500/20 px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm">Software Vala Internal Chat Hub</h1>
            <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent" />
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs">
            <Lock className="w-3 h-3 mr-1" />
            E2E Encrypted
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {isSuperAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSuperAdminPanel(!showSuperAdminPanel)}
              className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
            >
              <Crown className="w-4 h-4 mr-1" />
              Admin Panel
            </Button>
          )}
          
          {isSuperAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsChatFrozen(!isChatFrozen)}
              className={isChatFrozen ? "text-amber-400 bg-amber-500/20" : "text-slate-400"}
            >
              <Pause className="w-4 h-4 mr-1" />
              {isChatFrozen ? "Unfreeze" : "Freeze"}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-slate-400 hover:text-cyan-400"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
            {getRoleIconComponent(currentUser.role)}
            <span className="text-sm font-medium text-white">{currentUser.maskedName}</span>
            <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
              {currentUser.region}
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-slate-900/50 border-r border-slate-700/30 flex flex-col">
          <div className="p-3 border-b border-slate-700/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 p-2">
            <p className="text-[10px] font-semibold text-slate-500 mb-2 px-2 uppercase tracking-wider">Channels</p>
            {channels
              .filter(c => c.type === "role_based")
              .map((channel) => (
                <motion.button
                  key={channel.id}
                  whileHover={{ x: 2 }}
                  onClick={() => setActiveChannel(channel)}
                  className={`w-full p-2.5 rounded-lg mb-1 text-left transition-all ${
                    activeChannel.id === channel.id
                      ? "bg-cyan-500/10 border border-cyan-500/30"
                      : "hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getChannelIcon(channel.category)}
                      <span className="text-sm font-medium text-white">{channel.name}</span>
                    </div>
                    {channel.unread > 0 && (
                      <Badge className="bg-cyan-500 text-white text-[10px] h-5 px-1.5">{channel.unread}</Badge>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{channel.description}</p>
                </motion.button>
              ))}

            <p className="text-[10px] font-semibold text-slate-500 mb-2 mt-4 px-2 uppercase tracking-wider">System</p>
            {channels
              .filter(c => c.type === "broadcast" || c.type === "system")
              .map((channel) => (
                <motion.button
                  key={channel.id}
                  whileHover={{ x: 2 }}
                  onClick={() => setActiveChannel(channel)}
                  className={`w-full p-2.5 rounded-lg mb-1 text-left transition-all ${
                    activeChannel.id === channel.id
                      ? "bg-cyan-500/10 border border-cyan-500/30"
                      : "hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {getChannelIcon(channel.category)}
                    <span className="text-sm font-medium text-white">{channel.name}</span>
                    {channel.isLocked && <Lock className="w-3 h-3 text-slate-500" />}
                  </div>
                </motion.button>
              ))}
          </ScrollArea>
        </div>

        {/* Center - Messages */}
        <div className="flex-1 flex flex-col bg-slate-950/50">
          {/* Channel Header */}
          <div className="h-12 px-4 border-b border-slate-700/30 flex items-center justify-between bg-slate-900/30">
            <div className="flex items-center gap-2">
              {getChannelIcon(activeChannel.category)}
              <span className="font-semibold text-white">{activeChannel.name}</span>
              <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">
                {activeChannel.description}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                <FileText className="w-3 h-3 mr-1" />
                Audit Logged
              </Badge>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => {
                const bubbleClass = getMessageBubbleClass(message.senderRole);
                const isOwn = message.senderId === currentUser.id;

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
                      {/* Sender Info */}
                      <div className={`flex items-center gap-2 mb-1 ${isOwn ? "justify-end" : ""}`}>
                        <div className={`p-1 rounded ${bubbleClass}`}>
                          {getRoleIconComponent(message.senderRole)}
                        </div>
                        <span className="text-xs font-medium text-slate-400">{message.senderMaskedName}</span>
                        <Badge variant="outline" className="text-[9px] border-slate-700 text-slate-500">
                          {message.senderRegion}
                        </Badge>
                        <span className={`text-[10px] ${getSentimentColor(message.sentiment.score)}`}>
                          {message.sentiment.emoji}
                        </span>
                      </div>

                      {/* Message Bubble */}
                      <div className={`p-3 rounded-xl border ${bubbleClass} ${message.isFlagged ? "ring-1 ring-red-500/50" : ""}`}>
                        {message.isFlagged && (
                          <div className="flex items-center gap-1 text-[10px] text-red-400 mb-2">
                            <AlertTriangle className="w-3 h-3" />
                            Flagged: {message.flagReason}
                          </div>
                        )}
                        <p className="text-sm text-white">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-slate-500">{formatTime(message.createdAt)}</span>
                          {message.isEncrypted && <Lock className="w-3 h-3 text-slate-600" />}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-slate-700/30 bg-slate-900/30">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsRecording(!isRecording)}
                className={`${isRecording ? "text-red-400 bg-red-500/20" : "text-slate-400"}`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>

              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={`Message #${activeChannel.name.toLowerCase()}...`}
                className="flex-1 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                disabled={isChatFrozen}
              />

              <Button
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || isChatFrozen}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] text-slate-600 mt-2 text-center">
              🔒 Messages encrypted • No files/images • Contact sharing blocked
            </p>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-60 bg-slate-900/50 border-l border-slate-700/30 flex flex-col">
          <div className="p-3 border-b border-slate-700/30">
            <p className="text-xs font-semibold text-slate-400">Online Users</p>
          </div>

          <ScrollArea className="flex-1 p-2">
            {onlineUsers.map((user) => (
              <div
                key={user.id}
                className="p-2 rounded-lg hover:bg-slate-800/30 transition-colors mb-1"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className={`p-1.5 rounded-lg ${getMessageBubbleClass(user.role)}`}>
                      {getRoleIconComponent(user.role)}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                      user.isOnline ? "bg-emerald-400" : "bg-slate-600"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-white truncate">{user.maskedName}</span>
                      {user.isMuted && <Ban className="w-3 h-3 text-red-400" />}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-500">{user.region}</span>
                      <span className={`text-[10px] ${getSentimentColor(user.sentimentAvg)}`}>
                        {user.sentimentAvg === "positive" ? "😊" : user.sentimentAvg === "negative" ? "😟" : "😐"}
                      </span>
                    </div>
                  </div>
                  {user.violationCount > 0 && (
                    <Badge className="bg-red-500/20 text-red-400 text-[9px]">{user.violationCount}</Badge>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>

          {/* Escalation Shortcuts */}
          <div className="p-3 border-t border-slate-700/30">
            <p className="text-[10px] font-semibold text-slate-500 mb-2 uppercase">Quick Actions</p>
            <div className="space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-slate-400 hover:text-amber-400">
                <ArrowUpRight className="w-3 h-3 mr-2" />
                Escalate to Admin
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-slate-400 hover:text-red-400">
                <AlertTriangle className="w-3 h-3 mr-2" />
                Report Violation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Super Admin Panel */}
      <AnimatePresence>
        {showSuperAdminPanel && isSuperAdmin && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute right-0 top-14 bottom-0 w-80 bg-slate-900 border-l border-rose-500/30 z-40 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-700/30 bg-rose-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-rose-400" />
                  <h3 className="font-bold text-white">Super Admin Panel</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowSuperAdminPanel(false)}>
                  <X className="w-4 h-4 text-slate-400" />
                </Button>
              </div>
            </div>

            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <p className="text-xs font-semibold text-slate-400 mb-2">System Controls</p>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      onClick={() => setIsChatFrozen(!isChatFrozen)}
                      className={`w-full ${isChatFrozen ? "bg-amber-500/20 text-amber-400" : "bg-slate-700"}`}
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      {isChatFrozen ? "Unfreeze Chat" : "Freeze Chat (Panic)"}
                    </Button>
                    <Button size="sm" variant="outline" className="w-full border-slate-600 text-slate-300">
                      <Eye className="w-4 h-4 mr-2" />
                      View All Conversations
                    </Button>
                    <Button size="sm" variant="outline" className="w-full border-slate-600 text-slate-300">
                      <FileText className="w-4 h-4 mr-2" />
                      Export Audit Logs
                    </Button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <p className="text-xs font-semibold text-slate-400 mb-2">User Management</p>
                  <div className="space-y-2">
                    {onlineUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-2 rounded bg-slate-700/30">
                        <div className="flex items-center gap-2">
                          {getRoleIconComponent(user.role)}
                          <span className="text-xs text-white">{user.maskedName}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-amber-400">
                            <VolumeX className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400">
                            <Ban className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <p className="text-xs font-semibold text-slate-400 mb-2">Recent Violations</p>
                  <div className="space-y-2">
                    <div className="p-2 rounded bg-red-500/10 border border-red-500/30">
                      <div className="flex items-center gap-2 text-xs text-red-400">
                        <AlertTriangle className="w-3 h-3" />
                        K*** attempted contact share
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">2 min ago</p>
                    </div>
                    <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30">
                      <div className="flex items-center gap-2 text-xs text-amber-400">
                        <AlertCircle className="w-3 h-3" />
                        M*** off-topic message
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">15 min ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecureChatHub;