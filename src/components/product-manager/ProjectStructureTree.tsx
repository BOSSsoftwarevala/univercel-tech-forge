import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Folder, FolderOpen, File, Code2, Settings, Database, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  extension?: string;
  size?: string;
  modified?: string;
}

interface ProjectStructureTreeProps {
  data?: TreeNode[];
  className?: string;
}

const DEFAULT_TREE: TreeNode[] = [
  {
    id: '1', name: 'src', type: 'folder', children: [
      {
        id: '1-1', name: 'components', type: 'folder', children: [
          { id: '1-1-1', name: 'App.tsx', type: 'file', extension: 'tsx', size: '4.2 KB' },
          { id: '1-1-2', name: 'Layout.tsx', type: 'file', extension: 'tsx', size: '2.1 KB' },
        ]
      },
      {
        id: '1-2', name: 'pages', type: 'folder', children: [
          { id: '1-2-1', name: 'index.tsx', type: 'file', extension: 'tsx', size: '1.8 KB' },
          { id: '1-2-2', name: 'dashboard.tsx', type: 'file', extension: 'tsx', size: '6.4 KB' },
        ]
      },
      { id: '1-3', name: 'main.tsx', type: 'file', extension: 'tsx', size: '0.5 KB' },
    ]
  },
  {
    id: '2', name: 'public', type: 'folder', children: [
      { id: '2-1', name: 'index.html', type: 'file', extension: 'html', size: '1.1 KB' },
      { id: '2-2', name: 'favicon.ico', type: 'file', extension: 'ico', size: '15 KB' },
    ]
  },
  { id: '3', name: 'package.json', type: 'file', extension: 'json', size: '2.3 KB' },
  { id: '4', name: 'tsconfig.json', type: 'file', extension: 'json', size: '0.8 KB' },
  { id: '5', name: 'vite.config.ts', type: 'file', extension: 'ts', size: '0.4 KB' },
];

const FILE_ICONS: Record<string, React.ElementType> = {
  tsx: Code2,
  ts: Code2,
  js: Code2,
  jsx: Code2,
  json: Settings,
  sql: Database,
  html: Globe,
  css: File,
  scss: File,
};

const TreeNodeItem: React.FC<{ node: TreeNode; depth?: number }> = ({ node, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(depth < 1);
  const hasChildren = node.type === 'folder' && node.children && node.children.length > 0;
  const FileIcon = node.extension ? (FILE_ICONS[node.extension] || File) : File;

  return (
    <div>
      <button
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-800/60 text-left transition-colors group',
          depth > 0 && 'ml-3'
        )}
        style={{ paddingLeft: `${(depth * 12) + 8}px` }}
      >
        {/* Expand/collapse icon */}
        <span className="w-3.5 h-3.5 shrink-0">
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            )
          ) : null}
        </span>

        {/* File/folder icon */}
        {node.type === 'folder' ? (
          isExpanded ? (
            <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          ) : (
            <Folder className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
          )
        ) : (
          <FileIcon className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-400 shrink-0" />
        )}

        {/* Name */}
        <span
          className={cn(
            'text-xs truncate flex-1',
            node.type === 'folder' ? 'text-slate-300' : 'text-slate-400'
          )}
        >
          {node.name}
        </span>

        {/* Size */}
        {node.size && (
          <span className="text-[10px] text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {node.size}
          </span>
        )}
      </button>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {node.children!.map((child) => (
              <TreeNodeItem key={child.id} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProjectStructureTree: React.FC<ProjectStructureTreeProps> = ({
  data = DEFAULT_TREE,
  className,
}) => {
  return (
    <div className={cn('font-mono', className)}>
      {data.map((node) => (
        <TreeNodeItem key={node.id} node={node} depth={0} />
      ))}
    </div>
  );
};

export default ProjectStructureTree;
