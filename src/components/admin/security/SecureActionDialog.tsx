import React, { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, AlertTriangle, Lock, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  verifyReauth, 
  checkActionCooldown, 
  recordAdminAction,
  actionRequiresReauth,
  CooldownStatus,
  HIGH_RISK_ACTIONS,
  HighRiskAction 
} from '@/lib/securityService';
import { useToast } from '@/hooks/use-toast';

interface SecureActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  actionType: HighRiskAction | string;
  targetType?: string;
  targetId?: string;
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  language?: 'en' | 'bn';
  skipReauth?: boolean;
  metadata?: Record<string, unknown>;
}

const SecureActionDialog: React.FC<SecureActionDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  actionType,
  targetType,
  targetId,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  variant = 'default',
  language = 'en',
  skipReauth = false,
  metadata = {},
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'confirm' | 'reauth' | 'cooldown'>('confirm');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reauthError, setReauthError] = useState<string | null>(null);
  const [cooldownStatus, setCooldownStatus] = useState<CooldownStatus | null>(null);
  const [cooldownTimer, setCooldownTimer] = useState(0);

  const needsReauth = !skipReauth && actionRequiresReauth(actionType);
  const isHighRisk = HIGH_RISK_ACTIONS.includes(actionType as HighRiskAction);

  // Check cooldown on open
  useEffect(() => {
    if (open && isHighRisk) {
      checkActionCooldown(actionType).then(status => {
        setCooldownStatus(status);
        if (status.is_in_cooldown) {
          setStep('cooldown');
          setCooldownTimer(status.cooldown_remaining_seconds);
        }
      });
    }
  }, [open, actionType, isHighRisk]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownTimer > 0) {
      const timer = setInterval(() => {
        setCooldownTimer(prev => {
          if (prev <= 1) {
            setStep('confirm');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldownTimer]);

  const handleClose = () => {
    setStep('confirm');
    setPassword('');
    setReauthError(null);
    setCooldownStatus(null);
    onOpenChange(false);
    onCancel?.();
  };

  const handleConfirmClick = async () => {
    if (needsReauth && step === 'confirm') {
      setStep('reauth');
      return;
    }

    await executeAction();
  };

  const handleReauthSubmit = async () => {
    if (!password.trim()) {
      setReauthError(language === 'bn' ? 'পাসওয়ার্ড প্রয়োজন' : 'Password is required');
      return;
    }

    setIsLoading(true);
    setReauthError(null);

    const result = await verifyReauth(password);
    
    if (!result.success) {
      setReauthError(language === 'bn' ? 'ভুল পাসওয়ার্ড' : 'Incorrect password');
      setIsLoading(false);
      return;
    }

    await executeAction(true);
  };

  const executeAction = async (reauthVerified = false) => {
    setIsLoading(true);

    try {
      // Record the admin action
      await recordAdminAction(
        actionType,
        targetType,
        targetId,
        metadata,
        needsReauth,
        reauthVerified
      );

      // Execute the actual action
      await onConfirm();

      toast({
        title: language === 'bn' ? 'সফল' : 'Success',
        description: language === 'bn' ? 'অ্যাকশন সম্পন্ন হয়েছে' : 'Action completed successfully',
      });

      handleClose();
    } catch (error) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: error instanceof Error ? error.message : 'Action failed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderCooldownStep = () => (
    <AlertDialogContent className="max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2 text-warning">
          <Clock className="h-5 w-5" />
          {language === 'bn' ? 'কুলডাউন সক্রিয়' : 'Cooldown Active'}
        </AlertDialogTitle>
        <AlertDialogDescription className="space-y-4">
          <p>
            {language === 'bn'
              ? 'নিরাপত্তার জন্য, আপনাকে এই অ্যাকশন পুনরায় করার আগে অপেক্ষা করতে হবে।'
              : 'For security, you must wait before performing this action again.'}
          </p>
          <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
            <span className="text-3xl font-mono font-bold">{cooldownTimer}s</span>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={handleClose}>
          {language === 'bn' ? 'বাতিল' : 'Cancel'}
        </AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  );

  const renderReauthStep = () => (
    <AlertDialogContent className="max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          {language === 'bn' ? 'পাসওয়ার্ড যাচাই করুন' : 'Verify Your Password'}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {language === 'bn'
            ? 'এই সংবেদনশীল অ্যাকশন সম্পন্ন করতে আপনার পাসওয়ার্ড প্রবেশ করুন।'
            : 'Enter your password to confirm this sensitive action.'}
        </AlertDialogDescription>
      </AlertDialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="reauth-password">
            {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
          </Label>
          <Input
            id="reauth-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={language === 'bn' ? 'আপনার পাসওয়ার্ড' : 'Your password'}
            disabled={isLoading}
            onKeyDown={(e) => e.key === 'Enter' && handleReauthSubmit()}
          />
          {reauthError && (
            <p className="text-sm text-destructive">{reauthError}</p>
          )}
        </div>
      </div>

      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => setStep('confirm')} disabled={isLoading}>
          {language === 'bn' ? 'পেছনে' : 'Back'}
        </AlertDialogCancel>
        <Button onClick={handleReauthSubmit} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {language === 'bn' ? 'যাচাই করুন' : 'Verify'}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );

  const renderConfirmStep = () => (
    <AlertDialogContent className="max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          {isHighRisk ? (
            <AlertTriangle className={cn(
              "h-5 w-5",
              variant === 'destructive' ? 'text-destructive' : 'text-warning'
            )} />
          ) : (
            <Shield className="h-5 w-5 text-primary" />
          )}
          {title}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {description}
        </AlertDialogDescription>
      </AlertDialogHeader>

      {isHighRisk && (
        <div className={cn(
          "p-3 rounded-lg text-sm",
          variant === 'destructive' 
            ? 'bg-destructive/10 text-destructive border border-destructive/20' 
            : 'bg-warning/10 text-warning border border-warning/20'
        )}>
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">
                {language === 'bn' ? 'সতর্কতা' : 'Warning'}
              </p>
              <p className="text-xs mt-1 opacity-80">
                {language === 'bn'
                  ? 'এই অ্যাকশন অডিট লগে রেকর্ড করা হবে এবং পূর্বাবস্থায় ফেরানো যাবে না।'
                  : 'This action will be recorded in audit logs and cannot be undone.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <AlertDialogFooter>
        <AlertDialogCancel onClick={handleClose} disabled={isLoading}>
          {cancelText || (language === 'bn' ? 'বাতিল' : 'Cancel')}
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={handleConfirmClick}
          disabled={isLoading}
          className={cn(
            variant === 'destructive' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
          )}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {needsReauth && step === 'confirm' ? (
            <>
              <Lock className="mr-2 h-4 w-4" />
              {language === 'bn' ? 'যাচাই করে এগিয়ে যান' : 'Verify & Continue'}
            </>
          ) : (
            confirmText || (language === 'bn' ? 'নিশ্চিত করুন' : 'Confirm')
          )}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {step === 'cooldown' && renderCooldownStep()}
      {step === 'reauth' && renderReauthStep()}
      {step === 'confirm' && renderConfirmStep()}
    </AlertDialog>
  );
};

export default SecureActionDialog;
