import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useMemo, useState } from 'react';
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

function App(role, logout) {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);


  let mRole = role || TokenService.getRole() || "Admin";
  let eType = "Admin";

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><Dashboard /></Layout></ProtectedRoute>}/>
            <Route path="/live-matches" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div>Live Matches Component</div></Layout></ProtectedRoute>} />
            <Route path="/complete-matches" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div>Complete Matches Component</div></Layout></ProtectedRoute>} />

            {/* Users Routes */}
            <Route path="/users" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div>Users</div></Layout></ProtectedRoute>} />
            <Route path="/users/create" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div>Create Users</div></Layout></ProtectedRoute>} />
            <Route path="/users/sm" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div>SM Users</div></Layout></ProtectedRoute>} />
            <Route path="/users/sc" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div>SC Users</div></Layout></ProtectedRoute>} />
            <Route path="/users/stockist" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div>Stockist</div></Layout></ProtectedRoute>} />
            <Route path="/users/agents" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div>Agents</div></Layout></ProtectedRoute>} />
            
            {/* Ledger Routes */}
            <Route path="/ledgers" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div>Ledgers</div></Layout></ProtectedRoute>} />
            
            {/* Reports Routes */}
            <Route path="/report" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div>Reports</div></Layout></ProtectedRoute>} />
            <Route path="/report/daily" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div>Daily Report</div></Layout></ProtectedRoute>} />
            <Route path="/report/monthly" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div>Monthly Report</div></Layout></ProtectedRoute>} />

            {/* Other Routes */}
            <Route path="/dead-users" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div>Dead Users</div></Layout></ProtectedRoute>} />
            <Route path="/block-market" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div>Block Market</div></Layout></ProtectedRoute>} />
            <Route path="/profit-loss" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div>Profit & Loss</div></Layout></ProtectedRoute>} />
            <Route path="/coin-history" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div>Coin History</div></Layout></ProtectedRoute>} />
            <Route path="/search-user" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><SearchUser role={role} logout={logout} /></Layout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><Settings role={role} logout={logout} /></Layout></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute><Layout darkMode={darkMode} setDarkMode={setDarkMode}><div>Change Password</div></Layout></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
