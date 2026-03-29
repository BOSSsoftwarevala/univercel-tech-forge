import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  Mic,
  MicOff,
  Paperclip,
  Check,
  CheckCheck,
  Clock,
  X,
  Phone,
  Video,
  MoreVertical,
  Search,
  ArrowLeft,
  Play,
  Pause,
  User,
  Shield,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { format } from "date-fns";

interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'voice';
  voiceDuration?: number;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: Date;
  isRead: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  role: string;
}

const PersonalChatSystem = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  // Mock data
  const [chats] = useState<Chat[]>([
    {
      id: "1",
      name: "Support Team",
      lastMessage: "Your request is being processed",
      lastMessageTime: new Date(Date.now() - 300000),
      unreadCount: 2,
      isOnline: true,
      role: "support"
    },
    {
      id: "2",
      name: "Sales Manager",
      lastMessage: "Demo scheduled for tomorrow",
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 0,
      isOnline: true,
      role: "sales"
    },
    {
      id: "3",
      name: "Technical Lead",
      lastMessage: "Implementation complete",
      lastMessageTime: new Date(Date.now() - 86400000),
      unreadCount: 1,
      isOnline: false,
      role: "developer"
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: "other",
      content: "Hello! How can I help you today?",
      type: "text",
      status: "approved",
      timestamp: new Date(Date.now() - 3600000),
      isRead: true
    },
    {
      id: "2",
      senderId: "me",
      content: "I need assistance with my account setup",
      type: "text",
      status: "approved",
      timestamp: new Date(Date.now() - 3500000),
      isRead: true
    },
    {
      id: "3",
      senderId: "other",
      content: "Sure, I can help with that. Let me check your details.",
      type: "text",
      status: "approved",
      timestamp: new Date(Date.now() - 3400000),
      isRead: true
    },
    {
      id: "4",
      senderId: "me",
      content: "",
      type: "voice",
      voiceDuration: 12,
      status: "pending",
      timestamp: new Date(Date.now() - 60000),
      isRead: false
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      content: message,
      type: "text",
      status: "pending",
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    
    toast.info("Message sent for approval", {
      description: "Super Admin will review your message"
    });
  };

  const startRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setRecordingDuration(0);
      
      recordingInterval.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      toast.info("Recording started...");
    } catch (error) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      content: "",
      type: "voice",
      voiceDuration: recordingDuration,
      status: "pending",
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);
    setRecordingDuration(0);
    
    toast.info("Voice message sent for approval", {
      description: "Super Admin will review your voice message"
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3 text-amber-400" />;
      case 'approved':
        return <CheckCheck className="w-3 h-3 text-cyan-400" />;
      case 'rejected':
        return <X className="w-3 h-3 text-red-400" />;
      default:
        return <Check className="w-3 h-3 text-slate-400" />;
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-2rem)] flex bg-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden">
      {/* Chat List Sidebar */}
      <div className={`w-80 border-r border-slate-700/50 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              Messages
            </h2>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              {chats.reduce((acc, chat) => acc + chat.unreadCount, 0)} New
            </Badge>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Pending Approval Notice */}
        <div className="p-3 bg-amber-500/10 border-b border-amber-500/30">
          <div className="flex items-center gap-2 text-amber-400 text-xs">
            <Shield className="w-4 h-4" />
            <span>Messages require Super Admin approval</span>
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredChats.map((chat) => (
              <motion.div
                key={chat.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedChat(chat)}
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  selectedChat?.id === chat.id
                    ? 'bg-emerald-500/20 border border-emerald-500/30'
                    : 'hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12 border-2 border-slate-600">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback className="bg-slate-700 text-white">
                        {chat.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white truncate">{chat.name}</p>
                      <span className="text-xs text-slate-500">
                        {format(chat.lastMessageTime, 'HH:mm')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-400 truncate">{chat.lastMessage}</p>
                      {chat.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-700/50 bg-slate-800/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-slate-400"
                  onClick={() => setSelectedChat(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                
                <div className="relative">
                  <Avatar className="w-10 h-10 border-2 border-slate-600">
                    <AvatarImage src={selectedChat.avatar} />
                    <AvatarFallback className="bg-slate-700 text-white">
                      {selectedChat.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {selectedChat.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-800" />
                  )}
                </div>
                
                <div>
                  <p className="font-medium text-white">{selectedChat.name}</p>
                  <p className="text-xs text-slate-400">
                    {selectedChat.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      msg.senderId === 'me'
                        ? 'bg-emerald-500/20 border border-emerald-500/30'
                        : 'bg-slate-800/50 border border-slate-700/50'
                    }`}
                  >
                    {msg.type === 'voice' ? (
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-10 h-10 rounded-full bg-emerald-500/20"
                          onClick={() => setIsPlayingVoice(isPlayingVoice === msg.id ? null : msg.id)}
                        >
                          {isPlayingVoice === msg.id ? (
                            <Pause className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Play className="w-4 h-4 text-emerald-400" />
                          )}
                        </Button>
                        <div className="flex-1">
                          <div className="h-1 bg-slate-600 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-emerald-500"
                              initial={{ width: 0 }}
                              animate={{ width: isPlayingVoice === msg.id ? '100%' : '0%' }}
                              transition={{ duration: msg.voiceDuration || 5 }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-slate-400">
                          {formatDuration(msg.voiceDuration || 0)}
                        </span>
                      </div>
                    ) : (
                      <p className="text-white text-sm">{msg.content}</p>
                    )}
                    
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] text-slate-500">
                        {format(msg.timestamp, 'HH:mm')}
                      </span>
                      {msg.senderId === 'me' && (
                        <div className="flex items-center gap-1">
                          {getStatusIcon(msg.status)}
                          {msg.status === 'pending' && (
                            <span className="text-[10px] text-amber-400">Pending approval</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
            {isRecording ? (
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center"
                >
                  <Mic className="w-5 h-5 text-red-400" />
                </motion.div>
                <div className="flex-1">
                  <p className="text-white font-medium">Recording...</p>
                  <p className="text-sm text-slate-400">{formatDuration(recordingDuration)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsRecording(false);
                    if (recordingInterval.current) {
                      clearInterval(recordingInterval.current);
                    }
                    setRecordingDuration(0);
                  }}
                  className="text-slate-400"
                >
                  <X className="w-5 h-5" />
                </Button>
                <Button
                  onClick={stopRecording}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                />
                {message.trim() ? (
                  <Button
                    onClick={handleSendMessage}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={startRecording}
                    variant="ghost"
                    size="icon"
                    className="text-emerald-400 hover:bg-emerald-500/20"
                  >
                    <Mic className="w-5 h-5" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center bg-slate-800/20">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Personal Chat</h3>
            <p className="text-slate-400 text-sm max-w-xs">
              Select a conversation to start messaging.<br />
              All messages are reviewed by Super Admin before delivery.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalChatSystem;
