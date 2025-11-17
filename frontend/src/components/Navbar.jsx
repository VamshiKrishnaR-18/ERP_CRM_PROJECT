import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_LINKS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: '/customers',
    label: 'Customers',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    to: '/invoices',
    label: 'Invoices',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    to: '/payments',
    label: 'Payments',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
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
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setShowUserMenu(false);
    setMobileOpen(false);
  }, [location.pathname]);

  // Outside click + Esc handling
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
  const searchPlaceholder = currentNav
    ? `Search ${currentNav.label.toLowerCase()}...`
    : 'Search...';
  const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform);

  return (
    <nav className={`erp-navbar sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-2xl shadow-2xl shadow-blue-500/5 border-b border-white/20' 
        : 'bg-linear-to-b from-white/95 to-white/80 backdrop-blur-2xl border-b border-gray-200/30'
    }`}>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          
          {/* Left: Logo + Primary Nav (desktop) + Mobile Toggle */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              id="mobile-toggle"
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2.5 rounded-2xl bg-white/50 hover:bg-white/80 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-300/50 border border-white/50 transition-all duration-300 active:scale-95"
            >
              <div className="relative w-5 h-5">
                <span className={`absolute top-1/2 left-1/2 w-4 h-0.5 bg-gray-700 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  mobileOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
                }`} />
                <span className={`absolute top-1/2 left-1/2 w-4 h-0.5 bg-gray-700 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  mobileOpen ? 'opacity-0' : 'opacity-100'
                }`} />
                <span className={`absolute top-1/2 left-1/2 w-4 h-0.5 bg-gray-700 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  mobileOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
                }`} />
              </div>
            </button>

            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-lg bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                ERP
              </span>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-xl transition-all duration-200 ${
                    isActive(link.to)
                      ? 'bg-linear-to-r from-blue-50 to-blue-100/50 text-blue-600 shadow-inner'
                      : 'text-gray-700 hover:bg-gray-50/80'
                  }`}
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600">
                    {link.icon}
                  </span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Center: Search Bar (Desktop only) */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative group w-full">
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm group-hover:blur-md transition-all duration-500 opacity-0 group-focus-within:opacity-100" />
              <div className="relative">
                <svg
                  className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300 z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
                <input
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
                  className="w-full pl-12 pr-20 py-3 text-sm bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-gray-200/30 hover:shadow-2xl hover:shadow-gray-300/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300/50 focus:bg-white transition-all duration-300 placeholder:text-gray-400"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <span className="text-xs border border-gray-200/50 rounded-lg px-2 py-1 bg-white/60 text-gray-500 shadow-sm">
                    {isMac ? '⌘K' : 'Ctrl+K'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit full screen' : 'Full screen'}
              className="p-2.5 rounded-2xl text-gray-600 hover:text-gray-900 bg-white/50 hover:bg-white/80 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-300/50 border border-white/50 transition-all duration-300 active:scale-95"
            >
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H4v4M4 4l4 4m8-4h4v4m0-4-4 4M4 16v4h4M4 20l4-4m8 4h4v-4m0 4-4-4" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M4 4l4 4m8-4h4v4m0-4-4 4m4 8v4h-4m4 0-4-4M8 20H4v-4m4 4-4-4" />
                </svg>
              )}
            </button>

            {/* Notifications */}
            <button className="relative p-2.5 rounded-2xl text-gray-600 hover:text-gray-900 bg-white/50 hover:bg-white/80 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-300/50 border border-white/50 transition-all duration-300 active:scale-95 group">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" />
              </svg>
              <span className="absolute top-1.5 right-1.5 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex items-center justify-center h-5 w-5 rounded-full bg-linear-to-br from-red-500 to-red-600 text-white text-xs font-medium shadow-lg shadow-red-500/30">
                  3
                </span>
              </span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                  Notifications
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                </div>
              </div>
            </button>

            {/* User dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu((s) => !s)}
                className="flex items-center space-x-3 px-3 py-2 rounded-2xl bg-white/50 hover:bg-white/80 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-300/50 border border-white/50 transition-all duration-300 active:scale-95 group"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <span className="text-white font-semibold text-sm">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'user'}</p>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              <div
                className={`absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-gray-400/20 border border-white/50 py-3 transform origin-top-right transition-all duration-300 ${
                  showUserMenu ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none'
                }`}
              >
                <div className="px-5 py-4 border-b border-gray-100/50">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-all duration-200 hover:translate-x-1 rounded-xl mx-2"
                  >
                    <span>👤 Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-all duration-200 hover:translate-x-1 rounded-xl mx-2"
                  >
                    <span>⚙️ Settings</span>
                  </Link>
                </div>
                <div className="border-t border-gray-100/50 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-all duration-200 hover:translate-x-1 rounded-xl mx-2"
                  >
                    <span>🚪 Logout</span>
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
          className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
            mobileOpen ? 'max-h-[600px] opacity-100 mb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl shadow-gray-400/20 overflow-hidden">
            {/* Mobile Search */}
            <div className="px-5 py-4 border-b border-gray-100/50">
              <div className="relative">
                <svg
                  className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
                <input
                  type="search"
                  placeholder={searchPlaceholder}
                  className="w-full pl-12 pr-4 py-3 text-sm bg-white/50 border border-white/50 rounded-2xl shadow-lg shadow-gray-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300/50 focus:bg-white transition-all placeholder:text-gray-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      performSearchNavigation(e.currentTarget.value);
                    }
                  }}
                />
              </div>
            </div>

            {/* Mobile Nav Links */}
            <div className="py-3">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-4 px-5 py-4 text-sm transition-all duration-300 group ${
                    isActive(link.to)
                      ? 'bg-linear-to-r from-blue-50 to-blue-100/50 text-blue-600 border-r-4 border-blue-500 shadow-inner'
                      : 'text-gray-700 hover:bg-gray-50/80 border-r-4 border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-all duration-300 ${
                    isActive(link.to) 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}>
                    {link.icon}
                  </div>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile User Actions */}
            <div className="border-t border-gray-100/50 py-3">
              <Link
                to="/profile"
                className="flex items-center gap-4 px-5 py-4 text-sm text-gray-700 hover:bg-gray-50/80 transition-all duration-300 group"
              >
                <div className="p-2 rounded-xl bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors">
                  👤
                </div>
                <span>Profile</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-4 px-5 py-4 text-sm text-gray-700 hover:bg-gray-50/80 transition-all duration-300 group"
              >
                <div className="p-2 rounded-xl bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors">
                  ⚙️
                </div>
                <span>Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-5 py-4 text-sm text-red-600 hover:bg-red-50/80 transition-all duration-300 group"
              >
                <div className="p-2 rounded-xl bg-red-100 text-red-600 group-hover:bg-red-200 transition-colors">
                  🚪
                </div>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}