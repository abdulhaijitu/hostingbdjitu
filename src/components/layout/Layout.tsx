import React from 'react';
import Header from './Header';
import Footer from './Footer';
import FloatingChat from '@/components/common/FloatingChat';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
};

export default Layout;
