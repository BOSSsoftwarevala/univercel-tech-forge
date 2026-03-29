import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Mic, FileText, Image, Video, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ConversationMessage, BuildStatus } from "@/pages/auto-dev/AutoDevDashboard";
import ReactMarkdown from 'react-markdown';

interface AIConversationProps {
  messages: ConversationMessage[];
  buildStatus: BuildStatus;
}

export const AIConversation = ({ messages, buildStatus }: AIConversationProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'voice': return <Mic className="w-3 h-3" />;
      case 'file': return <FileText className="w-3 h-3" />;
      case 'image': return <Image className="w-3 h-3" />;
      case 'video': return <Video className="w-3 h-3" />;
      default: return null;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (messages.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-border/50">
        <CardContent className="p-8 text-center">
          <Bot className="w-12 h-12 mx-auto text-violet-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Ready to Help</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Tell me what you want to build. You can type, speak, or upload files. 
            I understand text, images, videos, and documents.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-border/50">
      <CardHeader className="pb-3 border-b border-border/30">
        <CardTitle className="text-sm flex items-center gap-2 text-white">
          <Bot className="w-4 h-4 text-violet-400" />
          AI Assistant
          {buildStatus !== 'idle' && buildStatus !== 'complete' && (
            <Badge variant="outline" className="ml-auto bg-violet-500/10 text-violet-400 border-violet-500/50">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              {buildStatus === 'understanding' ? 'Thinking...' : 
               buildStatus === 'clarifying' ? 'Need info' : 
               buildStatus === 'building' ? 'Building' :
               buildStatus === 'testing' ? 'Testing' :
               buildStatus === 'deploying' ? 'Deploying' : 'Working'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <ScrollArea className="h-[400px]" ref={scrollRef}>
        <CardContent className="p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  message.role === 'user' 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : "bg-violet-500/20 text-violet-400"
                )}>
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Content */}
                <div className={cn(
                  "flex-1 max-w-[80%]",
                  message.role === 'user' ? 'text-right' : 'text-left'
                )}>
                  {/* Type Badge */}
                  {message.type !== 'text' && (
                    <Badge 
                      variant="secondary" 
                      className="mb-2 text-xs bg-violet-500/10 text-violet-300"
                    >
                      {getTypeIcon(message.type)}
                      <span className="ml-1 capitalize">{message.type}</span>
                    </Badge>
                  )}

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className={cn(
                      "flex flex-wrap gap-2 mb-2",
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}>
                      {message.attachments.map((attachment, index) => (
                        <div 
                          key={index}
                          className="relative group"
                        >
                          {attachment.type.startsWith('image') && attachment.url ? (
                            <img 
                              src={attachment.url} 
                              alt={attachment.name}
                              className="max-w-[150px] max-h-[100px] rounded-lg border border-border/50 object-cover"
                            />
                          ) : (
                            <Badge variant="secondary" className="bg-slate-800">
                              {getTypeIcon(attachment.type)}
                              <span className="ml-1 text-xs">{attachment.name}</span>
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={cn(
                    "rounded-2xl px-4 py-3",
                    message.role === 'user' 
                      ? "bg-emerald-500/20 text-white rounded-tr-sm" 
                      : "bg-slate-800/80 text-white rounded-tl-sm"
                  )}>
                    {message.isTyping ? (
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    ) : (
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <p className={cn(
                    "text-xs text-muted-foreground mt-1",
                    message.role === 'user' ? 'text-right' : 'text-left'
                  )}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </ScrollArea>
    </Card>
  );
};
