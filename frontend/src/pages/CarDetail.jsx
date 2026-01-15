import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@heroui/react';
import {
  ArrowLeft,
  Calendar,
  Car,
  FileText,
  Fuel,
  Gauge,
  Mail,
  Package,
  Phone,
  Printer,
  Settings,
  Share2,
  Ship,
  Trash2,
  User
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  formatCurrency,
  formatDate,
  getStatusInfo
} from '../data/mockData';
import { useCars } from '../hooks/useCars';
import { useStaff } from '../hooks/useStaff';

// Компонент карточки характеристики
function SpecCard({ icon: Icon, label, value, color = 'default' }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-default-50 rounded-lg">
      <div className={`p-2 rounded-lg bg-${color}/10`}>
        <Icon size={18} className={`text-${color}`} />
      </div>
      <div>
        <p className="text-xs text-default-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

// Компонент прогресса статуса
function StatusProgress({ currentStatus }) {
  const statusOrder = [
    { key: 'in_korea', label: 'В Корее' },
    { key: 'at_port', label: 'В порту' },
    { key: 'shipping', label: 'На корабле' },
    { key: 'customs', label: 'Растаможка' },
    { key: 'in_stock', label: 'На складе' },
    { key: 'sold', label: 'Продан' },
  ];

  const currentIndex = statusOrder.findIndex(s => s.key === currentStatus);
  const progress = ((currentIndex + 1) / statusOrder.length) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span className="text-default-500">Прогресс</span>
        <span className="font-medium">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} color="primary" size="md" />
      <div className="flex flex-wrap gap-2">
        {statusOrder.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <Chip
              key={status.key}
              size="sm"
              variant={isCurrent ? 'solid' : isCompleted ? 'flat' : 'bordered'}
              color={isCurrent ? 'primary' : isCompleted ? 'success' : 'default'}
            >
              {status.label}
            </Chip>
          );
        })}
      </div>
    </div>
  );
}

// Компонент финансовой карточки
function FinanceCard({ car }) {
  const purchasePrice = car.purchasePrice || 0;
  const deliveryCost = car.deliveryCost || 0;
  const customsCost = car.customsCost || 0;
  const repairCost = car.repairCost || 0;
  const otherCost = car.otherCost || 0;
  const totalCost = purchasePrice + deliveryCost + customsCost + repairCost + otherCost;
  const sellingPrice = car.sellingPrice || 0;
  const profit = sellingPrice - totalCost;
  const margin = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(1) : '0.0';

  const expenses = [
    { label: 'Закупка авто', amount: purchasePrice, percentage: totalCost > 0 ? (purchasePrice / totalCost * 100).toFixed(0) : 0 },
    { label: 'Доставка', amount: deliveryCost, percentage: totalCost > 0 ? (deliveryCost / totalCost * 100).toFixed(0) : 0 },
    { label: 'Растаможка', amount: customsCost, percentage: totalCost > 0 ? (customsCost / totalCost * 100).toFixed(0) : 0 },
    { label: 'Ремонт', amount: repairCost, percentage: totalCost > 0 ? (repairCost / totalCost * 100).toFixed(0) : 0 },
    { label: 'Прочее', amount: otherCost, percentage: totalCost > 0 ? (otherCost / totalCost * 100).toFixed(0) : 0 },
  ];

  return (
    <Card className="border border-default-200">
      <CardHeader className="pb-0">
        <h3 className="text-lg font-semibold">Финансы</h3>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Main stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-default-50 rounded-lg">
            <p className="text-sm text-default-500 mb-1">Себестоимость</p>
            <p className="text-xl font-bold">{formatCurrency(totalCost)}</p>
          </div>
          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-default-500 mb-1">Цена продажи</p>
            <p className="text-xl font-bold text-primary">{formatCurrency(car.sellingPrice)}</p>
          </div>
        </div>

        {/* Profit */}
        <div className={`p-4 rounded-lg ${profit > 0 ? 'bg-success/10' : 'bg-danger/10'}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-default-500 mb-1">Прибыль</p>
              <p className={`text-2xl font-bold ${profit > 0 ? 'text-success' : 'text-danger'}`}>
                {formatCurrency(profit)}
              </p>
            </div>
            <Chip color={profit > 0 ? 'success' : 'danger'} size="lg">
              {margin}%
            </Chip>
          </div>
        </div>

        <Divider />

        {/* Expense breakdown */}
        <div className="space-y-3">
          <p className="font-medium text-sm">Структура расходов</p>
          {expenses.map((expense) => (
            expense.amount > 0 && (
              <div key={expense.label} className="flex items-center justify-between">
                <span className="text-sm text-default-600">{expense.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{formatCurrency(expense.amount)}</span>
                  <span className="text-xs text-default-400 w-10 text-right">{expense.percentage}%</span>
                </div>
              </div>
            )
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

// Главный компонент
export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars } = useCars();
  const { staff } = useStaff();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  
  const car = cars.find(c => c.id === id);
  
  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Car size={48} className="text-default-300" />
        <h2 className="text-xl font-semibold">Автомобиль не найден</h2>
        <Button as={Link} to="/cars" color="primary">
          Вернуться к списку
        </Button>
      </div>
    );
  }

  const statusInfo = getStatusInfo(car.status);
  const client = car.managerPassport ? staff.find(s => s.passportNumber === car.managerPassport) : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            onPress={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{car.brand} {car.model}</h1>
              <Chip color={statusInfo.color} variant="flat">
                {statusInfo.label}
              </Chip>
            </div>
            <p className="text-default-500 font-mono text-sm mt-1">{car.vin}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="bordered" startContent={<Printer size={16} />}>
            Печать
          </Button>
          <Button variant="bordered" startContent={<Share2 size={16} />}>
            Поделиться
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Car Images */}
          <Card className="border border-default-200">
            <CardBody className="p-0">
              <div className="aspect-video bg-default-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Car size={80} className="text-default-300 mx-auto mb-4" />
                  <p className="text-default-400">Фото автомобиля</p>
                  <p className="text-sm text-default-300">Здесь будут фотографии</p>
                </div>
              </div>
              <div className="p-4 flex gap-2 overflow-x-auto">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-20 h-16 bg-default-100 rounded-lg flex-shrink-0 flex items-center justify-center cursor-pointer hover:bg-default-200 transition-colors"
                  >
                    <Car size={24} className="text-default-300" />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Specifications */}
          <Card className="border border-default-200">
            <CardHeader>
              <h3 className="text-lg font-semibold">Характеристики</h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <SpecCard icon={Calendar} label="Год выпуска" value={car.year} color="primary" />
                <SpecCard icon={Gauge} label="Пробег" value={`${car.mileage.toLocaleString()} км`} color="warning" />
                <SpecCard icon={Fuel} label="Двигатель" value={`${car.engineVolume} ${car.fuel}`} color="success" />
                <SpecCard icon={Settings} label="КПП" value={car.transmission} color="secondary" />
                <SpecCard icon={Car} label="Привод" value={car.drive} color="primary" />
                <div className="flex items-center gap-3 p-3 bg-default-50 rounded-lg">
                  <div className="p-2 rounded-lg bg-default/10">
                    <Package size={18} className="text-default-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-xs text-default-500">Цвет</p>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border-2 border-default-300"
                          style={{ backgroundColor: car.color }}
                        />
                        <p className="font-medium text-sm">{car.color}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Status Progress */}
          <Card className="border border-default-200">
            <CardHeader>
              <h3 className="text-lg font-semibold">Статус доставки</h3>
            </CardHeader>
            <CardBody>
              <StatusProgress currentStatus={car.status} />
            </CardBody>
          </Card>

          {/* Description */}
          <Card className="border border-default-200">
            <CardHeader>
              <h3 className="text-lg font-semibold">Описание</h3>
            </CardHeader>
            <CardBody>
              <p className="text-default-600">{car.description}</p>
              
              <Divider className="my-4" />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-default-500 mb-1">Дата покупки</p>
                  <p className="font-medium">{formatDate(car.createdAt)}</p>
                </div>
                <div>
                  <p className="text-default-500 mb-1">Менеджер</p>
                  <p className="font-medium">{car.managerName || 'Не назначен'}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right column - Finance & Client */}
        <div className="space-y-6">
          {/* Finance */}
          <FinanceCard car={car} />

          {/* Client Info */}
          {client ? (
            <Card className="border border-default-200">
              <CardHeader>
                <h3 className="text-lg font-semibold">Сотрудник</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={client.name}
                    size="lg"
                    className="bg-primary text-white"
                  />
                  <div>
                    <p className="font-semibold">{client.name}</p>
                    <p className="text-sm text-default-500">ИНН: {client.passportNumber}</p>
                  </div>
                </div>
                
                <Divider />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-default-400" />
                    <span className="text-sm">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-default-400" />
                    <span className="text-sm">{client.email}</span>
                  </div>
                </div>
                
                <Button 
                  variant="flat" 
                  color="primary" 
                  fullWidth
                  onPress={onViewOpen}
                >
                  Профиль сотрудника
                </Button>
              </CardBody>
            </Card>
          ) : (
            <Card className="border border-default-200">
              <CardBody className="text-center py-8">
                <User size={40} className="text-default-300 mx-auto mb-3" />
                <p className="text-default-500 mb-3">Сотрудник не назначен</p>
                <Button color="primary" variant="flat">
                  Назначить сотрудника
                </Button>
              </CardBody>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="border border-default-200">
            <CardHeader>
              <h3 className="text-lg font-semibold">Действия</h3>
            </CardHeader>
            <CardBody className="space-y-2">
              <Button variant="flat" color="primary" fullWidth startContent={<FileText size={16} />}>
                Создать договор
              </Button>
              <Button variant="flat" color="success" fullWidth startContent={<Ship size={16} />}>
                Обновить статус
              </Button>
              <Button variant="flat" color="danger" fullWidth startContent={<Trash2 size={16} />}>
                Удалить авто
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Staff Detail Modal */}
      <Modal 
        isOpen={isViewOpen} 
        onClose={onViewClose} 
        size="5xl" 
        classNames={{ 
          base: "rounded-2xl",
          wrapper: "rounded-2xl",
          backdrop: "bg-overlay/50 backdrop-opacity-disabled"
        }}
      >
        <ModalContent className="rounded-2xl">
          {client && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={client.name}
                    size="lg"
                    className="bg-primary text-white"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{client.name}</h3>
                    <p className="text-sm text-default-500">ИНН: {client.passportNumber}</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-default-50 rounded-lg">
                    <p className="text-sm text-default-500 mb-1">Телефон</p>
                    <p className="font-medium">{client.phone}</p>
                  </div>
                  <div className="p-4 bg-default-50 rounded-lg">
                    <p className="text-sm text-default-500 mb-1">Email</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-lg font-semibold mb-3">Привезенные машины</h4>
                  <div className="overflow-x-auto">
                    <Table 
                      aria-label="Машины сотрудника"
                      classNames={{
                        wrapper: 'shadow-none border border-default-200',
                        th: 'bg-default-100',
                      }}
                    >
                      <TableHeader>
                        <TableColumn>Машина</TableColumn>
                        <TableColumn>VIN</TableColumn>
                        <TableColumn>Год</TableColumn>
                        <TableColumn>Пробег</TableColumn>
                        <TableColumn>Закупка</TableColumn>
                        <TableColumn>Продажа</TableColumn>
                        <TableColumn>Статус</TableColumn>
                      </TableHeader>
                      <TableBody emptyContent="Нет машин">
                        {cars
                          .filter((c) => c.managerName === client.name || c.managerPassport === client.passportNumber)
                          .map((c) => {
                            const status = getStatusInfo(c.status);
                            return (
                              <TableRow key={c.id}>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{c.brand} {c.model}</p>
                                    <p className="text-xs text-default-400">{c.color}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <p className="text-xs font-mono">{c.vin}</p>
                                </TableCell>
                                <TableCell>{c.year}</TableCell>
                                <TableCell>{c.mileage.toLocaleString()} км</TableCell>
                                <TableCell>
                                  <p className="font-medium">{formatCurrency(c.purchasePrice)}</p>
                                </TableCell>
                                <TableCell>
                                  <p className="font-medium text-success">{formatCurrency(c.sellingPrice)}</p>
                                </TableCell>
                                <TableCell>
                                  {status && (
                                    <Chip size="sm" color={status.color} variant="flat">
                                      {status.label}
                                    </Chip>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onViewClose}>
                  Закрыть
                </Button>
                <Button color="primary">
                  Редактировать
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
