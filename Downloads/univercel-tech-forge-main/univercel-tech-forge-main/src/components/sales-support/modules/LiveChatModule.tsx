import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLiveChat } from "@/hooks/useLiveChat";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const LiveChatModule = () => {
  const { sessions, currentMessages, loading, fetchSessions, fetchMessages, acceptChat, resolveChat, transferChat, subscribeToChat } = useLiveChat();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isViewingChat, setIsViewingChat] = useState(false);

  // Load chat sessions on mount
  useEffect(() => {
    fetchSessions();
    const interval = setInterval(() => fetchSessions(), 5000);
    return () => clearInterval(interval);
  }, [fetchSessions]);

  // Subscribe to real-time updates when viewing a chat
  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(selectedChatId);
      const unsubscribe = subscribeToChat(selectedChatId);
      return unsubscribe;
    }
  }, [selectedChatId, fetchMessages, subscribeToChat]);

  const handleAcceptChat = async (chatId: string, agent: string) => {
    try {
      await acceptChat(chatId, agent);
      await fetchSessions();
    } catch (err) {
      // Error already shown in hook
    }
  };

  const handleTransfer = async (chatId: string, agent: string) => {
    try {
      await transferChat(chatId, agent);
      await fetchSessions();
    } catch (err) {
      // Error already shown in hook
    }
  };

  const handleResolve = async (chatId: string) => {
    try {
      await resolveChat(chatId);
      await fetchSessions();
      setIsViewingChat(false);
      setSelectedChatId(null);
    } catch (err) {
      // Error already shown in hook
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-emerald-500/20 text-emerald-300";
      case "negative": return "bg-red-500/20 text-red-300";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting": return "bg-amber-500/20 text-amber-300";
      case "active": return "bg-emerald-500/20 text-emerald-300";
      case "resolved": return "bg-slate-500/20 text-slate-300";
      case "transferred": return "bg-blue-500/20 text-blue-300";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  const waitingCount = sessions.filter(c => c.status === "waiting").length;
  const activeCount = sessions.filter(c => c.status === "active").length;
  const negativeCount = sessions.filter(c => c.sentiment === "negative" && c.status === "active").length;

  const selectedChat = sessions.find(s => s.id === selectedChatId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">Live Chat</h2>
          <p className="text-slate-400">Real-time chat with sentiment analysis and auto-routing</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <MessageCircle className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-100">{sessions.length}</div>
            <div className="text-xs text-slate-400">Total Chats</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">{waitingCount}</div>
            <div className="text-xs text-slate-400">Waiting</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">{activeCount}</div>
            <div className="text-xs text-slate-400">Active</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-red-500/20">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-100">{negativeCount}</div>
            <div className="text-xs text-slate-400">Negative Sentiment</div>
          </CardContent>
        </Card>
      </div>

      {/* Chats List */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-100">Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !sessions.length ? (
            <div className="text-center text-slate-400">Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="text-center text-slate-400">No active chats</div>
          ) : (
            <div className="space-y-3">
              {sessions.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer ${
                    chat.status === "waiting" ? "border-l-4 border-amber-500" : ""
                  } ${chat.sentiment === "negative" ? "border-l-4 border-red-500" : ""}`}
                  onClick={() => {
                    setSelectedChatId(chat.id);
                    setIsViewingChat(true);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-cyan-500/20 text-cyan-300">
                          {chat.visitor_name?.substring(0, 2).toUpperCase() || "V"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-cyan-400 text-sm">{chat.chat_id}</span>
                          <span className="font-medium text-slate-100">{chat.visitor_name || "Visitor"}</span>
                          <Badge className={getStatusColor(chat.status)}>{chat.status}</Badge>
                          <Badge className={getSentimentColor(chat.sentiment)}>{chat.sentiment}</Badge>
                        </div>
                        <p className="text-sm text-slate-400">
                          {chat.visitor_email} • {chat.message_count} messages
                        </p>
                      </div>
                    </div>
                    {chat.status === "waiting" && (
                      <div className="flex items-center gap-2 text-amber-400 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>Waiting</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-300 italic">
                      {/* Last message would go here after fetching */}
                    </p>

                    <div className="flex items-center gap-2">
                      {chat.status === "waiting" && (
                        <Select onValueChange={(agent) => handleAcceptChat(chat.chat_id, agent)}>
                          <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600">
                            <SelectValue placeholder="Accept" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SA-001">Agent 1</SelectItem>
                            <SelectItem value="SA-002">Agent 2</SelectItem>
                            <SelectItem value="SA-003">Agent 3</SelectItem>
                          </SelectContent>
                        </Select>
                      )}

                      {chat.status === "active" && (
                        <>
                          <Select onValueChange={(agent) => handleTransfer(chat.chat_id, agent)}>
                            <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600">
                              <SelectValue placeholder="Transfer" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SA-001">Agent 1</SelectItem>
                              <SelectItem value="SA-002">Agent 2</SelectItem>
                              <SelectItem value="SA-003">Agent 3</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResolve(chat.chat_id);
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Resolve
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Detail Dialog */}
      <Dialog open={isViewingChat} onOpenChange={setIsViewingChat}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-white">
              Chat - {selectedChat?.visitor_name || "Visitor"} ({selectedChat?.chat_id})
            </DialogTitle>
          </DialogHeader>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-[300px] max-h-[400px] p-4 bg-slate-800/30 rounded-lg">
            {currentMessages.length === 0 ? (
              <div className="text-center text-slate-400">No messages yet</div>
            ) : (
              currentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_type === "agent" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      msg.sender_type === "agent"
                        ? "bg-cyan-500/20 text-cyan-100"
                        : "bg-slate-700/50 text-slate-100"
                    }`}
                  >
                    <p className="text-sm">{msg.message_text}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          {selectedChat?.status === "active" && (
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
              <Button
                className="bg-cyan-500 hover:bg-cyan-600"
                onClick={() => {
                  if (newMessage.trim()) {
                    // Send message logic would go here
                    setNewMessage("");
                  }
                }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveChatModule;
