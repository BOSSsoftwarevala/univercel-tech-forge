import React, { useState } from 'react';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import softwareValaLogo from '@/assets/software-vala-logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface AIAssistantWidgetProps {
  theme: 'dark' | 'light';
}

interface Message {
  id: number;
  type: 'user' | 'ai';
  text: string;
}

export function AIAssistantWidget({ theme }: AIAssistantWidgetProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const isDark = theme === 'dark';

  const quickActions = ['Analyze leads', 'Task summary', 'Today\'s alerts'];

  const handleQuickAction = (action: string) => {
    setIsLoading(true);
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: action }]);
    
    setTimeout(() => {
      let response = '';
      switch (action) {
        case 'Analyze leads':
          response = '📊 Lead Analysis:\n• 5 hot leads need attention\n• Conversion rate: 15% (up 3%)\n• Mumbai region performing best\n• Recommend: Focus on qualified leads';
          break;
        case 'Task summary':
          response = '📋 Task Summary:\n• 12 tasks in progress\n• 3 overdue (high priority)\n• 8 completed today\n• Next deadline: Task #T-1234 in 2 hours';
          break;
        case "Today's alerts":
          response = '🔔 Today\'s Alerts:\n• 3 buzzer alerts pending\n• 2 escalations resolved\n• 1 SLA warning active\n• System status: All operational';
          break;
        default:
          response = 'I\'m here to help! Please select an option or ask me anything.';
      }
      setMessages(prev => [...prev, { id: Date.now(), type: 'ai', text: response }]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!query.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: query }]);
    setQuery('');
    setIsLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        type: 'ai', 
        text: `I received your query: "${query}"\n\nI'm analyzing the data and will provide insights shortly. For now, try using the quick action buttons for immediate results.` 
      }]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/25 flex items-center justify-center hover:scale-110 transition-transform z-50 overflow-hidden"
        >
          <img src={softwareValaLogo} alt="AI Assistant" className="h-10 w-10 rounded-full object-cover" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white" />
        </button>
      )}

      {/* Expanded Panel */}
      {open && (
        <div className={`fixed bottom-24 right-6 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden ${
          isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-gray-200'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <img src={softwareValaLogo} alt="Software Vala" className="h-6 w-6 rounded-full object-cover" />
              <span className="font-semibold">AI Assistant</span>
              <Sparkles className="h-4 w-4" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
            {messages.length === 0 ? (
              <div className={`p-3 rounded-lg text-sm ${
                isDark ? 'bg-slate-800' : 'bg-gray-100'
              }`}>
                <p>👋 Hello! I'm your AI assistant. I can help you with:</p>
                <ul className="mt-2 space-y-1 text-muted-foreground text-xs">
                  <li>• Lead qualification insights</li>
                  <li>• Task prioritization</li>
                  <li>• Demo recommendations</li>
                  <li>• Performance analytics</li>
                </ul>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg text-sm ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 ml-4'
                      : isDark ? 'bg-slate-800' : 'bg-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              ))
            )}
            {isLoading && (
              <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing...</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => handleQuickAction(action)}
                  disabled={isLoading}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors disabled:opacity-50 ${
                    isDark 
                      ? 'bg-slate-800 hover:bg-slate-700' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className={`p-4 border-t ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                size="icon" 
                className="bg-gradient-to-r from-cyan-500 to-purple-500"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
