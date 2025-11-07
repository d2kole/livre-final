import FileExplorer from '../components/FileExplorer';
import { FileItem } from '../components/FileExplorer';
import { useState } from 'react';

/**
 * FileExplorerPage component
 * Demo page showcasing the file explorer component
 */
export default function FileExplorerPage() {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
  };

  return (
    <div className="min-h-screen bg-[#f8fbfc] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0e191b] mb-2">
            File Explorer
          </h1>
          <p className="text-[#4e8b97]">
            Minimalistic file browser with expand/collapse functionality
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Explorer */}
          <div className="lg:col-span-2">
            <FileExplorer onFileSelect={handleFileSelect} />
          </div>

          {/* File Details Panel */}
          <div className="bg-white rounded-lg border border-[#e7f1f3] p-6">
            <h2 className="text-lg font-bold text-[#0e191b] mb-4">
              File Details
            </h2>
            {selectedFile ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-[#4e8b97] uppercase mb-1">
                    Name
                  </p>
                  <p className="text-sm text-[#0e191b]">{selectedFile.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#4e8b97] uppercase mb-1">
                    Type
                  </p>
                  <p className="text-sm text-[#0e191b] capitalize">
                    {selectedFile.type}
                  </p>
                </div>
                {selectedFile.size && (
                  <div>
                    <p className="text-xs font-medium text-[#4e8b97] uppercase mb-1">
                      Size
                    </p>
                    <p className="text-sm text-[#0e191b]">{selectedFile.size}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-[#4e8b97]">
                Select a file to view details
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

