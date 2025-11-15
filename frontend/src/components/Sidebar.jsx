import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Drawer } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  DollarOutlined,
  CreditCardOutlined,
  SettingOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/customers',
      icon: <TeamOutlined />,
      label: 'Customers',
    },
    {
      key: '/invoices',
      icon: <FileTextOutlined />,
      label: 'Invoices',
    },
    {
      key: 'quote',
      icon: <FileTextOutlined />,
      label: 'Quote',
      disabled: true,
    },
    {
      key: '/payments',
      icon: <DollarOutlined />,
      label: 'Payments',
    },
    {
      key: 'payments-mode',
      icon: <CreditCardOutlined />,
      label: 'Payments Mode',
      disabled: true,
    },
    {
      key: 'taxes',
      icon: <DollarOutlined />,
      label: 'Taxes',
      disabled: true,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      disabled: true,
    },
    {
      key: 'about',
      icon: <InfoCircleOutlined />,
      label: 'About',
      disabled: true,
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key.startsWith('/')) {
      navigate(key);
      onClose();
    }
  };

  const selectedKey = location.pathname;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-lg">iD</span>
        </div>
        <div>
          <div className="text-base font-bold text-gray-900">iDURAR</div>
          <div className="text-xs text-gray-500">CRM/ERP</div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-4">
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={menuItems}
          style={{
            border: 'none',
            background: 'transparent',
          }}
          className="sidebar-menu"
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-gray-200 z-40">
        {sidebarContent}
      </div>

      {/* Mobile sidebar */}
      <Drawer
        placement="left"
        onClose={onClose}
        open={isOpen}
        width={240}
        styles={{
          body: { padding: 0 },
        }}
        className="md:hidden"
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;

