import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SnackbarProvider } from 'notistack';
import { ToastProvider } from './context/ToastProvider';
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter as Router } from 'react-router-dom';
import { IconProvider } from './context/IconsProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3}>
      <ToastProvider>
        <AuthProvider>
          <IconProvider>
          <Router>
            <App />
          </Router>
          </IconProvider>
        </AuthProvider>
      </ToastProvider>
    </SnackbarProvider>
  </React.StrictMode>,
);
