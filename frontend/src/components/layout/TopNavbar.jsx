import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from '@heroui/react';
import { 
  Menu,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { notifications } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export default function TopNavbar({ onMenuToggle, isDark, setIsDark }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

      <NavbarContent justify="end">
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button variant="light" className="gap-2">
                <Avatar
                  name={user?.name}
                  size="sm"
                  className="bg-primary text-white"
                />
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-default-500">
                    {isAdmin ? 'Администратор' : 'Сотрудник'}
                  </span>
                </div>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Профиль">
              <DropdownItem key="profile" startContent={<UserIcon size={16} />}>
                Профиль
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                startContent={<LogOut size={16} />}
                onPress={handleLogout}
              >
                Выйти
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
