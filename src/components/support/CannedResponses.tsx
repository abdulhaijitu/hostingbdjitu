import React, { useState, memo } from 'react';
import { 
  Zap, Search, ChevronDown, Star, MessageSquare, 
  Clock, FileText, Shield, CreditCard, HelpCircle 
} from 'lucide-react';
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

export interface CannedResponse {
  id: string;
  title: string;
  titleBn: string;
  content: string;
  contentBn: string;
  category: 'greeting' | 'technical' | 'billing' | 'closing' | 'general';
  isFavorite?: boolean;
}

const defaultCannedResponses: CannedResponse[] = [
  // Greetings
  {
    id: 'greeting-1',
    title: 'Welcome',
    titleBn: 'স্বাগতম',
    content: 'Hello! Thank you for contacting CHost support. I\'m here to help you. How can I assist you today?',
    contentBn: 'হ্যালো! CHost সাপোর্টে যোগাযোগের জন্য ধন্যবাদ। আমি আপনাকে সাহায্য করতে এখানে আছি। আজ আমি কিভাবে আপনাকে সাহায্য করতে পারি?',
    category: 'greeting',
    isFavorite: true,
  },
  {
    id: 'greeting-2',
    title: 'Follow-up',
    titleBn: 'ফলো-আপ',
    content: 'Thank you for your patience. I\'m looking into your issue and will update you shortly.',
    contentBn: 'ধৈর্য ধরার জন্য ধন্যবাদ। আমি আপনার সমস্যাটি দেখছি এবং শীঘ্রই আপডেট জানাব।',
    category: 'greeting',
  },
  // Technical
  {
    id: 'tech-1',
    title: 'Clear Cache',
    titleBn: 'ক্যাশ ক্লিয়ার',
    content: 'Please try clearing your browser cache and cookies, then restart your browser. This often resolves display and loading issues.',
    contentBn: 'অনুগ্রহ করে আপনার ব্রাউজারের ক্যাশ এবং কুকিজ ক্লিয়ার করুন, তারপর ব্রাউজার রিস্টার্ট করুন। এটি প্রায়ই ডিসপ্লে এবং লোডিং সমস্যা সমাধান করে।',
    category: 'technical',
    isFavorite: true,
  },
  {
    id: 'tech-2',
    title: 'DNS Propagation',
    titleBn: 'DNS প্রচার',
    content: 'DNS changes can take up to 24-48 hours to fully propagate worldwide. Please wait and check again later.',
    contentBn: 'DNS পরিবর্তন সম্পূর্ণ বিশ্বব্যাপী প্রচার হতে ২৪-৪৮ ঘণ্টা সময় লাগতে পারে। অনুগ্রহ করে অপেক্ষা করুন এবং পরে আবার চেক করুন।',
    category: 'technical',
  },
  {
    id: 'tech-3',
    title: 'cPanel Access',
    titleBn: 'cPanel অ্যাক্সেস',
    content: 'You can access your cPanel control panel at: yourdomain.com:2083 or yourdomain.com/cpanel. Use the credentials sent to your email during account creation.',
    contentBn: 'আপনি আপনার cPanel কন্ট্রোল প্যানেল অ্যাক্সেস করতে পারেন: yourdomain.com:2083 অথবা yourdomain.com/cpanel। অ্যাকাউন্ট তৈরির সময় আপনার ইমেইলে পাঠানো ক্রেডেনশিয়াল ব্যবহার করুন।',
    category: 'technical',
  },
  {
    id: 'tech-4',
    title: 'Email Setup',
    titleBn: 'ইমেইল সেটআপ',
    content: 'To set up email on your device:\n- Incoming Server: mail.yourdomain.com (IMAP: 993, POP3: 995)\n- Outgoing Server: mail.yourdomain.com (SMTP: 465)\n- Use SSL/TLS encryption',
    contentBn: 'আপনার ডিভাইসে ইমেইল সেটআপ করতে:\n- ইনকামিং সার্ভার: mail.yourdomain.com (IMAP: 993, POP3: 995)\n- আউটগোয়িং সার্ভার: mail.yourdomain.com (SMTP: 465)\n- SSL/TLS এনক্রিপশন ব্যবহার করুন',
    category: 'technical',
  },
  // Billing
  {
    id: 'billing-1',
    title: 'Payment Received',
    titleBn: 'পেমেন্ট প্রাপ্ত',
    content: 'Thank you for your payment! Your invoice has been marked as paid. Your services are now active.',
    contentBn: 'আপনার পেমেন্টের জন্য ধন্যবাদ! আপনার ইনভয়েস পরিশোধিত হিসেবে চিহ্নিত হয়েছে। আপনার সেবাগুলো এখন সক্রিয়।',
    category: 'billing',
  },
  {
    id: 'billing-2',
    title: 'Refund Request',
    titleBn: 'রিফান্ড অনুরোধ',
    content: 'Your refund request has been received and is being processed. Refunds typically take 5-7 business days to reflect in your account.',
    contentBn: 'আপনার রিফান্ড অনুরোধ গৃহীত হয়েছে এবং প্রক্রিয়াধীন আছে। রিফান্ড সাধারণত আপনার অ্যাকাউন্টে প্রতিফলিত হতে ৫-৭ কার্যদিবস সময় নেয়।',
    category: 'billing',
    isFavorite: true,
  },
  {
    id: 'billing-3',
    title: 'Renewal Reminder',
    titleBn: 'রিনিউয়াল রিমাইন্ডার',
    content: 'Your hosting/domain is due for renewal. Please make the payment before the due date to avoid any service interruption.',
    contentBn: 'আপনার হোস্টিং/ডোমেইন রিনিউয়ালের জন্য বকেয়া। সার্ভিস বিঘ্ন এড়াতে অনুগ্রহ করে নির্ধারিত তারিখের আগে পেমেন্ট করুন।',
    category: 'billing',
  },
  // Closing
  {
    id: 'closing-1',
    title: 'Issue Resolved',
    titleBn: 'সমস্যা সমাধান',
    content: 'I\'m glad I could help resolve your issue! If you have any other questions, feel free to reach out. Have a great day!',
    contentBn: 'আমি আনন্দিত যে আপনার সমস্যা সমাধান করতে পেরেছি! আপনার অন্য কোন প্রশ্ন থাকলে, নির্দ্বিধায় যোগাযোগ করুন। শুভ দিন কাটুক!',
    category: 'closing',
    isFavorite: true,
  },
  {
    id: 'closing-2',
    title: 'Need More Info',
    titleBn: 'আরো তথ্য প্রয়োজন',
    content: 'To better assist you, could you please provide more details about the issue? Screenshots or error messages would be very helpful.',
    contentBn: 'আপনাকে আরো ভালোভাবে সাহায্য করতে, আপনি কি সমস্যা সম্পর্কে আরো বিস্তারিত দিতে পারবেন? স্ক্রিনশট বা ত্রুটি বার্তা খুবই সহায়ক হবে।',
    category: 'closing',
  },
  {
    id: 'closing-3',
    title: 'Escalation',
    titleBn: 'এস্কালেশন',
    content: 'I\'m escalating this issue to our senior technical team for further investigation. They will contact you within 24 hours.',
    contentBn: 'আমি এই সমস্যাটি আমাদের সিনিয়র টেকনিক্যাল টিমের কাছে আরো তদন্তের জন্য এস্কালেট করছি। তারা ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবেন।',
    category: 'closing',
  },
  // General
  {
    id: 'general-1',
    title: 'Working Hours',
    titleBn: 'কাজের সময়',
    content: 'Our support team is available 24/7 for technical issues. For billing inquiries, please contact during 10 AM - 6 PM (BST).',
    contentBn: 'আমাদের সাপোর্ট টিম প্রযুক্তিগত সমস্যার জন্য ২৪/৭ উপলব্ধ। বিলিং সংক্রান্ত প্রশ্নের জন্য, সকাল ১০টা - সন্ধ্যা ৬টা (BST) সময়ে যোগাযোগ করুন।',
    category: 'general',
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  greeting: <MessageSquare className="h-3.5 w-3.5" />,
  technical: <FileText className="h-3.5 w-3.5" />,
  billing: <CreditCard className="h-3.5 w-3.5" />,
  closing: <Clock className="h-3.5 w-3.5" />,
  general: <HelpCircle className="h-3.5 w-3.5" />,
};

const categoryColors: Record<string, string> = {
  greeting: 'bg-emerald-500/10 text-emerald-600',
  technical: 'bg-blue-500/10 text-blue-600',
  billing: 'bg-purple-500/10 text-purple-600',
  closing: 'bg-orange-500/10 text-orange-600',
  general: 'bg-gray-500/10 text-gray-600',
};

interface CannedResponsesProps {
  onSelect: (content: string) => void;
  language: 'en' | 'bn';
}

const CannedResponses: React.FC<CannedResponsesProps> = memo(({ onSelect, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredResponses = defaultCannedResponses.filter(response => {
    const matchesSearch = 
      response.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.titleBn.includes(searchQuery) ||
      response.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.contentBn.includes(searchQuery);
    
    const matchesCategory = !selectedCategory || response.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const favoriteResponses = filteredResponses.filter(r => r.isFavorite);
  const otherResponses = filteredResponses.filter(r => !r.isFavorite);

  const handleSelect = (response: CannedResponse) => {
    onSelect(language === 'bn' ? response.contentBn : response.content);
    setIsOpen(false);
    setSearchQuery('');
    setSelectedCategory(null);
  };

  const categories = ['greeting', 'technical', 'billing', 'closing', 'general'] as const;

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
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <h4 className="font-semibold text-sm">
              {language === 'bn' ? 'দ্রুত উত্তর' : 'Quick Responses'}
            </h4>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'খুঁজুন...' : 'Search...'}
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
                selectedCategory === cat && categoryColors[cat]
              )}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            >
              {categoryIcons[cat]}
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>

        {/* Responses List */}
        <ScrollArea className="h-[280px]">
          <div className="p-2 space-y-1">
            {/* Favorites */}
            {favoriteResponses.length > 0 && (
              <>
                <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 text-amber-500" />
                  {language === 'bn' ? 'প্রিয়' : 'Favorites'}
                </div>
                {favoriteResponses.map(response => (
                  <button
                    key={response.id}
                    onClick={() => handleSelect(response)}
                    className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={cn("h-5 text-[10px] px-1.5", categoryColors[response.category])}>
                        {categoryIcons[response.category]}
                      </Badge>
                      <span className="text-sm font-medium">
                        {language === 'bn' ? response.titleBn : response.title}
                      </span>
                      <Star className="h-3 w-3 text-amber-500 ml-auto" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {language === 'bn' ? response.contentBn : response.content}
                    </p>
                  </button>
                ))}
                {otherResponses.length > 0 && (
                  <div className="h-px bg-border my-2" />
                )}
              </>
            )}

            {/* Other Responses */}
            {otherResponses.map(response => (
              <button
                key={response.id}
                onClick={() => handleSelect(response)}
                className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={cn("h-5 text-[10px] px-1.5", categoryColors[response.category])}>
                    {categoryIcons[response.category]}
                  </Badge>
                  <span className="text-sm font-medium">
                    {language === 'bn' ? response.titleBn : response.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {language === 'bn' ? response.contentBn : response.content}
                </p>
              </button>
            ))}

            {filteredResponses.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {language === 'bn' ? 'কোন উত্তর পাওয়া যায়নি' : 'No responses found'}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
});

CannedResponses.displayName = 'CannedResponses';

export default CannedResponses;
