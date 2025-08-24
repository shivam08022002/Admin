import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Button,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuButtonSvg from '../../assets/MenuButtonSvg';
import TokenService from '../../services/token-service';
import { httpHelpers } from '../../services/httpHelpers';
import LogoutIcon from '@mui/icons-material/Logout';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  maxWidth: '300px',
  fontFamily: 'Open Sans, Arial, sans-serif',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  fontFamily: 'Open Sans, Arial, sans-serif',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    fontFamily: 'Open Sans, Arial, sans-serif',
  },
}));

const Header = ({ handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [balance, setBalance] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const api = httpHelpers();
        const response = await api.get("beta/getBalance");
        if (response?.data) setBalance(response.data);
      } catch (err) {
        console.error("Balance error:", err);
        if (err.response?.status === 401) {
          TokenService.removeUser();
          window.location.href = '/';
        }
      }
    };

    const user = TokenService.getUser();
    if (user?.accountStatus?.includes("ACTIVE")) {
      fetchBalance();
      const interval = setInterval(fetchBalance, 100000);
      return () => clearInterval(interval);
    } else if (user?.availableBalance) {
      setBalance(user.availableBalance);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 4);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        backgroundColor:'transparent !important',
        color: theme.palette.text.primary,
        zIndex: theme.zIndex.drawer + 1,
        boxShadow: 'none',
        borderBottom: scrolled ? (theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)') : 'none',
        transition: 'backdrop-filter 0.3s, background-color 0.3s',
      }}
    >
      <Toolbar variant="dense" sx={{ fontFamily: 'Open Sans, Arial, sans-serif', minHeight: 60, pl: 1, pr: 1}}>
        {/* Menu button and search should render after sidebar width */}
        <Box sx={{ width: { xs: 0, md: 0, lg: 0 } }} />
                 {/* Menu button (for mobile) */}
         {isMobile && (
           <IconButton
             color="inherit"
             aria-label="open drawer"
             onClick={handleDrawerToggle}
             edge="start"
             sx={{ 
               mr: 0, 
               ml: 1,
               pl: 1, 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'center',
               backgroundColor: '#3F4D67',
               borderRadius: '4px',
               width: '35px',
               height: '35px',
               padding: '0px',
               '&:hover': {
                backgroundColor: '#3F4D67'
              }
             }}
           >
             <MenuButtonSvg style={{ color: '#ffffff', width: 25, height: 25 }} />
           </IconButton>
         )}

        {/* Search removed for all views */}

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
          <Typography
            variant="body1"
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? '#222' : '#f0f0f0',
              px: 1,
              py: 1,
              mr: 2,
              borderRadius: 1,
              fontWeight: 500,
              fontFamily: 'Open Sans, Arial, sans-serif',
              fontSize: { xs: '0.95rem', sm: '0.95rem' },
              minWidth: 90,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <span style={{ marginRight: 4 }}>₹</span> {balance.toFixed(2)}
          </Typography>
          {/* <IconButton
            onClick={toggleDarkMode}
            color="inherit"
            sx={{ ml: { xs: 0, sm: 1 } }}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </IconButton> */}
                     <Button
             variant="contained"
             onClick={() => {
               TokenService.removeUser();
               window.location.href = '/';
             }}
             startIcon={<LogoutIcon />}
             sx={{
               ml: { xs: 0, sm: 1 },
               backgroundColor: '#ff0000',
               color: '#fff',
               fontWeight: 600,
               padding: '7px 14px',
               textTransform: 'none',
               boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
               '&:hover': { 
                 backgroundColor: '#cc0000',
                 boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
               },
             }}
           >
             Logout
           </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
