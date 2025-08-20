import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { changeUserPassword } from "../../actions/auth.js";
import "../../index.css";
import { clearMessage } from "../../actions/message.js";
import "./Update.css";
import "./CricChangeUserPassword.css";
import TableTitle from "../customized/TableTitle";

// You might need to install these packages if not already installed
// npm install react-icons
import { FaUser, FaLock, FaKey, FaCheck, FaTimes } from 'react-icons/fa';

const CricChangeUserPassword = ({ role, logout }) => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { message } = useSelector(state => state.message);
    const [successful, setSuccessful] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    
    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch]);
    
    if (!state || !state.child) {
        logout();
        return null;
    }
    
    const { child } = state;
    console.log("change upwd", child);

    const cancel = (e) => {
        e.preventDefault();
        navigate(-1);
    };

    // Updated to work with Formik
    const handleChangeUserPassword = (values, { setSubmitting }) => {
        setSuccessful(false);

        dispatch(changeUserPassword(
            values.username,  // userId
            values.yourpassword,  // myPassword
            values.password,  // password (new password)
            child.entityType, // entityType
            child.entityType  // role - use entityType as role
        ))
            .then((data) => {
                console.log("user password data: ", data);
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
                    const entityType = child.entityType;
                    const msg = values.username + " Password Changed Successfully!";
                    setSuccessMessage(msg);
                    
                    // Delay navigation to show success message to user
                    setTimeout(() => {
                        if (entityType.includes("user")) {
                            navigate('/create-users', { state: { msg } });
                        } else if (entityType.includes("subsubcompany")) {
                            navigate('/SSC', { state: { msg } });
                        } else if (entityType.includes("subcompany")) {
                            navigate('/SC', { state: { msg } });
                        } else if (entityType.includes("superstockist")) {
                            navigate('/SST', { state: { msg } });
                        } else if (entityType.includes("stockist")) {
                            navigate('/ST', { state: { msg } });
                        } else if (entityType.includes("agent")) {
                            navigate('/AGENT', { state: { msg } });
                        }
                    }, 1500);
                }
                setSubmitting(false);
            })
            .catch((error) => {
                console.error(error);
                setSuccessful(false);
                setSubmitting(false);
            });
    };

    // Password strength indicator
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: 'None', color: '#ddd' };
        
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        const strengthMap = [
            { label: 'Weak', color: '#ff4d4d' },
            { label: 'Fair', color: '#ffaa00' },
            { label: 'Good', color: '#2196F3' },
            { label: 'Strong', color: '#4CAF50' }
        ];
        
        return { 
            strength, 
            label: strengthMap[strength - 1]?.label || 'None', 
            color: strengthMap[strength - 1]?.color || '#ddd'
        };
    };

    return (
        <div className="cpwd-change-password-top-container">
            <div className="cpwd-register-container">
                {successful && (
                    <div className="cpwd-form-group cpwd-success-message-container">
                        <div className="cpwd-alert cpwd-alert-success" role="alert">
                            <FaCheck className="cpwd-alert-icon" />
                            <span>{successMessage || "Password changed successfully!"}</span>
                        </div>
                    </div>
                )}
                {!successful && message && (
                    <div className="cpwd-form-group">
                        <div className="cpwd-alert cpwd-alert-danger" role="alert">
                            <FaTimes className="cpwd-alert-icon" />
                            <span>{message}</span>
                        </div>
                    </div>
                )}
                {!successful && (
                    <div className="cpwd-card">
                        <div className="cpwd-title-container">
                            <TableTitle
                                text="Change User Password"
                                color="#ffffff"
                                fontSize="14px"
                                textAlign="left"
                                width="100%"
                                height="42px"
                                marginLeft="0px"
                                marginRight="0px"
                                paddingLeft="10px"
                            />
                        </div>
                        <div className="cpwd-card-container">
                            <Formik
                                initialValues={{
                                    username: child ? child.userId : "",
                                    password: "",
                                    confirmPassword: "",
                                    yourpassword: ""
                                }}
                                validationSchema={Yup.object({
                                    username: Yup.string()
                                        .required('User Name is required'),
                                    password: Yup.string()
                                        .required('Password is required')
                                        .min(6, 'Password must be between 6 and 40 characters')
                                        .max(40, 'Password must be between 6 and 40 characters'),
                                    confirmPassword: Yup.string()
                                        .oneOf([Yup.ref('password'), null], 'Passwords must match')
                                        .required('Confirm Password is required'),
                                    yourpassword: Yup.string()
                                        .required('Your Password is required')
                                        .min(6, 'Your Password must be between 6 and 40 characters')
                                        .max(40, 'Your Password must be between 6 and 40 characters')
                                })}
                                onSubmit={handleChangeUserPassword}
                            >
                                {({ isSubmitting, values }) => {
                                    const passwordStrength = getPasswordStrength(values.password);
                                    
                                    return (
                                        <Form>
                                            <div className="cpwd-form-group">
                                                <div className="cpwd-form-label-input-container-add">
                                                    <div className="cpwd-div-label-form">
                                                        <label className="cpwd-label-form" htmlFor="username">
                                                            <FaUser className="cpwd-input-icon" /> User Name
                                                        </label>
                                                    </div>
                                                    <div className="cpwd-div-input-form">
                                                        <div className="cpwd-input-with-icon">
                                                            <Field
                                                                id="reg_username"
                                                                type="text"
                                                                className="cpwd-form-control"
                                                                name="username"
                                                                disabled
                                                            />
                                                        </div>
                                                        <ErrorMessage name="username" component="div" className="cpwd-alert cpwd-alert-danger" />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="cpwd-form-group">
                                                <div className="cpwd-form-label-input-container-add">
                                                    <div className="cpwd-div-label-form">
                                                        <label className="cpwd-label-form" htmlFor="yourpassword">
                                                            <FaKey className="cpwd-input-icon" /> YOUR PASSWORD
                                                        </label>
                                                    </div>
                                                    <div className="cpwd-div-input-form">
                                                        <div className="cpwd-input-with-icon">
                                                            <Field
                                                                placeholder="YOUR PASSWORD"
                                                                id="reg_yourpassword"
                                                                type="password"
                                                                className="cpwd-form-control"
                                                                name="yourpassword"
                                                            />
                                                        </div>
                                                        <ErrorMessage name="yourpassword" component="div" className="cpwd-alert cpwd-alert-danger" />
                                                    </div>
                                                </div>
                                                <div className="cpwd-form-update-dotted-separator"></div>
                                            </div>
                                            
                                            <div className="cpwd-form-group">
                                                <div className="cpwd-form-label-input-container-add">
                                                    <div className="cpwd-div-label-form">
                                                        <label className="cpwd-label-form" htmlFor="password">
                                                            <FaLock className="cpwd-input-icon" /> NEW PASSWORD
                                                        </label>
                                                    </div>
                                                    <div className="cpwd-div-input-form">
                                                        <div className="cpwd-input-with-icon">
                                                            <Field
                                                                placeholder="NEW"
                                                                id="reg_password"
                                                                type="password"
                                                                className="cpwd-form-control"
                                                                name="password"
                                                            />
                                                        </div>
                                                        <ErrorMessage name="password" component="div" className="cpwd-alert cpwd-alert-danger" />
                                                        
                                                        {values.password && (
                                                            <div className="cpwd-password-strength-container">
                                                                <div className="cpwd-strength-text">
                                                                    Password Strength: <span style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                                                                </div>
                                                                <div className="cpwd-strength-bar-container">
                                                                    {[1, 2, 3, 4].map((level) => (
                                                                        <div 
                                                                            key={level}
                                                                            className="cpwd-strength-bar-segment"
                                                                            style={{ 
                                                                                backgroundColor: level <= passwordStrength.strength ? passwordStrength.color : '#e0e0e0'
                                                                            }}
                                                                        ></div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="cpwd-form-group">
                                                <div className="cpwd-form-label-input-container-add">
                                                    <div className="cpwd-div-label-form">
                                                        <label className="cpwd-label-form" htmlFor="confirmPassword">
                                                            <FaCheck className="cpwd-input-icon" /> Confirm Password
                                                        </label>
                                                    </div>
                                                    <div className="cpwd-div-input-form">
                                                        <div className="cpwd-input-with-icon">
                                                            <Field
                                                                placeholder="Confirm"
                                                                id="reg_confirmpassword"
                                                                type="password"
                                                                className="cpwd-form-control"
                                                                name="confirmPassword"
                                                            />
                                                        </div>
                                                        <ErrorMessage name="confirmPassword" component="div" className="cpwd-alert cpwd-alert-danger" />
                                                        
                                                        {values.password && values.confirmPassword && (
                                                            <div className={`cpwd-password-match-indicator ${values.password === values.confirmPassword ? 'match' : 'no-match'}`}>
                                                                {values.password === values.confirmPassword 
                                                                    ? <><FaCheck /> Passwords match</>
                                                                    : <><FaTimes /> Passwords do not match</>
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="cpwd-form-buttons-cancel-submit">
                                                <button 
                                                    type="button"
                                                    className="cpwd-board-buttons cpwd-board-buttons-cancel"
                                                    onClick={cancel}
                                                >
                                                    <FaTimes className="cpwd-button-icon" /> Cancel
                                                </button>
                                                <button 
                                                    type="submit" 
                                                    disabled={isSubmitting} 
                                                    className="cpwd-board-buttons cpwd-board-buttons-save"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span className="cpwd-loading-spinner"></span> Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaCheck className="cpwd-button-icon" /> Save
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </Form>
                                    );
                                }}
                            </Formik>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

CricChangeUserPassword.propTypes = {
    role: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired
};

export default CricChangeUserPassword;