import { useState, useEffect } from 'react';
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
  Badge,
  Input,
} from '@heroui/react';
import { 
  Menu, 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  User,
  Settings,
  LogOut,
  ChevronDown,
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
      className="border-b border-default-200 bg-background/70 backdrop-blur-lg"
      height="4rem"
    >
      <NavbarContent justify="start">
        <Button 
          isIconOnly 
          variant="light" 
          onPress={onMenuToggle}
          className="lg:hidden"
        >
          <Menu size={20} />
        </Button>
        
        <NavbarBrand className="hidden sm:flex">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AK</span>
            </div>
            <p className="font-bold text-inherit text-lg">AutoKorea</p>
          </div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="center" className="hidden md:flex flex-1 max-w-md">
        <Input
          classNames={{
            base: "w-full",
            inputWrapper: "bg-default-100 hover:bg-default-200",
          }}
          placeholder="Поиск по VIN, марке, клиенту..."
          size="sm"
          startContent={<Search size={18} className="text-default-400" />}
          type="search"
        />
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            onPress={() => setIsDark(!isDark)}
            className="text-default-500"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly variant="light" className="text-default-500">
                <Badge 
                  content={unreadCount} 
                  color="danger" 
                  size="sm"
                  isInvisible={unreadCount === 0}
                >
                  <Bell size={20} />
                </Badge>
              </Button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Уведомления"
              className="w-80"
            >
              <DropdownItem key="header" isReadOnly className="h-14 gap-2">
                <p className="font-semibold">Уведомления</p>
              </DropdownItem>
              {notifications.slice(0, 4).map((notification) => (
                <DropdownItem 
                  key={notification.id}
                  description={notification.message}
                  className={notification.read ? 'opacity-60' : ''}
                >
                  {notification.title}
                </DropdownItem>
              ))}
              <DropdownItem key="all" className="text-center text-primary">
                Показать все
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>

        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button 
                variant="light" 
                className="gap-2 pl-2 pr-3"
              >
                <Avatar
                  size="sm"
                  name="Алексей Ким"
                  className="bg-primary text-white"
                />
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-sm font-medium">Алексей Ким</span>
                  <span className="text-xs text-default-400">Менеджер</span>
                </div>
                <ChevronDown size={16} className="text-default-400 hidden lg:block" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Профиль">
              <DropdownItem key="profile" startContent={<User size={16} />}>
                Мой профиль
              </DropdownItem>
              <DropdownItem key="settings" startContent={<Settings size={16} />}>
                Настройки
              </DropdownItem>
              <DropdownItem 
                key="logout" 
                color="danger" 
                startContent={<LogOut size={16} />}
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
