import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  FileText, 
  Wallet,
  Settings,
  TrendingUp,
  Package,
  Calculator,
  HelpCircle,
  X,
} from 'lucide-react';
import { Button } from '@heroui/react';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Дашборд' },
  { path: '/cars', icon: Car, label: 'Автомобили' },
  { path: '/orders', icon: Package, label: 'Заказы' },
  { path: '/clients', icon: Users, label: 'Клиенты' },
  { path: '/finance', icon: Wallet, label: 'Финансы' },
  { path: '/calculator', icon: Calculator, label: 'Калькулятор' },
  { path: '/reports', icon: FileText, label: 'Отчеты' },
  { path: '/analytics', icon: TrendingUp, label: 'Аналитика' },
  { path: '/settings', icon: Settings, label: 'Настройки' },
  { path: '/help', icon: HelpCircle, label: 'Помощь' },
];

export default function MobileMenu({ isOpen, onClose }) {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="fixed left-0 top-0 h-full w-72 bg-content1 z-50 lg:hidden animate-slideIn shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-default-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AK</span>
            </div>
            <p className="font-bold text-lg">AutoKorea</p>
          </div>
          <Button isIconOnly variant="light" onPress={onClose}>
            <X size={20} />
          </Button>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-primary text-white' 
                        : 'text-default-600 hover:bg-default-100'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
