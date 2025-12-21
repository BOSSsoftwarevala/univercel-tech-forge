import React, { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AIAssistantWidgetProps {
  theme: 'dark' | 'light';
}

export function AIAssistantWidget({ theme }: AIAssistantWidgetProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const isDark = theme === 'dark';

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/25 flex items-center justify-center hover:scale-110 transition-transform z-50"
        >
          <Bot className="h-6 w-6 text-white" />
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
              <Bot className="h-5 w-5" />
              <span className="font-semibold">AI Assistant</span>
              <Sparkles className="h-4 w-4" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
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

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              {['Analyze leads', 'Task summary', 'Today\'s alerts'].map((action) => (
                <button
                  key={action}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
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
                placeholder="Ask anything..."
                className="flex-1"
              />
              <Button size="icon" className="bg-gradient-to-r from-cyan-500 to-purple-500">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
