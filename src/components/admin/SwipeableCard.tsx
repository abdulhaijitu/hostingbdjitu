import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface SwipeAction {
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
  onClick: () => void;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  leftAction?: SwipeAction;
  rightAction?: SwipeAction;
  threshold?: number;
  className?: string;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  leftAction,
  rightAction,
  threshold = 80,
  className,
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = startX.current;
    setIsSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    // Limit swipe distance
    const maxSwipe = threshold * 1.5;
    let clampedDiff = diff;
    
    // Apply resistance at edges
    if (diff > 0 && leftAction) {
      clampedDiff = Math.min(diff, maxSwipe);
    } else if (diff < 0 && rightAction) {
      clampedDiff = Math.max(diff, -maxSwipe);
    } else {
      clampedDiff = diff * 0.2; // Heavy resistance if no action
    }
    
    setTranslateX(clampedDiff);
  }, [isSwiping, leftAction, rightAction, threshold]);

  const handleTouchEnd = useCallback(() => {
    setIsSwiping(false);
    
    if (translateX > threshold && leftAction) {
      leftAction.onClick();
    } else if (translateX < -threshold && rightAction) {
      rightAction.onClick();
    }
    
    setTranslateX(0);
  }, [translateX, threshold, leftAction, rightAction]);

  const leftProgress = Math.min(Math.max(translateX / threshold, 0), 1);
  const rightProgress = Math.min(Math.max(-translateX / threshold, 0), 1);

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden touch-pan-y", className)}
    >
      {/* Left Action Background */}
      {leftAction && (
        <div 
          className={cn(
            "absolute inset-y-0 left-0 flex items-center justify-start pl-4",
            "transition-opacity duration-150"
          )}
          style={{
            width: Math.abs(translateX),
            backgroundColor: leftAction.bgColor,
            opacity: leftProgress,
          }}
        >
          <div 
            className={cn("flex items-center gap-2", leftAction.color)}
            style={{
              transform: `scale(${0.5 + leftProgress * 0.5})`,
              opacity: leftProgress,
            }}
          >
            {leftAction.icon}
            {leftProgress >= 1 && (
              <span className="text-xs font-medium">{leftAction.label}</span>
            )}
          </div>
        </div>
      )}

      {/* Right Action Background */}
      {rightAction && (
        <div 
          className={cn(
            "absolute inset-y-0 right-0 flex items-center justify-end pr-4",
            "transition-opacity duration-150"
          )}
          style={{
            width: Math.abs(translateX),
            backgroundColor: rightAction.bgColor,
            opacity: rightProgress,
          }}
        >
          <div 
            className={cn("flex items-center gap-2", rightAction.color)}
            style={{
              transform: `scale(${0.5 + rightProgress * 0.5})`,
              opacity: rightProgress,
            }}
          >
            {rightProgress >= 1 && (
              <span className="text-xs font-medium">{rightAction.label}</span>
            )}
            {rightAction.icon}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={cn(
          "relative bg-card",
          !isSwiping && "transition-transform duration-200"
        )}
        style={{
          transform: `translateX(${translateX}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeableCard;
