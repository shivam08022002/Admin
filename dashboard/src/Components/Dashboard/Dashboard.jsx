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
  const [isLoadingUserCounts, setIsLoadingUserCounts] = useState(false);
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
    fetchActiveUserCounts();
  }, []);

  // Refresh user counts every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchActiveUserCounts();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
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

  const fetchActiveUserCounts = async () => {
    setIsLoadingUserCounts(true);
    try {
      const api = httpHelpers();
      const user = TokenService.getUser();
      
      console.log("Current User:", user);
      console.log("Current User ID:", user?.userId);
      console.log("Current User Entity Type:", user?.entityType);
      
      // Use getImmediateChildren API to get all user types in one call
      const response = await api.get(`beta/getImmediateChildren?agentId=${user.userId}`);
      
      console.log("Dashboard API Response:", response);
      console.log("Dashboard API Data:", response?.data);
      
      if (response?.data) {
        const activeUsers = { sm: 0, sc: 0, sst: 0, stockist: 0, agents: 0 };
        
        // Count all users for each type (not just ACTIVE ones)
        if (response.data.submaster && Array.isArray(response.data.submaster)) {
          activeUsers.sm = response.data.submaster.length;
        }
        
        if (response.data.subcompany && Array.isArray(response.data.subcompany)) {
          activeUsers.sc = response.data.subcompany.length;
        }
        
        if (response.data.superstockist && Array.isArray(response.data.superstockist)) {
          activeUsers.sst = response.data.superstockist.length;
        }
        
        if (response.data.stockist && Array.isArray(response.data.stockist)) {
          activeUsers.stockist = response.data.stockist.length;
        }
        
        if (response.data.agent && Array.isArray(response.data.agent)) {
          activeUsers.agents = response.data.agent.length;
        }
        
        setDashboardData(prev => ({
          ...prev,
          activeUsers
        }));
        
        console.log("Active User Counts:", activeUsers);
      }
    } catch (err) {
      console.error("Error fetching active user counts:", err);
    } finally {
      setIsLoadingUserCounts(false);
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
    // Users by type (matching sidebar subitems)
    {
      title: "Total Users",
      value: isLoadingUserCounts ? "Loading..." : (dashboardData.activeUsers.sm + dashboardData.activeUsers.sc + dashboardData.activeUsers.sst + dashboardData.activeUsers.stockist + dashboardData.activeUsers.agents),
      color: "#03c000",
      icon: FaUsers
    },
    {
      title: "SM",
      value: isLoadingUserCounts ? "Loading..." : dashboardData.activeUsers.sm,
      color: "#9c34a8",
      icon: FaUsers
    },
    {
      title: "SC",
      value: isLoadingUserCounts ? "Loading..." : dashboardData.activeUsers.sc,
      color: "#00bcd4",
      icon: FaUsers
    },
    {
      title: "SST",
      value: isLoadingUserCounts ? "Loading..." : dashboardData.activeUsers.sst,
      color: "#ab47bc",
      icon: FaUsers
    },
    {
      title: "Stockist",
      value: isLoadingUserCounts ? "Loading..." : dashboardData.activeUsers.stockist,
      color: "#ff7043",
      icon: FaUsers
    },
    {
      title: "Agents",
      value: isLoadingUserCounts ? "Loading..." : dashboardData.activeUsers.agents,
      color: "#607d8b",
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
