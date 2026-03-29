import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase, Upload, Download, Search, Grid, List, Image,
  FileText, Video, Music, Archive, Folder, Plus, Trash2,
  Eye, Copy, Share2, RefreshCw, HardDrive, BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

const T = {
  glass: 'hsla(222, 47%, 11%, 0.72)',
  glassBorder: 'hsla(215, 40%, 35%, 0.25)',
  text: 'hsl(210, 40%, 98%)',
  muted: 'hsl(215, 22%, 65%)',
  dim: 'hsl(215, 15%, 42%)',
  blue: 'hsl(217, 92%, 65%)',
  green: 'hsl(160, 84%, 44%)',
  amber: 'hsl(38, 95%, 55%)',
  red: 'hsl(346, 82%, 55%)',
  purple: 'hsl(262, 85%, 63%)',
  rowHover: 'hsla(217, 91%, 60%, 0.07)',
};

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const rise = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 28 } } };

const Glass = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div variants={rise} className={`rounded-2xl overflow-hidden ${className}`}
    style={{ background: T.glass, backdropFilter: 'blur(20px)', border: `1px solid ${T.glassBorder}`, boxShadow: `0 8px 32px -8px hsla(222,47%,4%,0.5)` }}>
    {children}
  </motion.div>
);

const ASSETS = [
  { id: '1', name: 'Brand Logo Pack', type: 'image', size: '24.5 MB', folder: 'Branding', modified: '2h ago', downloads: 142, format: 'PNG/SVG' },
  { id: '2', name: 'Product Demo Video', type: 'video', size: '486 MB', folder: 'Marketing', modified: '1d ago', downloads: 89, format: 'MP4' },
  { id: '3', name: 'API Documentation', type: 'document', size: '2.1 MB', folder: 'Technical', modified: '3h ago', downloads: 234, format: 'PDF' },
  { id: '4', name: 'UI Component Kit', type: 'archive', size: '18.3 MB', folder: 'Development', modified: '5d ago', downloads: 567, format: 'ZIP' },
  { id: '5', name: 'Brand Guidelines', type: 'document', size: '8.7 MB', folder: 'Branding', modified: '1w ago', downloads: 78, format: 'PDF' },
  { id: '6', name: 'Product Screenshots', type: 'image', size: '45.2 MB', folder: 'Marketing', modified: '2d ago', downloads: 312, format: 'PNG' },
  { id: '7', name: 'Pitch Deck', type: 'document', size: '15.6 MB', folder: 'Sales', modified: '3d ago', downloads: 156, format: 'PPTX' },
  { id: '8', name: 'Brand Audio Jingle', type: 'audio', size: '3.2 MB', folder: 'Branding', modified: '2w ago', downloads: 44, format: 'MP3' },
];

const FOLDERS = [
  { name: 'Branding', count: 12, size: '234 MB', color: T.blue },
  { name: 'Marketing', count: 28, size: '1.2 GB', color: T.green },
  { name: 'Technical', count: 45, size: '567 MB', color: T.purple },
  { name: 'Sales', count: 19, size: '345 MB', color: T.amber },
  { name: 'Development', count: 67, size: '2.3 GB', color: T.red },
];

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  image: { icon: Image, color: T.blue },
  video: { icon: Video, color: T.red },
  document: { icon: FileText, color: T.amber },
  archive: { icon: Archive, color: T.purple },
  audio: { icon: Music, color: T.green },
};

export function AssetManager() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [search, setSearch] = useState('');
  const [activeFolder, setActiveFolder] = useState('all');

  const totalSize = '4.7 GB';
  const totalAssets = 171;

  const filtered = ASSETS.filter(a => {
    const matchFolder = activeFolder === 'all' || a.folder === activeFolder;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    return matchFolder && matchSearch;
  });

  return (
    <motion.div className="space-y-5" variants={stagger} initial="hidden" animate="show" style={{ color: T.text }}>
      {/* Header */}
      <motion.div variants={rise} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight">Asset Manager</h1>
          <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>Central repository for all brand, marketing, and technical assets</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toast.info('Upload functionality coming soon')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all"
            style={{ background: T.blue, color: 'white' }}>
            <Upload className="w-3.5 h-3.5" /> Upload Asset
          </button>
        </div>
      </motion.div>

      {/* KPI */}
      <motion.div variants={stagger} className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Assets', value: totalAssets, icon: Briefcase, color: T.blue },
          { label: 'Storage Used', value: totalSize, icon: HardDrive, color: T.green },
          { label: 'Total Downloads', value: '1,622', icon: Download, color: T.amber },
          { label: 'Folders', value: FOLDERS.length, icon: Folder, color: T.purple },
        ].map(k => (
          <Glass key={k.label} className="p-4">
            <k.icon className="w-4 h-4 mb-2" style={{ color: k.color }} />
            <p className="text-2xl font-black">{k.value}</p>
            <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: T.muted }}>{k.label}</p>
          </Glass>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-4">
        {/* Folder Sidebar */}
        <Glass className="col-span-3 p-4">
          <h3 className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: T.muted }}>Folders</h3>
          <div className="space-y-1">
            <button onClick={() => setActiveFolder('all')}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all"
              style={{
                background: activeFolder === 'all' ? `${T.blue}15` : 'transparent',
                color: activeFolder === 'all' ? T.blue : T.muted,
                borderLeft: activeFolder === 'all' ? `2px solid ${T.blue}` : '2px solid transparent',
              }}>
              <Folder className="w-3.5 h-3.5" />
              <span className="flex-1 text-left">All Assets</span>
              <span className="text-[9px] font-bold">{totalAssets}</span>
            </button>
            {FOLDERS.map(f => (
              <button key={f.name} onClick={() => setActiveFolder(f.name)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all"
                style={{
                  background: activeFolder === f.name ? `${f.color}12` : 'transparent',
                  color: activeFolder === f.name ? f.color : T.muted,
                  borderLeft: activeFolder === f.name ? `2px solid ${f.color}` : '2px solid transparent',
                }}>
                <Folder className="w-3.5 h-3.5" />
                <span className="flex-1 text-left">{f.name}</span>
                <span className="text-[9px] font-bold">{f.count}</span>
              </button>
            ))}
          </div>
        </Glass>

        {/* Asset List */}
        <div className="col-span-9 space-y-3">
          {/* Search + Controls */}
          <motion.div variants={rise} className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: 'hsla(215,28%,15%,0.8)', border: `1px solid ${T.glassBorder}` }}>
              <Search className="w-3.5 h-3.5" style={{ color: T.muted }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets..."
                className="flex-1 bg-transparent text-sm outline-none" style={{ color: T.text }} />
            </div>
            <button onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
              style={{ background: 'hsla(215,28%,20%,0.5)', color: T.muted, border: `1px solid ${T.glassBorder}` }}>
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </button>
          </motion.div>

          <Glass className="p-4">
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
              {filtered.map(asset => {
                const tc = typeConfig[asset.type] || typeConfig.document;
                return (
                  <motion.div key={asset.id} variants={rise}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
                    whileHover={{ backgroundColor: T.rowHover }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: `${tc.color}15` }}>
                      <tc.icon className="w-4 h-4" style={{ color: tc.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: T.text }}>{asset.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px]" style={{ color: T.dim }}>{asset.folder}</span>
                        <span style={{ color: T.dim }}>•</span>
                        <span className="text-[10px]" style={{ color: T.dim }}>{asset.format}</span>
                        <span style={{ color: T.dim }}>•</span>
                        <span className="text-[10px]" style={{ color: T.dim }}>{asset.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mr-2">
                      <div className="text-right">
                        <p className="text-[10px] font-mono" style={{ color: T.dim }}>{asset.downloads} DL</p>
                        <p className="text-[9px]" style={{ color: T.dim }}>{asset.modified}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => toast.info(`Viewing ${asset.name}`)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${T.blue}15`, color: T.blue }}>
                        <Eye className="w-3 h-3" />
                      </button>
                      <button onClick={() => toast.success(`Downloading ${asset.name}`)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${T.green}15`, color: T.green }}>
                        <Download className="w-3 h-3" />
                      </button>
                      <button onClick={() => toast.info('Share link copied')}
                        className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${T.muted}15`, color: T.muted }}>
                        <Share2 className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Glass>
        </div>
      </div>
    </motion.div>
  );
}
