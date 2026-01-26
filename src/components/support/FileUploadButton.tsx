import React, { useRef, memo } from 'react';
import { Paperclip, X, File, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface PendingFile {
  file: File;
  preview?: string;
}

interface FileUploadButtonProps {
  pendingFiles: PendingFile[];
  onFilesSelect: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  isUploading: boolean;
  uploadProgress: number;
  maxSize?: number; // in MB
  maxFiles?: number;
  accept?: string;
  language?: 'en' | 'bn';
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/') || 
    /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(file.name);
};

const FileUploadButton: React.FC<FileUploadButtonProps> = memo(({
  pendingFiles,
  onFilesSelect,
  onRemoveFile,
  isUploading,
  uploadProgress,
  maxSize = 10,
  maxFiles = 5,
  accept = "image/*,.pdf,.doc,.docx,.txt,.zip",
  language = 'en'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate files
    const validFiles = files.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        return false;
      }
      return true;
    }).slice(0, maxFiles - pendingFiles.length);

    if (validFiles.length > 0) {
      onFilesSelect(validFiles);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const canAddMore = pendingFiles.length < maxFiles;

  return (
    <div className="space-y-2">
      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-muted/50 rounded-lg p-3 animate-in fade-in-0 slide-in-from-top-2">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {language === 'bn' ? 'আপলোড হচ্ছে...' : 'Uploading...'}
            </span>
            <span className="text-primary font-medium">{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-1.5" />
        </div>
      )}

      {/* Pending Files Preview */}
      {pendingFiles.length > 0 && !isUploading && (
        <div className="flex flex-wrap gap-2 animate-in fade-in-0">
          {pendingFiles.map((item, index) => (
            <div 
              key={index}
              className={cn(
                "relative group rounded-lg overflow-hidden",
                isImageFile(item.file) ? "w-16 h-16" : "flex items-center gap-2 bg-muted px-3 py-2"
              )}
            >
              {isImageFile(item.file) && item.preview ? (
                <>
                  <img
                    src={item.preview}
                    alt={item.file.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onRemoveFile(index)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5">
                    <p className="text-[8px] text-white truncate">{item.file.name}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-1.5 rounded bg-background">
                    <File className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate max-w-[100px]">{item.file.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatFileSize(item.file.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveFile(index)}
                    className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept={accept}
        onChange={handleFileSelect}
      />

      {/* Upload Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 text-muted-foreground hover:text-foreground",
              !canAddMore && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => canAddMore && fileInputRef.current?.click()}
            disabled={!canAddMore || isUploading}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {!canAddMore 
            ? (language === 'bn' ? `সর্বোচ্চ ${maxFiles}টি ফাইল` : `Max ${maxFiles} files`)
            : (language === 'bn' ? 'ফাইল সংযুক্ত করুন' : 'Attach files')
          }
        </TooltipContent>
      </Tooltip>
    </div>
  );
});

FileUploadButton.displayName = 'FileUploadButton';

export default FileUploadButton;
