import { useState } from 'react';

/**
 * File/Folder item type
 */
export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  size?: string;
  modified?: string;
}

/**
 * FileExplorer component
 * Minimalistic file browser with expand/collapse functionality
 */
interface FileExplorerProps {
  data?: FileItem[];
  onFileSelect?: (file: FileItem) => void;
  className?: string;
}

export default function FileExplorer({
  data = defaultFileStructure,
  onFileSelect,
  className = '',
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['src'])
  );
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileClick = (file: FileItem, path: string) => {
    setSelectedFile(path);
    onFileSelect?.(file);
  };

  const renderItem = (item: FileItem, path: string, level: number = 0) => {
    const isExpanded = expandedFolders.has(path);
    const isSelected = selectedFile === path;
    const indent = level * 20;

    if (item.type === 'folder') {
      return (
        <div key={path}>
          <button
            onClick={() => toggleFolder(path)}
            className={`w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#e7f1f3] rounded transition-colors text-left ${
              isSelected ? 'bg-[#e7f1f3]' : ''
            }`}
            style={{ paddingLeft: `${indent + 12}px` }}
            aria-label={`Toggle folder ${item.name}`}
          >
            <svg
              className={`w-4 h-4 text-[#4e8b97] transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <svg
              className="w-4 h-4 text-[#4e8b97]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <span className="text-sm font-medium text-[#0e191b]">
              {item.name}
            </span>
          </button>
          {isExpanded && item.children && (
            <div>
              {item.children.map((child) =>
                renderItem(
                  child,
                  `${path}/${child.name}`,
                  level + 1
                )
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={path}
        onClick={() => handleFileClick(item, path)}
        className={`w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#e7f1f3] rounded transition-colors text-left ${
          isSelected ? 'bg-[#e7f1f3] border-l-2 border-[#2E8B57]' : ''
        }`}
        style={{ paddingLeft: `${indent + 12}px` }}
        aria-label={`Select file ${item.name}`}
      >
        <svg
          className="w-4 h-4 text-[#4e8b97]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="text-sm text-[#0e191b] flex-1">{item.name}</span>
        {item.size && (
          <span className="text-xs text-[#4e8b97]">{item.size}</span>
        )}
      </button>
    );
  };

  return (
    <div
      className={`bg-white rounded-lg border border-[#e7f1f3] overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#e7f1f3] bg-[#f8fbfc]">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-[#2E8B57]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          <h3 className="text-sm font-bold text-[#0e191b]">Files</h3>
        </div>
      </div>

      {/* File Tree */}
      <div className="overflow-y-auto max-h-[600px] py-2">
        {data.map((item) => renderItem(item, item.name, 0))}
      </div>
    </div>
  );
}

// Default file structure for demonstration
const defaultFileStructure: FileItem[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'components',
        type: 'folder',
        children: [
          { name: 'Navbar.tsx', type: 'file', size: '2.1 KB' },
          { name: 'Layout.tsx', type: 'file', size: '1.8 KB' },
          { name: 'FileExplorer.tsx', type: 'file', size: '3.2 KB' },
        ],
      },
      {
        name: 'pages',
        type: 'folder',
        children: [
          { name: 'DashboardPage.tsx', type: 'file', size: '4.5 KB' },
          { name: 'BrowsePage.tsx', type: 'file', size: '6.2 KB' },
          { name: 'MyBooksPage.tsx', type: 'file', size: '5.1 KB' },
        ],
      },
      {
        name: 'store',
        type: 'folder',
        children: [
          { name: 'books.ts', type: 'file', size: '3.8 KB' },
          { name: 'user.ts', type: 'file', size: '2.4 KB' },
          { name: 'feed.ts', type: 'file', size: '2.9 KB' },
        ],
      },
      { name: 'App.tsx', type: 'file', size: '2.3 KB' },
      { name: 'main.tsx', type: 'file', size: '0.8 KB' },
    ],
  },
  {
    name: 'public',
    type: 'folder',
    children: [
      { name: 'vite.svg', type: 'file', size: '1.2 KB' },
    ],
  },
  { name: 'package.json', type: 'file', size: '1.5 KB' },
  { name: 'tsconfig.json', type: 'file', size: '0.9 KB' },
  { name: 'vite.config.ts', type: 'file', size: '0.6 KB' },
];

