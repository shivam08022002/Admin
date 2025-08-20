import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import './Change_Password.css';
import { changePassword, changePasswordProfile } from "../../actions/auth";
import TokenService from "../../services/token-service";
import { clearMessage } from "../../actions/message";

const Change_Password = ({ role, logout }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { message } = useSelector(state => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  // Calculate password strength


  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    };

    // Validate old password
    if (!oldPassword) {
      newErrors.oldPassword = 'Current password is required';
      isValid = false;
    }

    // Validate new password
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (newPassword.length < 6 || newPassword.length > 40) {
      newErrors.newPassword = 'Password must be between 6 and 40 characters';
      isValid = false;
    }

    // Validate confirm password
    if (!confirmNewPassword) {
      newErrors.confirmNewPassword = 'Please confirm your new password';
      isValid = false;
    } else if (confirmNewPassword !== newPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update state based on input field
    switch(name) {
      case 'oldPassword':
        setOldPassword(value);
        break;
      case 'newPassword':
        setNewPassword(value);
        // Clear confirm password error if they match now
        if (confirmNewPassword && value === confirmNewPassword) {
          setErrors(prev => ({...prev, confirmNewPassword: ''}));
        } else if (confirmNewPassword && value !== confirmNewPassword) {
          setErrors(prev => ({...prev, confirmNewPassword: 'Passwords do not match'}));
        }
        break;
      case 'confirmNewPassword':
        setConfirmNewPassword(value);
        // Check if passwords match
        if (value && value !== newPassword) {
          setErrors(prev => ({...prev, confirmNewPassword: 'Passwords do not match'}));
        } else {
          setErrors(prev => ({...prev, confirmNewPassword: ''}));
        }
        break;
      default:
        break;
    }

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: ''}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessful(false);

    try {
      const user = TokenService.getUser();
      let response;
      
      if (user && user.accountStatus === "ACTIVE") {
        response = await dispatch(changePasswordProfile(oldPassword, newPassword, role));
      } else {
        const userId = user.userId;
        response = await dispatch(changePassword(oldPassword, newPassword, userId, role));
      }
      
      if (response.status === 401) {
        if (response.data === "Wrong password") {
          setErrors(prev => ({...prev, oldPassword: 'Current password is incorrect'}));
        } else {
          logout();
        }
      } else if (response.status === 200) {
        setSuccessful(true);
        // Reset form
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
      
      setIsSubmitting(false);
    } catch (error) {
      console.error("Password change error:", error);
      setErrors(prev => ({
        ...prev, 
        oldPassword: error.message || 'An error occurred while changing password'
      }));
      setIsSubmitting(false);
    }
  };



  return (
    <div className="cp-change-password-container">
      <div className="cp-change-password-header">
        <h2>Change Password</h2>
      </div>

      <div className="cp-change-password-content">
        {!successful ? (
          <div className="cp-change-password-form-container">
            <form onSubmit={handleSubmit} className="cp-change-password-form">
              <div className="cp-change-password-card">
                <div className="cp-form-group">
                  <div className="cp-input-container">
                    <input
                      type="password"
                      id="oldPassword"
                      name="oldPassword"
                      className={`cp-password-input ${errors.oldPassword ? 'cp-input-error' : ''}`}
                      value={oldPassword}
                      onChange={handleInputChange}
                      placeholder="Enter current password"
                      autoComplete="current-password"
                    />
                    {errors.oldPassword && <div className="cp-error-message">{errors.oldPassword}</div>}
                  </div>
                </div>

                <div className="cp-form-group">
                  <div className="cp-input-container">
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className={`cp-password-input ${errors.newPassword ? 'cp-input-error' : ''}`}
                      value={newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                    />
                    {errors.newPassword && <div className="cp-error-message">{errors.newPassword}</div>}
                  </div>
                </div>

                <div className="cp-form-group">
                  <div className="cp-input-container">
                    <input
                      type="password"
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      className={`cp-password-input ${errors.confirmNewPassword ? 'cp-input-error' : ''}`}
                      value={confirmNewPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                    />
                    {errors.confirmNewPassword && <div className="cp-error-message">{errors.confirmNewPassword}</div>}
                  </div>
                </div>

                <div className="cp-button-container">
                  <button 
                    type="submit" 
                    className="cp-change-password-button2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Password'}
                  </button>
                </div>

                {message && !successful && (
                  <div className="cp-alert cp-alert-danger">{message}</div>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div className="cp-success-message-container">
            <div className="cp-success-icon">✓</div>
            <h3>Password Updated Successfully!</h3>
            <p>Your password has been changed. You can now use your new password to log in.</p>
          </div>
        )}
      </div>
    </div>
  );
};

Change_Password.propTypes = {
  role: PropTypes.string,
  logout: PropTypes.func
};

Change_Password.defaultProps = {
  role: '',
  logout: () => {}
};

export default Change_Password;