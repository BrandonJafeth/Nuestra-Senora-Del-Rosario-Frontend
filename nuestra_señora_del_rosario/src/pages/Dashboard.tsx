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
import ApprovedRequests from '../components/specific/ApprovedRequests';
import NewResidentForm from '../components/specific/NewResidentForm';
import AppointmentCalendar from '../components/specific/AppointmentCalendar';
import NotificationMailbox from '../components/specific/NotificationMailbox';
import InventoryTable from '../components/specific/InventoryTable';
import ProductCalendar from '../components/specific/ProductCalendar';
import UserList from '../components/specific/UsersList';
import CreateUserForm from '../components/specific/CreateUserForm';
import CreateUserFromEmployeeForm from '../components/specific/CreateUserFromEmployee';
import ResidentList from '../components/specific/ResidentList';
import UserSettings from '../components/specific/UserSettings';
import ResidentTableMedical from '../components/specific/ResidentsTableMedical';
import ResidentDetail from '../components/specific/ResidentInfo';
import AddMedicationPage from '../components/specific/AddResidentMedication';
import AddPathologyPage from '../components/specific/AddResidentPathology';
import EditResidentPathology from '../components/specific/EditResidentPathologyForm';
import EditResidentMedicationForm from '../components/specific/EditResidentMedicationForm';
import MedicalHistory from '../components/specific/MedicalHistory';
import UpdateMedicalHistory from '../components/specific/UpdateMedicalHistory';
import AddMedicalHistoryForm from '../components/specific/AddMedicalHistory';
import HomeConfig from '../components/specific/HomeConfig';
import SystemConfiguration from '../components/specific/SystemConfiguration';
import TableTypeOfSalary from '../components/specific/TableTypeSalary';
import TableUnitOfMeasure from '../components/specific/TableUnitOfMeasure';
import TableRooms from '../components/specific/TableRooms';
import TableProfessions from '../components/specific/TableProfessions';
import TableDependencyLevels from '../components/specific/TableDependencyLevel';

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
              <Route path="usuarios" element={<UserList />} />
              <Route path="usuarios/crear" element={<CreateUserForm />} />
              <Route path="usuarios/crear-por-empleado" element={<CreateUserFromEmployeeForm />} />
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
              <Route path="cardex" element={<ResidentTableMedical/>} />
              <Route path="residente-info/:id" element={<ResidentDetail/>}/>
              <Route path="residente/:id/agregar-medicamento" element={<AddMedicationPage/>}/>
              <Route path="residente-info/:id/editar-medicamento/:id_ResidentMedication" element={<EditResidentMedicationForm/>}/>
              <Route path="residente/:id/agregar-patologia" element={<AddPathologyPage/>}/>
              <Route path="residente/:id/editar-patologia/:id_ResidentPathology" element={<EditResidentPathology/>}/>
              <Route path="historial-medico/:residentId" element={<MedicalHistory />} />
              <Route path="residente/:residentId/editar-historial/:id_MedicalHistory" element={<UpdateMedicalHistory/>}/>
              <Route path="residente/:residentId/agregar-historial" element={<AddMedicalHistoryForm/>}/>
              <Route path="notifications"  element={<NotificationMailbox />} />
              <Route path="Configuracion" element={<HomeConfig />} />
              <Route path="Configuracion/usuario" element={<UserSettings/>} />
              <Route path="Configuracion/sistema" element={<SystemConfiguration />} />
              <Route path="Configuracion/sistema/tipo-salario" element={<TableTypeOfSalary/>}/>
              <Route path="Configuracion/sistema/unidad-medida" element={<TableUnitOfMeasure/>}/>
              <Route path="Configuracion/sistema/habitacion" element={<TableRooms/>}/>
              <Route path="Configuracion/sistema/profesion" element={<TableProfessions/>}/>
              <Route path="Configuracion/sistema/nivel-dependencia" element={<TableDependencyLevels />} />
              <Route path="NuevoResidente" element={<NewResidentForm />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;