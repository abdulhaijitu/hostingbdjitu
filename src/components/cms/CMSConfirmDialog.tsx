import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Trash2, Settings, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

type ActionType = 'delete' | 'unpublish' | 'settings' | 'custom';

interface CMSConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  actionType?: ActionType;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

const actionIcons: Record<ActionType, React.ReactNode> = {
  delete: <Trash2 className="h-6 w-6 text-destructive" />,
  unpublish: <EyeOff className="h-6 w-6 text-amber-500" />,
  settings: <Settings className="h-6 w-6 text-primary" />,
  custom: <AlertTriangle className="h-6 w-6 text-amber-500" />,
};

const actionStyles: Record<ActionType, string> = {
  delete: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  unpublish: 'bg-amber-500 text-white hover:bg-amber-600',
  settings: 'bg-primary text-primary-foreground hover:bg-primary/90',
  custom: 'bg-primary text-primary-foreground hover:bg-primary/90',
};

/**
 * CMSConfirmDialog - Confirmation modal for destructive/important actions
 * 
 * Use for:
 * - Delete operations
 * - Unpublish content
 * - Global settings changes
 */
const CMSConfirmDialog: React.FC<CMSConfirmDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  actionType = 'custom',
  confirmLabel = 'নিশ্চিত করুন',
  cancelLabel = 'বাতিল',
  isLoading = false,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-4">
            <div className={cn(
              'h-12 w-12 rounded-full flex items-center justify-center',
              actionType === 'delete' && 'bg-destructive/10',
              actionType === 'unpublish' && 'bg-amber-500/10',
              actionType === 'settings' && 'bg-primary/10',
              actionType === 'custom' && 'bg-amber-500/10'
            )}>
              {actionIcons[actionType]}
            </div>
            <div>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription className="mt-1">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        
        {actionType === 'settings' && (
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg p-3 mt-2">
            <p className="text-sm text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">সতর্কতা:</span> এই পরিবর্তন লাইভ সাইটকে প্রভাবিত করবে
            </p>
          </div>
        )}
        
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={isLoading}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className={cn(actionStyles[actionType])}
          >
            {isLoading ? 'প্রসেসিং...' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CMSConfirmDialog;
