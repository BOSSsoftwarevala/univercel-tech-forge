import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Sparkles, Zap, Clock, User, Brain,
  AlertTriangle, FileText, Send, Bot, Target, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Task } from "@/pages/TaskManager";

interface TaskAIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const TaskAIPanel = ({ isOpen, onClose, task }: TaskAIPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    { icon: User, label: "Best assignment", prompt: `Analyze task "${task?.title || 'this task'}" and suggest the best developer to assign based on skills and availability` },
    { icon: Clock, label: "Time estimate", prompt: `Estimate the time required to complete task "${task?.title || 'this task'}" and break down the work involved` },
    { icon: AlertTriangle, label: "Risk analysis", prompt: `Analyze potential risks and blockers for task "${task?.title || 'this task'}" and suggest mitigation strategies` },
    { icon: Target, label: "Break into subtasks", prompt: `Break down task "${task?.title || 'this task'}" into actionable subtasks with estimated time for each` },
  ];

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-task-assistant`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ 
            messages: updatedMessages,
            taskContext: task ? {
              title: task.title,
              description: task.description,
              priority: task.priority,
              status: task.status,
              estimatedHours: task.estimatedHours,
              assignedTo: task.assignedTo
            } : null
          }),
        }
      );

      if (response.status === 429) {
        toast.error('Rate limit exceeded. Please try again later.');
        setIsLoading(false);
        return;
      }

      if (response.status === 402) {
        toast.error('AI credits exhausted. Please add funds.');
        setIsLoading(false);
        return;
      }

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      let textBuffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: 'assistant',
                  content: assistantContent,
                };
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error('Task AI Assistant error:', error);
      toast.error('Failed to get AI response. Please try again.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[480px] bg-slate-900 border-l border-violet-500/20 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-gradient-to-r from-violet-500/10 to-purple-500/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    AI Task Assistant
                    <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Powered
                    </Badge>
                  </h3>
                  <p className="text-xs text-violet-400">Intelligent task automation</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5 text-slate-400" />
              </Button>
            </div>

            {/* Task Context */}
            {task && (
              <div className="p-3 border-b border-slate-700/50 bg-slate-800/30">
                <p className="text-xs text-slate-400 mb-1">Current Task:</p>
                <p className="text-sm font-medium text-white truncate">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`text-[10px] ${
                    task.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                    task.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {task.priority}
                  </Badge>
                  <Badge className="text-[10px] bg-slate-700/50 text-slate-400">
                    {task.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            )}

            {/* Quick Prompts */}
            {messages.length === 0 && (
              <div className="p-4 border-b border-slate-700/50">
                <p className="text-xs text-slate-400 mb-3">Quick actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickPrompts.map((item, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => sendMessage(item.prompt)}
                      className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 border border-violet-500/20 hover:bg-violet-500/10 hover:border-violet-500/40 transition-colors text-left"
                    >
                      <item.icon className="w-4 h-4 text-violet-400" />
                      <span className="text-xs text-slate-300">{item.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-violet-500/30 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">
                    Ask me anything about task management, assignments, estimates, or workflow optimization.
                  </p>
                </div>
              )}
              
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl ${
                      message.role === 'user'
                        ? 'bg-violet-500/20 border border-violet-500/30 text-white'
                        : 'bg-slate-800/50 border border-slate-700/50 text-slate-300'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder="Ask about task assignment, estimates, risks..."
                  className="flex-1 min-h-[44px] max-h-32 bg-slate-800/50 border-violet-500/20 resize-none"
                />
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskAIPanel;
