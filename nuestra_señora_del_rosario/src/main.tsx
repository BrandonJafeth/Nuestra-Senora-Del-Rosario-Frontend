import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SnackbarProvider } from 'notistack';
import { ToastProvider } from './context/ToastProvider';
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter as Router } from 'react-router-dom';
import { IconProvider } from './context/IconsProvider';
import ToggleProvider from './context/ToggleProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { QueryClient, QueryClientProvider } from 'react-query'; // Importa React Query

if ('Notification' in window && navigator.serviceWorker) {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Permiso de notificación concedido.');
    } else {
      console.warn('Permisos de notificación denegados.');
    }
  });
}


if ('Notification' in window) {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Permisos de notificación concedidos.');
    } else {
      console.warn('Permisos de notificación denegados.');
    }
  });
}

// Crea una instancia de QueryClient
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider maxSnack={3}>
        <ToastProvider>
                <ThemeProvider>
          <AuthProvider>
            <IconProvider>
              <ToggleProvider>
                  <Router>
                    <App />
                  </Router>
              </ToggleProvider>
            </IconProvider>
          </AuthProvider>
                </ThemeProvider>
        </ToastProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
