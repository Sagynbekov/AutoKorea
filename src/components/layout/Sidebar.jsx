import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  FileText, 
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Package,
  Calculator,
  HelpCircle,
} from 'lucide-react';
import { Button, Tooltip } from '@heroui/react';

const menuItems = [
  {
    section: 'Главное',
    items: [
      { path: '/', icon: LayoutDashboard, label: 'Дашборд' },
      { path: '/cars', icon: Car, label: 'Автомобили' },
      { path: '/orders', icon: Package, label: 'Заказы' },
    ],
  },
  {
    section: 'Управление',
    items: [
      { path: '/clients', icon: Users, label: 'Клиенты' },
      { path: '/finance', icon: Wallet, label: 'Финансы' },
      { path: '/calculator', icon: Calculator, label: 'Калькулятор' },
    ],
  },
  {
    section: 'Аналитика',
    items: [
      { path: '/reports', icon: FileText, label: 'Отчеты' },
      { path: '/analytics', icon: TrendingUp, label: 'Аналитика' },
    ],
  },
  {
    section: 'Система',
    items: [
      { path: '/settings', icon: Settings, label: 'Настройки' },
      { path: '/help', icon: HelpCircle, label: 'Помощь' },
    ],
  },
];

export default function Sidebar({ isCollapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside 
      className={`sidebar fixed left-0 top-16 h-[calc(100vh-4rem)] bg-content1 border-r border-default-200 z-40 
        ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} 
        transition-all duration-300 ease-in-out hidden lg:block`}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="flex justify-end p-2 border-b border-default-200">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={onToggle}
            className="text-default-500"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {!isCollapsed && (
                <p className="text-xs font-semibold text-default-400 uppercase tracking-wider mb-3 px-3">
                  {section.section}
                </p>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  
                  const linkContent = (
                    <NavLink
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-primary text-white shadow-md' 
                          : 'text-default-600 hover:bg-default-100 hover:text-foreground'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium text-sm">{item.label}</span>
                      )}
                    </NavLink>
                  );

                  return (
                    <li key={item.path}>
                      {isCollapsed ? (
                        <Tooltip 
                          content={item.label} 
                          placement="right"
                          delay={0}
                          closeDelay={0}
                        >
                          {linkContent}
                        </Tooltip>
                      ) : (
                        linkContent
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-default-200">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4">
              <p className="text-xs font-semibold text-foreground mb-1">AutoKorea CRM</p>
              <p className="text-xs text-default-500">Версия 1.0.0</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
