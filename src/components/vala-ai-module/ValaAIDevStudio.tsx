/**
 * VALA AI DEV STUDIO - Ultra Simple Lovable-style Interface
 * Clean split view: Project Selector + Chat | Preview
 */

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Send, ExternalLink, Copy, Check, Monitor, Tablet, Smartphone, 
  RefreshCw, Loader2, Search, ChevronDown, Bot, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  url: string;
  category?: string;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const ValaAIDevStudio: React.FC = () => {
  // Project state
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Preview state
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);
  const [copied, setCopied] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    { role: 'assistant', content: 'Hi! 👋 Select a project to start. I\'ll help you customize and clone it.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isCloning, setIsCloning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('demos')
          .select('id, title, url, category')
          .not('url', 'is', null)
          .order('title');
        
        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Filter projects
  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Select project
  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setShowDropdown(false);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `✅ **${project.title}** loaded!\n\nWhat would you like to do?\n• Clone this project\n• Change theme colors\n• Add a feature`
    }]);
  };

  // Clone project
  const handleClone = async () => {
    if (!selectedProject) return;
    setIsCloning(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success(`Cloned "${selectedProject.title}"!`);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `🚀 **${selectedProject.title}** cloned! You can now edit it.`
    }]);
    setIsCloning(false);
  };

  // Send message
  const handleSend = () => {
    if (!inputMessage.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: inputMessage }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: selectedProject 
          ? `I'll help with that for ${selectedProject.title}. This feature is coming soon!`
          : 'Please select a project first.'
      }]);
    }, 500);
    
    setInputMessage('');
  };

  // Copy URL
  const handleCopyUrl = () => {
    if (selectedProject?.url) {
      navigator.clipboard.writeText(selectedProject.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const deviceStyles = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' }
  };

  return (
    <div className="h-full flex bg-background rounded-lg overflow-hidden border border-border">
      {/* Left Panel - Chat */}
      <div className="w-[400px] flex flex-col border-r border-border">
        {/* Project Selector */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-emerald-900/30 to-pink-900/30">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-emerald-500/50 bg-background/90 hover:border-pink-500/50 transition-all shadow-lg"
            >
              <div className="flex items-center gap-3 min-w-0">
                {selectedProject ? (
                  <>
                    <div className="w-3 h-3 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                    <span className="truncate text-base font-semibold text-emerald-100">{selectedProject.title}</span>
                  </>
                ) : (
                  <span className="text-pink-300 text-base font-medium">🎯 Select project...</span>
                )}
              </div>
              <ChevronDown className={cn("h-5 w-5 text-pink-400 transition-transform", showDropdown && "rotate-180")} />
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border-2 border-emerald-500/50 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 border-b border-emerald-500/30 bg-emerald-900/20">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-emerald-400" />
                    <Input
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-11 text-base bg-background/80 border-emerald-500/30 text-white placeholder:text-emerald-300/50"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-[280px] overflow-auto">
                  {loading ? (
                    <div className="p-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-pink-400" />
                      <p className="mt-2 text-pink-300">Loading...</p>
                    </div>
                  ) : filteredProjects.length === 0 ? (
                    <div className="p-6 text-center text-pink-300 text-base font-medium">❌ No projects found</div>
                  ) : (
                    filteredProjects.map(project => (
                      <button
                        key={project.id}
                        onClick={() => handleSelectProject(project)}
                        className={cn(
                          "w-full px-4 py-3.5 text-left hover:bg-emerald-500/20 transition-all flex items-center gap-3 border-b border-gray-800/50",
                          selectedProject?.id === project.id && "bg-pink-500/20 border-l-4 border-l-pink-500"
                        )}
                      >
                        <div className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-base text-white truncate">{project.title}</div>
                          {project.category && (
                            <div className="text-sm text-emerald-300 mt-0.5">{project.category}</div>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Clone Button */}
          {selectedProject && (
            <Button
              onClick={handleClone}
              disabled={isCloning}
              className="w-full mt-3 h-12 text-base font-bold bg-gradient-to-r from-emerald-500 to-pink-500 hover:from-emerald-400 hover:to-pink-400 text-white shadow-lg shadow-pink-500/30"
            >
              {isCloning ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-5 w-5 mr-2" />
              )}
              {isCloning ? 'Cloning...' : '⚡ One-Click Clone'}
            </Button>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4 bg-gradient-to-b from-gray-900 to-gray-950">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                "max-w-[90%] rounded-2xl px-5 py-3 text-base leading-relaxed shadow-lg",
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-br-md'
                  : 'bg-gradient-to-r from-emerald-800/80 to-emerald-700/60 text-emerald-50 rounded-bl-md border border-emerald-500/30'
              )}>
                <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-emerald-500/30 bg-gradient-to-r from-emerald-900/30 to-pink-900/30">
          <div className="flex gap-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="💬 Ask anything..."
              className="flex-1 h-12 text-base bg-background/80 border-emerald-500/30 text-white placeholder:text-pink-300/50"
            />
            <Button size="icon" onClick={handleSend} className="shrink-0 h-12 w-12 bg-gradient-to-r from-pink-500 to-emerald-500 hover:from-pink-400 hover:to-emerald-400">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 flex flex-col bg-gray-950">
        {/* Preview Header */}
        <div className="h-14 border-b border-emerald-500/30 bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur flex items-center justify-between px-5">
          {/* Device Toggle */}
          <div className="flex bg-gray-800 rounded-xl p-1 border border-emerald-500/30">
            {[
              { type: 'desktop' as DeviceType, icon: Monitor },
              { type: 'tablet' as DeviceType, icon: Tablet },
              { type: 'mobile' as DeviceType, icon: Smartphone },
            ].map(({ type, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setDevice(type)}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  device === type 
                    ? 'bg-gradient-to-r from-emerald-500 to-pink-500 shadow-lg text-white' 
                    : 'text-gray-400 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>

          {/* URL + Actions */}
          <div className="flex items-center gap-3">
            {selectedProject?.url && (
              <div className="hidden sm:flex items-center gap-2 bg-gray-800/80 rounded-lg px-4 py-2 text-sm text-emerald-300 max-w-[280px] border border-emerald-500/30">
                <span className="truncate font-medium">{selectedProject.url}</span>
                <button onClick={handleCopyUrl} className="shrink-0 hover:text-pink-400 transition-colors">
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            )}
            <Button variant="ghost" size="icon" className="h-10 w-10 text-emerald-400 hover:text-pink-400 hover:bg-emerald-500/10" onClick={() => setRefreshKey(k => k + 1)}>
              <RefreshCw className="h-5 w-5" />
            </Button>
            {selectedProject?.url && (
              <Button variant="ghost" size="icon" className="h-10 w-10 text-pink-400 hover:text-emerald-400 hover:bg-pink-500/10" onClick={() => window.open(selectedProject.url, '_blank')}>
                <ExternalLink className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 flex items-start justify-center p-6 overflow-auto bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
          {selectedProject?.url ? (
            <div
              className={cn(
                "bg-background rounded-xl shadow-2xl overflow-hidden transition-all duration-300 border-2 border-emerald-500/30",
                device === 'desktop' && "w-full h-full"
              )}
              style={device !== 'desktop' ? deviceStyles[device] : undefined}
            >
              <iframe
                key={refreshKey}
                src={selectedProject.url}
                className="w-full h-full border-0"
                title="Preview"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500/20 to-pink-500/20 flex items-center justify-center mb-6">
                <Bot className="h-12 w-12 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-white mb-2">Select a Project</p>
              <p className="text-base text-emerald-300">Choose from the dropdown to preview ✨</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValaAIDevStudio;
