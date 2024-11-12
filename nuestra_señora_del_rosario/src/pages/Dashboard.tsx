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
import ResidentList from '../components/specific/ResidentList';
import ApprovedRequests from '../components/specific/ApprovedRequests';
import NewResidentForm from '../components/specific/NewResidentForm';
import AppointmentCalendar from '../components/specific/AppointmentCalendar';
import NotificationMailbox from '../components/specific/NotificationMailbox';
import InventoryTable from '../components/specific/InventoryTable';
import ProductCalendar from '../components/specific/ProductCalendar';

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
              <Route path="comprobante-pago" element={<PaymentReceiptForm />} />
              <Route path="cronograma-citas" element={<AppointmentCalendar />} />
              <Route path="solicitudes/voluntariado" element={<VolunteerRequests />} />
              <Route path="solicitudes/ingreso" element={<ApplicationRequests />} />
              <Route path="solicitudes/donaciones" element={<DonationRequests />} />
              <Route path="Residentes" element={<ResidentList/>} />
              <Route path='inventario/lista-productos' element={<InventoryTable />} />
              <Route path='inventario/consumo-productos' element={<ProductCalendar />} />
              <Route path="SolicitudesAprobadas" element={<ApprovedRequests />} />
              <Route path="notifications"  element={<NotificationMailbox />} />
              <Route path="NuevoResidente" element={<NewResidentForm />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;