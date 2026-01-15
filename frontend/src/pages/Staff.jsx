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
  Input,
  Button,
  Chip,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Users,
  DollarSign,
  ShoppingCart,
  UserPlus,
} from 'lucide-react';
import { cars, carStatuses, formatCurrency, formatDate } from '../data/mockData';
import AddModal from '../components/AddModal';
import { useStaff, useStaffOperations } from '../hooks/useStaff';

// Карточки статистики
function StatsCards({ clients }) {
  const totalClients = clients.length;

  return (
    <div className="mb-6">
      <Card className="border border-default-200">
        <CardBody className="flex flex-row items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Users size={24} className="text-primary" />
          </div>
          <div>
            <p className="text-sm text-default-500">Всего сотрудников</p>
            <p className="text-2xl font-bold">{totalClients}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function Clients() {
  const { staff: clients, loading, error, refetch } = useStaff();
  const { createStaff } = useStaffOperations();
  const [filterValue, setFilterValue] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const [selectedClient, setSelectedClient] = useState(null);

  const filteredClients = useMemo(() => {
    if (!filterValue) return clients;
    const search = filterValue.toLowerCase();
    return clients.filter(
      (client) =>
        client.name?.toLowerCase().includes(search) ||
        client.phone?.includes(search) ||
        client.email?.toLowerCase().includes(search) ||
        client.passportNumber?.includes(search)
    );
  }, [filterValue, clients]);

  const pages = Math.ceil(filteredClients.length / rowsPerPage);
  const paginatedClients = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredClients.slice(start, start + rowsPerPage);
  }, [filteredClients, page]);

  const handleView = (client) => {
    setSelectedClient(client);
    onViewOpen();
  };

  const handleAddClient = async (formData) => {
    try {
      await createStaff({
        name: formData.name,
        passportNumber: formData.passportNumber,
        phone: formData.phone,
        email: formData.email || '',
        status: 'active',
        totalOrders: 0,
        totalSpent: 0,
        registeredDate: new Date().toISOString(),
      });
      await refetch();
    } catch (error) {
      console.error('Error adding staff:', error);
      throw error;
    }
  };

  const columns = [
    { key: 'client', label: 'Сотрудник' },
    { key: 'inn', label: 'ИНН' },
    { key: 'contact', label: 'Контакты' },
    { key: 'orders', label: 'Заказы' },
    { key: 'actions', label: '' },
  ];

  const renderCell = (client, columnKey) => {
    switch (columnKey) {
      case 'client':
        return (
          <div className="flex items-center gap-3">
            <Avatar
              name={client.name}
              size="sm"
              className="bg-primary text-white"
            />
            <div>
              <p className="font-medium">{client.name}</p>
              <p className="text-xs text-default-400">С {formatDate(client.registeredDate)}</p>
            </div>
          </div>
        );
      case 'inn':
        return (
          <div className="font-mono text-sm">
            {client.passportNumber}
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Phone size={14} className="text-default-400" />
              <span>{client.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-default-500">
              <Mail size={14} className="text-default-400" />
              <span>{client.email}</span>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="flex items-center gap-2">
            <ShoppingCart size={14} className="text-default-400" />
            <span>{client.totalOrders}</span>
          </div>
        );
      case 'actions':
        return (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly variant="light" size="sm">
                <MoreVertical size={16} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Действия">
              <DropdownItem
                key="view"
                startContent={<Eye size={16} />}
                onPress={() => handleView(client)}
              >
                Просмотр
              </DropdownItem>
              <DropdownItem key="edit" startContent={<Edit size={16} />}>
                Редактировать
              </DropdownItem>
              <DropdownItem key="delete" color="danger" startContent={<Trash2 size={16} />}>
                Удалить
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
          <h1 className="text-2xl font-bold">Сотрудники</h1>
          <p className="text-default-500">Управление базой сотрудников</p>
        </div>
        <Button color="primary" startContent={<Plus size={16} />} onPress={onAddOpen}>
          Добавить сотрудника
        </Button>
      </div>

      {/* Stats */}
      <StatsCards clients={clients} />

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          className="max-w-xs"
          placeholder="Поиск по имени, телефону, email..."
          startContent={<Search size={18} className="text-default-400" />}
          value={filterValue}
          onValueChange={setFilterValue}
          isClearable
          onClear={() => setFilterValue('')}
        />
      </div>

      {/* Table */}
      <Table
        aria-label="Таблица сотрудников"
        bottomContent={
          pages > 1 && (
            <div className="flex justify-center py-2">
              <Pagination
                total={pages}
                page={page}
                onChange={setPage}
                showControls
                size="sm"
              />
            </div>
          )
        }
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
        <TableBody items={paginatedClients} emptyContent="Сотрудники не найдены">
          {(client) => (
            <TableRow key={client.id}>
              {(columnKey) => (
                <TableCell>{renderCell(client, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add Client Modal */}
      <AddModal
        isOpen={isAddOpen}
        onClose={onAddClose}
        type="client"
        onSubmit={handleAddClient}
      />

      {/* Client Detail Modal */}
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
          {selectedClient && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={selectedClient.name}
                    size="lg"
                    className="bg-primary text-white"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{selectedClient.name}</h3>
                    <p className="text-sm text-default-500">ИНН: {selectedClient.passportNumber}</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-default-50 rounded-lg">
                    <p className="text-sm text-default-500 mb-1">Телефон</p>
                    <p className="font-medium">{selectedClient.phone}</p>
                  </div>
                  <div className="p-4 bg-default-50 rounded-lg">
                    <p className="text-sm text-default-500 mb-1">Email</p>
                    <p className="font-medium">{selectedClient.email}</p>
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
                          .filter((car) => car.manager === selectedClient.name)
                          .map((car) => {
                            const status = Object.values(carStatuses).find(
                              (s) => s.key === car.status
                            );
                            return (
                              <TableRow key={car.id}>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{car.brand} {car.model}</p>
                                    <p className="text-xs text-default-400">{car.color}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <p className="text-xs font-mono">{car.vin}</p>
                                </TableCell>
                                <TableCell>{car.year}</TableCell>
                                <TableCell>{car.mileage.toLocaleString()} км</TableCell>
                                <TableCell>
                                  <p className="font-medium">{formatCurrency(car.purchasePrice)}</p>
                                </TableCell>
                                <TableCell>
                                  <p className="font-medium text-success">{formatCurrency(car.sellingPrice)}</p>
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
