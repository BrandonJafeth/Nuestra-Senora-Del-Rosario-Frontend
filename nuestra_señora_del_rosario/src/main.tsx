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

// Crea una instancia de QueryClient
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider maxSnack={3}>
        <ToastProvider>
          <AuthProvider>
            <IconProvider>
              <ToggleProvider>
                <ThemeProvider>
                  <Router>
                    <App />
                  </Router>
                </ThemeProvider>
              </ToggleProvider>
            </IconProvider>
          </AuthProvider>
        </ToastProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
