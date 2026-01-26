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
    'text-sidebar-foreground/80 transition-all duration-200 ease-out',
    'hover:bg-sidebar-accent hover:text-sidebar-foreground',
    depth > 0 && 'ml-4 text-[13px]'
  );

  const activeClasses = cn(
    'bg-primary/10 text-primary font-semibold',
    'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2',
    'before:w-1 before:h-6 before:rounded-r-full before:bg-primary'
  );

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(baseClasses, 'w-full justify-between relative')}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-[18px] w-[18px] shrink-0 text-muted-foreground group-hover:text-sidebar-foreground transition-colors" />
            {!collapsed && <span>{item.label}</span>}
          </div>
          {!collapsed && (
            <ChevronDown
              className={cn(
                'h-4 w-4 text-muted-foreground transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            />
          )}
        </button>
        {!collapsed && (
          <div
            className={cn(
              'overflow-hidden transition-all duration-200 ease-out',
              isOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
            )}
          >
            <div className="space-y-1 pl-2 border-l-2 border-sidebar-border ml-5">
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
      className={baseClasses + ' relative'}
      activeClassName={activeClasses + (collapsed ? ' justify-center px-2' : '')}
    >
      <Icon className="h-[18px] w-[18px] shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
};

const AdminSidebarNav: React.FC<AdminSidebarNavProps> = ({ sections, collapsed }) => {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      {sections.map((section) => (
        <div key={section.label}>
          {!collapsed && (
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
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
