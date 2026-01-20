import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Хардкодированные данные суперадмина
const SUPER_ADMIN = {
  login: 'admin',
  password: 'admin123',
  role: 'admin',
  name: 'Администратор',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Проверка сохраненной сессии при загрузке
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials, staffList) => {
    const { login, password } = credentials;

    // Проверка суперадмина
    if (login === SUPER_ADMIN.login && password === SUPER_ADMIN.password) {
      const userData = {
        role: 'admin',
        name: SUPER_ADMIN.name,
        login: SUPER_ADMIN.login,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    }

    // Проверка сотрудника (ИНН + пароль)
    const staff = staffList.find(
      (s) => s.passportNumber === login && s.password === password
    );

    if (staff) {
      const userData = {
        role: 'staff',
        name: staff.name,
        passportNumber: staff.passportNumber,
        email: staff.email,
        phone: staff.phone,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    }

    return { success: false, error: 'Неверный логин или пароль' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
