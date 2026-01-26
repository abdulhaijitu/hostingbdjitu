import React, { useState, memo } from 'react';
import { 
  Zap, Search, Star, MessageSquare, 
  Clock, FileText, CreditCard, HelpCircle, Loader2, Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCannedResponses, CannedResponse } from '@/hooks/useCannedResponses';

const categoryIcons: Record<string, React.ReactNode> = {
  greeting: <MessageSquare className="h-3.5 w-3.5" />,
  technical: <FileText className="h-3.5 w-3.5" />,
  billing: <CreditCard className="h-3.5 w-3.5" />,
  closing: <Clock className="h-3.5 w-3.5" />,
  general: <HelpCircle className="h-3.5 w-3.5" />,
  info: <HelpCircle className="h-3.5 w-3.5" />,
};

const categoryColors: Record<string, string> = {
  greeting: 'bg-emerald-500/10 text-emerald-600',
  technical: 'bg-blue-500/10 text-blue-600',
  billing: 'bg-purple-500/10 text-purple-600',
  closing: 'bg-orange-500/10 text-orange-600',
  general: 'bg-gray-500/10 text-gray-600',
  info: 'bg-cyan-500/10 text-cyan-600',
};

interface CannedResponsesProps {
  onSelect: (content: string) => void;
  language: 'en' | 'bn';
}

const CannedResponses: React.FC<CannedResponsesProps> = memo(({ onSelect, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: responses, isLoading } = useCannedResponses();

  const filteredResponses = responses?.filter(response => {
    const title = language === 'bn' ? (response.title_bn || response.title) : response.title;
    const content = language === 'bn' ? (response.content_bn || response.content) : response.content;
    
    const matchesSearch = 
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (response.shortcut && response.shortcut.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || response.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = [...new Set(responses?.map(r => r.category) || [])];

  const handleSelect = (response: CannedResponse) => {
    const content = language === 'bn' ? (response.content_bn || response.content) : response.content;
    onSelect(content);
    setIsOpen(false);
    setSearchQuery('');
    setSelectedCategory(null);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
            >
              <Zap className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {language === 'bn' ? 'দ্রুত উত্তর' : 'Quick Responses'}
        </TooltipContent>
      </Tooltip>
      
      <PopoverContent className="w-80 p-0" align="start" side="top">
        {/* Header */}
        <div className="p-3 border-b bg-gradient-to-r from-amber-500/5 to-transparent">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <h4 className="font-semibold text-sm">
                {language === 'bn' ? 'দ্রুত উত্তর' : 'Quick Responses'}
              </h4>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                  <Link to="/admin/canned-responses">
                    <Settings className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {language === 'bn' ? 'সেটিংস' : 'Manage Responses'}
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'খুঁজুন বা /শর্টকাট...' : 'Search or /shortcut...'}
              className="h-8 pl-8 text-sm"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="p-2 border-b flex flex-wrap gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-6 px-2 text-xs",
              !selectedCategory && "bg-muted"
            )}
            onClick={() => setSelectedCategory(null)}
          >
            {language === 'bn' ? 'সব' : 'All'}
          </Button>
          {categories.map(cat => (
            <Button
              key={cat}
              variant="ghost"
              size="sm"
              className={cn(
                "h-6 px-2 text-xs gap-1",
                selectedCategory === cat && (categoryColors[cat] || 'bg-muted')
              )}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            >
              {categoryIcons[cat] || <HelpCircle className="h-3.5 w-3.5" />}
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>

        {/* Responses List */}
        <ScrollArea className="h-[280px]">
          <div className="p-2 space-y-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredResponses.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {language === 'bn' ? 'কোন উত্তর পাওয়া যায়নি' : 'No responses found'}
                </p>
              </div>
            ) : (
              filteredResponses.map(response => {
                const title = language === 'bn' ? (response.title_bn || response.title) : response.title;
                const content = language === 'bn' ? (response.content_bn || response.content) : response.content;
                
                return (
                  <button
                    key={response.id}
                    onClick={() => handleSelect(response)}
                    className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={cn("h-5 text-[10px] px-1.5", categoryColors[response.category] || 'bg-muted')}>
                        {categoryIcons[response.category] || <HelpCircle className="h-3 w-3" />}
                      </Badge>
                      <span className="text-sm font-medium flex-1 truncate">{title}</span>
                      {response.shortcut && (
                        <code className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {response.shortcut}
                        </code>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{content}</p>
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
});

CannedResponses.displayName = 'CannedResponses';

export default CannedResponses;
