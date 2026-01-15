import {
    Button,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Pagination,
    Select,
    SelectItem,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure,
} from '@heroui/react';
import {
    Car,
    Download,
    Edit,
    Eye,
    Filter,
    MoreVertical,
    Search,
    Trash2
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    calculateProfit,
    cars,
    formatCurrency
} from '../data/mockData';

const columns = [
  { key: 'car', label: 'Автомобиль', sortable: true },
  { key: 'vin', label: 'VIN', sortable: true },
  { key: 'year', label: 'Год', sortable: true },
  { key: 'mileage', label: 'Пробег', sortable: true },
  { key: 'purchasePrice', label: 'Закупка', sortable: true },
  { key: 'sellingPrice', label: 'Продажа', sortable: true },
  { key: 'profit', label: 'Прибыль', sortable: true },
  { key: 'actions', label: '', sortable: false },
];

const brandOptions = [
  { key: 'all', label: 'Все марки' },
  { key: 'Hyundai', label: 'Hyundai' },
  { key: 'Kia', label: 'Kia' },
  { key: 'Genesis', label: 'Genesis' },
];

export default function CarsList() {
  const [filterValue, setFilterValue] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState({ column: 'car', direction: 'ascending' });
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [selectedCar, setSelectedCar] = useState(null);

  // Фильтрация данных
  const filteredCars = useMemo(() => {
    // Показываем только авто на складе
    let filtered = cars.filter(car => car.status === 'in_stock');

    // Поиск по тексту
    if (filterValue) {
      const search = filterValue.toLowerCase();
      filtered = filtered.filter(
        (car) =>
          car.brand.toLowerCase().includes(search) ||
          car.model.toLowerCase().includes(search) ||
          car.vin.toLowerCase().includes(search) ||
          (car.client && car.client.toLowerCase().includes(search))
      );
    }

    // Фильтр по марке
    if (brandFilter !== 'all') {
      filtered = filtered.filter((car) => car.brand === brandFilter);
    }

    return filtered;
  }, [filterValue, brandFilter]);

  // Сортировка
  const sortedCars = useMemo(() => {
    const sorted = [...filteredCars].sort((a, b) => {
      let cmp = 0;
      
      switch (sortDescriptor.column) {
        case 'car':
          cmp = `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
          break;
        case 'vin':
          cmp = a.vin.localeCompare(b.vin);
          break;
        case 'year':
          cmp = a.year - b.year;
          break;
        case 'mileage':
          cmp = a.mileage - b.mileage;
          break;
        case 'purchasePrice':
          cmp = a.purchasePrice - b.purchasePrice;
          break;
        case 'sellingPrice':
          cmp = a.sellingPrice - b.sellingPrice;
          break;
        case 'profit':
          cmp = calculateProfit(a) - calculateProfit(b);
          break;
        default:
          cmp = 0;
      }

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });

    return sorted;
  }, [filteredCars, sortDescriptor]);

  // Пагинация
  const pages = Math.ceil(sortedCars.length / rowsPerPage);
  const paginatedCars = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedCars.slice(start, end);
  }, [sortedCars, page, rowsPerPage]);

  const handleDelete = (car) => {
    setSelectedCar(car);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    // В реальном приложении здесь будет удаление
    console.log('Удаление автомобиля:', selectedCar?.id);
    onDeleteClose();
  };

  const renderCell = (car, columnKey) => {
    switch (columnKey) {
      case 'car':
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-10 bg-default-200 rounded-lg flex items-center justify-center">
              <Car size={20} className="text-default-400" />
            </div>
            <div>
              <p className="font-medium">{car.brand} {car.model}</p>
              <p className="text-xs text-default-400">{car.color}</p>
            </div>
          </div>
        );
      case 'vin':
        return (
          <p className="font-mono text-xs text-default-600">{car.vin}</p>
        );
      case 'year':
        return <p>{car.year}</p>;
      case 'mileage':
        return <p>{car.mileage.toLocaleString()} км</p>;
      case 'purchasePrice':
        return <p className="font-medium">{formatCurrency(car.purchasePrice)}</p>;
      case 'sellingPrice':
        return <p className="font-medium">{formatCurrency(car.sellingPrice)}</p>;
      case 'profit':
        const profit = calculateProfit(car);
        return (
          <p className={`font-semibold ${profit > 0 ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(profit)}
          </p>
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
                as={Link}
                to={`/cars/${car.id}`}
              >
                Просмотр
              </DropdownItem>
              <DropdownItem key="edit" startContent={<Edit size={16} />}>
                Редактировать
              </DropdownItem>
              <DropdownItem
                key="delete"
                color="danger"
                startContent={<Trash2 size={16} />}
                onPress={() => handleDelete(car)}
              >
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
          <h1 className="text-2xl font-bold">Автомобили</h1>
          <p className="text-default-500">Управление складом автомобилей</p>
        </div>
        <div className="flex gap-2">
          <Button variant="bordered" startContent={<Download size={16} />}>
            Экспорт
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          className="w-full sm:max-w-xs"
          placeholder="Поиск по VIN, марке, модели..."
          startContent={<Search size={18} className="text-default-400" />}
          value={filterValue}
          onValueChange={setFilterValue}
          isClearable
          onClear={() => setFilterValue('')}
        />

        <Select
          className="w-full sm:w-48"
          placeholder="Марка"
          selectedKeys={[brandFilter]}
          onChange={(e) => setBrandFilter(e.target.value)}
        >
          {brandOptions.map((brand) => (
            <SelectItem key={brand.key}>{brand.label}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-default-500">Всего:</span>
          <span className="font-semibold">{cars.length} авто</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-default-500">Найдено:</span>
          <span className="font-semibold">{filteredCars.length} авто</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-default-500">Общая стоимость:</span>
          <span className="font-semibold text-success">
            {formatCurrency(filteredCars.reduce((acc, car) => acc + car.sellingPrice, 0))}
          </span>
        </div>
      </div>

      {/* Table */}
      <Table
        aria-label="Таблица автомобилей"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        bottomContent={
          pages > 1 && (
            <div className="flex justify-between items-center py-2 px-2">
              <Select
                className="w-24"
                size="sm"
                selectedKeys={[String(rowsPerPage)]}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(1);
                }}
              >
                <SelectItem key="5">5</SelectItem>
                <SelectItem key="10">10</SelectItem>
                <SelectItem key="25">25</SelectItem>
                <SelectItem key="50">50</SelectItem>
              </Select>
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
            <TableColumn
              key={column.key}
              allowsSorting={column.sortable}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={paginatedCars} emptyContent="Автомобили не найдены">
          {(car) => (
            <TableRow key={car.id} className="cursor-pointer hover:bg-default-50">
              {(columnKey) => (
                <TableCell>{renderCell(car, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteOpen} 
        onClose={onDeleteClose} 
        classNames={{ 
          base: "rounded-2xl",
          wrapper: "rounded-2xl",
          backdrop: "bg-overlay/50 backdrop-opacity-disabled"
        }}
      >
        <ModalContent className="rounded-2xl">
          <ModalHeader>Подтверждение удаления</ModalHeader>
          <ModalBody>
            <p>
              Вы уверены, что хотите удалить автомобиль{' '}
              <strong>{selectedCar?.brand} {selectedCar?.model}</strong>?
            </p>
            <p className="text-sm text-default-500 mt-2">
              Это действие нельзя отменить.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              Отмена
            </Button>
            <Button color="danger" onPress={confirmDelete}>
              Удалить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
