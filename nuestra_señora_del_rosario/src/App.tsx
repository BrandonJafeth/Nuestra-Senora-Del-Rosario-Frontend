import './App.css';
import { useNotificationFetcher } from './hooks/useNotificationFetcher';

import AppRoutes from './routes/AppRoutes';

function App() {
useNotificationFetcher();
  return (
    <>
     <AppRoutes />
    </>
  );
}

export default App;
