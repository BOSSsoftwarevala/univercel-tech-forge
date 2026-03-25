import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Send, Code2, Bug, Zap, FileText, Lightbulb, 
  Copy, Check, Sparkles, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'code' | 'suggestion' | 'error' | 'documentation';
}

const quickActions = [
  { id: 'code', label: 'Code Suggestion', icon: Code2, prompt: 'Suggest code for:' },
  { id: 'bugfix', label: 'Bug Fix', icon: Bug, prompt: 'Help fix this bug:' },
  { id: 'optimize', label: 'Optimization', icon: Zap, prompt: 'Optimize this code:' },
  { id: 'error', label: 'Error Explanation', icon: Lightbulb, prompt: 'Explain this error:' },
  { id: 'docs', label: 'Documentation', icon: FileText, prompt: 'Generate docs for:' },
  { id: 'review', label: 'Code Review', icon: Sparkles, prompt: 'Review this code:' },
];

const DeveloperAISection = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI coding assistant. I can help you with code suggestions, bug fixes, optimization tips, error explanations, and documentation. What would you like help with?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setActiveAction(action.id);
    setInput(action.prompt + ' ');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(input, activeAction),
        type: activeAction === 'code' ? 'code' : activeAction === 'docs' ? 'documentation' : 'suggestion',
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      setActiveAction(null);
    }, 1500);
  };

  const generateMockResponse = (query: string, action: string | null): string => {
    if (action === 'code' || query.toLowerCase().includes('code')) {
      return `Here's a code suggestion:\n\n\`\`\`typescript\nconst handlePayment = async (amount: number) => {\n  try {\n    const response = await paymentGateway.process({\n      amount,\n      currency: 'INR',\n      method: 'card'\n    });\n    return response.transactionId;\n  } catch (error) {\n    console.error('Payment failed:', error);\n    throw new PaymentError(error.message);\n  }\n};\n\`\`\`\n\nThis handles payment processing with proper error handling.`;
    }
    if (action === 'bugfix' || query.toLowerCase().includes('bug')) {
      return `Based on your description, here's the likely fix:\n\n**Problem:** The component is re-rendering unnecessarily.\n\n**Solution:**\n1. Wrap the function in \`useCallback\`\n2. Memoize expensive calculations with \`useMemo\`\n3. Consider using \`React.memo\` for child components\n\n\`\`\`typescript\nconst memoizedValue = useMemo(() => computeExpensiveValue(data), [data]);\n\`\`\``;
    }
    if (action === 'optimize') {
      return `Here are optimization suggestions:\n\n1. **Lazy Loading:** Import components dynamically\n2. **Debounce:** Add debounce to search inputs\n3. **Virtual Lists:** Use react-window for long lists\n4. **Code Splitting:** Split routes into separate bundles\n\nEstimated performance improvement: ~40%`;
    }
    return `I understand you're asking about: "${query}"\n\nHere's my analysis:\n\n1. **Context:** This appears to be related to frontend development\n2. **Suggestion:** Consider using modern React patterns\n3. **Best Practice:** Always handle edge cases\n\nWould you like me to elaborate on any of these points?`;
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Bot className="w-7 h-7 text-violet-400" />
            AI Assistant
          </h1>
          <p className="text-slate-400 mt-1">Code help, bug fixes, and intelligent suggestions</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/20 border border-violet-500/30 rounded-lg">
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
          </motion.div>
          <span className="text-sm text-violet-400">AI Powered</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            size="sm"
            variant="outline"
            onClick={() => handleQuickAction(action)}
            className={`border-violet-500/30 text-violet-400 hover:bg-violet-500/10 ${
              activeAction === action.id ? 'bg-violet-500/20 border-violet-500/50' : ''
            }`}
          >
            <action.icon className="w-4 h-4 mr-2" />
            {action.label}
          </Button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-slate-900/30 rounded-xl border border-slate-700/50 mb-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-xl ${
                  message.role === 'user'
                    ? 'bg-cyan-500/20 border border-cyan-500/30'
                    : 'bg-violet-500/10 border border-violet-500/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  {message.role === 'assistant' && (
                    <div className="p-2 rounded-lg bg-violet-500/20">
                      <Bot className="w-4 h-4 text-violet-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{message.content}</p>
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className="mt-2 flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {copiedId === message.id ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <RefreshCw className="w-4 h-4 text-violet-400" />
                </motion.div>
                <span className="text-sm text-slate-400">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything about code, bugs, or optimization..."
            className="bg-slate-900/50 border-violet-500/30 min-h-[60px] resize-none pr-12"
          />
        </div>
        <Button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-violet-600 hover:bg-violet-500 h-[60px] px-6"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default DeveloperAISection;
