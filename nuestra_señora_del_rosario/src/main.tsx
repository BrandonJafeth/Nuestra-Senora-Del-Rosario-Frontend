import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SnackbarProvider } from 'notistack';
import { ToastProvider } from './context/ToastProvider';
import { AuthProvider } from './context/AuthProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3}>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </SnackbarProvider>
  </React.StrictMode>,
);
