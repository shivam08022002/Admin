import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './store';
import { getTheme } from './Components/theme';
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
import LiveCasinoPage from './Components/Casino/LiveCasino/LiveCasino';
import VirtualCasino from './Components/Casino/VirtualCasino/VirtualCasino';
import SearchCasinoResult from './Components/Casino/SearchCasinoResult/SearchCasinoResult';
import ScrollToTop from './Components/ScrollToTop';
// Import Ledger Components
import CompanyLenDen from './Components/Ledgers/MyLedger/CompanyLenDen';
import ProfitAndLoss from './Components/Ledgers/ProfitLoss/ProfitAndLoss';
import EntityStatement from './Components/Ledgers/CoinHistory/EntityStatement';
import CollectionReport from './Components/Ledgers/LenaAurDena/CollectionReport';

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
  const [roleState] = useState(role || TokenService.getRole() || "Admin");
  const [cricketSupported, setCricketSupported] = useState();

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

  useEffect(() => {
      if (supportedSports) {
        supportedSports.forEach(sport => {
          switch (sport.sportType) {
            case CRICKET:
              setCricketSupported(sport.status === SPORTS_STATUS_UNBLOCKED);
              break;
            default:
              break;
          }
        });
      }
    }, [supportedSports]);    

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/live-matches" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><LiveMatches role={roleState} logout={logout} /></Layout></ProtectedRoute>} />
      <Route path="/complete-matches" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><LiveMatches role={roleState} logout={logout} /></Layout></ProtectedRoute>} />
      <Route path="/matchscreen/:sport/:id/:title"element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}> <MatchScreenCricket role={roleState} logout={logout} cricketSupported={cricketSupported} /></Layout></ProtectedRoute>} />

      {/* Casino routes */}
      <Route path="/livecasino" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><LiveCasinoPage role={roleState} logout={logout} /></Layout></ProtectedRoute>} />
      <Route path="/virtualcasino" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><VirtualCasino role={roleState} logout={logout} /></Layout></ProtectedRoute>} />
      <Route path="/searchcasinoresult" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><SearchCasinoResult role={roleState} logout={logout} /></Layout></ProtectedRoute>} />

      {/* Users and Agents routes */}
      <Route path="/users/clients" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><MyClients role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/clients" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><MyClients role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/users/create" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><CricRegister role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/users/sm" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><MyDownlines role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/users/sc" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><MyDownlines role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/users/sst" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><MyDownlines role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/users/stockist" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><MyDownlines role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/users/agents" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><MyDownlines role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/showagent" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><MyDownlines role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/showst" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><MyDownlines role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/showsst" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><MyDownlines role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/showsc" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><MyDownlines role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/showsm" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><MyDownlines role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>

      {/* Registration routes */}
      <Route path="/register/user" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><CricRegister role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/register/sm" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><CricRegister role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/register/sc" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><CricRegister role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/register/sst" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><CricRegister role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/register/stockist" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><CricRegister role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/register/agent" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><CricRegister role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>

      {/* User management routes */}
      <Route path="/updateuser" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><Update role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/changeuserpassword" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><CricChangeUserPassword role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/change-password" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><Change_Password role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      
      {/* Ledgers routes */}
      <Route path="/ledgers/my-ledger" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><CompanyLenDen role={roleState} logout={logout} /></Layout></ProtectedRoute>}/>
      <Route path="/ledgers/profit-loss" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><ProfitAndLoss role={roleState} logout={logout} /></Layout></ProtectedRoute>}/>
      <Route path="/ledgers/coin-history" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><EntityStatement role={roleState} logout={logout} /></Layout></ProtectedRoute>}/>
      <Route path="/ledgers/lena-dena" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><CollectionReport role={roleState} logout={logout} /></Layout></ProtectedRoute>}/>
      
      {/* Report route */}
      <Route path="/report" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><div style={{padding: '20px'}}><h2>Report</h2><p>Report functionality coming soon...</p></div></Layout></ProtectedRoute>}/>
      
      {/* Dead Users route */}
      <Route path="/dead-users" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><div style={{padding: '20px'}}><h2>Dead Users</h2><p>Dead Users functionality coming soon...</p></div></Layout></ProtectedRoute>}/>
      
      {/* Other routes same as before */}
      <Route path="/block-market" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><BlockMarket role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/search-user" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><SearchUser role={roleState} logout={logout} /></Layout></ProtectedRoute>}/>
      <Route path="/commissionlimits" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><CommisionLimits role={roleState} logout={logout}/></Layout></ProtectedRoute>}/>
      <Route path="/settings" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode} logout={logout}><Settings role={roleState} logout={logout} /></Layout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
