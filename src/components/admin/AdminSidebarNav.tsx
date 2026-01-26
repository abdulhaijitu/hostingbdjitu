import React, { useState } from 'react';
import { NavLink } from '@/components/NavLink';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface NavItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  children?: NavItem[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

interface AdminSidebarNavProps {
  sections: NavSection[];
  collapsed: boolean;
}

const NavMenuItem: React.FC<{
  item: NavItem;
  collapsed: boolean;
  depth?: number;
}> = ({ item, collapsed, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  const baseClasses = cn(
    'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
    'text-slate-400 transition-all duration-200 ease-out',
    'hover:bg-slate-800/60 hover:text-white',
    'border border-transparent hover:border-slate-700/30',
    depth > 0 && 'ml-4 text-[13px]'
  );

  const activeClasses = cn(
    'bg-gradient-to-r from-primary/20 via-red-500/10 to-orange-500/10 text-white font-semibold',
    'border-primary/30',
    'shadow-sm shadow-primary/10',
    'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:bg-gradient-to-b before:from-primary before:to-orange-500 before:rounded-r-full'
  );

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(baseClasses, 'w-full justify-between relative')}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Icon className="h-[18px] w-[18px] shrink-0 text-slate-500 group-hover:text-primary transition-colors duration-200" />
            </div>
            {!collapsed && <span className="tracking-wide">{item.label}</span>}
          </div>
          {!collapsed && (
            <ChevronDown
              className={cn(
                'h-4 w-4 text-slate-600 transition-transform duration-200',
                isOpen && 'rotate-180 text-primary'
              )}
            />
          )}
        </button>
        {!collapsed && (
          <div
            className={cn(
              'overflow-hidden transition-all duration-300 ease-out',
              isOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
            )}
          >
            <div className="space-y-1 pl-2 border-l-2 border-slate-700/50 ml-5">
              {item.children?.map((child) => (
                <NavMenuItem
                  key={child.href || child.label}
                  item={child}
                  collapsed={collapsed}
                  depth={depth + 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const linkContent = (
    <NavLink
      to={item.href || '#'}
      className={cn(baseClasses, 'relative overflow-hidden')}
      activeClassName={activeClasses + (collapsed ? ' justify-center px-2' : '')}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-center gap-3">
        <div className="relative">
          <Icon className="h-[18px] w-[18px] shrink-0 text-slate-500 group-hover:text-primary transition-colors duration-200" />
        </div>
        {!collapsed && <span className="tracking-wide">{item.label}</span>}
      </div>
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="font-medium bg-slate-900 border-slate-700/50 text-white shadow-xl px-3 py-2"
        >
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
};

const AdminSidebarNav: React.FC<AdminSidebarNavProps> = ({ sections, collapsed }) => {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent relative">
      {sections.map((section, index) => (
        <div key={section.label} className="relative">
          {/* Section divider */}
          {index > 0 && !collapsed && (
            <div className="absolute -top-3 left-3 right-3 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
          )}
          
          {!collapsed && (
            <p className="px-3 mb-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
              {section.label}
            </p>
          )}
          <div className="space-y-1">
            {section.items.map((item) => (
              <NavMenuItem
                key={item.href || item.label}
                item={item}
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
};

export default AdminSidebarNav;