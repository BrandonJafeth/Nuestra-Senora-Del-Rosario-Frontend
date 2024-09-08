import { useIcon } from "../../hooks/useIcons";


interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar = ({ isSidebarOpen }: SidebarProps) => {
  const { getIcon } = useIcon();

  const menuItems = [
    'Residentes',
    'Personal',
    'Inventario',
    'Solicitudes de ingreso',
    'Donaciones',
    'Voluntariado',
    'Cronograma de Citas',
  ];

  return (
    <aside
      className={`fixed left-0 z-40 w-64 h-[calc(100%-64px)] pt-4 transition-transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700`}
      style={{ top: '64px' }}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          {menuItems.map((item) => (
            <li key={item}>
              <a
                href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {getIcon(item)}
                <span className="ml-3">{item}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
