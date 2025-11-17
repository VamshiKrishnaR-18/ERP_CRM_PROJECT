import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  Home, 
  Users, 
  FileText, 
  CreditCard, 
  Search, 
  Bell, 
  Maximize, 
  Minimize, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  Command
} from 'lucide-react';

const NAV_LINKS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: Home,
  },
  {
    to: '/customers',
    label: 'Customers',
    icon: Users,
  },
  {
    to: '/invoices',
    label: 'Invoices',
    icon: FileText,
  },
  {
    to: '/payments',
    label: 'Payments',
    icon: CreditCard,
  },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  // close menus on route change
  useEffect(() => {
    setShowUserMenu(false);
    setMobileOpen(false);
  }, [location.pathname]);

  // outside click + Esc handling
  useEffect(() => {
    const onDown = (e) => {
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (mobileOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && !e.target.closest('#mobile-toggle')) {
        setMobileOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowUserMenu(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [showUserMenu, mobileOpen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = useCallback(async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  }, [logout]);

  const isActive = (path) => location.pathname === path;

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);

  const performSearchNavigation = useCallback(
    (value) => {
      const term = value.trim().toLowerCase();
      if (!term) return;

      if (term.startsWith('cust')) {
        navigate('/customers');
      } else if (term.startsWith('inv')) {
        navigate('/invoices');
      } else if (term.startsWith('pay')) {
        navigate('/payments');
      } else {
        navigate('/dashboard');
      }
    },
    [navigate],
  );

  const currentNav = NAV_LINKS.find((link) => location.pathname.startsWith(link.to));
  const currentLabel = currentNav?.label || 'Dashboard';
  const searchPlaceholder = currentNav
    ? `Search ${currentNav.label.toLowerCase()}...`
    : 'Search...';

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC');

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">

          {/* Left: Logo + Mobile Toggle */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              id="mobile-toggle"
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100/80 active:bg-gray-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>

          {/* Right: Search, Notifications, User */}
          <div className="flex items-center space-x-2 ml-auto">
            {/* Search (desktop) */}
            <div className="hidden md:flex items-center">
              <label htmlFor="nav-search" className="sr-only">Search</label>
              <div className="relative group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" aria-hidden />
                <input
                  id="nav-search"
                  type="search"
                  ref={searchInputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      performSearchNavigation(query);
                    }
                  }}
                  placeholder={searchPlaceholder}
                  className="w-64 pl-10 pr-16 py-2.5 text-sm bg-gray-50/50 border border-gray-200/80 rounded-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300/50 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400">
                  <Command className="w-3 h-3" aria-hidden />
                  <span className="text-xs">{isMac ? 'K' : 'K'}</span>
                </div>
              </div>
            </div>

            {/* Fullscreen toggle (desktop) */}
            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit full screen' : 'Full screen'}
              className="hidden md:inline-flex p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 active:bg-gray-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" aria-hidden />
              ) : (
                <Maximize className="w-5 h-5" aria-hidden />
              )}
            </button>

            {/* Notifications */}
            <button
              title="Notifications"
              className="relative p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 active:bg-gray-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" aria-hidden />
              <span className="absolute top-1 right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex items-center justify-center h-4 w-4 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px]">3</span>
              </span>
            </button>

            {/* User dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(s => !s)}
                aria-haspopup="true"
                aria-expanded={showUserMenu}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-gray-100/80 active:bg-gray-200/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
                  <span className="text-white font-semibold text-sm">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'user'}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} aria-hidden />
              </button>

              <div
                role="menu"
                aria-hidden={!showUserMenu}
                className={`absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-200/80 py-2 z-50 transform origin-top-right transition-all duration-200 ${showUserMenu ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none'}`}
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm text-gray-900 truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="py-2">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors" 
                    role="menuitem"
                  >
                    <User className="w-4 h-4 text-gray-400" aria-hidden />
                    Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors" 
                    role="menuitem"
                  >
                    <Settings className="w-4 h-4 text-gray-400" aria-hidden />
                    Settings
                  </Link>
                </div>
                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/80 transition-colors flex items-center gap-3"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" aria-hidden />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          id="mobile-menu" 
          ref={mobileMenuRef} 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-[500px] opacity-100 mb-4' : 'max-h-0 opacity-0'}`}
        >
          <div className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-2xl shadow-lg overflow-hidden">
            {/* Mobile Search */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
                <input
                  type="search"
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300/50 focus:bg-white transition-all placeholder:text-gray-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      performSearchNavigation(e.currentTarget.value);
                    }
                  }}
                />
              </div>
            </div>

            {/* Mobile Nav Links */}
            <div className="py-2">
              {NAV_LINKS.map(link => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-all ${
                      isActive(link.to) 
                        ? 'bg-blue-50/80 text-blue-600 border-l-4 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50/80 border-l-4 border-transparent'
                    }`}
                  >
                    <Icon className="w-5 h-5" aria-hidden />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile User Actions */}
            <div className="border-t border-gray-100 py-2">
              <Link 
                to="/profile" 
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors"
              >
                <User className="w-5 h-5 text-gray-400" aria-hidden />
                Profile
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-400" aria-hidden />
                Settings
              </Link>
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-colors"
              >
                <LogOut className="w-5 h-5" aria-hidden />
                Logout
              </button>
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
}
