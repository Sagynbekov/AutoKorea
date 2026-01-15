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

function AppearanceAndSecuritySettings({ isDark, setIsDark }) {
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
              key="appearance-security"
              title={
                <div className="flex items-center gap-2">
                  <Palette size={16} />
                  <span>Внешний вид и безопасность</span>
                </div>
              }
            >
              <AppearanceAndSecuritySettings isDark={isDark} setIsDark={setIsDark} />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
