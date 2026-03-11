import React, { useState, useMemo } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  useDisclosure,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Divider,
} from '@heroui/react';
import {
  CheckSquare,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle,
  Play,
  Pause,
  MoreVertical,
  Calendar,
  User,
  Flag,
  Filter,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Моковые данные для задач
const mockTasks = [
  {
    id: 1,
    title: 'Помыть все автомобили на складе',
    description: 'Необходимо провести мойку всех автомобилей в наличии перед выставлением на продажу',
    priority: 'high',
    status: 'pending',
    assignedTo: null,
    createdBy: 'Администратор',
    createdAt: '2026-03-10T10:00:00Z',
    deadline: '2026-03-12T18:00:00Z',
    completedAt: null,
    completedBy: null,
  },
  {
    id: 2,
    title: 'Подготовить Toyota Corolla 2019 к выдаче',
    description: 'Клиент заберет автомобиль сегодня. Необходимо провести финальную подготовку: мойка, заправка, проверка документов.',
    priority: 'urgent',
    status: 'in_progress',
    assignedTo: 'Петр Иванов',
    createdBy: 'Администратор',
    createdAt: '2026-03-11T08:30:00Z',
    deadline: '2026-03-11T16:00:00Z',
    completedAt: null,
    completedBy: null,
  },
  {
    id: 3,
    title: 'Проверить документы на Hyundai Sonata',
    description: 'Убедиться что все документы готовы для регистрации',
    priority: 'medium',
    status: 'completed',
    assignedTo: 'Алексей Ким',
    createdBy: 'Алексей Ким',
    createdAt: '2026-03-10T14:00:00Z',
    deadline: '2026-03-11T12:00:00Z',
    completedAt: '2026-03-11T11:30:00Z',
    completedBy: 'Алексей Ким',
  },
  {
    id: 4,
    title: 'Обновить прайс-лист на сайте',
    description: 'Загрузить новые цены по прибывшим автомобилям',
    priority: 'low',
    status: 'pending_approval',
    assignedTo: 'Мария Сидорова',
    createdBy: 'Администратор',
    createdAt: '2026-03-09T16:00:00Z',
    deadline: '2026-03-12T10:00:00Z',
    completedAt: '2026-03-11T09:00:00Z',
    completedBy: 'Мария Сидорова',
  },
  {
    id: 5,
    title: 'Проверить техническое состояние Kia K5',
    description: 'Провести диагностику двигателя и ходовой части после доставки',
    priority: 'high',
    status: 'pending',
    assignedTo: null,
    createdBy: 'Администратор',
    createdAt: '2026-03-11T09:00:00Z',
    deadline: '2026-03-13T17:00:00Z',
    completedAt: null,
    completedBy: null,
  },
  {
    id: 6,
    title: 'Подготовить отчет по продажам за февраль',
    description: 'Сформировать детальный отчет с анализом продаж и прибыли за предыдущий месяц',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'Анна Петрова',
    createdBy: 'Администратор',
    createdAt: '2026-03-08T14:00:00Z',
    deadline: '2026-03-15T12:00:00Z',
    completedAt: null,
    completedBy: null,
  },
];

// Статусы задач
const taskStatuses = {
  pending: { label: 'Не назначено', color: 'default', icon: Clock },
  in_progress: { label: 'В процессе', color: 'primary', icon: Play },
  completed: { label: 'Выполнено', color: 'success', icon: CheckCircle },
  pending_approval: { label: 'Ожидает подтверждения', color: 'warning', icon: AlertCircle },
};

// Приоритеты задач
const taskPriorities = {
  low: { label: 'Низкий', color: 'default' },
  medium: { label: 'Средний', color: 'primary' },
  high: { label: 'Высокий', color: 'warning' },
  urgent: { label: 'Срочно', color: 'danger' },
};

export default function Tasks() {
  const { isAdmin, user } = useAuth();
  const [tasks, setTasks] = useState(mockTasks);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();

  // Форма для создания новой задачи
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    deadline: '',
  });

  // Фильтрация и поиск задач
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Фильтр по статусу
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    // Фильтр по приоритету
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Поиск по названию и описанию
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tasks, filterStatus, filterPriority, searchQuery]);

  // Создание новой задачи (только для админов)
  const handleCreateTask = () => {
    const task = {
      id: tasks.length + 1,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: 'pending',
      assignedTo: null,
      createdBy: user.name,
      createdAt: new Date().toISOString(),
      deadline: newTask.deadline ? new Date(newTask.deadline).toISOString() : null,
      completedAt: null,
      completedBy: null,
    };

    setTasks([task, ...tasks]);
    setNewTask({ title: '', description: '', priority: 'medium', deadline: '' });
    onCreateClose();
  };

  // Взять задачу в работу
  const handleTakeTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'in_progress', assignedTo: user.name }
        : task
    ));
  };

  // Завершить задачу
  const handleCompleteTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: 'pending_approval', 
            completedAt: new Date().toISOString(),
            completedBy: user.name 
          }
        : task
    ));
  };

  // Подтвердить выполнение (только для админов)
  const handleApproveTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' }
        : task
    ));
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return 'Не указан';
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Проверка просроченности
  const isOverdue = (deadline, status) => {
    if (!deadline || status === 'completed') return false;
    return new Date(deadline) < new Date();
  };

  const openTaskDetails = (task) => {
    setSelectedTask(task);
    onDetailsOpen();
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и основные действия */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Управление задачами</h1>
          <p className="text-default-500 mt-1">Координация работы между сотрудниками</p>
        </div>
        
        {isAdmin && (
          <Button
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            onPress={onCreateOpen}
          >
            Создать задачу
          </Button>
        )}
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-default-500">Ожидают</p>
                <p className="text-xl font-semibold">{tasks.filter(t => t.status === 'pending').length}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Play className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-default-500">В процессе</p>
                <p className="text-xl font-semibold">{tasks.filter(t => t.status === 'in_progress').length}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-default-500">На проверке</p>
                <p className="text-xl font-semibold">{tasks.filter(t => t.status === 'pending_approval').length}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-default-500">Выполнено</p>
                <p className="text-xl font-semibold">{tasks.filter(t => t.status === 'completed').length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Фильтры и поиск */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <Input
              placeholder="Поиск по названию задачи..."
              startContent={<Search className="w-4 h-4" />}
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex-1"
            />
            
            <Select
              placeholder="Статус"
              selectedKeys={[filterStatus]}
              onSelectionChange={(keys) => setFilterStatus([...keys][0])}
              className="w-full lg:w-48"
            >
              <SelectItem key="all">Все статусы</SelectItem>
              <SelectItem key="pending">Не назначено</SelectItem>
              <SelectItem key="in_progress">В процессе</SelectItem>
              <SelectItem key="pending_approval">На проверке</SelectItem>
              <SelectItem key="completed">Выполнено</SelectItem>
            </Select>

            <Select
              placeholder="Приоритет"
              selectedKeys={[filterPriority]}
              onSelectionChange={(keys) => setFilterPriority([...keys][0])}
              className="w-full lg:w-48"
            >
              <SelectItem key="all">Все приоритеты</SelectItem>
              <SelectItem key="urgent">Срочно</SelectItem>
              <SelectItem key="high">Высокий</SelectItem>
              <SelectItem key="medium">Средний</SelectItem>
              <SelectItem key="low">Низкий</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Список задач */}
      <Card>
        <Table aria-label="Таблица задач">
          <TableHeader>
            <TableColumn>ЗАДАЧА</TableColumn>
            <TableColumn>ПРИОРИТЕТ</TableColumn>
            <TableColumn>СТАТУС</TableColumn>
            <TableColumn>ИСПОЛНИТЕЛЬ</TableColumn>
            <TableColumn>ДЕДЛАЙН</TableColumn>
            <TableColumn>ДЕЙСТВИЯ</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => {
              const status = taskStatuses[task.status];
              const priority = taskPriorities[task.priority];
              const StatusIcon = status.icon;
              
              return (
                <TableRow key={task.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span 
                        className="font-medium cursor-pointer hover:text-primary"
                        onClick={() => openTaskDetails(task)}
                      >
                        {task.title}
                      </span>
                      <span className="text-xs text-default-400">
                        {task.description.length > 50 
                          ? `${task.description.substring(0, 50)}...` 
                          : task.description
                        }
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={priority.color}
                      size="sm"
                      variant="flat"
                    >
                      {priority.label}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={status.color}
                      size="sm"
                      variant="flat"
                      startContent={<StatusIcon className="w-3 h-3" />}
                    >
                      {status.label}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {task.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={task.assignedTo} size="sm" />
                        <span className="text-sm">{task.assignedTo}</span>
                      </div>
                    ) : (
                      <span className="text-default-400 text-sm">Не назначен</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className={`text-sm ${isOverdue(task.deadline, task.status) ? 'text-danger' : ''}`}>
                        {formatDate(task.deadline)}
                      </span>
                      {isOverdue(task.deadline, task.status) && (
                        <Chip color="danger" size="sm" variant="flat">
                          Просрочено
                        </Chip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        {/* Взять в работу (для сотрудников) */}
                        {!isAdmin && task.status === 'pending' && (
                          <DropdownItem
                            key="take"
                            startContent={<Play className="w-4 h-4" />}
                            onPress={() => handleTakeTask(task.id)}
                          >
                            Взять в работу
                          </DropdownItem>
                        )}
                        
                        {/* Завершить задачу */}
                        {(task.assignedTo === user.name && task.status === 'in_progress') && (
                          <DropdownItem
                            key="complete"
                            startContent={<CheckCircle className="w-4 h-4" />}
                            onPress={() => handleCompleteTask(task.id)}
                          >
                            Завершить
                          </DropdownItem>
                        )}
                        
                        {/* Подтвердить выполнение (для админов) */}
                        {isAdmin && task.status === 'pending_approval' && (
                          <DropdownItem
                            key="approve"
                            startContent={<CheckCircle className="w-4 h-4" />}
                            onPress={() => handleApproveTask(task.id)}
                            color="success"
                          >
                            Подтвердить выполнение
                          </DropdownItem>
                        )}
                        
                        <DropdownItem
                          key="details"
                          startContent={<User className="w-4 h-4" />}
                          onPress={() => openTaskDetails(task)}
                        >
                          Подробности
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Модальное окно создания задачи */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="2xl">
        <ModalContent>
          <ModalHeader>Создать новую задачу</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Название задачи"
                placeholder="Введите название задачи"
                value={newTask.title}
                onValueChange={(value) => setNewTask({...newTask, title: value})}
                isRequired
              />
              
              <Textarea
                label="Описание"
                placeholder="Подробное описание задачи"
                value={newTask.description}
                onValueChange={(value) => setNewTask({...newTask, description: value})}
                minRows={3}
              />
              
              <Select
                label="Приоритет"
                selectedKeys={[newTask.priority]}
                onSelectionChange={(keys) => setNewTask({...newTask, priority: [...keys][0]})}
              >
                <SelectItem key="low">Низкий</SelectItem>
                <SelectItem key="medium">Средний</SelectItem>
                <SelectItem key="high">Высокий</SelectItem>
                <SelectItem key="urgent">Срочно</SelectItem>
              </Select>
              
              <Input
                type="datetime-local"
                label="Дедлайн"
                value={newTask.deadline}
                onValueChange={(value) => setNewTask({...newTask, deadline: value})}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCreateClose}>
              Отмена
            </Button>
            <Button 
              color="primary" 
              onPress={handleCreateTask}
              isDisabled={!newTask.title.trim()}
            >
              Создать задачу
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Модальное окно деталей задачи */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="2xl">
        <ModalContent>
          {selectedTask && (
            <>
              <ModalHeader>Детали задачи</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedTask.title}</h3>
                    <p className="text-default-700 mt-2">{selectedTask.description}</p>
                  </div>
                  
                  <Divider />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-default-500">Приоритет</p>
                      <Chip color={taskPriorities[selectedTask.priority].color} variant="flat">
                        {taskPriorities[selectedTask.priority].label}
                      </Chip>
                    </div>
                    
                    <div>
                      <p className="text-sm text-default-500">Статус</p>
                      <Chip color={taskStatuses[selectedTask.status].color} variant="flat">
                        {taskStatuses[selectedTask.status].label}
                      </Chip>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-default-500">Создана</p>
                      <p className="text-sm">{formatDate(selectedTask.createdAt)}</p>
                      <p className="text-xs text-default-400">Автор: {selectedTask.createdBy}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-default-500">Дедлайн</p>
                      <p className="text-sm">{formatDate(selectedTask.deadline)}</p>
                    </div>
                  </div>
                  
                  {selectedTask.assignedTo && (
                    <div>
                      <p className="text-sm text-default-500">Исполнитель</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar name={selectedTask.assignedTo} size="sm" />
                        <span>{selectedTask.assignedTo}</span>
                      </div>
                    </div>
                  )}
                  
                  {selectedTask.completedAt && (
                    <div>
                      <p className="text-sm text-default-500">Выполнена</p>
                      <p className="text-sm">{formatDate(selectedTask.completedAt)}</p>
                      {selectedTask.completedBy && (
                        <p className="text-xs text-default-400">Исполнитель: {selectedTask.completedBy}</p>
                      )}
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onDetailsClose}>
                  Закрыть
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}