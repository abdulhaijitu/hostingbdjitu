import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { usePreloadRoute } from '@/hooks/usePreloadRoute';

interface PreloadLinkProps extends LinkProps {
  children: React.ReactNode;
}

/**
 * Link component that preloads route chunks on hover/focus
 * for faster perceived navigation
 */
const PreloadLink: React.FC<PreloadLinkProps> = ({ to, children, ...props }) => {
  const { preload } = usePreloadRoute();

  const handleMouseEnter = () => {
    if (typeof to === 'string') {
      preload(to);
    }
  };

  const handleFocus = () => {
    if (typeof to === 'string') {
      preload(to);
    }
  };

  return (
    <Link
      to={to}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      {...props}
    >
      {children}
    </Link>
  );
};

export default PreloadLink;
