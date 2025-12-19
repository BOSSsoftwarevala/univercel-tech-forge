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
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  ChevronRight,
  Settings,
  Search,
  Plus,
  Phone,
  X,
  Bot,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  processMessage,
  maskUserName,
  getMessageBubbleClass,
  getViolationAction,
  generateWatermark,
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
};

interface Channel {
  id: string;
  name: string;
  type: "role_based" | "direct" | "group" | "broadcast";
  unread: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface Message {
  id: string;
  senderId: string;
  senderRole: string;
  senderMaskedName: string;
  senderRegion: string;
  content: string;
  messageType: "text" | "voice_note" | "ai_auto_reply" | "system";
  isFlagged: boolean;
  flagReason?: string;
  createdAt: string;
}

interface OnlineUser {
  id: string;
  role: string;
  maskedName: string;
  region: string;
  isOnline: boolean;
  isMuted: boolean;
}

// Mock data
const mockChannels: Channel[] = [
  { id: "1", name: "General", type: "role_based", unread: 3, lastMessage: "Welcome to the team!", lastMessageTime: "2m ago" },
  { id: "2", name: "Developers", type: "role_based", unread: 0, lastMessage: "Task completed", lastMessageTime: "15m ago" },
  { id: "3", name: "Sales Team", type: "role_based", unread: 5, lastMessage: "New lead assigned", lastMessageTime: "1h ago" },
  { id: "4", name: "Support Hub", type: "role_based", unread: 2, lastMessage: "Ticket resolved", lastMessageTime: "30m ago" },
  { id: "5", name: "Franchises", type: "role_based", unread: 0, lastMessage: "Monthly report", lastMessageTime: "2h ago" },
  { id: "6", name: "Super Admin Broadcast", type: "broadcast", unread: 1, lastMessage: "System update scheduled", lastMessageTime: "4h ago" },
];

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "admin1",
    senderRole: "super_admin",
    senderMaskedName: "A***",
    senderRegion: "India",
    content: "Welcome to the Software Vala Internal Chat Hub. Please follow all security protocols.",
    messageType: "system",
    isFlagged: false,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    senderId: "dev1",
    senderRole: "developer",
    senderMaskedName: "R***",
    senderRegion: "East Africa",
    content: "Task #4521 has been completed. Ready for review.",
    messageType: "text",
    isFlagged: false,
    createdAt: "2024-01-15T10:05:00Z",
  },
  {
    id: "3",
    senderId: "sales1",
    senderRole: "sales",
    senderMaskedName: "S***",
    senderRegion: "UAE",
    content: "New franchise lead from Dubai region. High priority.",
    messageType: "text",
    isFlagged: false,
    createdAt: "2024-01-15T10:10:00Z",
  },
  {
    id: "4",
    senderId: "bot",
    senderRole: "super_admin",
    senderMaskedName: "AI Bot",
    senderRegion: "System",
    content: "Reminder: All contact details are automatically masked for security.",
    messageType: "ai_auto_reply",
    isFlagged: false,
    createdAt: "2024-01-15T10:15:00Z",
  },
];

const mockOnlineUsers: OnlineUser[] = [
  { id: "1", role: "super_admin", maskedName: "A***", region: "India", isOnline: true, isMuted: false },
  { id: "2", role: "developer", maskedName: "R***", region: "East Africa", isOnline: true, isMuted: false },
  { id: "3", role: "sales", maskedName: "S***", region: "UAE", isOnline: true, isMuted: false },
  { id: "4", role: "support", maskedName: "M***", region: "UK", isOnline: false, isMuted: false },
  { id: "5", role: "franchise", maskedName: "K***", region: "Kenya", isOnline: true, isMuted: true },
  { id: "6", role: "reseller", maskedName: "J***", region: "Singapore", isOnline: true, isMuted: false },
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Current user mock (would come from auth in real app)
  const currentUser = {
    id: "current",
    role: "developer",
    maskedName: "Y***",
    region: "India",
  };

  // Watermark for anti-screen recording
  const watermark = generateWatermark(currentUser.id);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Anti-leak: Disable right-click
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.warning("Right-click is disabled for security");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable Ctrl+C, Ctrl+V, Ctrl+P, PrintScreen
      if (
        (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "p")) ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
        toast.warning("Copy/Print functions are disabled for security");
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    // Process message through security filters
    const { processedText, violations, isMasked } = processMessage(messageInput);

    if (violations.length > 0) {
      const newViolationCount = violationCount + 1;
      setViolationCount(newViolationCount);

      const action = getViolationAction(newViolationCount);
      setWarningMessage(action.message);
      setShowWarning(true);

      if (action.level === 3) {
        // Force logout would happen here
        toast.error("Account suspended due to repeated violations");
        return;
      }

      if (action.level === 2) {
        toast.warning("You have been muted for 30 minutes");
        return;
      }
    }

    // Add message with masked content
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
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");

    // Play send sound if enabled
    if (soundEnabled && currentUser.role !== "developer") {
      // Would play sound here
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

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden select-none">
      {/* Security Watermark Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-50 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 100px,
            rgba(0,242,255,0.1) 100px,
            rgba(0,242,255,0.1) 200px
          )`,
        }}
      >
        <div className="absolute bottom-4 right-4 text-[10px] text-primary/20 font-mono">
          {watermark}
        </div>
      </div>

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md p-6 rounded-xl bg-card border border-neon-red/50 shadow-xl shadow-neon-red/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-neon-red/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-neon-red" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Security Warning</h3>
                  <p className="text-sm text-muted-foreground">Violation Level {violationCount}/3</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{warningMessage}</p>
              <Button
                onClick={() => setShowWarning(false)}
                className="w-full bg-neon-red/20 hover:bg-neon-red/30 text-neon-red border border-neon-red/50"
              >
                I Understand
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-16 bg-card/50 backdrop-blur-xl border-b border-border/30 px-6 flex items-center justify-between z-40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-neon-purple flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">Software Vala Internal Chat Hub</h1>
            <div className="h-0.5 w-full bg-gradient-to-r from-primary via-neon-teal to-transparent" />
          </div>
          <Badge className="bg-neon-green/20 text-neon-green border border-neon-green/30">
            <Lock className="w-3 h-3 mr-1" />
            Secure
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-muted-foreground hover:text-primary"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-neon-red rounded-full text-[10px] text-white flex items-center justify-center">
              3
            </span>
          </Button>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/30">
            {getRoleIconComponent(currentUser.role)}
            <span className="text-sm font-medium text-foreground">{currentUser.maskedName}</span>
            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
              {currentUser.region}
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Channels */}
        <div className="w-72 bg-card/30 backdrop-blur-xl border-r border-border/30 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-border/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/30 border-border/50"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 p-3">
            {/* Role-Based Channels */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2 px-2">ROLE CHANNELS</p>
              {channels
                .filter((c) => c.type === "role_based")
                .map((channel) => (
                  <motion.button
                    key={channel.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveChannel(channel)}
                    className={`
                      w-full p-3 rounded-lg mb-1 text-left transition-all
                      ${activeChannel.id === channel.id
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-secondary/50 border border-transparent"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">{channel.name}</span>
                      </div>
                      {channel.unread > 0 && (
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          {channel.unread}
                        </Badge>
                      )}
                    </div>
                    {channel.lastMessage && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {channel.lastMessage}
                      </p>
                    )}
                  </motion.button>
                ))}
            </div>

            {/* Broadcast */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2 px-2">BROADCASTS</p>
              {channels
                .filter((c) => c.type === "broadcast")
                .map((channel) => (
                  <motion.button
                    key={channel.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveChannel(channel)}
                    className={`
                      w-full p-3 rounded-lg mb-1 text-left transition-all
                      ${activeChannel.id === channel.id
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-secondary/50 border border-transparent"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-neon-orange" />
                      <span className="font-medium text-foreground">{channel.name}</span>
                    </div>
                  </motion.button>
                ))}
            </div>

            {/* System Alerts */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 px-2">SYSTEM</p>
              <div className="p-3 rounded-lg bg-neon-orange/10 border border-neon-orange/30">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-neon-orange" />
                  <span className="text-sm font-medium text-foreground">Active Alerts</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">2 policy warnings pending</p>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Center - Messages */}
        <div className="flex-1 flex flex-col">
          {/* Channel Header */}
          <div className="h-14 px-6 border-b border-border/30 flex items-center justify-between bg-card/20">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">{activeChannel.name}</span>
              <Badge variant="outline" className="text-xs">
                {activeChannel.type === "broadcast" ? "Broadcast" : "Role Channel"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {onlineUsers.filter((u) => u.isOnline).length} online
              </span>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Settings className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => {
                const isCurrentUser = message.senderId === currentUser.id;
                const bubbleClass = getMessageBubbleClass(message.senderRole);

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] ${isCurrentUser ? "order-2" : ""}`}>
                      {/* Sender Info */}
                      {!isCurrentUser && (
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center
                            ${message.senderRole === "super_admin" ? "bg-primary/20" : "bg-secondary"}
                          `}>
                            {getRoleIconComponent(message.senderRole)}
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {message.senderMaskedName}
                          </span>
                          <Badge variant="outline" className="text-[10px] border-primary/30">
                            {message.senderRegion}
                          </Badge>
                          {message.messageType === "ai_auto_reply" && (
                            <Badge className="bg-neon-purple/20 text-neon-purple text-[10px]">
                              <Bot className="w-3 h-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`
                          p-4 rounded-xl border
                          ${bubbleClass}
                          ${message.isFlagged ? "ring-1 ring-neon-orange/50" : ""}
                        `}
                      >
                        {message.isFlagged && (
                          <div className="flex items-center gap-1 mb-2 text-xs text-neon-orange">
                            <AlertTriangle className="w-3 h-3" />
                            Content masked by AI
                          </div>
                        )}
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <div className="flex items-center justify-end gap-2 mt-2">
                          <span className="text-[10px] text-muted-foreground">
                            {formatTime(message.createdAt)}
                          </span>
                          {isCurrentUser && (
                            <CheckCircle className="w-3 h-3 text-neon-green" />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border/30 bg-card/20">
            {/* Warning Banner */}
            <div className="mb-3 p-2 rounded-lg bg-neon-orange/10 border border-neon-orange/20 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-neon-orange flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Sharing contact details is prohibited. All messages are monitored and logged.
              </p>
            </div>

            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <Textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a secure message..."
                  className="min-h-[50px] max-h-[150px] bg-secondary/30 border-border/50 resize-none pr-12"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>

              {/* Voice Note Button */}
              <Button
                variant="outline"
                size="icon"
                className={`
                  h-12 w-12 border-primary/30
                  ${isRecording ? "bg-neon-red/20 border-neon-red animate-pulse" : "hover:bg-primary/10"}
                `}
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? (
                  <MicOff className="w-5 h-5 text-neon-red" />
                ) : (
                  <Mic className="w-5 h-5 text-primary" />
                )}
              </Button>

              {/* Send Button */}
              <Button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="h-12 px-6 bg-primary hover:bg-primary/90"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Users & Info */}
        <div className="w-72 bg-card/30 backdrop-blur-xl border-l border-border/30 flex flex-col">
          <div className="p-4 border-b border-border/30">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Active Users
            </h3>
          </div>

          <ScrollArea className="flex-1 p-3">
            <div className="space-y-2">
              {onlineUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-3 rounded-lg bg-secondary/30 border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${user.role === "super_admin" ? "bg-primary/20" : "bg-secondary"}
                    `}>
                      {getRoleIconComponent(user.role)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {user.maskedName}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${user.isOnline ? "bg-neon-green" : "bg-muted"}`} />
                      </div>
                      <p className="text-xs text-muted-foreground">{user.region}</p>
                    </div>
                    {user.isMuted && (
                      <Badge className="bg-neon-red/20 text-neon-red text-xs">
                        Muted
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Escalation Shortcuts */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-muted-foreground mb-2">QUICK ESCALATE</p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start border-primary/30 text-muted-foreground hover:text-primary">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  To Super Admin
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start border-primary/30 text-muted-foreground hover:text-primary">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  To Task Manager
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start border-primary/30 text-muted-foreground hover:text-primary">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  To Finance
                </Button>
              </div>
            </div>
          </ScrollArea>

          {/* Security Status */}
          <div className="p-4 border-t border-border/30">
            <div className="p-3 rounded-lg bg-neon-green/10 border border-neon-green/30">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-neon-green" />
                <span className="text-sm font-medium text-neon-green">Secure Mode Active</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All messages encrypted & logged
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Anti-leak CSS */}
      <style>{`
        .select-none * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
        }
        
        @media print {
          body { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default SecureChatHub;
