import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, X, Send, Image, Hash, Type, 
  Loader2, Copy, RefreshCw, Wand2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AIContentAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIContentAssistant = ({ isOpen, onClose }: AIContentAssistantProps) => {
  const [activeTab, setActiveTab] = useState<'caption' | 'hashtag' | 'thumbnail'>('caption');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please enter a topic or description');
      return;
    }

    setIsLoading(true);
    setOutput('');

    try {
      const response = await supabase.functions.invoke('campaign-optimizer', {
        body: {
          type: 'ad_copy',
          input: {
            product: input,
            targetAudience: 'Social media followers',
            platform: 'Instagram',
            contentType: activeTab
          }
        }
      });

      if (response.error) throw response.error;
      
      setOutput(response.data.result || 'Generated content will appear here');
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate content');
      
      // Fallback demo content
      if (activeTab === 'caption') {
        setOutput(`✨ Introducing something amazing! ${input}\n\n🚀 This is your next favorite thing. Trust us!\n\n💫 Experience the difference today.\n\n#ProductLaunch #Innovation #MustHave`);
      } else if (activeTab === 'hashtag') {
        setOutput(`#${input.replace(/\s+/g, '')}\n#Innovation\n#Trending\n#MustHave\n#LifeHack\n#Viral\n#Explore\n#Featured\n#Recommended\n#TopPick`);
      } else {
        setOutput(`Thumbnail Suggestions for "${input}":\n\n1. Bold text overlay with vibrant gradient background\n2. Product close-up with soft lighting\n3. Before/after split design\n4. Minimalist design with centered product\n5. Dynamic action shot with motion blur`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard!');
  };

  const tabs = [
    { id: 'caption', label: 'Caption Generator', icon: Type },
    { id: 'hashtag', label: 'Hashtag Strategy', icon: Hash },
    { id: 'thumbnail', label: 'Thumbnail Ideas', icon: Image },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">AI Content Assistant</h2>
                  <p className="text-xs text-slate-400">Generate captions, hashtags & thumbnail ideas</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-700/50">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setOutput('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Input */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  {activeTab === 'caption' && 'Describe your product or post topic'}
                  {activeTab === 'hashtag' && 'Enter your niche or topic keywords'}
                  {activeTab === 'thumbnail' && 'Describe your video content'}
                </label>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    activeTab === 'caption' ? 'E.g., New fitness app that tracks workouts and nutrition...' :
                    activeTab === 'hashtag' ? 'E.g., fitness, health, workout, gym...' :
                    'E.g., Tutorial on how to use our new software feature...'
                  }
                  className="bg-slate-800/50 border-slate-600/50 min-h-[100px]"
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !input.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate {activeTab === 'caption' ? 'Caption' : activeTab === 'hashtag' ? 'Hashtags' : 'Ideas'}
                  </>
                )}
              </Button>

              {/* Output */}
              {output && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-slate-800/50 border border-purple-500/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-purple-400">Generated Content</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleGenerate()}>
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-slate-300 whitespace-pre-wrap">{output}</div>
                </motion.div>
              )}
            </div>

            {/* Footer Tips */}
            <div className="p-4 bg-slate-800/30 border-t border-slate-700/50">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>
                  {activeTab === 'caption' && 'Tip: Be specific about your product and target audience for better results'}
                  {activeTab === 'hashtag' && 'Tip: Mix popular and niche hashtags for optimal reach'}
                  {activeTab === 'thumbnail' && 'Tip: Include the main action or benefit in your description'}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIContentAssistant;
