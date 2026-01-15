import { useState, useMemo } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Tabs,
  Tab,
  Input,
  Select,
  SelectItem,
  Divider,
  Progress,
  DateRangePicker,
  ButtonGroup,
} from '@heroui/react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  Filter,
  Calendar,
  Wallet,
  CreditCard,
  PiggyBank,
  Receipt,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../data/mockData';
import { useCars } from '../hooks/useCars';

// Компонент финансовой карточки
function FinanceStatCard({ title, value, change, changeType, icon: Icon, color }) {
  const isPositive = changeType === 'positive';
  
  const bgColors = {
    success: 'bg-success/10',
    primary: 'bg-primary/10',
    warning: 'bg-warning/10',
    danger: 'bg-danger/10',
  };

  const textColors = {
    success: 'text-success',
    primary: 'text-primary',
    warning: 'text-warning',
    danger: 'text-danger',
  };

  return (
    <Card className="border border-default-200">
      <CardBody className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-default-500 mb-2">{title}</p>
            <p className="text-2xl font-bold mb-2">{value}</p>
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
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${bgColors[color]}`}>
            <Icon size={24} className={textColors[color]} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// Компонент структуры расходов
function ExpenseBreakdown({ cars }) {
  // Вычисляем структуру расходов из данных автомобилей
  const expensesByCategory = useMemo(() => {
    const expenses = {
      'Покупка автомобилей': 0,
      'Доставка': 0,
      'Растаможка': 0,
      'Ремонт': 0,
      'Дополнительные расходы': 0,
    };

    cars.forEach(car => {
      expenses['Покупка автомобилей'] += car.purchasePrice || 0;
      expenses['Доставка'] += car.shippingCost || 0;
      expenses['Растаможка'] += car.customsCost || 0;
      expenses['Ремонт'] += car.repairCost || 0;
      expenses['Дополнительные расходы'] += car.additionalCost || 0;
    });

    const totalExpenses = Object.values(expenses).reduce((acc, val) => acc + val, 0);
    
    return Object.entries(expenses)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0
      }))
      .filter(expense => expense.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [cars]);

  return (
    <Card className="border border-default-200">
      <CardHeader>
        <div>
          <h3 className="text-lg font-semibold">Структура расходов</h3>
          <p className="text-sm text-default-500">За текущий период</p>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {expensesByCategory.length > 0 ? (
          expensesByCategory.map((expense) => (
            <div key={expense.category}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">{expense.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{formatCurrency(expense.amount)}</span>
                  <Chip size="sm" variant="flat">{expense.percentage}%</Chip>
                </div>
              </div>
              <Progress 
                value={expense.percentage} 
                color={
                  expense.percentage > 50 ? 'primary' : 
                  expense.percentage > 20 ? 'secondary' : 
                  'success'
                }
                size="sm"
              />
            </div>
          ))
        ) : (
          <p className="text-sm text-default-500 text-center py-4">Нет данных о расходах</p>
        )}
      </CardBody>
    </Card>
  );
}

// Компонент графика доходов/расходов
function RevenueChart({ cars }) {
  // Вычисляем доходы и расходы из данных автомобилей
  const { totalIncome, totalExpense } = useMemo(() => {
    let income = 0;
    let expense = 0;

    cars.forEach(car => {
      // Расходы - все затраты на машину
      expense += (car.purchasePrice || 0) + 
                 (car.shippingCost || 0) + 
                 (car.customsCost || 0) + 
                 (car.repairCost || 0) + 
                 (car.additionalCost || 0);
      
      // Доходы - только проданные машины
      if (car.status === 'sold' && car.sellingPrice) {
        income += car.sellingPrice;
      }
    });

    return { totalIncome: income, totalExpense: expense };
  }, [cars]);

  // Группируем данные по месяцам для графика
  const salesByMonth = useMemo(() => {
    const monthsData = {};
    
    cars.forEach(car => {
      if (car.status === 'sold' && car.soldDate) {
        const date = new Date(car.soldDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('ru-RU', { month: 'short' });
        
        if (!monthsData[monthKey]) {
          monthsData[monthKey] = { month: monthName, revenue: 0, date: date };
        }
        monthsData[monthKey].revenue += car.sellingPrice || 0;
      }
    });

    // Сортируем по дате и берем последние 6 месяцев
    return Object.values(monthsData)
      .sort((a, b) => a.date - b.date)
      .slice(-6)
      .map(({ month, revenue }) => ({ month, revenue }));
  }, [cars]);

  return (
    <Card className="border border-default-200">
      <CardHeader>
        <div>
          <h3 className="text-lg font-semibold">Доходы и расходы</h3>
          <p className="text-sm text-default-500">Финансовая сводка</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-success/10 rounded-lg">
            <ArrowUpRight className="mx-auto mb-2 text-success" size={24} />
            <p className="text-sm text-default-500 mb-1">Доходы</p>
            <p className="text-xl font-bold text-success">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="text-center p-4 bg-danger/10 rounded-lg">
            <ArrowDownRight className="mx-auto mb-2 text-danger" size={24} />
            <p className="text-sm text-default-500 mb-1">Расходы</p>
            <p className="text-xl font-bold text-danger">{formatCurrency(totalExpense)}</p>
          </div>
        </div>

        {/* Mini chart */}
        {salesByMonth.length > 0 && (
          <div className="px-4">
            <div className="h-32 flex items-end justify-around gap-2 mb-2">
              {salesByMonth.map((month, index) => {
                const maxRevenue = Math.max(...salesByMonth.map(s => s.revenue));
                const heightPx = maxRevenue > 0 ? (month.revenue / maxRevenue) * 120 : 4;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-primary rounded-t transition-all hover:bg-primary/80 cursor-pointer"
                      style={{ height: `${heightPx}px`, minHeight: '4px' }}
                      title={`${month.month}: ${formatCurrency(month.revenue)}`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-around gap-2">
              {salesByMonth.map((month, index) => (
                <div key={index} className="flex-1 text-center">
                  <span className="text-xs text-default-500">{month.month}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

// Таблица транзакций
function TransactionsTable({ cars }) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

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
          description: `${car.brand} ${car.model} ${car.year} (${car.vin})`,
          amount: car.purchasePrice,
          date: car.purchaseDate || new Date().toISOString().split('T')[0],
          carId: car.id
        });
      }

      // Доставка (расход)
      if (car.shippingCost && car.shippingCost > 0) {
        allTransactions.push({
          id: transactionId++,
          type: 'expense',
          category: 'Доставка',
          description: `Доставка ${car.brand} ${car.model} (${car.vin})`,
          amount: car.shippingCost,
          date: car.purchaseDate || new Date().toISOString().split('T')[0],
          carId: car.id
        });
      }

      // Растаможка (расход)
      if (car.customsCost && car.customsCost > 0) {
        allTransactions.push({
          id: transactionId++,
          type: 'expense',
          category: 'Растаможка',
          description: `Растаможка ${car.brand} ${car.model} (${car.vin})`,
          amount: car.customsCost,
          date: car.arrivalDate || car.purchaseDate || new Date().toISOString().split('T')[0],
          carId: car.id
        });
      }

      // Ремонт (расход)
      if (car.repairCost && car.repairCost > 0) {
        allTransactions.push({
          id: transactionId++,
          type: 'expense',
          category: 'Ремонт',
          description: `Ремонт ${car.brand} ${car.model} (${car.vin})`,
          amount: car.repairCost,
          date: car.arrivalDate || car.purchaseDate || new Date().toISOString().split('T')[0],
          carId: car.id
        });
      }

      // Дополнительные расходы (расход)
      if (car.additionalCost && car.additionalCost > 0) {
        allTransactions.push({
          id: transactionId++,
          type: 'expense',
          category: 'Дополнительные расходы',
          description: `Дополнительные расходы ${car.brand} ${car.model} (${car.vin})`,
          amount: car.additionalCost,
          date: car.arrivalDate || car.purchaseDate || new Date().toISOString().split('T')[0],
          carId: car.id
        });
      }

      // Продажа автомобиля (доход)
      if (car.status === 'sold' && car.sellingPrice && car.sellingPrice > 0) {
        allTransactions.push({
          id: transactionId++,
          type: 'income',
          category: 'Продажа автомобиля',
          description: `Продажа ${car.brand} ${car.model} ${car.year}${car.client ? ` - ${car.client}` : ''}`,
          amount: car.sellingPrice,
          date: car.soldDate || car.arrivalDate || car.purchaseDate || new Date().toISOString().split('T')[0],
          carId: car.id
        });
      }
    });

    return allTransactions;
  }, [cars]);

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, typeFilter, categoryFilter]);

  const categories = useMemo(() => {
    return [...new Set(transactions.map(t => t.category))];
  }, [transactions]);

  const columns = [
    { key: 'date', label: 'Дата' },
    { key: 'type', label: 'Тип' },
    { key: 'category', label: 'Категория' },
    { key: 'description', label: 'Описание' },
    { key: 'amount', label: 'Сумма' },
  ];

  const renderCell = (transaction, columnKey) => {
    switch (columnKey) {
      case 'date':
        return (
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-default-400" />
            <span>{formatDate(transaction.date)}</span>
          </div>
        );
      case 'type':
        return (
          <Chip
            size="sm"
            color={transaction.type === 'income' ? 'success' : 'danger'}
            variant="flat"
            startContent={
              transaction.type === 'income' 
                ? <ArrowUpRight size={12} /> 
                : <ArrowDownRight size={12} />
            }
          >
            {transaction.type === 'income' ? 'Доход' : 'Расход'}
          </Chip>
        );
      case 'category':
        return (
          <Chip size="sm" variant="bordered">
            {transaction.category}
          </Chip>
        );
      case 'description':
        return <p className="text-sm text-default-600">{transaction.description}</p>;
      case 'amount':
        return (
          <p className={`font-semibold ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border border-default-200">
      <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Транзакции</h3>
          <p className="text-sm text-default-500">История финансовых операций</p>
        </div>
        <div className="flex gap-2">
          <Select
            size="sm"
            className="w-32"
            placeholder="Тип"
            selectedKeys={[typeFilter]}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <SelectItem key="all">Все</SelectItem>
            <SelectItem key="income">Доходы</SelectItem>
            <SelectItem key="expense">Расходы</SelectItem>
          </Select>
          <Select
            size="sm"
            className="w-40"
            placeholder="Категория"
            selectedKeys={[categoryFilter]}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <SelectItem key="all">Все категории</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat}>{cat}</SelectItem>
            ))}
          </Select>
        </div>
      </CardHeader>
      <CardBody>
        <Table
          aria-label="Таблица транзакций"
          classNames={{
            wrapper: 'shadow-none p-0',
            th: 'bg-default-100',
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={filteredTransactions} emptyContent="Нет транзакций">
            {(transaction) => (
              <TableRow key={transaction.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(transaction, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}

export default function Finance() {
  const [dateRange, setDateRange] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  
  // Получаем данные автомобилей
  const { cars, loading } = useCars();

  // Фильтруем автомобили по периоду
  const filteredCars = useMemo(() => {
    if (selectedPeriod === 'all') {
      return cars;
    }

    // Получаем диапазон дат для фильтрации
    let startDate = null;
    let endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    if (selectedPeriod === 'today') {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    } else if (selectedPeriod === 'week') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    } else if (selectedPeriod === 'month') {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
    } else if (selectedPeriod === 'year') {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setHours(0, 0, 0, 0);
    } else if (selectedPeriod === 'custom' && dateRange?.start && dateRange?.end) {
      startDate = new Date(dateRange.start.year, dateRange.start.month - 1, dateRange.start.day, 0, 0, 0, 0);
      endDate = new Date(dateRange.end.year, dateRange.end.month - 1, dateRange.end.day, 23, 59, 59, 999);
    } else {
      return cars; // Если не удалось определить период, показываем все
    }

    // Функция для парсинга даты
    const parseDate = (dateString) => {
      if (!dateString) return null;
      
      // Если это объект Timestamp из Firebase
      if (dateString?.toDate) {
        return dateString.toDate();
      }
      
      // Если это строка
      if (typeof dateString === 'string') {
        // Формат YYYY-MM-DD
        if (dateString.includes('-')) {
          const [year, month, day] = dateString.split('-').map(Number);
          return new Date(year, month - 1, day);
        }
        // Пробуем стандартный парсинг
        return new Date(dateString);
      }
      
      // Если это уже Date объект
      if (dateString instanceof Date) {
        return dateString;
      }
      
      return null;
    };

    // Проверяем попадает ли дата в диапазон
    const isInRange = (dateString) => {
      const date = parseDate(dateString);
      if (!date || isNaN(date.getTime())) return false;
      
      date.setHours(0, 0, 0, 0);
      return date >= startDate && date <= endDate;
    };

    // Фильтруем автомобили
    return cars.filter(car => {
      const dates = [
        car.purchaseDate,
        car.arrivalDate,
        car.soldDate,
      ].filter(Boolean);

      if (dates.length === 0) return false;
      
      // Если хотя бы одна дата попадает в период
      return dates.some(date => isInRange(date));
    });
  }, [cars, selectedPeriod, dateRange]);

  // Вычисляем финансовую статистику
  const stats = useMemo(() => {
    let totalRevenue = 0; // Общая выручка от продаж
    let totalExpenses = 0; // Все расходы
    
    filteredCars.forEach(car => {
      // Расходы на каждый автомобиль
      totalExpenses += (car.purchasePrice || 0) + 
                      (car.shippingCost || 0) + 
                      (car.customsCost || 0) + 
                      (car.repairCost || 0) + 
                      (car.additionalCost || 0);
      
      // Выручка только от проданных машин
      if (car.status === 'sold' && car.sellingPrice) {
        totalRevenue += car.sellingPrice;
      }
    });

    const netProfit = totalRevenue - totalExpenses; // Чистая прибыль

    return {
      totalRevenue,
      netProfit,
      totalExpenses
    };
  }, [filteredCars]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (period !== 'custom') {
      setDateRange(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-default-500">Загрузка финансовых данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Финансы</h1>
          <p className="text-default-500">Управление финансами компании</p>
        </div>
        <div className="flex gap-2">
          <Button variant="bordered" startContent={<Download size={16} />}>
            Экспорт
          </Button>
        </div>
      </div>

      {/* Date Filters */}
      <Card className="border border-default-200">
        <CardBody className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-default-500" />
              <span className="text-sm font-medium">Период:</span>
            </div>
            <div className="flex-1 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <ButtonGroup size="sm" variant="flat">
                <Button
                  color={selectedPeriod === 'all' ? 'primary' : 'default'}
                  onPress={() => handlePeriodChange('all')}
                >
                  Все время
                </Button>
                <Button
                  color={selectedPeriod === 'today' ? 'primary' : 'default'}
                  onPress={() => handlePeriodChange('today')}
                >
                  Сегодня
                </Button>
                <Button
                  color={selectedPeriod === 'week' ? 'primary' : 'default'}
                  onPress={() => handlePeriodChange('week')}
                >
                  Неделя
                </Button>
                <Button
                  color={selectedPeriod === 'month' ? 'primary' : 'default'}
                  onPress={() => handlePeriodChange('month')}
                >
                  Месяц
                </Button>
                <Button
                  color={selectedPeriod === 'year' ? 'primary' : 'default'}
                  onPress={() => handlePeriodChange('year')}
                >
                  Год
                </Button>
                <Button
                  color={selectedPeriod === 'custom' ? 'primary' : 'default'}
                  onPress={() => handlePeriodChange('custom')}
                >
                  Выбрать период
                </Button>
              </ButtonGroup>
              {selectedPeriod === 'custom' && (
                <DateRangePicker
                  label="Выберите период"
                  size="sm"
                  variant="bordered"
                  value={dateRange}
                  onChange={setDateRange}
                  className="max-w-xs"
                  visibleMonths={2}
                />
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FinanceStatCard
          title="Общая выручка"
          value={formatCurrency(stats.totalRevenue)}
          change={stats.totalRevenue > 0 ? "+12.5%" : null}
          changeType="positive"
          icon={DollarSign}
          color="success"
        />
        <FinanceStatCard
          title="Чистая прибыль"
          value={formatCurrency(stats.netProfit)}
          change={stats.netProfit > 0 ? "+8.2%" : stats.netProfit < 0 ? "-8.2%" : null}
          changeType={stats.netProfit >= 0 ? "positive" : "negative"}
          icon={TrendingUp}
          color={stats.netProfit >= 0 ? "primary" : "danger"}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart cars={filteredCars} />
        <ExpenseBreakdown cars={filteredCars} />
      </div>

      {/* Transactions */}
      <TransactionsTable cars={filteredCars} />
    </div>
  );
}
