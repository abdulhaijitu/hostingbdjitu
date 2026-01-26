import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Smooth page transition wrapper with fade-in animation
 * Prevents layout jumps during page transitions
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure smooth transition
    const timer = requestAnimationFrame(() => {
      setIsVisible(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  return (
    <div 
      className={cn(
        "transition-all duration-200 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Content placeholder that maintains layout during loading
 * Prevents layout shift when content loads
 */
export const ContentPlaceholder: React.FC<{
  height?: string;
  className?: string;
}> = ({ height = "min-h-[200px]", className }) => (
  <div 
    className={cn(
      "flex items-center justify-center",
      height,
      className
    )}
  >
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="h-8 w-8 rounded-lg bg-primary/20 animate-pulse" />
        <div className="absolute inset-0 h-8 w-8 rounded-lg border-2 border-primary/60 border-t-transparent animate-spin" />
      </div>
      <span className="text-sm text-muted-foreground animate-pulse">
        লোড হচ্ছে...
      </span>
    </div>
  </div>
);

/**
 * Page header with consistent styling
 */
export const PageHeader: React.FC<{
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}> = ({ title, description, actions, className }) => (
  <div className={cn(
    "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8",
    className
  )}>
    <div className="min-w-0">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-display truncate">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {description}
        </p>
      )}
    </div>
    {actions && (
      <div className="flex items-center gap-2 shrink-0">
        {actions}
      </div>
    )}
  </div>
);

/**
 * Section with consistent spacing and optional title
 */
export const Section: React.FC<{
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, description, children, className }) => (
  <section className={cn("space-y-4", className)}>
    {(title || description) && (
      <div className="space-y-1">
        {title && (
          <h2 className="text-lg font-semibold">{title}</h2>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    )}
    {children}
  </section>
);

/**
 * Container with consistent max-width and padding
 */
export const Container: React.FC<{
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}> = ({ children, size = 'lg', className }) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={cn(
      "w-full mx-auto px-4 sm:px-6 lg:px-8",
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
};

export default PageTransition;
