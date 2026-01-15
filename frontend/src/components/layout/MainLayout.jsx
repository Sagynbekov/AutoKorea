import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function MainLayout({ isDark, setIsDark }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''} bg-background text-foreground`}>
      <TopNavbar 
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isDark={isDark}
        setIsDark={setIsDark}
      />
      
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main 
        className={`pt-8 pb-32 min-h-screen transition-all duration-300
          ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-[280px]'}
        `}
      >
        <div className="px-4 md:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
