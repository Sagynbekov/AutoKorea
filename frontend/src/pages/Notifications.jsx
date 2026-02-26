import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Avatar,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  useDisclosure
} from '@heroui/react';
import {
  Bell,
  AlertCircle,
  CheckCircle,
  Clock,
  Car,
  Users,
  DollarSign,
  Calendar,
  Plus,
  X,
  Send,
  Archive
} from 'lucide-react';

// Компонент для создания уведомления
function CreateNotificationModal({ isOpen, onClose, onCreateNotification }) {
  const [formData, setFormData] = useState({
    type: 'info',
    title: '',
    message: '',
    priority: 'medium',
    targetRole: 'all',
    scheduledDate: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.message) return;
    
    const newNotification = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      read: false,
      author: 'Администратор'
    };
    
    onCreateNotification(newNotification);
    setFormData({
      type: 'info',
      title: '',
      message: '',
      priority: 'medium',
      targetRole: 'all',
      scheduledDate: '',
    });
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      classNames={{
        base: "rounded-2xl",
        wrapper: "rounded-2xl",
        backdrop: "bg-overlay/50 backdrop-opacity-disabled"
      }}
    >
      <ModalContent className="rounded-2xl">
        <ModalHeader>
          <div className="flex items-center gap-2">
            <Plus size={20} className="text-primary" />
            <h3 className="text-lg font-semibold">Создать уведомление</h3>
          </div>
        </ModalHeader>
        
        <ModalBody className="gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Тип уведомления"
              selectedKeys={formData.type ? [formData.type] : []}
              onChange={(e) => handleInputChange('type', e.target.value)}
              classNames={{ trigger: "rounded-lg" }}
            >
              <SelectItem key="info" value="info">Информация</SelectItem>
              <SelectItem key="warning" value="warning">Предупреждение</SelectItem>
              <SelectItem key="success" value="success">Успех</SelectItem>
              <SelectItem key="error" value="error">Ошибка</SelectItem>
            </Select>

            <Select
              label="Приоритет"
              selectedKeys={formData.priority ? [formData.priority] : []}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              classNames={{ trigger: "rounded-lg" }}
            >
              <SelectItem key="low" value="low">Низкий</SelectItem>
              <SelectItem key="medium" value="medium">Средний</SelectItem>
              <SelectItem key="high" value="high">Высокий</SelectItem>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Кому отправить"
              selectedKeys={formData.targetRole ? [formData.targetRole] : []}
              onChange={(e) => handleInputChange('targetRole', e.target.value)}
              classNames={{ trigger: "rounded-lg" }}
            >
              <SelectItem key="all" value="all">Всем</SelectItem>
              <SelectItem key="managers" value="managers">Менеджерам</SelectItem>
              <SelectItem key="sales" value="sales">Отдел продаж</SelectItem>
              <SelectItem key="finance" value="finance">Финансовый отдел</SelectItem>
            </Select>

            <Input
              type="datetime-local"
              label="Запланировать на (опционально)"
              value={formData.scheduledDate}
              onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
              classNames={{ inputWrapper: "rounded-lg" }}
            />
          </div>

          <Input
            label="Заголовок"
            placeholder="Заголовок уведомления"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            classNames={{ inputWrapper: "rounded-lg" }}
            isRequired
          />

          <Textarea
            label="Сообщение"
            placeholder="Текст уведомления"
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            classNames={{ inputWrapper: "rounded-lg" }}
            minRows={3}
            isRequired
          />
        </ModalBody>

        <ModalFooter>
          <Button
            variant="bordered"
            onPress={onClose}
            className="rounded-lg"
          >
            Отмена
          </Button>
          <Button
            color="primary"
            startContent={<Send size={16} />}
            onPress={handleSubmit}
            className="rounded-lg"
            isDisabled={!formData.title || !formData.message}
          >
            Отправить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Компонент уведомления
function NotificationItem({ notification, onMarkAsRead, onArchive }) {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertCircle size={16} className="text-warning" />;
      case 'success': return <CheckCircle size={16} className="text-success" />;
      case 'error': return <AlertCircle size={16} className="text-danger" />;
      default: return <Bell size={16} className="text-primary" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'warning': return 'warning';
      case 'success': return 'success';
      case 'error': return 'danger';
      default: return 'primary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Card className={`border ${!notification.read ? 'border-primary/50 bg-primary/5' : 'border-default-200'}`}>
      <CardBody className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3 flex-1">
            <div className="flex-shrink-0 pt-1">
              {getTypeIcon(notification.type)}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className={`font-semibold ${!notification.read ? 'text-primary' : ''}`}>
                    {notification.title}
                  </h4>
                  <p className="text-sm text-default-500">
                    {notification.message}
                  </p>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <Chip size="sm" color={getPriorityColor(notification.priority)} variant="flat">
                    {notification.priority === 'high' ? 'Высокий' : 
                     notification.priority === 'medium' ? 'Средний' : 'Низкий'}
                  </Chip>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-default-400">
                  <span>
                    <Clock size={12} className="inline mr-1" />
                    {new Date(notification.createdAt).toLocaleString('ru-RU')}
                  </span>
                  <span>От: {notification.author}</span>
                </div>

                <div className="flex gap-1">
                  {!notification.read && (
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      onPress={() => onMarkAsRead(notification.id)}
                      className="h-6 px-2 text-xs"
                    >
                      Прочитано
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="flat"
                    color="default"
                    onPress={() => onArchive(notification.id)}
                    className="h-6 px-2 text-xs"
                    startContent={<Archive size={12} />}
                  >
                    Архив
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// Главный компонент системы уведомлений
export default function NotificationSystem() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'warning',
      title: 'Низкий остаток на складе',
      message: 'Количество автомобилей марки Toyota на складе менее 5 единиц',
      priority: 'high',
      targetRole: 'managers',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      author: 'Система'
    },
    {
      id: '2',
      type: 'success',
      title: 'Продажа завершена',
      message: 'Автомобиль Honda Civic 2023 успешно продан клиенту Иванову И.И.',
      priority: 'medium',
      targetRole: 'all',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      read: true,
      author: 'Менеджер Петров'
    },
    {
      id: '3',
      type: 'info',
      title: 'Поступление новых автомобилей',
      message: 'На склад поступили 15 новых автомобилей различных марок',
      priority: 'medium',
      targetRole: 'all',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      read: false,
      author: 'Склад'
    },
    {
      id: '4',
      type: 'error',
      title: 'Проблема с документами',
      message: 'У автомобиля VIN: 1234567890 отсутствуют документы о растаможке',
      priority: 'high',
      targetRole: 'finance',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      read: false,
      author: 'Бухгалтерия'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const handleCreateNotification = (newNotification) => {
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const handleArchive = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'high') return notif.priority === 'high';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.read).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Центр уведомлений</h1>
          <p className="text-default-500">
            Управление уведомлениями и важными событиями
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus size={16} />}
          onPress={onOpen}
          className="rounded-lg"
        >
          Создать уведомление
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-default-200">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bell className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-sm text-default-500">Всего</p>
                <p className="text-xl font-bold">{notifications.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-default-200">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <AlertCircle className="text-warning" size={20} />
              </div>
              <div>
                <p className="text-sm text-default-500">Непрочитанные</p>
                <p className="text-xl font-bold text-warning">{unreadCount}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-default-200">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-danger/10 rounded-lg">
                <AlertCircle className="text-danger" size={20} />
              </div>
              <div>
                <p className="text-sm text-default-500">Высокий приоритет</p>
                <p className="text-xl font-bold text-danger">{highPriorityCount}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-default-200">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="text-success" size={20} />
              </div>
              <div>
                <p className="text-sm text-default-500">Обработанные</p>
                <p className="text-xl font-bold text-success">
                  {notifications.filter(n => n.read).length}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border border-default-200">
        <CardBody className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={filter === 'all' ? 'solid' : 'bordered'}
              color={filter === 'all' ? 'primary' : 'default'}
              onPress={() => setFilter('all')}
              className="rounded-lg"
            >
              Все ({notifications.length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'unread' ? 'solid' : 'bordered'}
              color={filter === 'unread' ? 'warning' : 'default'}
              onPress={() => setFilter('unread')}
              className="rounded-lg"
            >
              Непрочитанные ({unreadCount})
            </Button>
            <Button
              size="sm"
              variant={filter === 'high' ? 'solid' : 'bordered'}
              color={filter === 'high' ? 'danger' : 'default'}
              onPress={() => setFilter('high')}
              className="rounded-lg"
            >
              Высокий приоритет ({highPriorityCount})
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onArchive={handleArchive}
            />
          ))
        ) : (
          <Card className="border border-default-200">
            <CardBody className="p-8 text-center">
              <Bell size={48} className="text-default-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Уведомлений нет</h3>
              <p className="text-default-500">
                {filter === 'all' 
                  ? 'У вас пока нет уведомлений'
                  : `Нет уведомлений в категории "${filter === 'unread' ? 'непрочитанные' : 'высокий приоритет'}"`
                }
              </p>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Create Notification Modal */}
      <CreateNotificationModal
        isOpen={isOpen}
        onClose={onClose}
        onCreateNotification={handleCreateNotification}
      />
    </div>
  );
}