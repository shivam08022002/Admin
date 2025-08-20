import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useLocation } from 'react-router-dom';
import TokenService from '../../services/token-service';
import { httpHelpers } from '../../services/httpHelpers';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box,
  CircularProgress
} from '@mui/material';
import {
  FaUser,
  FaUserShield,
  FaWallet,
  FaBuilding,
  FaPercent,
  FaHandshake,
  FaUsers,
  FaUserTie
} from 'react-icons/fa';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  height: '100%',
  minHeight: 140,
  aspectRatio: '2/1',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '6px',
    height: '100%',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    backgroundColor: color,
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    '&::before': {
      opacity: 1,
    },
  },
  [theme.breakpoints.down('sm')]: {
    aspectRatio: 'unset',
    minHeight: 110,
    width: '100%',
    padding: theme.spacing(2),
  },
}));

const IconBox = styled(Box)(({ theme, bgcolor }) => ({
  width: 56,
  height: 56,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(2),
  backgroundColor: bgcolor,
  flexShrink: 0,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
}));

const Dashboard = () => {
  const { state } = useLocation();
  const { notificationMessage } = state || {};
  const [openDialog, setOpenDialog] = useState(!!notificationMessage);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    balance: 0,
    activeUsers: {
      sm: 0,
      sc: 0,
      sst: 0,
      stockist: 0,
      agents: 0
    }
  });

  const user = TokenService.getUser();
  const [userData] = useState({
    username: user?.userId || "",
    name: user ? `${user.firstName} ${user.lastName}` : "",
    level: user?.entityType || "ADMIN",
    balance: user?.balance || "0.00",
    companyContact: user?.parentId || "-",
    myShare: user?.share || "0",
    companyShare: user ? 100 - user.share : "0",
    matchCommission: user?.matchCommission || "0",
    sessionCommission: user?.sessionCommission || "0",
  });

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    setIsLoading(true);
    try {
      const api = httpHelpers();
      const response = await api.get("beta/getBalance");
      if (response?.data) {
        setDashboardData(prev => ({
          ...prev,
          balance: response.data
        }));
        
        // Update user token with new balance
        let temp = TokenService.getUser();
        if (temp) {
          temp.balance = response.data;
          TokenService.setUser(temp);
        }
      }
    } catch (err) {
      console.error("Error fetching balance:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardItems = [
    {
      title: "Username",
      value: userData.username,
      subtext: userData.name,
      color: "#3b556e",
      icon: FaUser
    },
    {
      title: "My Level",
      value: userData.level,
      color: "#2196f3",
      icon: FaUserShield
    },
    {
      title: "Balance",
      value: isLoading ? "Loading..." : userData.balance,
      color: "#4caf50",
      icon: FaWallet
    },
    {
      title: "Company Contact",
      value: userData.companyContact,
      color: "#ff9800",
      icon: FaBuilding
    },
    {
      title: "My Share",
      value: `${userData.myShare}%`,
      color: "#9c27b0",
      icon: FaPercent
    },
    {
      title: "Company Share",
      value: `${userData.companyShare}%`,
      color: "#673ab7",
      icon: FaHandshake
    },
    {
      title: "Match Commission",
      value: `${userData.matchCommission}%`,
      color: "#3f51b5",
      icon: FaPercent
    },
    {
      title: "Session Commission",
      value: `${userData.sessionCommission}%`,
      color: "#009688",
      icon: FaPercent
    },
    // Active Users by type (matching sidebar subitems)
    {
      title: "Active SM",
      value: dashboardData.activeUsers.sm,
      color: "#8bc34a",
      icon: FaUsers
    },
    {
      title: "Active SC",
      value: dashboardData.activeUsers.sc,
      color: "#00bcd4",
      icon: FaUsers
    },
    {
      title: "Active SST",
      value: dashboardData.activeUsers.sst,
      color: "#ab47bc",
      icon: FaUsers
    },
    {
      title: "Active Stockist",
      value: dashboardData.activeUsers.stockist,
      color: "#ff7043",
      icon: FaUsers
    },
    {
      title: "Active Agents",
      value: dashboardData.activeUsers.agents,
      color: "#607d8b",
      icon: FaUsers
    },
    {
      title: "Total Active Users",
      value: dashboardData.activeUsers.sm + dashboardData.activeUsers.sc + dashboardData.activeUsers.sst + dashboardData.activeUsers.stockist + dashboardData.activeUsers.agents,
      color: "#ff9800",
      icon: FaUsers
    },
  ];

  return (
    <Box sx={{ p: 3 }}>

      <Grid container spacing={3} alignItems="stretch">
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index} sx={{ display: 'flex', width: { xs: '100%', sm: 'auto' }, p: 0 }}>
            <StyledPaper color={item.color} sx={{ width: { xs: '100%', sm: '100%' }, m: { xs: 0, sm: 'auto' } }}>
              <IconBox bgcolor={item.color}>
                {item.icon && <item.icon style={{ color: '#fff', fontSize: 24 }} />}
              </IconBox>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {item.title}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {item.value}
                </Typography>
                {item.subtext && (
                  <Typography variant="body2" color="textSecondary">
                    {item.subtext}
                  </Typography>
                )}
              </Box>
            </StyledPaper>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!notificationMessage && openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="notification-dialog-title"
        aria-describedby="notification-dialog-description"
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            py: 2,
          },
        }}
      >
        <DialogTitle id="notification-dialog-title" sx={{ width: '100%', textAlign: 'center', fontWeight: 600 }}>
          Notification
        </DialogTitle>
        <DialogContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
          <Typography id="notification-dialog-description" sx={{ width: '100%', textAlign: 'center' }}>{notificationMessage}</Typography>
        </DialogContent>
        <DialogActions sx={{ width: '100%', justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setOpenDialog(false)} autoFocus variant="contained" sx={{ minWidth: 100 }}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
