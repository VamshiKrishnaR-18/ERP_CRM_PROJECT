import { Link, useLocation } from 'react-router-dom';
import { useMemo } from 'react';

const MenuItem = ({ to, label, icon, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
      ${active ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
  >
    <span className="mr-3 text-gray-400">{icon}</span>
    {label}
  </Link>
);

const SidebarContent = ({ pathname, onNavigate }) => {
  const menu = useMemo(() => ([
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0 7-7 7 7m-9 8V5m6 7v7m-3-4v4" />
        </svg>
      ),
    },
    {
      to: '/customers',
      label: 'Customers',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2M7 20H2v-2a3 3 0 015.356-1.857M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      to: '/invoices',
      label: 'Invoices',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l6 6v9a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      to: '/payments',
      label: 'Payments',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ]), []);

  return (
    <nav className="mt-4 space-y-1">
      {menu.map((item) => (
        <MenuItem
          key={item.to}
          to={item.to}
          label={item.label}
          icon={item.icon}
          active={pathname === item.to}
          onClick={onNavigate}
        />
      ))}
    </nav>
  );
};

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const location = useLocation();

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:w-60 md:flex-col bg-gray-900 border-r border-gray-800">
        <div className="flex h-16 items-center px-4 border-b border-gray-800">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">E</span>
          </div>
          <div className="ml-3">
            <p className="text-white font-semibold leading-tight">ERP & CRM</p>
            <p className="text-gray-400 text-xs">Management</p>
          </div>
        </div>
        <div className="px-3 py-4 overflow-y-auto">
          <SidebarContent pathname={location.pathname} />
        </div>
      </div>

      {/* Mobile sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={onClose} />
          <div className="relative w-64 bg-gray-900 border-r border-gray-800 p-4">
            <div className="flex h-12 items-center mb-2">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <button onClick={onClose} className="ml-auto text-gray-400 hover:text-white">✕</button>
            </div>
            <SidebarContent pathname={location.pathname} onNavigate={onClose} />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

