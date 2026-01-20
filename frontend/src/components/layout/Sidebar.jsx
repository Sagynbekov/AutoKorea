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
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  {
    section: 'Главное',
    items: [
      { path: '/', icon: LayoutDashboard, label: 'Дашборд', adminOnly: true },
      { path: '/orders', icon: Package, label: 'Заказы' },
      { path: '/cars', icon: Car, label: 'Автомобили' },
    ],
  },
  {
    section: 'Управление',
    items: [
      { path: '/clients', icon: Users, label: 'Сотрудники', adminOnly: true },
      { path: '/finance', icon: Wallet, label: 'Финансы', adminOnly: true },
      { path: '/calculator', icon: Calculator, label: 'Калькулятор' },
    ],
  },
  {
    section: 'Аналитика',
    items: [
      { path: '/reports', icon: FileText, label: 'Отчеты', adminOnly: true },
    ],
  },
  {
    section: 'Система',
    items: [
      { path: '/settings', icon: Settings, label: 'Настройки' },
    ],
  },
];

export default function Sidebar({ isCollapsed, onToggle }) {
  const location = useLocation();
  const { isAdmin } = useAuth();

  return (
    <aside 
      className={`sidebar fixed left-0 top-16 h-[calc(100vh-4rem)] bg-content1 border-r border-default-200 z-40 
        ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} 
        transition-all duration-300 ease-in-out hidden lg:block`}
    >
      <div className="flex flex-col h-full">

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {menuItems.map((section, sectionIndex) => {
            // Фильтруем пункты меню для сотрудников
            const visibleItems = section.items.filter(
              (item) => !item.adminOnly || isAdmin
            );
            
            // Не показываем секцию, если в ней нет доступных пунктов
            if (visibleItems.length === 0) return null;
            
            return (
              <div key={sectionIndex} className="mb-6">
                {!isCollapsed && (
                  <p className="text-xs font-semibold text-default-400 uppercase tracking-wider mb-3 px-3">
                    {section.section}
                  </p>
                )}
                <ul className="space-y-1">
                  {visibleItems.map((item) => {
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
          );
          })}
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
