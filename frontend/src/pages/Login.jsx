import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Input, Button, Tabs, Tab } from '@heroui/react';
import { Lock, User, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { staffService } from '../services';

export default function Login() {
  const [activeTab, setActiveTab] = useState('admin');
  const [adminCredentials, setAdminCredentials] = useState({ login: '', password: '' });
  const [staffCredentials, setStaffCredentials] = useState({ inn: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Загружаем список сотрудников при монтировании компонента
  useEffect(() => {
    const loadStaff = async () => {
      try {
        const data = await staffService.getAllStaff();
        setStaffList(data);
      } catch (err) {
        console.error('Error loading staff:', err);
      }
    };
    loadStaff();
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(
        { login: adminCredentials.login, password: adminCredentials.password },
        staffList
      );

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(
        { login: staffCredentials.inn, password: staffCredentials.password },
        staffList
      );

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardBody className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <LogIn size={32} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-center">AutoKorea</h1>
            <p className="text-default-500 text-center mt-2">Система управления автосалоном</p>
          </div>

          <Tabs
            selectedKey={activeTab}
            onSelectionChange={setActiveTab}
            fullWidth
            classNames={{
              tabList: 'mb-6',
            }}
          >
            <Tab key="admin" title="Администратор">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <Input
                  label="Логин"
                  placeholder="Введите логин"
                  value={adminCredentials.login}
                  onChange={(e) =>
                    setAdminCredentials({ ...adminCredentials, login: e.target.value })
                  }
                  startContent={<User size={18} className="text-default-400" />}
                  variant="bordered"
                  isRequired
                />
                <Input
                  label="Пароль"
                  type="password"
                  placeholder="Введите пароль"
                  value={adminCredentials.password}
                  onChange={(e) =>
                    setAdminCredentials({ ...adminCredentials, password: e.target.value })
                  }
                  startContent={<Lock size={18} className="text-default-400" />}
                  variant="bordered"
                  isRequired
                />
                {error && <p className="text-danger text-sm">{error}</p>}
                <Button
                  type="submit"
                  color="primary"
                  fullWidth
                  size="lg"
                  isLoading={isLoading}
                  startContent={!isLoading && <LogIn size={18} />}
                >
                  Войти как администратор
                </Button>
              </form>
            </Tab>

            <Tab key="staff" title="Сотрудник">
              <form onSubmit={handleStaffLogin} className="space-y-4">
                <Input
                  label="ИНН паспорта"
                  placeholder="Введите ИНН"
                  value={staffCredentials.inn}
                  onChange={(e) =>
                    setStaffCredentials({ ...staffCredentials, inn: e.target.value })
                  }
                  startContent={<User size={18} className="text-default-400" />}
                  variant="bordered"
                  maxLength={14}
                  isRequired
                />
                <Input
                  label="Пароль"
                  type="password"
                  placeholder="Введите пароль"
                  value={staffCredentials.password}
                  onChange={(e) =>
                    setStaffCredentials({ ...staffCredentials, password: e.target.value })
                  }
                  startContent={<Lock size={18} className="text-default-400" />}
                  variant="bordered"
                  isRequired
                />
                {error && <p className="text-danger text-sm">{error}</p>}
                <Button
                  type="submit"
                  color="primary"
                  fullWidth
                  size="lg"
                  isLoading={isLoading}
                  startContent={!isLoading && <LogIn size={18} />}
                >
                  Войти как сотрудник
                </Button>
              </form>
            </Tab>
          </Tabs>

          <div className="mt-6 text-center text-sm text-default-400">
            <p>© 2026 AutoKorea. Все права защищены.</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
