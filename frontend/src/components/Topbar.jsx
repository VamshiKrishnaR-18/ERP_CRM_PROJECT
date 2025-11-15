import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Dropdown, Avatar, Button } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, BellOutlined } from '@ant-design/icons';

const Topbar = ({ onMenuClick, onLogout }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    } else if (key === 'profile') {
      navigate('/profile');
    } else if (key === 'settings') {
      navigate('/settings');
    }
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign out',
      danger: true,
    },
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="h-16 flex items-center justify-between px-6">
        {/* Left side - Mobile menu button */}
        <button
          className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications */}
          <Button
            type="text"
            icon={<BellOutlined style={{ fontSize: '18px' }} />}
            className="text-gray-600 hover:text-gray-900"
          />

          {/* User Profile Dropdown */}
          <Dropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
            placement="bottomRight"
            trigger={['click']}
          >
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
              <Avatar
                size={36}
                style={{ backgroundColor: '#1890ff' }}
                icon={<UserOutlined />}
              >
                {getInitials(user?.name)}
              </Avatar>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-900">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {user?.role || 'user'}
                </div>
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
