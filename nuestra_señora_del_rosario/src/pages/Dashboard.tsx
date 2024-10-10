import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import EmployeeForm from '../components/specific/EmployeeForm';
import VolunteerRequests from '../components/specific/VolunteerRequests';
import HomeDashboard from '../components/specific/HomeDashboard';
import ApplicationRequests from '../components/specific/ApplicationRequests';
import DonationRequests from '../components/specific/DonationRequests';
import EmployeeList from '../components/specific/EmployeeList';
import PaymentReceiptForm from '../components/specific/VoucherPaymentForm';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-[#E0E0E0]">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1">
        <Header toggleSidebar={toggleSidebar} />
        <main className={`p-4 mt-16 transition-all ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-4 rounded-lg">
            {/* Aquí van las rutas dinámicas */}
            <Routes>
              <Route path="/" element={<HomeDashboard />} />
              <Route path="personal/registro" element={<EmployeeForm />} />
              <Route path="personal/lista" element={<EmployeeList />} />
              {/* Ruta con el parámetro dni */}
              <Route path="comprobante-pago" element={<PaymentReceiptForm />} />
              <Route path="solicitudes/voluntariado" element={<VolunteerRequests />} />
              <Route path="solicitudes/ingreso" element={<ApplicationRequests />} />
              <Route path="solicitudes/donaciones" element={<DonationRequests />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
