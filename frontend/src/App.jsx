import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import CarsList from './pages/CarsList';
import CarDetail from './pages/CarDetail';
import Clients from './pages/Staff';
import Finance from './pages/Finance';
import Calculator from './pages/Calculator';
import Orders from './pages/Orders';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="cars" element={<CarsList />} />
          <Route path="cars/:id" element={<CarDetail />} />
          <Route
            path="clients"
            element={
              <ProtectedRoute adminOnly>
                <Clients />
              </ProtectedRoute>
            }
          />
          <Route
            path="finance"
            element={
              <ProtectedRoute adminOnly>
                <Finance />
              </ProtectedRoute>
            }
          />
          <Route path="calculator" element={<Calculator />} />
          <Route path="orders" element={<Orders />} />
          <Route
            path="reports"
            element={
              <ProtectedRoute adminOnly>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
