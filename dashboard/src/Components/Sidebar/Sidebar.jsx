import { useState, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Box
} from '@mui/material';
import { MdSportsCricket } from 'react-icons/md';
import {
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaUsers,
  FaUser,
  FaBook,
  FaChartLine,
  FaUserSlash,
  FaBan,
  FaWallet,
  FaHistory,
  FaSearch,
  FaCog,
  FaLock,
  FaPercent,
  FaSignOutAlt,
  FaDiceFive,   
} from 'react-icons/fa';
import { VscChromeClose } from "react-icons/vsc";
import './Sidebar.css';
import TokenService from '../../services/token-service';
import { httpHelpers } from '../../services/httpHelpers';

const drawerWidth = 265;

function Sidebar({ collapsed, toggleSidebar, mobileOpen, handleMobileClose, style }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [userId, setUserId] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchUserAndBalance = async () => {
      const user = TokenService.getUser();
      setUserId(user?.userId || '');
      try {
        const api = httpHelpers();
        const response = await api.get("beta/getBalance");
        if (response?.data) setBalance(response.data);
      } catch {
        if (user?.balance) setBalance(user.balance);
      }
    };
    fetchUserAndBalance();
  }, []);

  const menuItems = [
    { text: 'Dashboard', icon: <FaHome />, path: '/dashboard' },
    {
      text: 'Users', icon: <FaUsers />, subItems: [
        { text: 'My Cients', icon: <FaUser />, path: '/users/clients' },
        { text: 'SM', icon: <FaUsers />, path: '/users/sm' },
        { text: 'SC', icon: <FaUsers />, path: '/users/sc' },
        { text: 'SST', icon: <FaUsers />, path: '/users/sst' },
        { text: 'Stockist', icon: <FaUsers />, path: '/users/stockist' },
        { text: 'Agents', icon: <FaUsers />, path: '/users/agents' }
      ]
    },
    { text: 'Live Matches', icon: <MdSportsCricket/>, path: '/live-matches' },
    { text: 'Complete Matches', icon: <MdSportsCricket/>, path: '/complete-matches' },
    { text: 'Live Casino', icon: <FaDiceFive />, path: '/livecasino' },
    { text: 'Virtual Casino', icon: <FaDiceFive />, path: '/virtualcasino' },
    { text: 'Search Casino Result', icon: <FaDiceFive />, path: '/searchcasinoresult' },
    
    {
      text: 'Ledgers',
      icon: <FaBook />,
      submenu: [
        { text: 'My Ledgers', icon: <FaBook />, path: '/ledgers/my-ledger' },
        { text: 'Lena aur Dena', icon: <FaWallet />, path: '/ledgers/lena-dena' },
      ]
    },
    { text: 'Block Market', icon: <FaBan />, path: '/block-market' },
    { text: 'Profit & Loss', icon: <FaWallet />, path: '/ledgers/profit-loss' },
    { text: 'Coin History', icon: <FaHistory />, path: '/ledgers/coin-history' },
    { text: 'Search User', icon: <FaSearch />, path: '/search-user' },
    { text: 'Settings', icon: <FaCog />, path: '/settings' },
    { text: 'Change Password', icon: <FaLock />, path: '/change-password' },
    { text: 'Logout', icon: <FaSignOutAlt />, path: '/logout' },
  ];

  const handleNavigate = (path) => {
    if (path === '/logout') {
      localStorage.clear();
      window.location.href = '/';
    } else {
      navigate(path);
    }
  };

  const handleSubmenuToggle = (submenuName) => {
    setOpenSubmenu(openSubmenu === submenuName ? null : submenuName);
  };

  const renderListItemText = (text, active) => (
    <ListItemText
      primary={text}
      className="menu-text"
      sx={{
        fontFamily: '"Open Sans", sans-serif',
        fontSize: { xs: '14px', md: '16px' },
        fontWeight: { xs: 400, md: 500 },
        color: active ? '#fff' : '#A9B7D0',
      }}
    />
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleMobileClose}
        ModalProps={{
          keepMounted: true,
          BackdropProps: {
            sx: {
              backgroundColor: 'rgba(255,255,255,0.0)',
              backdropFilter: 'blur(1px)',
              WebkitBackdropFilter: 'blur(10px)',
            }
          }
        }}
        sx={{
          width: '100vw',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '245px',
            maxWidth: '100%',
            boxSizing: 'border-box',
            backgroundColor: '#3F4D67',
            color: '#A9B7D0',
            zIndex: 2000,
            transition: 'width 0.3s, background-color 0.3s',
            fontFamily: 'Open Sans, Arial, sans-serif',
            boxShadow: '4px 0 12px rgba(0, 0, 0, 0.3)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          },
          '& .MuiDrawer-paper::-webkit-scrollbar': {
            display: 'none',
          },
          ...(style || {}),
        }}
      >
        <div className="drawer-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px', minHeight: 60, position: 'relative', zIndex: 2000 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', flex: 1, gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: '#fff', lineHeight: 1 , marginLeft: 8}}>{userId}</span>
            <span style={{ fontWeight: 500, fontSize: 14, color: '#A9B7D0', lineHeight: 1, marginLeft: 6 }}>₹ {Number(balance).toFixed(2)}</span>
          </div>
          <div style={{ width: 24 }} />
          <IconButton onClick={isMobile ? handleMobileClose : toggleSidebar} className="toggle-button" sx={{ color: '#A9B7D0', position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
            {isMobile ? <VscChromeClose /> : (collapsed ? <FaChevronRight /> : <FaChevronLeft />)}
          </IconButton>
        </div>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const subMenuKey = item.submenu ? 'submenu' : (item.subItems ? 'subItems' : null);
            const hasSubMenu = !!subMenuKey;
            return (
              <Box key={item.text}>
                <ListItemButton
                  onClick={() => hasSubMenu ? handleSubmenuToggle(item.text) : (handleNavigate(item.path), handleMobileClose())}
                  className={`menu-button${isActive ? ' active' : ''}`}
                  sx={{
                    justifyContent: 'flex-start',
                    px: 2,
                    color: isActive ? '#fff' : '#A9B7D0',
                    borderLeft: isActive ? '4px solid #00bcd4' : '4px solid transparent',
                  }}
                >
                  <ListItemIcon className="menu-icon" sx={{ minWidth: 0, mr: 2, justifyContent: 'center', color: isActive ? '#fff' : '#A9B7D0' }}>{item.icon}</ListItemIcon>
                  {renderListItemText(item.text, isActive)}
                  {hasSubMenu && (
                    <span className="menu-expand" style={{ color: isActive ? '#fff' : '#A9B7D0' }}>
                      {openSubmenu === item.text ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  )}
                </ListItemButton>
                {hasSubMenu && (
                  <Collapse in={openSubmenu === item.text} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding className="submenu" sx={{ overflow: 'visible' }}>
                      {item[subMenuKey].map((subItem) => {
                        const isSubActive = location.pathname === subItem.path;
                        return (
                          <ListItemButton
                            key={subItem.text}
                            onClick={() => { handleNavigate(subItem.path); handleMobileClose(); }}
                            className={`submenu-item${isSubActive ? ' active' : ''}`}
                            sx={{
                              pl: 4,
                              display: 'flex',
                              alignItems: 'center',
                              color: isSubActive ? '#fff' : '#A9B7D0',
                              backgroundColor: isSubActive ? '#2d3a4d' : 'transparent',
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 0, mr: 2, color: isSubActive ? '#fff' : '#A9B7D0' }}>{subItem.icon}</ListItemIcon>
                            {renderListItemText(subItem.text, isSubActive)}
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </List>
      </Drawer>
    );
  }

  // Desktop
  return (
    <Drawer
      variant="permanent"
      open={!collapsed}
      sx={{
        width: collapsed ? 70 : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 70 : drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#3F4D67',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: '#A9B7D0',
          overflowX: 'hidden',
          transition: 'width 0.3s, background-color 0.3s',
        },
        '& .MuiDrawer-paper::-webkit-scrollbar': {
          display: 'none',
        },
        ...(style || {}),
      }}
    >
      <div className="drawer-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 0 16px', minHeight: 60 , position: 'relative', zIndex: 2000 }}>
        {!collapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: '#fff', lineHeight: 1 }}>{userId}</span>
            <span style={{ fontWeight: 500, fontSize: 14, color: '#A9B7D0', lineHeight: 1 }}>₹ {Number(balance).toFixed(2)}</span>
          </div>
        )}
        <IconButton onClick={toggleSidebar} className="toggle-button" sx={{ color: '#A9B7D0', ml: 1 }}>
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </IconButton>
      </div>
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const subMenuKey = item.submenu ? 'submenu' : (item.subItems ? 'subItems' : null);
          const hasSubMenu = !!subMenuKey;
          return (
            <Box key={item.text}>
              <ListItemButton
                onClick={() => hasSubMenu ? (!collapsed && handleSubmenuToggle(item.text)) : handleNavigate(item.path)}
                className={`menu-button${isActive ? ' active' : ''}`}
                sx={{
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  px: collapsed ? 1 : 2,
                  color: isActive ? '#fff' : '#A9B7D0',
                }}
              >
                <ListItemIcon className="menu-icon" sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center', color: isActive ? '#fff' : '#A9B7D0' }}>{item.icon}</ListItemIcon>
                {!collapsed && renderListItemText(item.text, isActive)}
                {hasSubMenu && !collapsed && (
                  <span className="menu-expand" style={{ color: isActive ? '#fff' : '#A9B7D0' }}>
                    {openSubmenu === item.text ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                )}
              </ListItemButton>
              {hasSubMenu && !collapsed && (
                <Collapse in={openSubmenu === item.text} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding className="submenu">
                    {item[subMenuKey].map((subItem) => {
                      const isSubActive = location.pathname === subItem.path;
                      return (
                        <ListItemButton
                          key={subItem.text}
                          onClick={() => handleNavigate(subItem.path)}
                          className={`submenu-item${isSubActive ? ' active' : ''}`}
                          sx={{
                            pl: 4,
                            display: 'flex',
                            alignItems: 'center',
                            color: isSubActive ? '#fff' : '#A9B7D0',
                            backgroundColor: isSubActive ? '#2d3a4d' : 'transparent',
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 0, mr: 2, color: isSubActive ? '#fff' : '#A9B7D0' }}>{subItem.icon}</ListItemIcon>
                          {renderListItemText(subItem.text, isSubActive)}
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>
    </Drawer>
  );
}

export default Sidebar;
