import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';

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
        className={`pt-8 min-h-screen transition-all duration-300
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
