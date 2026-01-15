import { Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="cars" element={<CarsList />} />
        <Route path="cars/:id" element={<CarDetail />} />
        <Route path="clients" element={<Clients />} />
        <Route path="finance" element={<Finance />} />
        <Route path="calculator" element={<Calculator />} />
        <Route path="orders" element={<Orders />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
