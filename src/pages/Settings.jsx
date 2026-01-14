import { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Switch,
  Divider,
  Select,
  SelectItem,
  Avatar,
  Tabs,
  Tab,
} from '@heroui/react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Save,
  Camera,
} from 'lucide-react';

function ProfileSettings() {
  const [name, setName] = useState('Алексей Ким');
  const [email, setEmail] = useState('alexey.kim@autokorea.com');
  const [phone, setPhone] = useState('+7 (999) 111-22-33');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar
            name="Алексей Ким"
            className="w-24 h-24 text-2xl bg-primary"
          />
          <Button
            isIconOnly
            size="sm"
            className="absolute bottom-0 right-0 bg-content1 shadow-lg"
          >
            <Camera size={14} />
          </Button>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Алексей Ким</h3>
          <p className="text-default-500">Старший менеджер</p>
        </div>
      </div>

      <Divider />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Имя"
          value={name}
          onValueChange={setName}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onValueChange={setEmail}
        />
        <Input
          label="Телефон"
          value={phone}
          onValueChange={setPhone}
        />
        <Select label="Роль" defaultSelectedKeys={['manager']}>
          <SelectItem key="admin">Администратор</SelectItem>
          <SelectItem key="manager">Менеджер</SelectItem>
          <SelectItem key="accountant">Бухгалтер</SelectItem>
        </Select>
      </div>

      <Button color="primary" startContent={<Save size={16} />}>
        Сохранить изменения
      </Button>
    </div>
  );
}

function NotificationSettings() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  const notifications = [
    { key: 'new_order', label: 'Новые заказы', description: 'Уведомления о новых заказах от клиентов' },
    { key: 'status_change', label: 'Изменение статуса', description: 'Когда статус авто меняется' },
    { key: 'payment', label: 'Оплаты', description: 'Уведомления о получении оплаты' },
    { key: 'arrival', label: 'Прибытие авто', description: 'Когда автомобиль прибывает на склад' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Каналы уведомлений</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-default-50 rounded-lg">
            <div>
              <p className="font-medium">Email уведомления</p>
              <p className="text-sm text-default-500">Получать уведомления на почту</p>
            </div>
            <Switch isSelected={emailNotif} onValueChange={setEmailNotif} />
          </div>
          <div className="flex items-center justify-between p-4 bg-default-50 rounded-lg">
            <div>
              <p className="font-medium">Push уведомления</p>
              <p className="text-sm text-default-500">Уведомления в браузере</p>
            </div>
            <Switch isSelected={pushNotif} onValueChange={setPushNotif} />
          </div>
          <div className="flex items-center justify-between p-4 bg-default-50 rounded-lg">
            <div>
              <p className="font-medium">SMS уведомления</p>
              <p className="text-sm text-default-500">Важные уведомления по SMS</p>
            </div>
            <Switch isSelected={smsNotif} onValueChange={setSmsNotif} />
          </div>
        </div>
      </div>

      <Divider />

      <div className="space-y-4">
        <h3 className="font-semibold">Типы уведомлений</h3>
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif.key} className="flex items-center justify-between p-4 bg-default-50 rounded-lg">
              <div>
                <p className="font-medium">{notif.label}</p>
                <p className="text-sm text-default-500">{notif.description}</p>
              </div>
              <Switch defaultSelected />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings({ isDark, setIsDark }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Тема оформления</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card
            isPressable
            className={`border-2 ${!isDark ? 'border-primary' : 'border-default-200'}`}
            onPress={() => setIsDark(false)}
          >
            <CardBody className="p-4 text-center">
              <div className="w-full h-20 bg-white border rounded-lg mb-3" />
              <p className="font-medium">Светлая тема</p>
            </CardBody>
          </Card>
          <Card
            isPressable
            className={`border-2 ${isDark ? 'border-primary' : 'border-default-200'}`}
            onPress={() => setIsDark(true)}
          >
            <CardBody className="p-4 text-center">
              <div className="w-full h-20 bg-zinc-900 border border-zinc-700 rounded-lg mb-3" />
              <p className="font-medium">Темная тема</p>
            </CardBody>
          </Card>
        </div>
      </div>

      <Divider />

      <div className="space-y-4">
        <h3 className="font-semibold">Региональные настройки</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select label="Язык" defaultSelectedKeys={['ru']}>
            <SelectItem key="ru">Русский</SelectItem>
            <SelectItem key="en">English</SelectItem>
            <SelectItem key="ko">한국어</SelectItem>
          </Select>
          <Select label="Валюта по умолчанию" defaultSelectedKeys={['usd']}>
            <SelectItem key="usd">USD ($)</SelectItem>
            <SelectItem key="rub">RUB (₽)</SelectItem>
            <SelectItem key="krw">KRW (₩)</SelectItem>
          </Select>
          <Select label="Часовой пояс" defaultSelectedKeys={['msk']}>
            <SelectItem key="msk">Москва (UTC+3)</SelectItem>
            <SelectItem key="vlad">Владивосток (UTC+10)</SelectItem>
            <SelectItem key="seoul">Сеул (UTC+9)</SelectItem>
          </Select>
          <Select label="Формат даты" defaultSelectedKeys={['dmy']}>
            <SelectItem key="dmy">DD.MM.YYYY</SelectItem>
            <SelectItem key="mdy">MM/DD/YYYY</SelectItem>
            <SelectItem key="ymd">YYYY-MM-DD</SelectItem>
          </Select>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Изменить пароль</h3>
        <div className="space-y-4 max-w-md">
          <Input
            label="Текущий пароль"
            type="password"
          />
          <Input
            label="Новый пароль"
            type="password"
          />
          <Input
            label="Подтвердите пароль"
            type="password"
          />
          <Button color="primary">Изменить пароль</Button>
        </div>
      </div>

      <Divider />

      <div className="space-y-4">
        <h3 className="font-semibold">Двухфакторная аутентификация</h3>
        <div className="flex items-center justify-between p-4 bg-default-50 rounded-lg">
          <div>
            <p className="font-medium">2FA через SMS</p>
            <p className="text-sm text-default-500">Дополнительная защита при входе</p>
          </div>
          <Switch />
        </div>
      </div>

      <Divider />

      <div className="space-y-4">
        <h3 className="font-semibold">Активные сессии</h3>
        <div className="p-4 bg-default-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Текущая сессия</p>
              <p className="text-sm text-default-500">Windows • Chrome • Москва</p>
            </div>
            <span className="text-xs text-success">Активна</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Settings({ isDark, setIsDark }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Настройки</h1>
        <p className="text-default-500">Управление профилем и системой</p>
      </div>

      <Card className="border border-default-200">
        <CardBody className="p-0">
          <Tabs 
            aria-label="Настройки" 
            variant="underlined"
            classNames={{
              tabList: "px-6 pt-4 border-b border-default-200",
              panel: "p-6",
            }}
          >
            <Tab
              key="profile"
              title={
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>Профиль</span>
                </div>
              }
            >
              <ProfileSettings />
            </Tab>
            <Tab
              key="notifications"
              title={
                <div className="flex items-center gap-2">
                  <Bell size={16} />
                  <span>Уведомления</span>
                </div>
              }
            >
              <NotificationSettings />
            </Tab>
            <Tab
              key="appearance"
              title={
                <div className="flex items-center gap-2">
                  <Palette size={16} />
                  <span>Внешний вид</span>
                </div>
              }
            >
              <AppearanceSettings isDark={isDark} setIsDark={setIsDark} />
            </Tab>
            <Tab
              key="security"
              title={
                <div className="flex items-center gap-2">
                  <Shield size={16} />
                  <span>Безопасность</span>
                </div>
              }
            >
              <SecuritySettings />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
