import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import TokenService from "../../services/token-service.js";
import { editAgent, editUser } from "../../actions/auth.js";
import "../../index.css";
import { clearMessage } from "../../actions/message.js";
import "./Update.css";

const ToggleSwitch = ({ value, onToggle, disabled }) => {
    return (
        <button
            className={`toggle-switch ${value ? 'active' : 'inactive'} ${disabled ? 'disabled' : ''}`}
            onClick={() => !disabled && onToggle(!value)}
            disabled={disabled}
            type="button"
            role="switch"
            aria-checked={value}
        >
            <span className="toggle-switch-handle" />
        </button>
    );
};

ToggleSwitch.propTypes = {
    value: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

ToggleSwitch.defaultProps = {
    disabled: false
};

const Update = ({ logout }) => {
    const user = TokenService.getUser();
    if (user === null) {
        logout();
    }
    const { state } = useLocation();
    if (state === null) {
        logout();
    }
    const { child } = state ? state : "";
    
    let formHeader = "User";
    if (child) {
        if (child.entityType.includes("subsubcompany")) {
            formHeader = "SSC";
        } else if (child.entityType.includes("subcompany")) {
            formHeader = "Sub Company";
        } else if (child.entityType.includes("superstockist")) {
            formHeader = "Super Stockist";
        } else if (child.entityType.includes("stockist")) {
            formHeader = "Stockist";
        } else if (child.entityType.includes("agent")) {
            formHeader = "Agent";
        }
    }
    
    const [userId] = useState(child ? child.userId : "");
    const [firstName, setFirstName] = useState(child ? child.firstName : "");
    const [lastName, setLastName] = useState(child ? child.lastName : "");
    const [currentLimit, setCurrentLimit] = useState(child ? child.balance : 0);
    const [status] = useState(child ? child.accountStatus : "");
    const [successful, setSuccessful] = useState(false);
    const [agentBlocked, setAgentBlocked] = useState(status === "BLOCKED" ? true : false);
    const [betsBlocked, setBetsBlocked] = useState(status === "BETSBLOCKED" ? true : false);
    const [errors, setErrors] = useState({});

    const { message } = useSelector(state => state.message);
    const dispatch = useDispatch();
    let navigate = useNavigate();

    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch]);

    const onChangeCurrentLimit = (e) => {
        const newValue = e.target.value;
        if (newValue === '' || (/^\d+$/.test(newValue))) {
            if (Number(newValue) > Number(user.balance)) {
                setCurrentLimit(user.balance);
            } else if (Number(newValue) < 0) {
                setCurrentLimit(0);
            } else {
                setCurrentLimit(newValue);
            }
        } else {
            setCurrentLimit(child.balance);
        }
    };

    const cancel = (e) => {
        e.preventDefault();
        navigate(-1);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!firstName.trim()) {
            newErrors.firstName = "This field is required!";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleEdit = (e) => {
        e.preventDefault();
        setSuccessful(false);
        
        if (validateForm()) {
            let status = "ACTIVE";
            if (betsBlocked) {
                status = "BETSBLOCKED";
            }
            if (agentBlocked) {
                status = "BLOCKED";
            }

            if (child.entityType.includes("user")) {
                // Use editUser action for user entities
                dispatch(editUser(userId, firstName + " " + lastName, status, "", child.exposureLimit))
                    .then((data) => {
                        if (data.status === 401) {
                            if (data.data === "Wrong password") {
                                setSuccessful(false);
                            } else {
                                logout();
                            }
                        } else if (data.data === "Admin balance not sufficient" || data.data === "Insuffcient Balance") {
                            setSuccessful(false);
                        } else if (data.status === 200) {
                            setSuccessful(true);
                            let msg = "User " + data.data.userId + " is Updated Successfully!";
                            if (agentBlocked)
                                msg = "User " + data.data.userId + " is Blocked Successfully!";
                            else if (betsBlocked)
                                msg = "User " + data.data.userId + " Bets Blocked Successfully!";

                            navigate('/clients', { state: { msg } });
                        }
                    })
                    .catch(() => {});
            } else {
                // Use editAgent action for all other entity types
                dispatch(editAgent(userId, status, child.matchCommission, child.sessionCommission, child.entityType))
                    .then((data) => {
                        if (data.status === 401) {
                            if (data.data === "Wrong password") {
                                setSuccessful(false);
                            } else {
                                logout();
                            }
                        } else if (data.data === "Admin balance not sufficient" || data.data === "Insuffcient Balance") {
                            setSuccessful(false);
                        } else if (data.status === 200) {
                            setSuccessful(true);
                            let eType = data.data.entityType;
                            let entt = "User ";
                            if (eType !== "user")
                                entt = "Agent ";
                            let msg = entt + data.data.userId + " is Updated Successfully!";
                            if (agentBlocked)
                                msg = entt + data.data.userId + " is Blocked Successfully!";
                            else if (betsBlocked)
                                msg = entt + data.data.userId + " Bets Blocked Successfully!";

                            if (eType.includes("subsubcompany")) {
                                navigate('/showsm', { state: { msg } });
                            } else if (eType.includes("subcompany")) {
                                navigate('/showsc', { state: { msg } });
                            } else if (eType.includes("superstockist")) {
                                navigate('/showsst', { state: { msg } });
                            } else if (eType.includes("stockist")) {
                                navigate('/showst', { state: { msg } });
                            } else if (eType.includes("agent")) {
                                navigate('/showagent', { state: { msg } });
                            }
                        }
                    })
                    .catch(() => {});
            }
        }
    };

    return (
        <div className="page-container">
            <div className="content-container">
                <div className="card-container">
                    {!successful && (
                        <div className="header">
                            <h2 className="header-title">Edit {formHeader}</h2>
                        </div>
                    )}
                    <div className="form-container">
                        <form onSubmit={handleEdit} className="form">
                            {!successful && (
                                <div className="form-content">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="username">User ID</label>
                                        <input
                                            id="reg_username"
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            value={userId}
                                            disabled
                                            style={{ backgroundColor: "#f8f9fa" }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="fname">First Name</label>
                                        <input
                                            id="reg_fname"
                                            type="text"
                                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                            name="fname"
                                            maxLength="20"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                        {errors.firstName && (
                                            <div className="invalid-feedback">
                                                {errors.firstName}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="lname">Last Name</label>
                                        <input
                                            id="reg_lname"
                                            type="text"
                                            className="form-control"
                                            name="lname"
                                            maxLength="20"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="currentLimit">Current Limit</label>
                                        <div className="input-with-note">
                                            <input
                                                type="tel"
                                                id="reg_climit"
                                                className="form-control"
                                                name="currentLimit"
                                                value={currentLimit}
                                                onChange={onChangeCurrentLimit}
                                                style={{ backgroundColor: "#f8f9fa" }}
                                                disabled
                                            />
                                            <div className="note">
                                                <span className="note-label">Note:</span>
                                                <span className="note-text">Initial Balance can be set from 0 to {user.balance}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="matchShare">My Match Share</label>
                                        <div className="input-with-note">
                                            <input
                                                type="tel"
                                                id="reg_mmshare"
                                                className="form-control"
                                                name="matchShare"
                                                value={child.userId.includes("user") ? user.share : child.share}
                                                style={{ backgroundColor: "#f8f9fa" }}
                                                disabled
                                            />
                                            <div className="note">
                                                <span className="note-label">Note:</span>
                                                <span className="note-text">My Match Share can be set from 0 to {user.share}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {child.userId.includes("user") && (
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="share">Match Share</label>
                                            <div className="input-with-note">
                                                <input
                                                    type="tel"
                                                    id="reg_amshare"
                                                    className="form-control"
                                                    name="share"
                                                    value={child.share}
                                                    disabled
                                                    style={{ backgroundColor: "#f8f9fa" }}
                                                />
                                                <div className="note">
                                                    <span className="note-label">Note:</span>
                                                    <span className="note-text">Match Share can be set from 0 to {user.share - child.share}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="matchCommission">Match Commission</label>
                                        <div className="input-with-note">
                                            <input
                                                type="tel"
                                                id="reg_amc"
                                                className="form-control"
                                                name="matchCommission"
                                                value={child.matchCommission}
                                                disabled
                                                style={{ backgroundColor: "#f8f9fa" }}
                                            />
                                            <div className="note">
                                                <span className="note-label">Note:</span>
                                                <span className="note-text">Match Commission can be set from 0 to {user.matchCommission}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="sessionCommission">Session Commission</label>
                                        <div className="input-with-note">
                                            <input
                                                type="tel"
                                                id="reg_asc"
                                                className="form-control"
                                                name="sessionCommission"
                                                value={child.sessionCommission}
                                                disabled
                                                style={{ backgroundColor: "#f8f9fa" }}
                                            />
                                            <div className="note">
                                                <span className="note-label">Note:</span>
                                                <span className="note-text">Session Commission can be set from 0 to {user.sessionCommission}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="agentBlocked">Agent Blocked</label>
                                        <div className="toggle-container">
                                            <ToggleSwitch
                                                value={agentBlocked}
                                                onToggle={setAgentBlocked}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="betsBlocked">Bets Blocked</label>
                                        <div className="toggle-container">
                                            <ToggleSwitch
                                                value={betsBlocked}
                                                onToggle={setBetsBlocked}
                                                disabled={agentBlocked}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="button button-secondary" 
                                    onClick={cancel}
                                >
                                    Cancel
                                </button>
                                {!successful && (
                                    <button 
                                        type="submit" 
                                        className="button button-primary"
                                    >
                                        Save Changes
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                    
                    {message && (
                        <div className="alert-container">
                            <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                                {message ? message : (userId + " Details Updated Successfully!")}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

Update.propTypes = {
    logout: PropTypes.func.isRequired,
    isSmallScreen: PropTypes.bool
};

Update.defaultProps = {
    isSmallScreen: false
};

export default Update;