import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import EmployeeForm from '../components/specific/EmployeeForm';
import VolunteerRequests from '../components/specific/VolunteerRequests'; // Importar el componente

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
              <Route path="/personal" element={<EmployeeForm />} />
              <Route path="solicitudes/voluntariado" element={<VolunteerRequests />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
