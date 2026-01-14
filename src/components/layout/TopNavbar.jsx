import { useState, useEffect } from 'react';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem,
  Button
} from '@heroui/react';
import { 
  Menu
} from 'lucide-react';
import { notifications } from '../../data/mockData';

export default function TopNavbar({ onMenuToggle, isDark, setIsDark }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, []);

  return (
    <Navbar 
      maxWidth="full" 
      className="border-b border-default-200 bg-background/70 backdrop-blur-lg w-full py-4"
    >
      <NavbarContent justify="start" className="gap-2">
        <NavbarItem className="lg:hidden">
          <Button 
            isIconOnly 
            variant="light" 
            onPress={onMenuToggle}
          >
            <Menu size={20} />
          </Button>
        </NavbarItem>
        
        <NavbarBrand className="hidden sm:flex">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AK</span>
            </div>
            <p className="font-bold text-inherit text-lg">AutoKorea</p>
          </div>
        </NavbarBrand>
      </NavbarContent>
    </Navbar>
  );
}
