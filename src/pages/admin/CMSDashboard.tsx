import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PanelTop, Tag, FileEdit, Megaphone, HelpCircle, Quote, 
  MessageSquare, Settings, Users, Edit, Eye, Crown, ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCMSRole, CMSRole } from '@/hooks/useCMSRole';
import { useCMSAnnouncements } from '@/hooks/useCMSAnnouncements';
import { useContactMessages } from '@/hooks/useContactMessages';
import SEOHead from '@/components/common/SEOHead';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { WHMCS_URLS } from '@/lib/whmcsConfig';

/**
 * CMS Dashboard - Content Management Overview
 * 
 * This is a content-only CMS dashboard.
 * All billing, orders, and hosting operations are handled by WHMCS.
 */
const CMSDashboard: React.FC = () => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const { data: cmsRole, isLoading: roleLoading } = useCMSRole();
  const { data: announcements } = useCMSAnnouncements();
  const { data: messages } = useContactMessages();
  
  const isSuperAdmin = cmsRole?.role === 'super_admin';
  const isEditor = cmsRole?.role === 'editor' || isSuperAdmin;
  
  // Role info display
  const roleInfo: Record<CMSRole, { label: string; labelBn: string; icon: React.ReactNode; color: string }> = {
    super_admin: {
      label: 'Super Admin',
      labelBn: 'সুপার অ্যাডমিন',
      icon: <Crown className="h-4 w-4" />,
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    },
    editor: {
      label: 'Editor',
      labelBn: 'এডিটর',
      icon: <Edit className="h-4 w-4" />,
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    },
    viewer: {
      label: 'Viewer',
      labelBn: 'ভিউয়ার',
      icon: <Eye className="h-4 w-4" />,
      color: 'bg-slate-500/10 text-slate-600 border-slate-500/30',
    },
  };
  
  // Quick access cards - filter by role
  const quickAccessCards = [
    { icon: PanelTop, label: 'Pages', labelBn: 'পেজ', href: '/admin/cms/pages', color: 'from-blue-500/10 to-cyan-500/10', editorOnly: false },
    { icon: Tag, label: 'Pricing', labelBn: 'প্রাইসিং', href: '/admin/cms/pricing', color: 'from-emerald-500/10 to-green-500/10', editorOnly: false },
    { icon: FileEdit, label: 'Blog', labelBn: 'ব্লগ', href: '/admin/cms/blog', color: 'from-violet-500/10 to-purple-500/10', editorOnly: false },
    { icon: Megaphone, label: 'Announcements', labelBn: 'অ্যানাউন্সমেন্ট', href: '/admin/cms/announcements', color: 'from-orange-500/10 to-amber-500/10', editorOnly: false },
    { icon: HelpCircle, label: 'FAQs', labelBn: 'FAQ', href: '/admin/cms/faq', color: 'from-rose-500/10 to-pink-500/10', editorOnly: false },
    { icon: Quote, label: 'Testimonials', labelBn: 'টেস্টিমোনিয়াল', href: '/admin/cms/testimonials', color: 'from-teal-500/10 to-cyan-500/10', editorOnly: false },
    { icon: MessageSquare, label: 'Messages', labelBn: 'বার্তা', href: '/admin/cms/messages', color: 'from-indigo-500/10 to-blue-500/10', editorOnly: false },
  ];
  
  // Admin-only cards
  const adminCards = [
    { icon: Settings, label: 'Settings', labelBn: 'সেটিংস', href: '/admin/cms/settings', color: 'from-slate-500/10 to-gray-500/10' },
    { icon: Users, label: 'Admin Users', labelBn: 'অ্যাডমিন', href: '/admin/cms/admins', color: 'from-purple-500/10 to-violet-500/10' },
  ];
  
  // Stats
  const activeAnnouncements = announcements?.filter(a => a.is_active)?.length || 0;
  const unreadMessages = messages?.filter(m => !m.is_read)?.length || 0;
  
  const currentRole = cmsRole?.role || 'viewer';
  const currentRoleInfo = roleInfo[currentRole];

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'CMS ড্যাশবোর্ড' : 'CMS Dashboard'}
        description="Content Management System Dashboard"
        canonicalUrl="/admin"
        noIndex={true}
      />
      
      <div className={cn(isMobile ? "pb-4" : "p-6 lg:p-8")}>
        {/* Header */}
        <div className={cn("mb-6", isMobile && "px-4 pt-4")}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                {language === 'bn' ? 'CMS ড্যাশবোর্ড' : 'CMS Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'bn' ? 'কনটেন্ট ম্যানেজমেন্ট সিস্টেম' : 'Content Management System'}
              </p>
            </div>
            
            {/* Role Badge */}
            {!roleLoading && currentRoleInfo && (
              <Badge className={cn("gap-1.5 py-1.5 px-3", currentRoleInfo.color)}>
                {currentRoleInfo.icon}
                <span>{language === 'bn' ? currentRoleInfo.labelBn : currentRoleInfo.label}</span>
              </Badge>
            )}
          </div>
        </div>
        
        {/* WHMCS Notice */}
        <div className={cn("mb-6", isMobile && "px-4")}>
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <ExternalLink className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-amber-700 dark:text-amber-300">
                    {language === 'bn' ? 'গুরুত্বপূর্ণ নোটিশ' : 'Important Notice'}
                  </p>
                  <p className="text-sm text-amber-600/80 dark:text-amber-200/70 mt-1">
                    {language === 'bn' 
                      ? 'এটি শুধুমাত্র কনটেন্ট ম্যানেজমেন্টের জন্য। বিলিং, অর্ডার এবং হোস্টিং অপারেশন WHMCS এ পরিচালিত হয়।'
                      : 'This is for content management only. Billing, orders, and hosting operations are managed in WHMCS.'}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="shrink-0 border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                  onClick={() => window.open(WHMCS_URLS.billingHome, '_blank')}
                >
                  {language === 'bn' ? 'WHMCS এ যান' : 'Go to WHMCS'}
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Stats */}
        <div className={cn("grid gap-4 mb-6", isMobile ? "grid-cols-2 px-4" : "grid-cols-2 md:grid-cols-4")}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Megaphone className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeAnnouncements}</p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'bn' ? 'সক্রিয় অ্যানাউন্সমেন্ট' : 'Active Announcements'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{unreadMessages}</p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'bn' ? 'অপঠিত বার্তা' : 'Unread Messages'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Content Quick Access */}
        <div className={cn("mb-6", isMobile && "px-4")}>
          <h2 className="text-lg font-semibold mb-4">
            {language === 'bn' ? 'কনটেন্ট ম্যানেজমেন্ট' : 'Content Management'}
          </h2>
          <div className={cn("grid gap-3", isMobile ? "grid-cols-2" : "grid-cols-3 md:grid-cols-4 lg:grid-cols-7")}>
            {quickAccessCards.map((card) => (
              <Link key={card.href} to={card.href}>
                <Card className={cn(
                  `bg-gradient-to-br ${card.color} hover:shadow-md transition-all duration-200 cursor-pointer group active:scale-95 h-full`
                )}>
                  <CardContent className="flex flex-col items-center justify-center text-center p-4">
                    <div className="p-3 rounded-xl bg-background/50 group-hover:scale-110 transition-transform duration-200 mb-2">
                      <card.icon className="h-5 w-5 text-foreground/80" />
                    </div>
                    <span className="text-sm font-medium text-foreground/90">
                      {language === 'bn' ? card.labelBn : card.label}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Admin Section - Super Admin Only */}
        {isSuperAdmin && (
          <div className={cn("mb-6", isMobile && "px-4")}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              {language === 'bn' ? 'অ্যাডমিন সেটিংস' : 'Admin Settings'}
              <Badge variant="outline" className="ml-2 text-amber-500 border-amber-500/30 text-xs">
                Super Admin Only
              </Badge>
            </h2>
            <div className={cn("grid gap-3", isMobile ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4")}>
              {adminCards.map((card) => (
                <Link key={card.href} to={card.href}>
                  <Card className={cn(
                    `bg-gradient-to-br ${card.color} hover:shadow-md transition-all duration-200 cursor-pointer group active:scale-95 border-amber-500/20`
                  )}>
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="p-2.5 rounded-xl bg-background/50 group-hover:scale-110 transition-transform duration-200">
                        <card.icon className="h-5 w-5 text-foreground/80" />
                      </div>
                      <span className="text-sm font-medium text-foreground/90">
                        {language === 'bn' ? card.labelBn : card.label}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Role-based Message */}
        {!isSuperAdmin && !isEditor && (
          <div className={cn("", isMobile && "px-4")}>
            <Card className="border-blue-500/30 bg-blue-500/5">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-700 dark:text-blue-300">
                      {language === 'bn' ? 'শুধুমাত্র দেখার অনুমতি' : 'View-Only Access'}
                    </p>
                    <p className="text-sm text-blue-600/80 dark:text-blue-200/70">
                      {language === 'bn' 
                        ? 'আপনার বর্তমান রোলে কনটেন্ট এডিট করার অনুমতি নেই।'
                        : 'Your current role does not have permission to edit content.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default CMSDashboard;
