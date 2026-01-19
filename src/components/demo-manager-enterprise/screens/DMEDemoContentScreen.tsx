/**
 * DEMO CONTENT SCREEN
 * Manage demo content, images, videos, and features
 * LOCK: No modifications without approval
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Image,
  Video,
  List,
  AlertCircle,
  Upload,
  Save,
  Trash2,
  Plus,
  CheckCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export const DMEDemoContentScreen: React.FC = () => {
  const [aboutProduct, setAboutProduct] = useState(
    'This is a comprehensive e-commerce solution designed for modern businesses. It includes advanced inventory management, multi-vendor support, payment gateway integration, and real-time analytics dashboard.'
  );

  const [features, setFeatures] = useState([
    { id: 1, name: 'Multi-vendor Support', enabled: true },
    { id: 2, name: 'Payment Gateway Integration', enabled: true },
    { id: 3, name: 'Real-time Analytics', enabled: true },
    { id: 4, name: 'Inventory Management', enabled: true },
    { id: 5, name: 'Customer Reviews', enabled: false },
  ]);

  const [newFeature, setNewFeature] = useState('');

  const media = [
    { id: 1, type: 'image', name: 'Dashboard Preview', size: '2.4 MB' },
    { id: 2, type: 'image', name: 'Product Catalog', size: '1.8 MB' },
    { id: 3, type: 'video', name: 'Demo Walkthrough', size: '45 MB' },
    { id: 4, type: 'image', name: 'Mobile View', size: '1.2 MB' },
  ];

  const wordCount = aboutProduct.split(/\s+/).filter(Boolean).length;

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, { id: Date.now(), name: newFeature.trim(), enabled: true }]);
      setNewFeature('');
    }
  };

  const toggleFeature = (id: number) => {
    setFeatures(features.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            Demo Content
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage demo content, media & features</p>
        </div>
        <Button className="bg-neon-green/20 text-neon-green hover:bg-neon-green/30 border border-neon-green/30">
          <Save className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* About Product */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">About Product</h2>
              <span className={`text-xs font-mono ${wordCount > 500 ? 'text-red-400' : 'text-muted-foreground'}`}>
                {wordCount}/500 words
              </span>
            </div>
            <Textarea
              value={aboutProduct}
              onChange={(e) => setAboutProduct(e.target.value)}
              className="min-h-[200px] bg-background border-border resize-none"
              placeholder="Describe the product..."
            />
            {wordCount > 500 && (
              <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Exceeded maximum word limit
              </p>
            )}
          </motion.div>

          {/* Media Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Media Files</h2>
            
            {/* Upload Area */}
            <div className="p-8 border-2 border-dashed border-border rounded-lg text-center mb-4 hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Drop images or videos here</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, MP4 up to 50MB</p>
            </div>

            {/* Media List */}
            <div className="space-y-2">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border"
                >
                  <div className="flex items-center gap-3">
                    {item.type === 'image' ? (
                      <Image className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Video className="w-5 h-5 text-purple-400" />
                    )}
                    <div>
                      <p className="text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.size}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Feature List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Feature List</h2>
            
            {/* Add Feature */}
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="Add new feature..."
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="bg-background border-border"
                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
              />
              <Button onClick={addFeature} className="bg-neon-teal/20 text-neon-teal hover:bg-neon-teal/30 border border-neon-teal/30">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-2">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleFeature(feature.id)}
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                        feature.enabled 
                          ? 'bg-neon-green/20 text-neon-green' 
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {feature.enabled && <CheckCircle className="w-4 h-4" />}
                    </button>
                    <span className={`text-sm ${feature.enabled ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                      {feature.name}
                    </span>
                  </div>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 h-6 w-6 p-0">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Limitations Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-400">Limitations Note</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  "Some features are under upgrade. This demo showcases the core functionality. 
                  Contact sales for full feature access and customization options."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
