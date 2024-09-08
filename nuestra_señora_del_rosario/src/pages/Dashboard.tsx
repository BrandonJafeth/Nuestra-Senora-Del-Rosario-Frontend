import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

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
          {/* Aquí va el contenido del Dashboard */}
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
                <p className="text-2xl text-gray-400 dark:text-gray-500">Content 1</p>
              </div>
              {/* Otros contenidos */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
