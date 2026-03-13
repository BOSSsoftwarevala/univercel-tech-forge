import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Mic, Paperclip, Code2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CommandInputProps {
  onCommand?: (command: string) => void;
  placeholder?: string;
  className?: string;
}

const QUICK_COMMANDS = [
  { label: 'Scan Project', value: '/scan project' },
  { label: 'Detect Framework', value: '/detect framework' },
  { label: 'Check Dependencies', value: '/check dependencies' },
  { label: 'Run Security Audit', value: '/audit security' },
  { label: 'Deploy to Production', value: '/deploy production' },
  { label: 'View Logs', value: '/logs view' },
];

const CommandInput: React.FC<CommandInputProps> = ({
  onCommand,
  placeholder = 'Ask AI to scan, build, deploy, or analyze your project...',
  className,
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onCommand?.(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickCommand = (cmd: string) => {
    setValue(cmd);
    textareaRef.current?.focus();
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Quick commands */}
      <div className="flex flex-wrap gap-2">
        {QUICK_COMMANDS.map((cmd) => (
          <button
            key={cmd.value}
            onClick={() => handleQuickCommand(cmd.value)}
            className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700 hover:border-slate-600 transition-all"
          >
            {cmd.label}
          </button>
        ))}
      </div>

      {/* Main input area */}
      <motion.div
        animate={{
          boxShadow: isFocused
            ? '0 0 0 2px rgba(139, 92, 246, 0.4), 0 0 30px rgba(139, 92, 246, 0.1)'
            : '0 0 0 1px rgba(71, 85, 105, 0.5)',
        }}
        className="relative rounded-xl bg-slate-900 border border-slate-700 overflow-hidden"
      >
        {/* Header bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-xs text-slate-400 font-medium">AI Command Console</span>
          <Badge className="ml-auto text-[10px] bg-violet-500/20 text-violet-300 border-violet-500/30 px-2 py-0">
            GPT-4o
          </Badge>
        </div>

        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={4}
          className="w-full bg-transparent border-0 resize-none text-slate-200 placeholder:text-slate-600 focus-visible:ring-0 px-4 py-3 text-sm"
        />

        {/* Footer toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 border-t border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-slate-500 hover:text-slate-300"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-slate-500 hover:text-slate-300"
          >
            <Code2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-slate-500 hover:text-slate-300"
          >
            <Mic className="w-4 h-4" />
          </Button>

          <span className="flex-1 text-xs text-slate-600">
            {value.length > 0 ? `${value.length} chars` : 'Shift+Enter for new line'}
          </span>

          <Button
            onClick={handleSubmit}
            disabled={!value.trim()}
            size="sm"
            className={cn(
              'h-8 px-4 text-xs font-medium transition-all',
              value.trim()
                ? 'bg-violet-600 hover:bg-violet-500 text-white'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            )}
          >
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Execute
            <Send className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default CommandInput;
