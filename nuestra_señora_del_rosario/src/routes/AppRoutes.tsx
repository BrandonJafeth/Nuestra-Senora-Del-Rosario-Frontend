import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Dashboard from '../pages/Dashboard';

const AppRoutes = () => (
<Router>
  <Routes>
    <Route path="/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
  </Routes>
</Router>

);

export default AppRoutes;
