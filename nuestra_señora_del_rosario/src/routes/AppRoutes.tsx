import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Dashboard from '../pages/Dashboard';
import RequestPassword from '../pages/RequestPassword';
import ResetPassword from '../pages/ResetPassword';
import Login from '../pages/Login';

const AppRoutes = () => (
    <Routes>
      <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/" element={<Login />} />
      <Route path="/solicitar-restablecimiento" element={<RequestPassword />} />
      <Route path="/restablecer-contraseña" element={<ResetPassword />} />
    </Routes>
);

export default AppRoutes;
