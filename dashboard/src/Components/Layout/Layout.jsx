import React, { useState, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import CustomBreadcrumbs from '../Breadcrumbs';
import Marquee from '../Marquee';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const Layout = ({ children, darkMode, setDarkMode, logout }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const themeMUI = useTheme();
  const isMobile = useMediaQuery(themeMUI.breakpoints.down('md'));

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };
      
    useEffect(() => {
      document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      background: {
        default: darkMode ? '#121212' : '#f8f9fa',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* ✅ Sidebar */}
      {!isMobile && (
        <Sidebar
          collapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          mobileOpen={mobileOpen}
          handleMobileClose={() => setMobileOpen(false)}
          style={{ zIndex: 1200, position: 'fixed', height: '100%' }}
        />
      )}
      {isMobile && (
        <Sidebar
          collapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          mobileOpen={mobileOpen}
          handleMobileClose={() => setMobileOpen(false)}
          style={{ zIndex: 2000, position: 'fixed', height: '100%' }}
        />
      )}

      {/* ✅ Fixed header aligned with sidebar */}
      <div style={{
        height: 60,
        background: theme.palette.background.paper,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        zIndex: 1301,
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: !isMobile ? (sidebarCollapsed ? 70 : 265) : 0, // ✅ fix: header starts after sidebar
        transition: 'margin-left 0.3s ease'
      }}>
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          handleDrawerToggle={toggleSidebar}
        />
      </div>

      {/* ✅ Marquee component */}
      <Marquee logout={logout} />

      {/* ✅ Content below header and marquee */}
      <div style={{ display: 'flex', minHeight: '100vh', marginTop: 94 }}>
        <div style={{
          flex: 1,
          minWidth: 0,
          backgroundColor: theme.palette.background.default,
          marginLeft: !isMobile ? (sidebarCollapsed ? 70 : 265) : 0, // ✅ content also shifts with sidebar
          transition: 'margin-left 0.3s ease'
        }}>
          <div style={{ flex: 1, padding: 0, background: theme.palette.background.paper, borderRadius: 0, boxShadow: 'none', minHeight: 0 }}>
            <div style={{ padding: '16px 24px 0 24px' }}>
              <CustomBreadcrumbs />
            </div>
            {children && React.isValidElement(children) ? React.cloneElement(children, { isSmallScreen: isMobile }) : <Outlet context={{ isSmallScreen: isMobile }} />}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
