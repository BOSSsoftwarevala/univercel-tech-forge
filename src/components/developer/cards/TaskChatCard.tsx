import { motion } from 'framer-motion';
import { MessageSquare, Send, User, Languages, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  maskedSender: string;
  message: string;
  timestamp: string;
  isAutoTranslated?: boolean;
}

interface TaskChatCardProps {
  taskId: string | null;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

const TaskChatCard = ({ taskId, messages, onSendMessage }: TaskChatCardProps) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    if (!taskId) {
      toast.error('Chat is only available for active tasks');
      return;
    }
    onSendMessage(newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!taskId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-slate-700/50">
            <MessageSquare className="w-5 h-5 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-500">Task Chat</h3>
        </div>
        <div className="text-center py-8 text-slate-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Chat available only with active task</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 flex flex-col h-[400px]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Task Chat</h3>
            <p className="text-xs text-slate-400">Linked to {taskId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            <Lock className="w-3 h-3 mr-1" />
            No Edit/Delete
          </Badge>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p className="text-sm">No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-cyan-400 font-mono">{msg.maskedSender}</span>
                </div>
                <div className="flex items-center gap-2">
                  {msg.isAutoTranslated && (
                    <Languages className="w-3 h-3 text-violet-400" />
                  )}
                  <span className="text-xs text-slate-500">{msg.timestamp}</span>
                </div>
              </div>
              <p className="text-sm text-slate-300">{msg.message}</p>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-slate-800/50 border-slate-700/50 text-white"
        />
        <Button
          onClick={handleSend}
          className="bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Rules */}
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-500">
        <span>• Masked identity</span>
        <span>• No delete</span>
        <span>• No edit</span>
        <span>• Auto-translate</span>
      </div>
    </motion.div>
  );
};

export default TaskChatCard;
