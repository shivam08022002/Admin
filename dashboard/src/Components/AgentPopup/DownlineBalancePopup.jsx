import React, { useState, useEffect } from "react";
import "../../index.css";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../../actions/message";
import { httpHelpers } from "../../services/httpHelpers";
import "./DownlineBalancePopup.css";

const DownlineBalancePopup = ({ role, logout, child, closeDownlineBalancePopup }) => {
    const { message } = useSelector(state => state.message);
    const dispatch = useDispatch();
    const api = httpHelpers();
    const [balance, setBalance] = useState("...");

    const fetchBalance = () => {
        api
            .get(`beta/getDownLineBalance?userId=${child.userId}`)
            .then(res => {
                setBalance(res?.data || null);
            })
            .catch(err => {
                console.log("Error:", err);
                if (err?.data?.status === 401 || err?.response?.status === 401) {
                    logout();
                }
            });
    };

    useEffect(() => {
        dispatch(clearMessage());
        fetchBalance();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    return (
        <div className="balance-popup-overlay">
            <div className="balance-popup-modal">
                <div className="balance-popup-header">
                    <h3>Downline Balance</h3>
                    <button className="balance-popup-close" onClick={closeDownlineBalancePopup}>
                        ×
                    </button>
                </div>
                
                <div className="balance-popup-body">
                    <div className="balance-user-card">
                        <div className="balance-user-avatar">
                            {child.userId.charAt(0).toUpperCase()}
                        </div>
                        <div className="balance-user-info">
                            <h4>{child.firstName || child.displayName || 'N/A'}</h4>
                            <p>{child.userId}</p>
                        </div>
                    </div>

                    <div className="balance-amount-card">
                        <div className="balance-amount-label">Current Balance</div>
                        <div className="balance-amount-value">
                            {balance === "..." ? (
                                <div className="balance-loading">Loading...</div>
                            ) : balance === null ? (
                                <div className="balance-no-data">No data available</div>
                            ) : (
                                <div className="balance-currency">{formatCurrency(balance)}</div>
                            )}
                        </div>
                    </div>

                    <button className="balance-refresh-btn" onClick={fetchBalance}>
                         Refresh Balance
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DownlineBalancePopup;