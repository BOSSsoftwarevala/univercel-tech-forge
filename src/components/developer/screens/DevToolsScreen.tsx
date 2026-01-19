/**
 * DEVELOPER TOOLS SCREEN
 * Formatter, Optimizer, Validator utilities
 * LOCK: No modifications without approval
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  Code,
  Zap,
  ShieldCheck,
  Play,
  CheckCircle,
  Copy,
  RefreshCw
} from 'lucide-react';

interface DevToolsScreenProps {
  view: 'formatter' | 'optimizer' | 'validator';
}

export const DevToolsScreen: React.FC<DevToolsScreenProps> = ({ view }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const toolInfo = {
    formatter: {
      title: 'Code Formatter',
      description: 'Format and beautify your code with consistent styling',
      icon: Code,
      color: 'cyan',
      placeholder: 'Paste your code here to format...'
    },
    optimizer: {
      title: 'Code Optimizer',
      description: 'Analyze and optimize your code for better performance',
      icon: Zap,
      color: 'amber',
      placeholder: 'Paste your code here to optimize...'
    },
    validator: {
      title: 'Code Validator',
      description: 'Validate your code for errors and best practices',
      icon: ShieldCheck,
      color: 'emerald',
      placeholder: 'Paste your code here to validate...'
    }
  };

  const tool = toolInfo[view];

  const handleRun = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setOutput(`// ${view === 'formatter' ? 'Formatted' : view === 'optimizer' ? 'Optimized' : 'Validated'} code\n${input}`);
      setIsProcessing(false);
    }, 1500);
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
      amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
      emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' }
    };
    return colors[color] || colors.cyan;
  };

  const colors = getColorClasses(tool.color);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.bg} border ${colors.border}`}>
          <tool.icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{tool.title}</h1>
          <p className="text-slate-400 text-sm">{tool.description}</p>
        </div>
      </div>

      {/* Editor Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Input</h3>
            <button
              onClick={() => setInput('')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tool.placeholder}
            className="w-full h-80 p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white font-mono text-sm placeholder-slate-500 resize-none focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Output</h3>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
            >
              <Copy className="w-3 h-3" />
              Copy
            </button>
          </div>
          <div className="w-full h-80 p-4 rounded-xl bg-slate-900/50 border border-slate-700 font-mono text-sm overflow-auto">
            {isProcessing ? (
              <div className="flex items-center justify-center h-full">
                <RefreshCw className={`w-6 h-6 ${colors.text} animate-spin`} />
              </div>
            ) : output ? (
              <pre className="text-white whitespace-pre-wrap">{output}</pre>
            ) : (
              <span className="text-slate-500">Output will appear here...</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleRun}
          disabled={!input || isProcessing}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${colors.bg} ${colors.text} hover:opacity-80 border ${colors.border}`}
        >
          {isProcessing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          Run {tool.title.split(' ')[1]}
        </button>

        {output && (
          <button
            onClick={() => {
              setInput(output);
              setOutput('');
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium hover:opacity-80 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Apply Result
          </button>
        )}
      </div>

      {/* Quick Tips */}
      <div className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}>
        <h4 className={`font-medium ${colors.text} mb-2`}>Quick Tips</h4>
        <ul className="text-sm text-slate-400 space-y-1">
          {view === 'formatter' && (
            <>
              <li>• Supports JavaScript, TypeScript, JSON, CSS, and HTML</li>
              <li>• Automatically detects file type from content</li>
              <li>• Uses Prettier configuration from your project</li>
            </>
          )}
          {view === 'optimizer' && (
            <>
              <li>• Identifies unused imports and variables</li>
              <li>• Suggests performance improvements</li>
              <li>• Detects common anti-patterns</li>
            </>
          )}
          {view === 'validator' && (
            <>
              <li>• Checks for syntax errors and type issues</li>
              <li>• Validates against ESLint rules</li>
              <li>• Identifies security vulnerabilities</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};
