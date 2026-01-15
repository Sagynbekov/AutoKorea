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
import {
  transactions,
  dashboardStats,
  expensesByCategory,
  salesByMonth,
  formatCurrency,
  formatDate,
} from '../data/mockData';

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
function ExpenseBreakdown() {
  return (
    <Card className="border border-default-200">
      <CardHeader>
        <div>
          <h3 className="text-lg font-semibold">Структура расходов</h3>
          <p className="text-sm text-default-500">За текущий период</p>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {expensesByCategory.map((expense) => (
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
        ))}
      </CardBody>
    </Card>
  );
}

// Компонент графика доходов/расходов
function RevenueChart() {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <Card className="border border-default-200">
      <CardHeader>
        <div>
          <h3 className="text-lg font-semibold">Баланс</h3>
          <p className="text-sm text-default-500">Доходы и расходы</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-3 gap-4 mb-6">
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
          <div className={`text-center p-4 rounded-lg ${balance >= 0 ? 'bg-primary/10' : 'bg-warning/10'}`}>
            <Wallet className={`mx-auto mb-2 ${balance >= 0 ? 'text-primary' : 'text-warning'}`} size={24} />
            <p className="text-sm text-default-500 mb-1">Баланс</p>
            <p className={`text-xl font-bold ${balance >= 0 ? 'text-primary' : 'text-warning'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </div>

        {/* Mini chart */}
        <div className="h-32 flex items-end justify-around gap-2 px-4">
          {salesByMonth.map((month, index) => {
            const maxRevenue = Math.max(...salesByMonth.map(s => s.revenue));
            const height = (month.revenue / maxRevenue) * 100;
            return (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-default-500">{month.month}</span>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}

// Таблица транзакций
function TransactionsTable() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [typeFilter, categoryFilter]);

  const categories = [...new Set(transactions.map(t => t.category))];

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
          <TableBody items={filteredTransactions}>
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

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    // Здесь можно добавить логику для установки соответствующего диапазона дат
    if (period !== 'custom') {
      setDateRange(null);
    }
  };

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
          value={formatCurrency(dashboardStats.totalRevenue)}
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
          color="success"
        />
        <FinanceStatCard
          title="Чистая прибыль"
          value={formatCurrency(dashboardStats.totalProfit)}
          change="+8.2%"
          changeType="positive"
          icon={TrendingUp}
          color="primary"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <ExpenseBreakdown />
      </div>

      {/* Transactions */}
      <TransactionsTable />
    </div>
  );
}
