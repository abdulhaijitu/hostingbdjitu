import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileAdminHeaderProps {
  title: string;
  titleBn?: string;
  description?: string;
  descriptionBn?: string;
  language?: 'en' | 'bn';
  actions?: React.ReactNode;
  className?: string;
}

const MobileAdminHeader: React.FC<MobileAdminHeaderProps> = ({
  title,
  titleBn,
  description,
  descriptionBn,
  language = 'en',
  actions,
  className,
}) => {
  const isMobile = useIsMobile();
  
  const displayTitle = language === 'bn' && titleBn ? titleBn : title;
  const displayDescription = language === 'bn' && descriptionBn ? descriptionBn : description;

  return (
    <div className={cn(
      "flex flex-col gap-4",
      isMobile ? "px-4 py-4" : "p-6 lg:p-8",
      className
    )}>
      <div className={cn(
        "flex gap-4",
        isMobile ? "flex-col" : "flex-row items-center justify-between"
      )}>
        <div className="min-w-0 flex-1">
          <h1 className={cn(
            "font-bold font-display",
            isMobile ? "text-xl" : "text-2xl lg:text-3xl"
          )}>
            {displayTitle}
          </h1>
          {displayDescription && (
            <p className="text-muted-foreground text-sm mt-1">
              {displayDescription}
            </p>
          )}
        </div>
        
        {actions && (
          <div className={cn(
            "flex items-center gap-2 shrink-0",
            isMobile && "w-full"
          )}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileAdminHeader;
