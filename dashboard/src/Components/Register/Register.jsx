import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TokenService from "../../services/token-service";
import { register } from "../../actions/auth";
import "../../index.css";
import { clearMessage } from "../../actions/message";
import { SET_MESSAGE } from "../../actions/types";
import TableTitle from "../customized/TableTitle.jsx";
import ToggleButton from "react-toggle-button";
import "./Register.css";

// Validation schema using Yup
const createValidationSchema = (registerType, user) => {
  return yup.object().shape({
    firstName: yup
      .string()
      .required('First name is required!')
      .max(20, 'First name must be less than 20 characters'),
    
    lastName: yup
      .string()
      .max(20, 'Last name must be less than 20 characters'),
    
    fixLimit: yup
      .number()
      .required('Initial balance is required!')
      .min(0, 'Balance cannot be negative')
      .max(user?.balance || 0, `Balance cannot exceed ${user?.balance || 0}`),
    
    myMatchShare: yup
      .number()
      .required('Match share is required!')
      .min(0, 'Share cannot be negative')
      .max(user?.share || 0, `Share cannot exceed ${user?.share || 0}`),
    
    agentMatchCommission: yup
      .number()
      .required('Match commission is required!')
      .min(0, 'Commission cannot be negative')
      .max(3, 'Commission cannot exceed 3')
      .test('decimal-places', 'Commission can have at most 2 decimal places', value => {
        if (value === undefined || value === null) return true;
        return /^\d*(\.\d{1,2})?$/.test(value.toString());
      }),
    
    agentSessionCommission: yup
      .number()
      .required('Session commission is required!')
      .min(0, 'Commission cannot be negative')
      .max(3, 'Commission cannot exceed 3')
      .test('decimal-places', 'Commission can have at most 2 decimal places', value => {
        if (value === undefined || value === null) return true;
        return /^\d*(\.\d{1,2})?$/.test(value.toString());
      }),
    
    password: yup
      .string()
      .required('Password is required!')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must be less than 40 characters'),
    
    confirmPassword: yup
      .string()
      .required('Confirm password is required!')
      .oneOf([yup.ref('password')], 'Passwords must match'),
    
    iCasinoShare: yup
      .number()
      .when('iCasinoEnabled', {
        is: true,
        then: (schema) => schema
          .required('iCasino share is required when iCasino is enabled!')
          .min(0, 'iCasino share cannot be negative')
          .max(user?.icasinoShare || 0, `iCasino share cannot exceed ${user?.icasinoShare || 0}`),
        otherwise: (schema) => schema.notRequired()
      })
  });
};

// Custom input component with error handling
const FormInput = ({ 
  register, 
  error, 
  name, 
  type = "text", 
  placeholder, 
  disabled = false, 
  maxLength,
  style = {},
  children,
  ...props 
}) => (
  <div className="register-input-container">
    <div className="input-wrapper" style={{ position: 'relative' }}>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className={error ? 'error' : ''}
        disabled={disabled}
        maxLength={maxLength}
        style={{ 
          fontSize: "14px", 
          ...style 
        }}
        {...props}
      />
      {children}
    </div>
    {error && (
      <div className="register-alert register-alert-danger" role="alert">
        {error.message}
      </div>
    )}
  </div>
);

const CricRegister = ({ role, logout }) => {
  const user = TokenService.getUser();

  if (user === null) {
    logout();
  }

  const href = window.location.href;
  let formHeader = "User";
  let regType = "User ";
  let registerType = "user";
  
  if (href.includes("registersm") || href.includes("/register/sm")) {
    formHeader = "SM";
    regType = "SM ";
    registerType = "submaster";
  } else if (href.includes("registersc") || href.includes("/register/sc")) {
    formHeader = "Sub Company";
    regType = "SC ";
    registerType = "subcompany";
  } else if (href.includes("registersst") || href.includes("/register/sst")) {
    formHeader = "Super Stockist";
    regType = "SST ";
    registerType = "superstockist";
  } else if (href.includes("registerst") || href.includes("/register/stockist")) {
    formHeader = "Stockist";
    regType = "Stockist ";
    registerType = "stockist";
  } else if (href.includes("registeragent") || href.includes("/register/agent")) {
    formHeader = "Agent";
    regType = "Agent ";
    registerType = "agent";
  } else if (href.includes("registeruser") || href.includes("/register/user")) {
    formHeader = "User";
    regType = "User ";
    registerType = "user";
  }

  let navigate = useNavigate();
  
  // Form state
  const [successful, setSuccessful] = useState(false);
  const [newCreatedUserName, setNewCreatedUserName] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [iCasinoEnabled, setICasinoEnabled] = useState(false);
  const [agentMatchShare, setAgentMatchShare] = useState(0);
  const [agentICasinoShare, setAgentICasinoShare] = useState(0);

  // React Hook Form setup
  const validationSchema = createValidationSchema(registerType, user);
  const {
    register: registerField,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      fixLimit: '',
      myMatchShare: registerType.includes("user") ? user?.share || 0 : '',
      agentMatchCommission: '',
      agentSessionCommission: '',
      password: '',
      confirmPassword: '',
      iCasinoShare: 0
    }
  });

  const watchedValues = watch();
  const { message } = useSelector(state => state.message);
  const dispatch = useDispatch();

  // Calculate agent shares
  useEffect(() => {
    const myShare = Number(watchedValues.myMatchShare) || 0;
    const totalShare = Number(user?.share) || 0;
    setAgentMatchShare(totalShare - myShare);
  }, [watchedValues.myMatchShare, user?.share]);

  // Calculate maxCasinoShare for subagents
  const maxCasinoShare = (user?.icasinoShare !== undefined && user?.icasinoShare !== null)
    ? Number(user.icasinoShare)
    : 0;

  useEffect(() => {
    const myICasinoShare = Number(watchedValues.iCasinoShare) || 0;
    setAgentICasinoShare(maxCasinoShare - myICasinoShare);
  }, [watchedValues.iCasinoShare, maxCasinoShare]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const cancel = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleRegister = (data) => {
    dispatch(clearMessage());
    setSuccessful(false);

    if (!iCasinoEnabled || (iCasinoEnabled && (data.iCasinoShare >= 0 && data.iCasinoShare <= maxCasinoShare))) {
      // Send agentICasinoShare as iCasinoShare to update the agent's value in the API
      const iCasinoShareToSend = iCasinoEnabled ? Number(agentICasinoShare) : undefined;
      
      dispatch(register(
        data.firstName,
        data.lastName,
        data.password,
        registerType,
        data.fixLimit,
        agentMatchShare,
        data.agentMatchCommission,
        data.agentSessionCommission,
        iCasinoEnabled,
        iCasinoShareToSend,
        role
      ))
        .then((response) => {
          console.log("reg data: ", response);
          if (response.status === 401) {
            if (response.data === "Wrong password") {
              setSuccessful(false);
            } else {
              logout();
            }
          } else if (response.status === 200) {
            setNewCreatedUserName(response.data.userId);
            setSuccessful(true);
            let eType = response.data.entityType;
            let entt = "New User ";
            if (eType !== "user") entt = "New Agent ";
            let uid = response.data.userId;
            let msg = { msg: entt + " is Created Successfully!", uid: uid };
            console.log("new user", registerType);
            
            if (registerType.includes("user")) {
              navigate('/clients', { state: { msg } });
            } else if (registerType.includes("submaster")) {
              navigate('/showsm', { state: { msg } });
            } else if (registerType.includes("subcompany")) {
              navigate('/showsc', { state: { msg } });
            } else if (registerType.includes("superstockist")) {
              navigate('/showsst', { state: { msg } });
            } else if (registerType.includes("stockist")) {
              navigate('/showst', { state: { msg } });
            } else if (registerType.includes("agent")) {
              navigate('/showagent', { state: { msg } });
            }
          } else {
            setSuccessful(false);
            dispatch({
              type: SET_MESSAGE,
              payload: response.data,
              role: role
            });
          }
        })
        .catch(() => {
          // Handle error
        });
    }
  };



  const borderRadiusStyle = { borderRadius: 2 };

  return (
    <>
      {!successful && (
        <div className="register-table-title-container">
          <TableTitle
            text={"New " + formHeader}
            color="#1593A7"
            fontSize="16px"
            textAlign="left"
            width="100%"
            height="50px"
            marginLeft="0px"
            marginRight="0px"
            paddingLeft="10px"
          />
        </div>
      )}
      <div className="register-main-container">
        <div className="register-wrapper">
          <div className="register-card">
            <div className="register-card-content">
            {newCreatedUserName && (
              <label style={{ marginTop: "250px", fontSize: "30px", fontWeight: "bold" }}>
                {newCreatedUserName}
              </label>
            )}
            {(message || successful) && (
              <div className="register-form-group" style={{ marginTop: "10px" }}>
                <div className={successful ? "register-alert register-alert-success" : "register-alert register-alert-danger"} role="alert">
                  {message ? message : ("New User " + newCreatedUserName + " is Created Successfully!")}
                </div>
              </div>
            )}


            <form onSubmit={handleSubmit(handleRegister)}>
              {!successful && (
                <div>
                  {/* First Name */}
                  <div className="register-form-group">
                    <div className="register-form-row">
                      <div className="register-label-container">
                        <label className="register-form-label" htmlFor="firstName">First Name</label>
                      </div>
                      <FormInput
                        register={registerField}
                        error={errors.firstName}
                        name="firstName"
                        placeholder="First Name"
                        maxLength="20"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="register-form-group">
                    <div className="register-form-row">
                      <div className="register-label-container">
                        <label className="register-form-label" htmlFor="lastName">Last Name</label>
                      </div>
                      <FormInput
                        register={registerField}
                        error={errors.lastName}
                        name="lastName"
                        placeholder="Last Name"
                        maxLength="20"
                      />
                    </div>
                  </div>

                  {/* Initial Balance */}
                  <div className="register-form-group">
                    <div className="register-form-row">
                      <div className="register-label-container">
                        <label className="register-form-label" htmlFor="fixLimit">Initial Balance</label>
                      </div>
                      <FormInput
                        register={registerField}
                        error={errors.fixLimit}
                        name="fixLimit"
                        type="number"
                        placeholder="0"
                        min="0"
                        max={user?.balance}
                      >
                        <div className="register-note">
                          <span>Note: Initial Balance can be set from 0 to {user?.balance}</span>
                        </div>
                      </FormInput>
                    </div>
                  </div>

                  {/* My Match Share */}
                  <div className="register-form-group">
                    <div className="register-form-row">
                      <div className="register-label-container">
                        <label className="register-form-label" htmlFor="myMatchShare">My Match Share</label>
                      </div>
                      <FormInput
                        register={registerField}
                        error={errors.myMatchShare}
                        name="myMatchShare"
                        type="number"
                        placeholder="Enter Share"
                        disabled={registerType.includes("user")}
                        style={{
                          color: registerType.includes("user") ? "#a0aec0" : "#2d3748"
                        }}
                        min="0"
                        max={user?.share}
                      >
                        <div className="register-note">
                          <span>Note: My Match Share can be set from 0 to {user?.share}</span>
                        </div>
                      </FormInput>
                    </div>
                  </div>

                  {/* Agent Match Share */}
                  {!registerType.includes("user") && (
                    <div className="register-form-group">
                      <div className="register-form-row">
                        <div className="register-label-container">
                          <label className="register-form-label">{regType} Match Share</label>
                        </div>
                        <div className="register-input-container">
                          <input
                            placeholder="Enter Partnership"
                            type="number"
                            value={agentMatchShare}
                            disabled
                            style={{ fontSize: "14px" }}
                          />
                          <div className="register-note">
                            <span>Note: {regType} Match Share is auto-calculated (Total: {user?.share}) - Current: {agentMatchShare}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Agent Match Commission */}
                  <div className="register-form-group">
                    <div className="register-form-row">
                      <div className="register-label-container">
                        <label className="register-form-label">{regType} Match Commission</label>
                      </div>
                      <FormInput
                        register={registerField}
                        error={errors.agentMatchCommission}
                        name="agentMatchCommission"
                        type="number"
                        step="0.01"
                        placeholder={formHeader + " Match Commission"}
                        min="0"
                        max="3"
                      >
                        <div className="register-note">
                          <span>Note: {regType} Match Commission can be set from 0 to 3</span>
                        </div>
                      </FormInput>
                    </div>
                  </div>

                  {/* Agent Session Commission */}
                  <div className="register-form-group">
                    <div className="register-form-row">
                      <div className="register-label-container">
                        <label className="register-form-label">{regType} Session Commission</label>
                      </div>
                      <FormInput
                        register={registerField}
                        error={errors.agentSessionCommission}
                        name="agentSessionCommission"
                        type="number"
                        step="0.01"
                        placeholder={"Enter " + formHeader + " Session Commission"}
                        min="0"
                        max="3"
                      >
                        <div className="register-note">
                          <span>Note: {regType} Session Commission can be set from 0 to 3</span>
                        </div>
                      </FormInput>
                    </div>
                  </div>

                  {/* iCasino Toggle and Fields - ADMIN ONLY */}
                  {!registerType.includes("user") && (
                    <>
                      <div className="register-form-group">
                        <div className="register-form-row">
                          <div className="register-label-container">
                            <label className="register-form-label">iCasino</label>
                          </div>
                          <div className="register-input-container">
                            <div className="register-toggle-container">
                              <ToggleButton
                                value={iCasinoEnabled}
                                inactiveLabel={"Off"}
                                activeLabel={"On"}
                                thumbStyle={borderRadiusStyle}
                                trackStyle={borderRadiusStyle}
                                onToggle={value => {
                                  setICasinoEnabled(!value);
                                  if (value) {
                                    setValue('iCasinoShare', 0);
                                    setAgentICasinoShare(0);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {iCasinoEnabled && (
                        <div className="register-form-group">
                          <div className="register-form-row">
                            <div className="register-label-container">
                              <label className="register-form-label">My iCasino Share</label>
                            </div>
                            <FormInput
                              register={registerField}
                              error={errors.iCasinoShare}
                              name="iCasinoShare"
                              type="number"
                              placeholder="Enter iCasino Share"
                              min="0"
                              max={maxCasinoShare}
                            >
                              <div className="register-note">
                                <span>Note: iCasino Share can be set from 0 to {maxCasinoShare}</span>
                              </div>
                            </FormInput>
                          </div>
                        </div>
                      )}

                      {iCasinoEnabled && (
                        <div className="register-form-group">
                          <div className="register-form-row">
                            <div className="register-label-container">
                              <label className="register-form-label">{regType} iCasino Share</label>
                            </div>
                            <div className="register-input-container">
                              <input
                                placeholder="Enter iCasino Partnership"
                                type="number"
                                value={agentICasinoShare}
                                disabled
                                style={{ fontSize: "14px" }}
                              />
                              <div className="register-note">
                                <span>Note: {regType} iCasino Share is auto-calculated (Total: {maxCasinoShare}) - Current: {agentICasinoShare}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Password */}
                  <div className="register-form-group">
                    <div className="register-form-row">
                      <div className="register-label-container">
                        <label className="register-form-label">Password</label>
                      </div>
                      <FormInput
                        register={registerField}
                        error={errors.password}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                      >
                        <span
                          className="register-password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                            zIndex: 1
                          }}
                        >
                          {showPassword ? '🙈' : '👁️'}
                        </span>
                      </FormInput>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="register-form-group">
                    <div className="register-form-row">
                      <div className="register-label-container">
                        <label className="register-form-label">Confirm Password</label>
                      </div>
                      <FormInput
                        register={registerField}
                        error={errors.confirmPassword}
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                      >
                        <span
                          className="register-password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                            zIndex: 1
                          }}
                        >
                          {showConfirmPassword ? '🙈' : '👁️'}
                        </span>
                      </FormInput>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="register-button-group">
                    <button 
                      type="button"
                      className="register-button register-button-cancel"
                      onClick={cancel}
                    >
                      Cancel
                    </button>
                    <div className="register-form-group">
                      <button 
                        type="submit"
                        className="register-button register-button-submit"
                        disabled={!isValid}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CricRegister;