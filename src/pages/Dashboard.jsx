import { 
  Card, 
  CardBody, 
  CardHeader,
  Chip,
  Button,
  Progress,
  Avatar,
  Divider,
} from '@heroui/react';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Car,
  Users,
  Package,
  ArrowUpRight,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Ship,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  dashboardStats, 
  cars, 
  clients, 
  transactions,
  salesByMonth,
  popularBrands,
  formatCurrency,
  formatDate,
  getStatusInfo,
} from '../data/mockData';

// Компонент карточки статистики
function StatCard({ title, value, change, changeType, icon: Icon, color, prefix = '' }) {
  const isPositive = changeType === 'positive';
  
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    secondary: 'bg-secondary/10 text-secondary',
    danger: 'bg-danger/10 text-danger',
  };

  return (
    <Card className="stat-card border border-default-200">
      <CardBody className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-default-500 mb-1">{title}</p>
            <p className="text-2xl font-bold mb-2">{prefix}{value}</p>
            {change && (
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp size={14} className="text-success" />
                ) : (
                  <TrendingDown size={14} className="text-danger" />
                )}
                <span className={`text-xs font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
                  {change}
                </span>
                <span className="text-xs text-default-400">vs прошлый месяц</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// Компонент последних автомобилей
function RecentCars() {
  const recentCars = cars.slice(0, 5);

  return (
    <Card className="border border-default-200">
      <CardHeader className="flex justify-between items-center px-5 pt-5">
        <div>
          <h3 className="text-lg font-semibold">Последние автомобили</h3>
          <p className="text-sm text-default-500">Недавно добавленные в систему</p>
        </div>
        <Button 
          as={Link} 
          to="/cars" 
          variant="light" 
          color="primary"
          endContent={<ArrowRight size={16} />}
        >
          Все авто
        </Button>
      </CardHeader>
      <CardBody className="px-5 pb-5">
        <div className="space-y-4">
          {recentCars.map((car) => {
            const statusInfo = getStatusInfo(car.status);
            return (
              <div 
                key={car.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-default-100 transition-colors cursor-pointer"
              >
                <div className="w-16 h-12 bg-default-200 rounded-lg flex items-center justify-center">
                  <Car size={24} className="text-default-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{car.brand} {car.model}</p>
                  <p className="text-sm text-default-500">{car.year} • {car.mileage.toLocaleString()} км</p>
                </div>
                <div className="text-right">
                  <Chip 
                    size="sm" 
                    color={statusInfo.color}
                    variant="flat"
                  >
                    {statusInfo.label}
                  </Chip>
                  <p className="text-sm font-semibold mt-1">{formatCurrency(car.sellingPrice)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}

// Компонент статусов автомобилей
function CarStatusOverview() {
  const statusCounts = {
    inTransit: cars.filter(c => ['in_transit_korea', 'shipping', 'at_port'].includes(c.status)).length,
    customs: cars.filter(c => c.status === 'customs').length,
    inStock: cars.filter(c => c.status === 'in_stock').length,
    reserved: cars.filter(c => c.status === 'reserved').length,
    sold: cars.filter(c => c.status === 'sold').length,
  };

  const statuses = [
    { label: 'В пути', count: statusCounts.inTransit, icon: Ship, color: 'warning' },
    { label: 'Растаможка', count: statusCounts.customs, icon: Clock, color: 'secondary' },
    { label: 'На складе', count: statusCounts.inStock, icon: Package, color: 'success' },
    { label: 'Забронировано', count: statusCounts.reserved, icon: AlertCircle, color: 'primary' },
    { label: 'Продано', count: statusCounts.sold, icon: CheckCircle, color: 'success' },
  ];

  return (
    <Card className="border border-default-200">
      <CardHeader className="px-5 pt-5">
        <div>
          <h3 className="text-lg font-semibold">Статусы автомобилей</h3>
          <p className="text-sm text-default-500">Распределение по статусам</p>
        </div>
      </CardHeader>
      <CardBody className="px-5 pb-5">
        <div className="space-y-4">
          {statuses.map((status) => {
            const Icon = status.icon;
            const percentage = (status.count / cars.length) * 100;
            return (
              <div key={status.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={`text-${status.color}`} />
                    <span className="text-sm">{status.label}</span>
                  </div>
                  <span className="text-sm font-semibold">{status.count}</span>
                </div>
                <Progress 
                  value={percentage} 
                  color={status.color}
                  size="sm"
                  className="h-2"
                />
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}

// Компонент последних транзакций
function RecentTransactions() {
  const recent = transactions.slice(0, 5);

  return (
    <Card className="border border-default-200">
      <CardHeader className="flex justify-between items-center px-5 pt-5">
        <div>
          <h3 className="text-lg font-semibold">Последние транзакции</h3>
          <p className="text-sm text-default-500">Финансовые операции</p>
        </div>
        <Button 
          as={Link} 
          to="/finance" 
          variant="light" 
          color="primary"
          endContent={<ArrowRight size={16} />}
        >
          Все
        </Button>
      </CardHeader>
      <CardBody className="px-5 pb-5">
        <div className="space-y-3">
          {recent.map((tx) => (
            <div 
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-default-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${tx.type === 'income' ? 'bg-success/10' : 'bg-danger/10'}`}>
                  {tx.type === 'income' ? (
                    <ArrowUpRight size={18} className="text-success" />
                  ) : (
                    <ArrowUpRight size={18} className="text-danger rotate-180" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{tx.category}</p>
                  <p className="text-xs text-default-400">{formatDate(tx.date)}</p>
                </div>
              </div>
              <p className={`font-semibold ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

// Компонент популярных марок
function PopularBrands() {
  return (
    <Card className="border border-default-200">
      <CardHeader className="px-5 pt-5">
        <div>
          <h3 className="text-lg font-semibold">Популярные марки</h3>
          <p className="text-sm text-default-500">За все время</p>
        </div>
      </CardHeader>
      <CardBody className="px-5 pb-5">
        <div className="space-y-4">
          {popularBrands.map((brand, index) => (
            <div key={brand.brand}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="font-medium">{brand.brand}</span>
                </div>
                <span className="text-sm text-default-500">{brand.count} авто</span>
              </div>
              <Progress 
                value={brand.percentage} 
                color="primary"
                size="sm"
              />
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

// Компонент графика продаж (упрощенный)
function SalesChart() {
  const maxRevenue = Math.max(...salesByMonth.map(s => s.revenue));

  return (
    <Card className="border border-default-200">
      <CardHeader className="px-5 pt-5">
        <div>
          <h3 className="text-lg font-semibold">Динамика продаж</h3>
          <p className="text-sm text-default-500">Выручка за последние 6 месяцев</p>
        </div>
      </CardHeader>
      <CardBody className="px-5 pb-5">
        <div className="flex items-end justify-between gap-2 h-48">
          {salesByMonth.map((month) => {
            const height = (month.revenue / maxRevenue) * 100;
            return (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center">
                  <span className="text-xs font-medium mb-1">{month.sales}</span>
                  <div 
                    className="w-full bg-primary/80 rounded-t-lg transition-all hover:bg-primary"
                    style={{ height: `${height * 1.5}px` }}
                  />
                </div>
                <span className="text-xs text-default-500">{month.month}</span>
              </div>
            );
          })}
        </div>
        <Divider className="my-4" />
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-default-500">Всего продаж</p>
            <p className="font-semibold">{salesByMonth.reduce((acc, m) => acc + m.sales, 0)} авто</p>
          </div>
          <div className="text-right">
            <p className="text-default-500">Общая выручка</p>
            <p className="font-semibold">{formatCurrency(salesByMonth.reduce((acc, m) => acc + m.revenue, 0))}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// Главный компонент Dashboard
export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fadeIn pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0">
        <div>
          <h1 className="text-2xl font-bold">Дашборд</h1>
          <p className="text-default-500">Добро пожаловать в AutoKorea CRM</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Общая выручка"
          value={formatCurrency(dashboardStats.totalRevenue)}
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
          color="success"
        />
        <StatCard
          title="Чистая прибыль"
          value={formatCurrency(dashboardStats.totalProfit)}
          change="+8.2%"
          changeType="positive"
          icon={TrendingUp}
          color="primary"
        />
        <StatCard
          title="Авто в пути"
          value={dashboardStats.carsInTransit}
          icon={Ship}
          color="warning"
        />
        <StatCard
          title="Клиентов"
          value={dashboardStats.totalClients}
          change="+2"
          changeType="positive"
          icon={Users}
          color="secondary"
        />
      </div>

      {/* Second row stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Продано за месяц"
          value={dashboardStats.carsSoldThisMonth}
          icon={CheckCircle}
          color="success"
        />
        <StatCard
          title="На складе"
          value={dashboardStats.carsInStock}
          icon={Package}
          color="primary"
        />
        <StatCard
          title="Средняя маржа"
          value={`${dashboardStats.averageMargin}%`}
          icon={TrendingUp}
          color="success"
        />
        <StatCard
          title="Ожидает оплаты"
          value={formatCurrency(dashboardStats.pendingPayments)}
          icon={Clock}
          color="warning"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <CarStatusOverview />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentCars />
        </div>
        <RecentTransactions />
      </div>

      {/* Popular Brands */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PopularBrands />
      </div>
    </div>
  );
}
