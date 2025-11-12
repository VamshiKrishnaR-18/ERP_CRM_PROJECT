import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext..jsx';

const Breadcrumbs = () => {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
        </li>
        {parts.map((part, idx) => {
          const to = '/' + parts.slice(0, idx + 1).join('/');
          const isLast = idx === parts.length - 1;
          return (
            <li key={to} className="flex items-center space-x-2">
              <span>/</span>
              {isLast ? (
                <span className="capitalize text-gray-700">{part}</span>
              ) : (
                <Link to={to} className="hover:text-gray-700 capitalize">{part}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="h-16 flex items-center px-4 sm:px-6 lg:px-8">
        <button className="md:hidden mr-3 text-gray-600" onClick={onMenuClick} aria-label="Open menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <Breadcrumbs />
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-48 md:w-64 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 leading-tight">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'user'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

