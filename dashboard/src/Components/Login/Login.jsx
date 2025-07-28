import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { login } from "../../actions/auth";
import TokenService from "../../services/token-service";
import { httpHelpers } from "../../services/httpHelpers";
import logoImage from '../../assets/logo-main2.png';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cantConnect, setCantConnect] = useState("");
  const { message, types } = useSelector(state => state.message);
  const dispatch = useDispatch();
  const api = httpHelpers();

  const fetchNotificationMessage = () => {
    api.get("alpha/getGlobalProperty/agentNotificationMessage")
      .then(res => {
        if (res && res.data) {
          navigate("/dashboard", { state: { notificationMessage: res.data } });
        } else {
          navigate("/dashboard");
        }
      })
      .catch(err => {
        console.error("Error fetching notification:", err);
        if (err?.response?.status === 401) {
          TokenService.clearUser();
          navigate("/");
        }
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCantConnect("");
    setLoading(true);

    if (!username || !password) {
      setCantConnect("Please enter both username and password");
      setLoading(false);
      return;
    }

    try {
      const data = await dispatch(login(username, password));
      
      if (data.status === 401) {
        setLoading(false);
      } else if (data && data.accessToken === null && data.accountStatus && data.accountStatus.includes("NEW")) {
        navigate("/changepassword");
      } else if (data.accountStatus.includes("NEW")) {
        navigate("/changepassword");
      } else if (data && data.accessToken && data.accountStatus && data.accountStatus.includes("ACTIVE")) {
        TokenService.setUser(data);
        fetchNotificationMessage();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log("Error during login:", error);
      setCantConnect("Connection Time Out.");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-section">
          <div className="brand-logo">
            <img src={logoImage} alt="STUMP EXCH" className="logo-main" />
          </div>
          {/* <h2>Welcome Back</h2> */}
          <p>Sign in to your account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-container">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toUpperCase())}
                placeholder=" "
              />
              <label htmlFor="username">Username</label>
            </div>
          </div>

          <div className="form-group">
            <div className="input-container">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
              />
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '🙈' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {message && (
            <div className={`message ${types === "CHANGE_PASSWORD_SUCCESS" ? "success" : "error"}`}>
              {message}
            </div>
          )}
          
          {cantConnect && (
            <div className="message error">
              {cantConnect}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : (
              'SIGN IN'
            )}
          </button>
        </form>
      <footer className="login-footer">
        <p>STUMPEXCH &copy; 2025 All Rights Reserved</p>
      </footer>
    </div>


  </div>
  );
};

export default Login;
