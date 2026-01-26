import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface UploadedAttachment {
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
}

export const useTicketAttachments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFiles = async (files: File[], ticketId: string): Promise<UploadedAttachment[]> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setIsUploading(true);
    setUploadProgress(0);
    const uploadedFiles: UploadedAttachment[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${user.id}/${ticketId}/${fileName}`;

        const { data, error } = await supabase.storage
          .from('ticket-attachments')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          console.error('Upload error:', error);
          throw error;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('ticket-attachments')
          .getPublicUrl(filePath);

        uploadedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url: urlData.publicUrl,
          path: filePath,
        });

        setUploadProgress(((i + 1) / files.length) * 100);
      }

      return uploadedFiles;
    } catch (error: any) {
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload files',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteFile = async (filePath: string): Promise<void> => {
    try {
      const { error } = await supabase.storage
        .from('ticket-attachments')
        .remove([filePath]);

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'Delete Failed',
        description: error.message || 'Failed to delete file',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const getSignedUrl = async (filePath: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from('ticket-attachments')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (error) throw error;
    return data.signedUrl;
  };

  return {
    uploadFiles,
    deleteFile,
    getSignedUrl,
    isUploading,
    uploadProgress,
  };
};
