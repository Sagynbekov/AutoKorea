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
  Spinner,
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
  X,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks, useTaskOperations } from '../hooks/useTasks';

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
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Хуки для работы с данными
  const { tasks, loading, error, refetch } = useTasks();
  const { 
    createTask, 
    takeTask, 
    completeTask, 
    approveTask, 
    rejectTask, 
    deleteTask,
    loading: operationLoading 
  } = useTaskOperations();
  
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
  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;
    
    try {
      await createTask({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        deadline: newTask.deadline || null,
        createdBy: user.name,
      });
      
      setNewTask({ title: '', description: '', priority: 'medium', deadline: '' });
      onCreateClose();
      refetch(); // Обновляем список задач
    } catch (error) {
      console.error('Error creating task:', error);
      // Здесь можно добавить уведомление об ошибке
    }
  };

  // Взять задачу в работу
  const handleTakeTask = async (taskId) => {
    try {
      await takeTask(taskId, user.name);
      refetch();
    } catch (error) {
      console.error('Error taking task:', error);
    }
  };

  // Завершить задачу
  const handleCompleteTask = async (taskId) => {
    try {
      await completeTask(taskId, user.name);
      refetch();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  // Подтвердить выполнение (только для админов)
  const handleApproveTask = async (taskId) => {
    try {
      await approveTask(taskId);
      refetch();
    } catch (error) {
      console.error('Error approving task:', error);
    }
  };

  // Отклонить выполнение (только для админов)
  const handleRejectTask = async (taskId, reason = 'Требуется доработка') => {
    try {
      await rejectTask(taskId, reason);
      refetch();
    } catch (error) {
      console.error('Error rejecting task:', error);
    }
  };

  // Удалить задачу (только для админов)
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту задачу?')) return;
    
    try {
      await deleteTask(taskId);
      refetch();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
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

  // Показать загрузку если данные загружаются
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // Показать ошибку если что-то пошло не так
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="w-12 h-12 text-danger" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-danger">Ошибка загрузки</h3>
          <p className="text-default-500">{error.message}</p>
          <Button 
            color="primary" 
            startContent={<RefreshCw className="w-4 h-4" />}
            onPress={refetch}
            className="mt-4"
          >
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Управление задачами</h1>
          <p className="text-default-500 mt-1">Координация работы между сотрудниками</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="light"
            startContent={<RefreshCw className="w-4 h-4" />}
            onPress={refetch}
            isLoading={loading}
          >
            Обновить
          </Button>
          
          {isAdmin && (
            <Button
              color="primary"
              startContent={<Plus className="w-4 h-4" />}
              onPress={onCreateOpen}
              isLoading={operationLoading}
            >
              Создать задачу
            </Button>
          )}
        </div>
      </div>

      {/* Особое уведомление для админов о задачах на подтверждении */}
      {isAdmin && tasks.filter(t => t.status === 'pending_approval').length > 0 && (
        <Card className="border-warning-200 bg-warning-50">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-warning-600">
                  Задачи ожидают вашего подтверждения
                </h3>
                <p className="text-sm text-warning-500">
                  {tasks.filter(t => t.status === 'pending_approval').length} задач(и) выполнены и ждут проверки
                </p>
              </div>
              <Button
                size="sm"
                color="warning"
                variant="flat"
                onPress={() => setFilterStatus('pending_approval')}
              >
                Посмотреть
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

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
                <div className="flex items-center gap-2">
                  <p className="text-xl font-semibold">{tasks.filter(t => t.status === 'pending_approval').length}</p>
                  {tasks.filter(t => t.status === 'pending_approval').length > 0 && isAdmin && (
                    <Chip color="warning" size="sm" variant="flat">
                      Требует внимания
                    </Chip>
                  )}
                </div>
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
                <div className="flex items-center gap-2">
                  <p className="text-xl font-semibold">{tasks.filter(t => t.status === 'pending_approval').length}</p>
                  {tasks.filter(t => t.status === 'pending_approval').length > 0 && isAdmin && (
                    <Chip color="warning" size="sm" variant="flat">
                      Требует внимания
                    </Chip>
                  )}
                </div>
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
        {filteredTasks.length === 0 ? (
          <CardBody className="text-center py-12">
            <CheckSquare className="w-16 h-16 text-default-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-default-600 mb-2">
              {searchQuery || filterStatus !== 'all' || filterPriority !== 'all' 
                ? 'Задачи не найдены' 
                : 'Задач пока нет'
              }
            </h3>
            <p className="text-default-400 mb-4">
              {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Попробуйте изменить фильтры поиска'
                : isAdmin 
                  ? 'Создайте первую задачу для команды'
                  : 'Пока что новых задач нет'
              }
            </p>
            {isAdmin && !searchQuery && filterStatus === 'all' && filterPriority === 'all' && (
              <Button
                color="primary"
                startContent={<Plus className="w-4 h-4" />}
                onPress={onCreateOpen}
              >
                Создать первую задачу
              </Button>
            )}
          </CardBody>
        ) : (
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
                      className={task.status === 'pending_approval' && isAdmin ? 'animate-pulse' : ''}
                    >
                      {status.label}
                      {task.status === 'pending_approval' && isAdmin && (
                        <span className="ml-1">⚠️</span>
                      )}
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
                    <div className="flex items-center gap-2">
                      {/* Специальные кнопки для задач на подтверждении (только для админов) */}
                      {isAdmin && task.status === 'pending_approval' && (
                        <>
                          <Button
                            size="sm"
                            color="success"
                            variant="flat"
                            startContent={<CheckCircle className="w-3 h-3" />}
                            onPress={() => handleApproveTask(task.id)}
                            isLoading={operationLoading}
                          >
                            Подтвердить
                          </Button>
                          <Button
                            size="sm"
                            color="warning"
                            variant="flat"
                            startContent={<X className="w-3 h-3" />}
                            onPress={() => handleRejectTask(task.id)}
                            isLoading={operationLoading}
                          >
                            Отклонить
                          </Button>
                        </>
                      )}
                      
                      {/* Обычные действия в dropdown */}
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
                        
                        {/* Подтвердить выполнение (для админов) - в dropdown только если кнопки не показаны */}
                        {isAdmin && task.status === 'pending_approval' && (
                          <>
                            <DropdownItem
                              key="approve"
                              startContent={<CheckCircle className="w-4 h-4" />}
                              onPress={() => handleApproveTask(task.id)}
                              color="success"
                            >
                              Подтвердить выполнение
                            </DropdownItem>
                            <DropdownItem
                              key="reject"
                              startContent={<X className="w-4 h-4" />}
                              onPress={() => handleRejectTask(task.id)}
                              color="warning"
                            >
                              Отклонить
                            </DropdownItem>
                          </>
                        )}
                        
                        <DropdownItem
                          key="details"
                          startContent={<User className="w-4 h-4" />}
                          onPress={() => openTaskDetails(task)}
                        >
                          Подробности
                        </DropdownItem>
                        
                        {/* Удалить задачу (только для админов) */}
                        {isAdmin && (
                          <DropdownItem
                            key="delete"
                            startContent={<X className="w-4 h-4" />}
                            onPress={() => handleDeleteTask(task.id)}
                            color="danger"
                          >
                            Удалить
                          </DropdownItem>
                        )}
                      </DropdownMenu>
                      </Dropdown>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          </Table>
        )}
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
                placeholder="Выберите дату и время"
                value={newTask.deadline}
                onValueChange={(value) => setNewTask({...newTask, deadline: value})}
                description="Необязательно - оставьте пустым если дедлайн не требуется"
                classNames={{
                  input: "text-small",
                  inputWrapper: "h-unit-12"
                }}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCreateClose} isDisabled={operationLoading}>
              Отмена
            </Button>
            <Button 
              color="primary" 
              onPress={handleCreateTask}
              isDisabled={!newTask.title.trim() || operationLoading}
              isLoading={operationLoading}
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