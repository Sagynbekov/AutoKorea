import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Progress,
  Chip,
  Divider,
} from '@heroui/react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Car,
  Users,
  Clock,
} from 'lucide-react';
import {
  dashboardStats,
  salesByMonth,
  popularBrands,
  expensesByCategory,
  cars,
  formatCurrency,
} from '../data/mockData';

// KPI Карточка
function KPICard({ title, value, target, trend, trendValue, icon: Icon, color }) {
  const isPositive = trend === 'up';
  const progress = Math.min((parseFloat(value.replace(/[^0-9.]/g, '')) / target) * 100, 100);
  
  return (
    <Card className="border border-default-200">
      <CardBody className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-${color}/10`}>
            <Icon size={24} className={`text-${color}`} />
          </div>
          <div className="flex items-center gap-1">
            {isPositive ? (
              <ArrowUpRight size={16} className="text-success" />
            ) : (
              <ArrowDownRight size={16} className="text-danger" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
              {trendValue}
            </span>
          </div>
        </div>
        <p className="text-sm text-default-500 mb-1">{title}</p>
        <p className="text-2xl font-bold mb-3">{value}</p>
        <Progress value={progress} color={color} size="sm" className="mb-2" />
        <p className="text-xs text-default-400">Цель: {target}</p>
      </CardBody>
    </Card>
  );
}

// Графики продаж
function SalesChart() {
  const maxRevenue = Math.max(...salesByMonth.map(s => s.revenue));
  const maxSales = Math.max(...salesByMonth.map(s => s.sales));

  return (
    <Card className="border border-default-200">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Динамика продаж</h3>
          <p className="text-sm text-default-500">Выручка и количество продаж</p>
        </div>
        <BarChart3 size={20} className="text-default-400" />
      </CardHeader>
      <CardBody>
        <div className="flex items-end justify-between gap-3 h-48 mb-4">
          {salesByMonth.map((month) => {
            const revenueHeight = (month.revenue / maxRevenue) * 100;
            const salesHeight = (month.sales / maxSales) * 100;
            return (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-1 items-end h-40">
                  <div 
                    className="flex-1 bg-primary rounded-t transition-all hover:opacity-80"
                    style={{ height: `${revenueHeight}%` }}
                    title={`Выручка: ${formatCurrency(month.revenue)}`}
                  />
                  <div 
                    className="flex-1 bg-success/60 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${salesHeight}%` }}
                    title={`Продаж: ${month.sales}`}
                  />
                </div>
                <span className="text-xs text-default-500">{month.month}</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded" />
            <span className="text-sm text-default-500">Выручка</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success/60 rounded" />
            <span className="text-sm text-default-500">Кол-во продаж</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// Распределение по маркам (Pie chart визуализация)
function BrandDistribution() {
  const total = popularBrands.reduce((acc, b) => acc + b.count, 0);
  const colors = ['bg-primary', 'bg-secondary', 'bg-warning'];

  return (
    <Card className="border border-default-200">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Распределение по маркам</h3>
          <p className="text-sm text-default-500">Всего: {total} авто</p>
        </div>
        <PieChart size={20} className="text-default-400" />
      </CardHeader>
      <CardBody>
        {/* Simple pie chart representation */}
        <div className="flex justify-center mb-6">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {popularBrands.map((brand, index) => {
                const prevPercent = popularBrands.slice(0, index).reduce((acc, b) => acc + b.percentage, 0);
                const strokeDasharray = `${brand.percentage} ${100 - brand.percentage}`;
                const strokeDashoffset = -prevPercent;
                const colorClass = index === 0 ? '#006FEE' : index === 1 ? '#7828c8' : '#f5a524';
                
                return (
                  <circle
                    key={brand.brand}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={colorClass}
                    strokeWidth="20"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold">{total}</p>
                <p className="text-xs text-default-500">авто</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {popularBrands.map((brand, index) => (
            <div key={brand.brand} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${colors[index]}`} />
                <span className="font-medium">{brand.brand}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-default-500">{brand.count} авто</span>
                <Chip size="sm" variant="flat">{brand.percentage}%</Chip>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

// Структура расходов
function ExpenseAnalysis() {
  return (
    <Card className="border border-default-200">
      <CardHeader>
        <div>
          <h3 className="font-semibold">Анализ расходов</h3>
          <p className="text-sm text-default-500">Структура затрат</p>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {expensesByCategory.map((expense) => (
          <div key={expense.category}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">{expense.category}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{formatCurrency(expense.amount)}</span>
                <Chip size="sm" variant="flat" color={expense.percentage > 50 ? 'danger' : 'default'}>
                  {expense.percentage}%
                </Chip>
              </div>
            </div>
            <Progress 
              value={expense.percentage} 
              size="sm"
              color={expense.percentage > 50 ? 'primary' : expense.percentage > 20 ? 'secondary' : 'success'}
            />
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

// Статусы авто
function StatusAnalysis() {
  const statusCounts = {
    'На складе': cars.filter(c => c.status === 'in_stock').length,
    'В пути': cars.filter(c => ['in_transit_korea', 'shipping', 'at_port'].includes(c.status)).length,
    'Растаможка': cars.filter(c => c.status === 'customs').length,
    'Забронировано': cars.filter(c => c.status === 'reserved').length,
    'Продано': cars.filter(c => c.status === 'sold').length,
  };

  const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  return (
    <Card className="border border-default-200">
      <CardHeader>
        <div>
          <h3 className="font-semibold">Статусы автомобилей</h3>
          <p className="text-sm text-default-500">Текущее распределение</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {Object.entries(statusCounts).map(([status, count]) => {
            const percent = ((count / total) * 100).toFixed(0);
            return (
              <div key={status} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{status}</span>
                    <span className="text-sm font-medium">{count} ({percent}%)</span>
                  </div>
                  <Progress value={parseFloat(percent)} size="sm" color="primary" />
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Аналитика</h1>
          <p className="text-default-500">Детальный анализ бизнес-показателей</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-default-500">
          <Calendar size={16} />
          <span>Данные за последние 6 месяцев</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Выручка"
          value={formatCurrency(dashboardStats.totalRevenue)}
          target={500000}
          trend="up"
          trendValue="+12.5%"
          icon={DollarSign}
          color="success"
        />
        <KPICard
          title="Продаж"
          value={`${dashboardStats.carsSoldTotal}`}
          target={35}
          trend="up"
          trendValue="+8%"
          icon={Car}
          color="primary"
        />
        <KPICard
          title="Клиентов"
          value={`${dashboardStats.totalClients}`}
          target={10}
          trend="up"
          trendValue="+2"
          icon={Users}
          color="secondary"
        />
        <KPICard
          title="Средняя маржа"
          value={`${dashboardStats.averageMargin}%`}
          target={20}
          trend="down"
          trendValue="-1.5%"
          icon={Target}
          color="warning"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <BrandDistribution />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseAnalysis />
        <StatusAnalysis />
      </div>
    </div>
  );
}
