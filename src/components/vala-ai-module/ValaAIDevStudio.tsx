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
      <div className="w-[380px] flex flex-col border-r border-border">
        {/* Project Selector */}
        <div className="p-3 border-b border-border bg-card">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border bg-background hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                {selectedProject ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-neon-green shrink-0" />
                    <span className="truncate text-sm font-medium">{selectedProject.title}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground text-sm">Select project...</span>
                )}
              </div>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", showDropdown && "rotate-180")} />
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-9"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-[250px] overflow-auto">
                  {loading ? (
                    <div className="p-6 text-center">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                    </div>
                  ) : filteredProjects.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">No projects found</div>
                  ) : (
                    filteredProjects.map(project => (
                      <button
                        key={project.id}
                        onClick={() => handleSelectProject(project)}
                        className={cn(
                          "w-full px-3 py-2.5 text-left hover:bg-accent/50 transition-colors flex items-center gap-3",
                          selectedProject?.id === project.id && "bg-accent/30"
                        )}
                      >
                        <div className="w-2 h-2 rounded-full bg-neon-green shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">{project.title}</div>
                          {project.category && (
                            <div className="text-xs text-muted-foreground">{project.category}</div>
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
              className="w-full mt-2 bg-gradient-to-r from-primary to-neon-cyan text-white"
            >
              {isCloning ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {isCloning ? 'Cloning...' : 'One-Click Clone'}
            </Button>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-muted rounded-bl-md'
              )}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border bg-card">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-1"
            />
            <Button size="icon" onClick={handleSend} className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 flex flex-col bg-muted/20">
        {/* Preview Header */}
        <div className="h-12 border-b border-border bg-card/50 backdrop-blur flex items-center justify-between px-4">
          {/* Device Toggle */}
          <div className="flex bg-muted rounded-lg p-0.5">
            {[
              { type: 'desktop' as DeviceType, icon: Monitor },
              { type: 'tablet' as DeviceType, icon: Tablet },
              { type: 'mobile' as DeviceType, icon: Smartphone },
            ].map(({ type, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setDevice(type)}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  device === type ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          {/* URL + Actions */}
          <div className="flex items-center gap-2">
            {selectedProject?.url && (
              <div className="hidden sm:flex items-center gap-1.5 bg-muted/50 rounded-lg px-3 py-1.5 text-xs text-muted-foreground max-w-[250px]">
                <span className="truncate">{selectedProject.url}</span>
                <button onClick={handleCopyUrl} className="shrink-0 hover:text-foreground transition-colors">
                  {copied ? <Check className="h-3.5 w-3.5 text-neon-green" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setRefreshKey(k => k + 1)}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            {selectedProject?.url && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(selectedProject.url, '_blank')}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 flex items-start justify-center p-4 overflow-auto">
          {selectedProject?.url ? (
            <div
              className={cn(
                "bg-background rounded-lg shadow-2xl overflow-hidden transition-all duration-300 border border-border",
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
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Bot className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-xl font-medium mb-1">Select a project</p>
              <p className="text-sm">Choose from the dropdown to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValaAIDevStudio;
