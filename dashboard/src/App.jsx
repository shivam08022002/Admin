import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './store';
import { getTheme } from './Components/theme';
import { httpHelpers } from "./services/httpHelpers";
import Layout from './Components/Layout/Layout';
import Login from './Components/Login/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import Dashboard from './Components/Dashboard/Dashboard';
import Settings from './Components/Settings/Settings';
import SearchUser from './Components/SearchUser/SearchUsers';
import TokenService from './services/token-service';
import LiveMatches from './Components/LiveMatches/LiveMatches';
import MatchScreenCricket from './Components/LiveMatches/MatchScreen/MatchScreenCricket';
import BlockMarket from './Components/BlockMarket/BlockMarket';
import CommisionLimits  from './Components/Commision&Limits/CommisionAndLimits';
import MyDownlines from './Components/MyAgents/MyDownlines';
import MyClients from './Components/MyClients/MyClients';
import CricRegister from './Components/Register/Register';
import Update from './Components/ActionsBtn/Update';
import CricChangeUserPassword from './Components/ActionsBtn/CricChangeUserPassword';
import Change_Password from './Components/ChangePassword/Change_Password';

function App(props) {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          {/* ✅ All Redux hooks moved into child */}
          <AppRoutes {...props} darkMode={darkMode} setDarkMode={setDarkMode} />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

function AppRoutes({ role, logout, darkMode, setDarkMode }) {

  const [supportedSports, setSupportedSports] = useState();
  const [roleState, setRole] = useState(role || TokenService.getRole() || "Admin");
  const [cricketSupported, setCricketSupported] = useState();
  const [indianCasinoSupported, setIndianCasinoSupported] = useState();
  const [internationalCasinoSupported, setInternationalCasinoSupported] = useState();
  const [virtualCasinoSupported, setVirtualCasinoSupported] = useState();
  const [open, setOpen] = useState(false); 

  const { user: currentUser } = useSelector((state) => state.auth); // ✅ now inside Provider
  const navigate = useNavigate();

  const CRICKET = 'CRICKET';
  const INDIAN_CASINO = 'INDIAN_CASINO';
  const VIRTUAL_CASINO = 'VIRTUAL_CASINO';
  const INTERNATIONAL_CASINO = 'INTERNATIONAL_CASINO';
  const SPORTS_STATUS_UNBLOCKED = 'UNBLOCKED';


  useEffect(() => {
    if (currentUser?.accountStatus?.includes("ACTIVE") || currentUser?.accountStatus?.includes("NEW")) {
      setSupportedSports(currentUser.supportedSports);
    } else {
      console.log("JWT is null, not authorized!");
      navigate("/");
    }
  }, [currentUser, navigate]);

  const api = httpHelpers();

  const fetchSupportedSports = () => {
    api.get(`beta/getSupportedSports`)
      .then(res => setSupportedSports(res?.data || null))
      .catch(err => {
        if (err?.data?.status === 401 || err?.response?.status === 401) logout();
      });
  };

  
    useEffect(() => {
      if (supportedSports) {
        supportedSports.forEach(sport => {
          switch (sport.sportType) {
            case CRICKET:
              setCricketSupported(sport.status === SPORTS_STATUS_UNBLOCKED);
              break;
            case INDIAN_CASINO:
              setIndianCasinoSupported(sport.status === SPORTS_STATUS_UNBLOCKED);
              break;
            case VIRTUAL_CASINO:
              setVirtualCasinoSupported(sport.status === SPORTS_STATUS_UNBLOCKED);
              break;
            case INTERNATIONAL_CASINO:
              setInternationalCasinoSupported(sport.status === SPORTS_STATUS_UNBLOCKED);
              break;
            default:
              break;
          }
        });
      }
    }, [supportedSports]);    

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/live-matches" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><LiveMatches role={roleState} logout={logout} /></Layout></ProtectedRoute>} />
      <Route path="/complete-matches" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><LiveMatches role={roleState} logout={logout} /></Layout></ProtectedRoute>} />
      <Route path="/matchscreen/:sport/:id/:title"element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}> <MatchScreenCricket role={roleState} logout={logout} open={open} cricketSupported={cricketSupported} /></Layout></ProtectedRoute>} />

      {/* Users and Agents routes */}
      <Route path="/users/clients" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><MyClients role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/users/sm" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><MyDownlines role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/users/sc" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><MyDownlines role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/users/sst" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><MyDownlines role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/users/stockist" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><MyDownlines role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/users/agents" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><MyDownlines role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>

      {/* Registration routes */}
      <Route path="/register/user" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><CricRegister role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/register/sm" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><CricRegister role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/register/sc" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><CricRegister role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/register/sst" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><CricRegister role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/register/stockist" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><CricRegister role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/register/agent" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><CricRegister role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>

      {/* User management routes */}
      <Route path="/updateuser" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><Update role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/changeuserpassword" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><CricChangeUserPassword role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/change-password" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><Change_Password role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      
      {/* Ledgers routes */}
      <Route path="/ledgers/my-ledgers" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div style={{padding: '20px'}}><h2>My Ledgers</h2><p>Ledger functionality coming soon...</p></div></Layout></ProtectedRoute>}/>
      <Route path="/ledgers/lena-dena" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div style={{padding: '20px'}}><h2>Lena aur Dena</h2><p>Lena aur Dena functionality coming soon...</p></div></Layout></ProtectedRoute>}/>
      
      {/* Report route */}
      <Route path="/report" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div style={{padding: '20px'}}><h2>Report</h2><p>Report functionality coming soon...</p></div></Layout></ProtectedRoute>}/>
      
      {/* Dead Users route */}
      <Route path="/dead-users" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div style={{padding: '20px'}}><h2>Dead Users</h2><p>Dead Users functionality coming soon...</p></div></Layout></ProtectedRoute>}/>
      
      {/* Profit & Loss route */}
      <Route path="/profit-loss" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div style={{padding: '20px'}}><h2>Profit & Loss</h2><p>Profit & Loss functionality coming soon...</p></div></Layout></ProtectedRoute>}/>
      
      {/* Coin History route */}
      <Route path="/coin-history" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div style={{padding: '20px'}}><h2>Coin History</h2><p>Coin History functionality coming soon...</p></div></Layout></ProtectedRoute>}/>
      
      {/* Other routes same as before */}
      <Route path="/block-market" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><BlockMarket role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/search-user" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><SearchUser role={roleState} logout={logout} /></Layout></ProtectedRoute>}/>
      <Route path="/commissionlimits" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><CommisionLimits role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/settings" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><Settings role={roleState} logout={logout} /></Layout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
