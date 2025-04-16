// FILE: src/pages/Dashboard.tsx
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import HomeDashboard from '../components/specific/HomeDashboard';
import EmployeeForm from '../components/specific/EmployeeForm';
import VolunteerRequests from '../components/specific/VolunteerRequests';
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
import TableAppointmentStatuses from '../components/specific/TableAppointmentStatuses';
import TablePathologies from '../components/specific/TablePathologies';
import TableNotes from '../components/specific/TableNotes';
import TableSpecialities from '../components/specific/TableSpecialities';
import TableHealtcareCenter from '../components/specific/TableHealtcareCenter';
import TableCategories from '../components/specific/TableCategories';
import SystemPageSettings from '../components/specific/SystemPageSettings';
import Gallery from '../components/specific/GalleryCard';
import ResidentDocumentsPage from '../components/specific/ResidentFile';
import TableBrands from '../components/specific/TableBrands';
import TableModels from '../components/specific/TableModels';
import TableAssetCategories from '../components/specific/TableAssetCategories';
import AssetTable from '../components/specific/AssetTable';
import TableLaws from '../components/specific/TableLaws';
import TableMedicationSpecific from '../components/specific/TableMedication';
import TableAdministrationRoute from '../components/specific/TableAdministrationRoute';
import RoleBasedRoute from '../components/layout/RoleBasedRoute';
import PageNotFound from '../components/layout/PageNotFound';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-[#E0E0E0]">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1">
        <Header toggleSidebar={toggleSidebar} />
        <main className={`p-4 mt-16 transition-all ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-4 rounded-lg">
            <Routes>
              <Route path="/" element={<HomeDashboard />} />

              {/* Residentes: solo SuperAdmin y Admin */}
              <Route 
                path="residentes" 
                element={
                  <RoleBasedRoute allowedRoles={['SuperAdmin', 'Admin']}>
                    <ResidentList />
                  </RoleBasedRoute>
                } 
              />

              {/* Usuarios: solo SuperAdmin y Admin */}
              <Route 
                path="usuarios" 
                element={
                  <RoleBasedRoute allowedRoles={['SuperAdmin', 'Admin']}>
                    <UserList />
                  </RoleBasedRoute>
                } 
              />

              {/* Cronograma de Citas: permitido para varios roles */}
              <Route 
                path="cronograma-citas" 
                element={
                  <RoleBasedRoute allowedRoles={['SuperAdmin','Enfermeria','Admin','Fisioterapia','Encargado']}>
                    <AppointmentCalendar />
                  </RoleBasedRoute>
                } 
              />

              {/* Cardex: solo SuperAdmin y Enfermeria */}
              <Route 
                path="cardex" 
                element={
                  <RoleBasedRoute allowedRoles={['SuperAdmin', 'Enfermeria']}>
                    <ResidentTableMedical />
                  </RoleBasedRoute>
                } 
              />
              <Route path="personal/registro" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Admin']}>
                <EmployeeForm />
                </RoleBasedRoute>
                } />

              <Route path="usuarios/crear" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Admin']}>
                <CreateUserForm />
                </RoleBasedRoute>
                } />

              <Route path="usuarios/crear-por-empleado" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Admin']}>
                <CreateUserFromEmployeeForm />
                </RoleBasedRoute>
                } />

              <Route path="personal/lista" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Admin']}>
                <EmployeeList />
                </RoleBasedRoute>
                } />

              <Route path="comprobante-pago" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Admin']}>
                <PaymentReceiptForm />
                </RoleBasedRoute>
                } />
            
              <Route path="solicitudes/voluntariado" element={
               <RoleBasedRoute allowedRoles={['SuperAdmin', 'Admin']}> 
               <VolunteerRequests />
                </RoleBasedRoute>
                } />

              <Route path="solicitudes/ingreso" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Admin']}>
                <ApplicationRequests />
                </RoleBasedRoute>
                } />

              <Route path="solicitudes/donaciones" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Admin']}>
                <DonationRequests />
                </RoleBasedRoute>
                } />

              <Route path="inventario/lista-productos" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Admin', 'Enfermeria', 'Inventario']}>
                <InventoryTable />
                </RoleBasedRoute>
                } />

              <Route path="inventario/lista-activos" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Admin', 'Fisioterapia']}>
                <AssetTable />
                </RoleBasedRoute>
                } />

              <Route path="inventario/consumo-productos" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Admin', 'Enfermeria', 'Inventario']}>
                <ProductCalendar />
                </RoleBasedRoute>
                } />

              <Route path="SolicitudesAprobadas" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Admin']}>
                <ApprovedRequests />
                </RoleBasedRoute>
                } />

              <Route path="residente-info/:id" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Enfermeria']}>
                <ResidentDetail />
                </RoleBasedRoute>
                } />

              <Route path="residente/:id/agregar-medicamento" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Enfermeria']}>
                <AddMedicationPage />
                </RoleBasedRoute>
                } />

              <Route path="residente-info/:id/editar-medicamento/:id_ResidentMedication" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Enfermeria']}>
                <EditResidentMedicationForm />
                </RoleBasedRoute>
                } />

              <Route path="residente/:id/agregar-patologia" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Enfermeria']}>
                <AddPathologyPage />
                </RoleBasedRoute>
                } />

              <Route path="residente/:id/editar-patologia/:id_ResidentPathology" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Enfermeria']}>
                <EditResidentPathology />
                </RoleBasedRoute>
                } />

              <Route path="historial-medico/:residentId" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Enfermeria']}>
                <MedicalHistory />
                </RoleBasedRoute>
                } />

              <Route path="residente/:residentId/editar-historial/:id_MedicalHistory" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Enfermeria']}>
                <UpdateMedicalHistory />
                </RoleBasedRoute>
                } />

              <Route path="residente/:residentId/agregar-historial" element={
               <RoleBasedRoute allowedRoles={['SuperAdmin', 'Enfermeria']}>
               <AddMedicalHistoryForm />
                </RoleBasedRoute>
                } />

              <Route path="residente/documentos/:residentName" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Admin']}>
                <ResidentDocumentsPage />
                </RoleBasedRoute>
                } />

              <Route path="notifications" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin', 'Enfermeria']}>
                <NotificationMailbox />
                </RoleBasedRoute>
                } />

              {/* Configuración: algunas rutas tienen restricciones */}
              <Route path="Configuracion/usuario" element={<UserSettings />} />
              <Route path="Configuracion" element={<HomeConfig />} />

              <Route 
                path="Configuracion/sistema" 
                element={
                  <RoleBasedRoute allowedRoles={['SuperAdmin','Admin','Enfermeria','Inventario']}>
                    <SystemConfiguration />
                  </RoleBasedRoute>
                }
              />
              <Route 
                path="Configuracion/pagina" 
                element={
                  <RoleBasedRoute allowedRoles={['SuperAdmin','Admin']}>
                    <SystemPageSettings />
                  </RoleBasedRoute>
                }
              />

              <Route path="Configuracion/sistema/tipo-salario" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin','Admin']}>
                <TableTypeOfSalary />
                </RoleBasedRoute>
                } />

              <Route path="Configuracion/sistema/unidad-medida" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin','Admin', 'Enfermeria', 'Inventario']}>
                <TableUnitOfMeasure />
                </RoleBasedRoute>
                } />

              <Route path="Configuracion/sistema/habitacion" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin','Admin']}>
                <TableRooms />
                </RoleBasedRoute>
                } />

              <Route path="Configuracion/sistema/profesion" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin','Admin']}>
                <TableProfessions />
                </RoleBasedRoute>
                } />

              <Route path="Configuracion/sistema/nivel-dependencia" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin','Admin', 'Enfermeria']}>
                <TableDependencyLevels />
                </RoleBasedRoute>
                } />

              <Route path="Configuracion/sistema/estado-citas" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin','Enfermeria']}>
                <TableAppointmentStatuses />
                </RoleBasedRoute>
                } />

              <Route path="Configuracion/sistema/patologia" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin','Enfermeria']}>
                <TablePathologies />
                </RoleBasedRoute>
                } />

              <Route path="Configuracion/sistema/notas" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin','Enfermeria']}>
                <TableNotes />
                </RoleBasedRoute>
                } />

              <Route path="Configuracion/sistema/especialidad" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin','Enfermeria']}>
                <TableSpecialities />
                </RoleBasedRoute>
                } />

              <Route path="Configuracion/sistema/centro-atencion" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin','Enfermeria']}>
                <TableHealtcareCenter />
                </RoleBasedRoute>
                } />

              <Route path="Configuracion/sistema/categoria" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin','Admin', 'Inventario']}>
                <TableCategories />
                </RoleBasedRoute>
                } />

              <Route path="Configuracion/sistema/marca" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin','Admin', 'Enfermeria', 'Fisioterapia']}>
                <TableBrands />
                </RoleBasedRoute>
                } />

              <Route path="Configuracion/sistema/modelo" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin','Admin', 'Enfermeria', 'Fisioterapia']}>
                <TableModels />
                </RoleBasedRoute>
                } />

              <Route path="Configuracion/sistema/categoria-activo" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin','Admin', 'Enfermeria', 'Fisioterapia']}>
                <TableAssetCategories />
                </RoleBasedRoute>
                } />

              <Route path="Configuracion/sistema/leyes" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin','Admin']}>
                <TableLaws />
                </RoleBasedRoute>
                } />

              <Route path="Configuracion/sistema/medicamento" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin','Enfermeria']}>
                <TableMedicationSpecific />
                </RoleBasedRoute>
                } />

              <Route path="Configuracion/sistema/via-administracion" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin','Enfermeria']}>
                <TableAdministrationRoute />
                </RoleBasedRoute>
                } />

              <Route path="Configuracion/pagina/imagenes" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin','Admin']}>
                <Gallery />
                </RoleBasedRoute>
                } />

              <Route path="NuevoResidente" element={
                <RoleBasedRoute allowedRoles={['SuperAdmin','Admin']}>
                <NewResidentForm />
                </RoleBasedRoute>
                } />

                <Route path="*" element={<PageNotFound/>} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
