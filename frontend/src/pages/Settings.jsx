import { useState, useEffect } from 'react';
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
  Calculator as CalculatorIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { staffService } from '../services';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Профиль сотрудника - загрузка данных из Firestore
function StaffProfileSettings() {
  const { user } = useAuth();
  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const loadStaffData = async () => {
      try {
        const staff = await staffService.getAllStaff();
        const currentStaff = staff.find(s => s.passportNumber === user.passportNumber);
        if (currentStaff) {
          setStaffData(currentStaff);
          setName(currentStaff.name || '');
          setEmail(currentStaff.email || '');
          setPhone(currentStaff.phone || '');
        }
      } catch (error) {
        console.error('Error loading staff data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.passportNumber) {
      loadStaffData();
    }
  }, [user]);

  const handleSave = async () => {
    if (!staffData?.id) return;
    
    setSaving(true);
    try {
      await staffService.updateStaff(staffData.id, {
        name,
        email,
        phone,
      });
      alert('Данные успешно сохранены');
    } catch (error) {
      console.error('Error saving staff data:', error);
      alert('Ошибка при сохранении данных');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar
            name={name}
            className="w-24 h-24 text-2xl bg-primary"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-default-500">Сотрудник</p>
        </div>
      </div>

      <Divider />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Имя"
          value={name}
          onValueChange={setName}
          variant="bordered"
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onValueChange={setEmail}
          variant="bordered"
        />
        <Input
          label="Телефон"
          value={phone}
          onValueChange={setPhone}
          variant="bordered"
        />
        <Input
          label="ИНН"
          value={user?.passportNumber || ''}
          isDisabled
          variant="bordered"
        />
      </div>

      <Button 
        color="primary" 
        startContent={<Save size={16} />}
        onPress={handleSave}
        isLoading={saving}
      >
        Сохранить изменения
      </Button>
    </div>
  );
}

// Настройки калькулятора для админа
function CalculatorSettings() {
  const [settings, setSettings] = useState({
    exchangeRate: 1300, // Курс вон на доллар
    deliveryEconomy: 500, // Тариф эконом ($)
    deliveryStandard: 800, // Тариф стандарт ($)
    deliveryExpress: 1200, // Тариф экспресс ($)
    ageRate: 50, // Цена за возраст автомобиля ($)
    customsDuty: 15, // Таможенная пошлина (%)
    vat: 12, // НДС (%)
    recyclingFee: 3000, // Утилизационный сбор ($)
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'calculator');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings({ ...settings, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Error loading calculator settings:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'settings', 'calculator');
      await setDoc(docRef, settings);
      alert('Настройки калькулятора сохранены');
    } catch (error) {
      console.error('Error saving calculator settings:', error);
      alert('Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Настройки калькулятора</h3>
        <p className="text-sm text-default-500">
          Управление параметрами для расчета стоимости автомобилей
        </p>
      </div>

      <Divider />

      {/* Курс валюты */}
      <div>
        <h4 className="font-semibold mb-3 text-default-700">Курс валюты</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Курс вон на доллар"
            type="number"
            value={settings.exchangeRate.toString()}
            onValueChange={(value) => setSettings({ ...settings, exchangeRate: parseFloat(value) || 0 })}
            variant="bordered"
            startContent={<span className="text-default-400">₩</span>}
            endContent={<span className="text-default-400">= $1</span>}
            description="Текущий курс корейской воны к доллару"
          />
        </div>
      </div>

      <Divider />

      {/* Тарифы доставки */}
      <div>
        <h4 className="font-semibold mb-3 text-default-700">Тарифы доставки</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Эконом"
            type="number"
            value={settings.deliveryEconomy.toString()}
            onValueChange={(value) => setSettings({ ...settings, deliveryEconomy: parseFloat(value) || 0 })}
            variant="bordered"
            startContent={<span className="text-default-400">$</span>}
            description="Стандартная доставка"
          />
          <Input
            label="Стандарт"
            type="number"
            value={settings.deliveryStandard.toString()}
            onValueChange={(value) => setSettings({ ...settings, deliveryStandard: parseFloat(value) || 0 })}
            variant="bordered"
            startContent={<span className="text-default-400">$</span>}
            description="Ускоренная доставка"
          />
          <Input
            label="Экспресс"
            type="number"
            value={settings.deliveryExpress.toString()}
            onValueChange={(value) => setSettings({ ...settings, deliveryExpress: parseFloat(value) || 0 })}
            variant="bordered"
            startContent={<span className="text-default-400">$</span>}
            description="Срочная доставка"
          />
        </div>
      </div>

      <Divider />

      {/* Возраст автомобиля */}
      <div>
        <h4 className="font-semibold mb-3 text-default-700">Возраст автомобиля</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Цена за год возраста"
            type="number"
            value={settings.ageRate.toString()}
            onValueChange={(value) => setSettings({ ...settings, ageRate: parseFloat(value) || 0 })}
            variant="bordered"
            startContent={<span className="text-default-400">$</span>}
            description="Доплата за каждый год возраста авто"
          />
        </div>
      </div>

      <Divider />

      {/* Налоги и сборы */}
      <div>
        <h4 className="font-semibold mb-3 text-default-700">Налоги и сборы</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Таможенная пошлина"
            type="number"
            step="0.1"
            value={settings.customsDuty.toString()}
            onValueChange={(value) => setSettings({ ...settings, customsDuty: parseFloat(value) || 0 })}
            variant="bordered"
            endContent={<span className="text-default-400">%</span>}
            description="Процент от стоимости авто"
          />
          <Input
            label="НДС"
            type="number"
            step="0.1"
            value={settings.vat.toString()}
            onValueChange={(value) => setSettings({ ...settings, vat: parseFloat(value) || 0 })}
            variant="bordered"
            endContent={<span className="text-default-400">%</span>}
            description="Налог на добавленную стоимость"
          />
          <Input
            label="Утилизационный сбор"
            type="number"
            value={settings.recyclingFee.toString()}
            onValueChange={(value) => setSettings({ ...settings, recyclingFee: parseFloat(value) || 0 })}
            variant="bordered"
            startContent={<span className="text-default-400">$</span>}
            description="Фиксированный сбор"
          />
        </div>
      </div>

      <Divider />

      {/* Предварительный расчет */}
      <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
        <h4 className="font-semibold mb-2 text-primary">Предварительный расчет</h4>
        <p className="text-sm text-default-600 mb-3">
          Для автомобиля 2020 года стоимостью $20,000:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-default-500 mb-2">Доставка:</p>
            <ul className="text-sm text-default-600 space-y-1">
              <li>• Эконом: ${settings.deliveryEconomy.toLocaleString()}</li>
              <li>• Стандарт: ${settings.deliveryStandard.toLocaleString()}</li>
              <li>• Экспресс: ${settings.deliveryExpress.toLocaleString()}</li>
            </ul>
          </div>
          <div>
            <p className="text-xs text-default-500 mb-2">Налоги и сборы:</p>
            <ul className="text-sm text-default-600 space-y-1">
              <li>• Возраст (4 года): ${(settings.ageRate * 4).toLocaleString()}</li>
              <li>• Таможенная пошлина: ${(20000 * settings.customsDuty / 100).toLocaleString()}</li>
              <li>• НДС: ${(20000 * settings.vat / 100).toLocaleString()}</li>
              <li>• Утилизационный сбор: ${settings.recyclingFee.toLocaleString()}</li>
            </ul>
          </div>
        </div>
      </div>

      <Button 
        color="primary" 
        startContent={<Save size={16} />}
        onPress={handleSave}
        isLoading={saving}
        size="lg"
      >
        Сохранить настройки
      </Button>
    </div>
  );
}

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
  const { isStaff } = useAuth();

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

      {!isStaff && (
        <>
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
        </>
      )}
    </div>
  );
}

export default function Settings({ isDark, setIsDark }) {
  const { isAdmin, isStaff } = useAuth();

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
            {isStaff && (
              <Tab
                key="profile"
                title={
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>Профиль</span>
                  </div>
                }
              >
                <StaffProfileSettings />
              </Tab>
            )}
            
            {isAdmin && (
              <Tab
                key="calculator"
                title={
                  <div className="flex items-center gap-2">
                    <CalculatorIcon size={16} />
                    <span>Калькулятор</span>
                  </div>
                }
              >
                <CalculatorSettings />
              </Tab>
            )}
            
            <Tab
              key="appearance-security"
              title={
                <div className="flex items-center gap-2">
                  <Palette size={16} />
                  <span>Внешний вид{!isStaff && ' и безопасность'}</span>
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
