import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import './index.css';
import App from './App.jsx';

console.log('🚀 AutoKorea CRM загружается...');
console.log('✅ HeroUIProvider импортирован:', HeroUIProvider);
console.log('✅ React Router импортирован:', BrowserRouter);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <HeroUIProvider>
        <App />
      </HeroUIProvider>
    </BrowserRouter>
  </StrictMode>
);

console.log('✅ Приложение отрендерено');
