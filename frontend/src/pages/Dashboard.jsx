import { useMemo } from 'react';
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
  formatCurrency,
  formatDate,
  getStatusInfo,
} from '../data/mockData';
import { useCars } from '../hooks/useCars';
import { useStaff } from '../hooks/useStaff';

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
function RecentCars({ cars }) {
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
          {recentCars.length > 0 ? (
            recentCars.map((car) => {
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
                    <p className="text-sm text-default-500">{car.year} • {car.mileage ? car.mileage.toLocaleString() : 0} км</p>
                  </div>
                  <div className="text-right">
                    <Chip 
                      size="sm" 
                      color={statusInfo.color}
                      variant="flat"
                    >
                      {statusInfo.label}
                    </Chip>
                    <p className="text-sm font-semibold mt-1">{formatCurrency(car.sellingPrice || 0)}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-default-500 text-center py-4">Нет автомобилей</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

// Компонент статусов автомобилей
function CarStatusOverview({ cars }) {
  const statusCounts = useMemo(() => ({
    inTransit: cars.filter(c => ['in_korea', 'in_transit_korea', 'shipping', 'at_port', 'customs'].includes(c.status)).length,
    inStock: cars.filter(c => c.status === 'in_stock').length,
    sold: cars.filter(c => c.status === 'sold').length,
  }), [cars]);

  const statuses = [
    { label: 'В пути', count: statusCounts.inTransit, icon: Ship, color: 'warning' },
    { label: 'На складе', count: statusCounts.inStock, icon: Package, color: 'primary' },
    { label: 'Продано', count: statusCounts.sold, icon: CheckCircle, color: 'success' },
  ];

  const totalCars = cars.length;

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
            const percentage = totalCars > 0 ? Math.round((status.count / totalCars) * 100) : 0;
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
function RecentTransactions({ cars }) {
  // Генерируем транзакции из данных автомобилей
  const transactions = useMemo(() => {
    const allTransactions = [];
    let transactionId = 1;

    cars.forEach(car => {
      // Покупка автомобиля (расход)
      if (car.purchasePrice && car.purchasePrice > 0) {
        allTransactions.push({
          id: transactionId++,
          type: 'expense',
          category: 'Покупка автомобиля',
          description: `${car.brand} ${car.model}`,
          amount: car.purchasePrice,
          date: car.purchaseDate || new Date().toISOString().split('T')[0],
        });
      }

      // Продажа автомобиля (доход)
      if (car.status === 'sold' && car.sellingPrice && car.sellingPrice > 0) {
        allTransactions.push({
          id: transactionId++,
          type: 'income',
          category: 'Продажа автомобиля',
          description: `${car.brand} ${car.model}`,
          amount: car.sellingPrice,
          date: car.soldDate || new Date().toISOString().split('T')[0],
        });
      }
    });

    return allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [cars]);

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
          {recent.length > 0 ? (
            recent.map((tx) => (
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
            ))
          ) : (
            <p className="text-sm text-default-500 text-center py-4">Нет транзакций</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}



// Компонент графика продаж (упрощенный)
function SalesChart({ cars }) {
  // Группируем данные по месяцам для графика
  const salesByMonth = useMemo(() => {
    const monthsData = {};
    
    cars.forEach(car => {
      if (car.status === 'sold' && car.sellingPrice) {
        // Используем разные поля дат в порядке приоритета
        let dateString = car.soldDate || car.saleDate || car.arrivalDate || car.purchaseDate;
        
        if (!dateString) return; // Пропускаем если нет даты
        
        // Обработка разных форматов дат
        let date;
        if (dateString?.toDate) {
          // Firestore Timestamp
          date = dateString.toDate();
        } else if (typeof dateString === 'string') {
          date = new Date(dateString);
        } else if (dateString instanceof Date) {
          date = dateString;
        } else {
          return; // Неизвестный формат
        }
        
        if (isNaN(date.getTime())) return; // Невалидная дата
        
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('ru-RU', { month: 'short' });
        
        if (!monthsData[monthKey]) {
          monthsData[monthKey] = { month: monthName, revenue: 0, sales: 0, date: date };
        }
        monthsData[monthKey].revenue += car.sellingPrice || 0;
        monthsData[monthKey].sales += 1;
      }
    });

    // Сортируем по дате и берем последние 6 месяцев
    return Object.values(monthsData)
      .sort((a, b) => a.date - b.date)
      .slice(-6)
      .map(({ month, revenue, sales }) => ({ month, revenue, sales }));
  }, [cars]);

  const maxRevenue = salesByMonth.length > 0 ? Math.max(...salesByMonth.map(s => s.revenue)) : 0;

  return (
    <Card className="border border-default-200">
      <CardHeader className="px-5 pt-5">
        <div>
          <h3 className="text-lg font-semibold">Динамика продаж</h3>
          <p className="text-sm text-default-500">Выручка за последние 6 месяцев</p>
        </div>
      </CardHeader>
      <CardBody className="px-5 pb-5">
        {salesByMonth.length > 0 ? (
          <>
            <div className="flex items-end justify-between gap-2 h-48">
              {salesByMonth.map((month, index) => {
                const height = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center">
                      <span className="text-xs font-medium mb-1">{month.sales}</span>
                      <div 
                        className="w-full bg-primary/80 rounded-t-lg transition-all hover:bg-primary"
                        style={{ height: `${height * 1.5}px`, minHeight: '4px' }}
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
          </>
        ) : (
          <p className="text-sm text-default-500 text-center py-8">Нет данных о продажах</p>
        )}
      </CardBody>
    </Card>
  );
}

// Главный компонент Dashboard
export default function Dashboard() {
  // Получаем данные автомобилей и сотрудников
  const { cars, loading: carsLoading } = useCars();
  const { staff, loading: staffLoading } = useStaff();

  // Вычисляем статистику на основе реальных данных
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let totalExpenses = 0;
    let soldCarsRevenue = 0;
    let soldCarsCosts = 0;
    let soldCarsCount = 0;
    
    // Статусы для заказов (как в Orders.jsx)
    const orderStatuses = ['in_korea', 'at_port', 'shipping', 'customs'];
    
    // Подсчет машин в пути (страница Заказы)
    const carsInTransit = cars.filter(car => orderStatuses.includes(car.status)).length;
    
    // Подсчет машин на складе (страница Автомобили: in_stock и sold)
    const carsInStock = cars.filter(car => car.status === 'in_stock' || car.status === 'sold').length;
    
    cars.forEach(car => {
      const carTotalCost = (car.purchasePrice || 0) + 
                           (car.shippingCost || 0) + 
                           (car.customsCost || 0) + 
                           (car.repairCost || 0) + 
                           (car.additionalCost || 0);
      
      // Все расходы (для общей статистики)
      totalExpenses += carTotalCost;
      
      // Только проданные машины для расчета маржи и выручки
      if (car.status === 'sold' && car.sellingPrice) {
        soldCarsRevenue += car.sellingPrice;
        soldCarsCosts += carTotalCost;
        soldCarsCount++;
        totalRevenue += car.sellingPrice;
      }
    });

    const totalProfit = totalRevenue - soldCarsCosts; // Прибыль только от проданных
    // Средняя маржа = (выручка - затраты) / выручка * 100, только по проданным авто
    const averageMargin = soldCarsRevenue > 0 
      ? Math.round(((soldCarsRevenue - soldCarsCosts) / soldCarsRevenue) * 100) 
      : 0;

    return {
      totalRevenue,
      totalProfit,
      totalClients: staff.length,
      carsInTransit,
      carsInStock,
      averageMargin
    };
  }, [cars, staff]);

  const loading = carsLoading || staffLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-default-500">Загрузка данных дашборда...</p>
        </div>
      </div>
    );
  }

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Общая выручка"
          value={formatCurrency(stats.totalRevenue)}
          change={stats.totalRevenue > 0 ? "+12.5%" : null}
          changeType="positive"
          icon={DollarSign}
          color="success"
        />
        <StatCard
          title="Чистая прибыль"
          value={formatCurrency(stats.totalProfit)}
          change={stats.totalProfit > 0 ? "+8.2%" : stats.totalProfit < 0 ? "-8.2%" : null}
          changeType={stats.totalProfit >= 0 ? "positive" : "negative"}
          icon={TrendingUp}
          color="primary"
        />
        <StatCard
          title="Сотрудников"
          value={stats.totalClients}
          change={stats.totalClients > 0 ? "+2" : null}
          changeType="positive"
          icon={Users}
          color="secondary"
        />
      </div>

      {/* Second row stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Авто в пути"
          value={stats.carsInTransit}
          icon={Ship}
          color="warning"
        />
        <StatCard
          title="На складе"
          value={stats.carsInStock}
          icon={Package}
          color="primary"
        />
        <StatCard
          title="Средняя маржа"
          value={`${stats.averageMargin}%`}
          icon={TrendingUp}
          color="success"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart cars={cars} />
        </div>
        <CarStatusOverview cars={cars} />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentCars cars={cars} />
        </div>
        <RecentTransactions cars={cars} />
      </div>
    </div>
  );
}
