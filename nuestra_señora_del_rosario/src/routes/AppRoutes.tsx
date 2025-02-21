import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Dashboard from '../pages/Dashboard';
import RequestPassword from '../pages/RequestPassword';
import ResetPassword from '../pages/ResetPassword';
import Login from '../pages/Login';
import ChangePassword from '../pages/ChangePassword';

const AppRoutes = () => (
    <Routes>
      <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/" element={<Login />} />
      <Route path="/solicitar-restablecimiento" element={<RequestPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/cambio-contraseña" element={<ChangePassword/>}/>
    </Routes>
);

export default AppRoutes;
