import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
  Progress,
  Avatar,
  Input,
  Select,
  SelectItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import {
  Package,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Car,
} from 'lucide-react';
import { cars, clients, getStatusInfo, formatCurrency, formatDate } from '../data/mockData';

// Фильтруем только заказанные авто (не на складе и не проданные)
const orderStatuses = ['ordered', 'auction', 'purchased', 'in_transit_korea', 'at_port', 'shipping', 'customs'];

export default function Orders() {
  const [filterValue, setFilterValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const orders = useMemo(() => {
    return cars.filter(car => orderStatuses.includes(car.status) || car.status === 'reserved');
  }, []);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    
    if (filterValue) {
      const search = filterValue.toLowerCase();
      filtered = filtered.filter(
        order =>
          order.brand.toLowerCase().includes(search) ||
          order.model.toLowerCase().includes(search) ||
          order.vin.toLowerCase().includes(search) ||
          (order.client && order.client.toLowerCase().includes(search))
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    return filtered;
  }, [orders, filterValue, statusFilter]);

  // Статистика
  const stats = {
    total: orders.length,
    inTransit: orders.filter(o => ['in_transit_korea', 'shipping', 'at_port'].includes(o.status)).length,
    customs: orders.filter(o => o.status === 'customs').length,
    auction: orders.filter(o => ['ordered', 'auction', 'purchased'].includes(o.status)).length,
  };

  const columns = [
    { key: 'car', label: 'Автомобиль' },
    { key: 'client', label: 'Клиент' },
    { key: 'status', label: 'Статус' },
    { key: 'progress', label: 'Прогресс' },
    { key: 'price', label: 'Стоимость' },
    { key: 'date', label: 'Дата заказа' },
    { key: 'actions', label: '' },
  ];

  const getProgressPercent = (status) => {
    const statusProgress = {
      ordered: 10,
      auction: 20,
      purchased: 30,
      in_transit_korea: 45,
      at_port: 55,
      shipping: 70,
      customs: 85,
      reserved: 95,
    };
    return statusProgress[status] || 0;
  };

  const renderCell = (order, columnKey) => {
    const statusInfo = getStatusInfo(order.status);
    
    switch (columnKey) {
      case 'car':
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-10 bg-default-200 rounded-lg flex items-center justify-center">
              <Car size={20} className="text-default-400" />
            </div>
            <div>
              <p className="font-medium">{order.brand} {order.model}</p>
              <p className="text-xs text-default-400 font-mono">{order.vin.slice(0, 11)}...</p>
            </div>
          </div>
        );
      case 'client':
        return order.client ? (
          <div className="flex items-center gap-2">
            <Avatar name={order.client} size="sm" className="bg-primary" />
            <span className="text-sm">{order.client}</span>
          </div>
        ) : (
          <span className="text-default-400 text-sm">Не назначен</span>
        );
      case 'status':
        return (
          <Chip size="sm" color={statusInfo.color} variant="flat">
            {statusInfo.label}
          </Chip>
        );
      case 'progress':
        const percent = getProgressPercent(order.status);
        return (
          <div className="w-32">
            <Progress 
              value={percent} 
              color={percent > 80 ? 'success' : percent > 50 ? 'primary' : 'warning'}
              size="sm"
              className="mb-1"
            />
            <span className="text-xs text-default-500">{percent}%</span>
          </div>
        );
      case 'price':
        return <p className="font-semibold">{formatCurrency(order.sellingPrice)}</p>;
      case 'date':
        return <span className="text-sm">{formatDate(order.purchaseDate)}</span>;
      case 'actions':
        return (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly variant="light" size="sm">
                <MoreVertical size={16} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="view" startContent={<Eye size={16} />} as={Link} to={`/cars/${order.id}`}>
                Просмотр
              </DropdownItem>
              <DropdownItem key="edit" startContent={<Edit size={16} />}>
                Редактировать
              </DropdownItem>
              <DropdownItem key="status" startContent={<Truck size={16} />}>
                Обновить статус
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Заказы</h1>
          <p className="text-default-500">Отслеживание заказов и доставки</p>
        </div>
        <Button color="primary" startContent={<Plus size={16} />}>
          Новый заказ
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-default-200">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-default-500">Всего заказов</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="border border-default-200">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Truck size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-xs text-default-500">В пути</p>
              <p className="text-xl font-bold">{stats.inTransit}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="border border-default-200">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Clock size={20} className="text-secondary" />
            </div>
            <div>
              <p className="text-xs text-default-500">На растаможке</p>
              <p className="text-xl font-bold">{stats.customs}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="border border-default-200">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <AlertCircle size={20} className="text-success" />
            </div>
            <div>
              <p className="text-xs text-default-500">На аукционе</p>
              <p className="text-xl font-bold">{stats.auction}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          className="max-w-xs"
          placeholder="Поиск..."
          startContent={<Search size={18} className="text-default-400" />}
          value={filterValue}
          onValueChange={setFilterValue}
          isClearable
        />
        <Select
          className="w-48"
          placeholder="Статус"
          selectedKeys={[statusFilter]}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <SelectItem key="all">Все статусы</SelectItem>
          <SelectItem key="ordered">Заказан</SelectItem>
          <SelectItem key="auction">На аукционе</SelectItem>
          <SelectItem key="purchased">Выкуплен</SelectItem>
          <SelectItem key="in_transit_korea">В пути (Корея)</SelectItem>
          <SelectItem key="shipping">На корабле</SelectItem>
          <SelectItem key="customs">Растаможка</SelectItem>
        </Select>
      </div>

      {/* Table */}
      <Table
        aria-label="Таблица заказов"
        classNames={{
          wrapper: 'shadow-none border border-default-200',
          th: 'bg-default-100',
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={filteredOrders} emptyContent="Заказы не найдены">
          {(order) => (
            <TableRow key={order.id}>
              {(columnKey) => (
                <TableCell>{renderCell(order, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
