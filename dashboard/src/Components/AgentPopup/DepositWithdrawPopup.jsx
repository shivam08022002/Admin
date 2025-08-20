import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from "react-redux";
import { httpHelpers } from '../../services/httpHelpers';
import './DepositWithdrawPopup.css';
import { makeTransaction } from "../../actions/auth";
import { clearMessage } from "../../actions/message";
import { SET_MESSAGE } from "../../actions/types";
import { DEPOSIT_COINS, WITHDRAW_COINS } from "../../common/constants";

const DepositWithdrawPopup = ({ user, onClose, activeTab, setActiveTab }) => {
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [successful, setSuccessful] = useState(false);
  const [showError, setShowError] = useState(null);
  
  const api = httpHelpers();
  
  const dispatch = useDispatch();
  const { message } = useSelector(state => state.message || { message: null });
  
  useEffect(() => {
    // Fetch current balance when component mounts or tab changes
    if (user && user.userId) {
      fetchCurrentBalance();
    }
    
    // Clear any previous messages
    dispatch(clearMessage());
  }, [user, activeTab]);

  const fetchCurrentBalance = async () => {
    try {
      const response = await api.get(`/beta/getUserBalance/${user.userId}`);
      if (response && response.data) {
        setCurrentBalance(response.data.balance || 0);
      }
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset the form when switching tabs
    setAmount('');
    setRemark('');
    setError('');
    setSuccess('');
    setShowError(null);
    setSuccessful(false);
  };

  const onChangeAmount = (e) => {
    const newValue = e.target.value;
    if (newValue === '' || (/^\d+$/.test(newValue))) {
      setAmount(newValue);
    } else {
      setAmount(0);
    }
  };

  const validateForm = () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      setShowError('Please enter a valid amount');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');
    setShowError(null);
    setSuccessful(false);

    dispatch(clearMessage());

    // Map activeTab to action constants
    const action = activeTab === 'deposit' ? DEPOSIT_COINS : WITHDRAW_COINS;
    
    try {
      const data = await dispatch(makeTransaction(user.userId, remark, action, amount));
      
      if (data.status === 401) {
        if (data.data === "Wrong password") {
          setSuccessful(false);
        } else {
          // If you have logout functionality, call it here
          // logout();
          onClose();
        }
      } else if (data.status === 200) {
        setSuccessful(true);
        let msg = `Successfully ${activeTab === 'deposit' ? 'deposited' : 'withdrawn'} ${amount} ${activeTab === 'deposit' ? 'to' : 'from'} user ${user.userId}`;
        setSuccess(msg);
        
        // Refresh balance after successful transaction
        fetchCurrentBalance();
        
        setAmount('');
        setRemark('');
      } else if (data.status === 400) {
        console.error("Transaction error:", data.data);
        setShowError(data.data);
        setError(data.data);
        setSuccessful(false);
      } else {
        setSuccessful(false);
        dispatch({
          type: SET_MESSAGE,
          payload: data.data
        });
      }
    } catch (err) {
      console.error(`Error during ${activeTab}:`, err);
      setError(err.message || `Failed to ${activeTab}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "Loading...";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="dw-deposit-withdraw-popup">
      <div className="dw-deposit-withdraw-header">
        <h3 className="dw-deposit-withdraw-title">
          {activeTab === 'deposit' ? 'Deposit Balance' : 'Withdraw Balance'}
          <div className="dw-user-id"> - {user.userId}</div>
        </h3>

        <button className="dw-close-button" onClick={onClose} title="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="dw-deposit-withdraw-tabs">
        <button 
          className={`dw-deposit-withdraw-tab ${activeTab === 'deposit' ? 'active' : ''}`}
          onClick={() => handleTabChange('deposit')}
        >
          Deposit
        </button>
        <button 
          className={`dw-deposit-withdraw-tab ${activeTab === 'withdraw' ? 'active' : ''}`}
          onClick={() => handleTabChange('withdraw')}
        >
          Withdraw
        </button>
      </div>
      
      <div className="dw-deposit-withdraw-content">

        {currentBalance !== null && (
          <div className="dw-amount-display">
            <span className="dw-amount-label">Current Balance</span>
            <span className="dw-amount-value">{formatCurrency(currentBalance)}</span>
          </div>
        )}
        
        {(success || message) && successful && (
          <div className="dw-form-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            {success || message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="dw-form-group">
            <label htmlFor="amount">{activeTab === 'deposit' ? 'Deposit Amount' : 'Withdrawal Amount'}</label>
            <input
              type="text"
              id="amount"
              className="dw-form-control"
              value={amount}
              onChange={onChangeAmount}
              placeholder={`Enter ${activeTab} amount`}
              required
            />
            {(error || showError) && (
              <div className="dw-form-error">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error || showError}
              </div>
            )}
          </div>
          
          <div className="dw-form-group">
            <label htmlFor="remark">Remark (optional)</label>
            <input
              type="text"
              id="remark"
              className="dw-form-control"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter transaction remark"
            />
          </div>
          
          <button 
            type="submit" 
            className="dw-submit-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="dw-spinner"></span>
                Processing...
              </>
            ) : (
              activeTab === 'deposit' ? 'Complete Deposit' : 'Complete Withdrawal'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

DepositWithdrawPopup.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    name: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  activeTab: PropTypes.oneOf(['deposit', 'withdraw']).isRequired,
  setActiveTab: PropTypes.func.isRequired
};

export default DepositWithdrawPopup; 