import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadZoneProps {
  label: string;
  accept?: Record<string, string[]>;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  required?: boolean;
}

export function UploadZone({ label, accept, onFileSelect, selectedFile, required }: UploadZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      
      <div
        {...getRootProps()}
        className={cn(
          'relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer',
          isDragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600',
          selectedFile ? 'border-indigo-500/50 bg-slate-800' : ''
        )}
      >
        <input {...getInputProps()} />
        
        <div className="p-8 text-center flex flex-col items-center justify-center min-h-[140px]">
          <AnimatePresence mode="wait">
            {!selectedFile ? (
              <motion.div
                key="upload-prompt"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
                  <UploadCloud className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-300 mb-1">
                  <span className="text-indigo-400 font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500">
                  {accept ? Object.values(accept).flat().join(', ') : 'Any file'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="file-info"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex items-center p-3 bg-slate-900/50 rounded-lg border border-slate-700"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <File className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="ml-4 flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500">{formatBytes(selectedFile.size)}</p>
                </div>
                <button
                  onClick={removeFile}
                  className="p-2 hover:bg-slate-700 rounded-full transition-colors ml-2"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
