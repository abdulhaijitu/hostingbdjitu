import React, { useState, memo } from 'react';
import { X, ZoomIn, Download, ExternalLink, FileText, File, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface Attachment {
  name: string;
  size: number;
  type: string;
  url: string;
  path?: string;
}

interface ImagePreviewProps {
  attachments: Attachment[];
  onRemove?: (index: number) => void;
  isEditable?: boolean;
  className?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const isImageFile = (type: string, name: string): boolean => {
  return type.startsWith('image/') || 
    /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(name);
};

const ImagePreview: React.FC<ImagePreviewProps> = memo(({ 
  attachments, 
  onRemove, 
  isEditable = false,
  className 
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string>('');

  if (!attachments || attachments.length === 0) return null;

  const images = attachments.filter(att => isImageFile(att.type, att.name));
  const files = attachments.filter(att => !isImageFile(att.type, att.name));

  const handlePreview = (url: string, name: string) => {
    setPreviewImage(url);
    setPreviewName(name);
  };

  return (
    <>
      <div className={cn("space-y-2", className)}>
        {/* Image Grid */}
        {images.length > 0 && (
          <div className={cn(
            "grid gap-2",
            images.length === 1 ? "grid-cols-1" : 
            images.length === 2 ? "grid-cols-2" : 
            "grid-cols-3"
          )}>
            {images.map((img, index) => (
              <div 
                key={index} 
                className="relative group rounded-lg overflow-hidden bg-muted aspect-square"
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePreview(img.url, img.name)}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    asChild
                  >
                    <a href={img.url} target="_blank" rel="noopener noreferrer" download>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                {/* Remove Button */}
                {isEditable && onRemove && (
                  <button
                    onClick={() => onRemove(attachments.indexOf(img))}
                    className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}

                {/* File Info */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-[10px] text-white truncate">{img.name}</p>
                  <p className="text-[9px] text-white/70">{formatFileSize(img.size)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 group"
              >
                <div className="p-1.5 rounded bg-background">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate max-w-[150px]">{file.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    asChild
                  >
                    <a href={file.url} target="_blank" rel="noopener noreferrer" download>
                      <Download className="h-3 w-3" />
                    </a>
                  </Button>
                  {isEditable && onRemove && (
                    <button
                      onClick={() => onRemove(attachments.indexOf(file))}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95">
          <div className="relative">
            {/* Image */}
            <div className="flex items-center justify-center min-h-[60vh] max-h-[85vh] p-4">
              <img
                src={previewImage || ''}
                alt={previewName}
                className="max-w-full max-h-full object-contain rounded"
              />
            </div>
            
            {/* Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9"
                asChild
              >
                <a href={previewImage || ''} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9"
                asChild
              >
                <a href={previewImage || ''} download={previewName}>
                  <Download className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9"
                onClick={() => setPreviewImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* File Name */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <p className="text-white text-sm">{previewName}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

ImagePreview.displayName = 'ImagePreview';

export default ImagePreview;
