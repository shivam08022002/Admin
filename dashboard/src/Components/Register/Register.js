import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail, isMobilePhone } from "validator";
import TokenService from "../../services/token-service";
import { register} from "../../actions/auth";
import "../../index.css";
import { clearMessage } from "../../actions/message";
import { SET_MESSAGE } from "../../actions/types";
import TableTitle from "./customized/TableTitle.js";
import ToggleButton from "react-toggle-button";

const required = (value) => {
  if (value === '') {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = (value) => {
  const re = /^\S*$/;
  if (!re.test(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        User Name can not contain spaces.
      </div>
    );
  } else if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const validPhone = (value) => {
  console.log(value)
  if (!isMobilePhone(value) || value.length < 10) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid phone.
      </div>
    );
  }
};

const validCommission = (value) => {
  // Allow up to 2 decimal places
  if (isNaN(value) || value > 100 || value < 0 || !/^\d*(\.\d{1,2})?$/.test(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        Please enter a valid number in range (0 - 100) with up to 2 decimal places.
      </div>
    );
  }
};

const CricRegister = ({ role, logout, isSmallScreen }) => {
  let registerBy = role;
  const user = TokenService.getUser();

  if (user === null) {
    logout();
  }

  const href = window.location.href;
  let formHeader = "User";
  let regType = "User ";
  let registerType = "user";
  if (href.includes("registersm")) {
    formHeader = "SSC";
    regType = "SSC ";
    registerType = "subsubcompany";
  } else if (href.includes("registersc")) {
    formHeader = "Sub Company";
    regType = "SC ";
    registerType = "subcompany";
  } else if (href.includes("registersst")) {
    formHeader = "Super Stockist";
    regType = "SST ";
    registerType = "superstockist";
  } else if (href.includes("registerst")) {
    formHeader = "Stockist";
    regType = "Stockist ";
    registerType = "stockist";
  } else if (href.includes("registeragent")) {
    formHeader = "Agent";
    regType = "Agent ";
    registerType = "agent";
  }

  let navigate = useNavigate();
  const form = useRef();
  const checkBtn = useRef();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [yourPassword, setYourPassword] = useState("");
  const [myMatchShare, setMyMatchShare] = useState("");
  const [agentMatchShare, setAgentMatchShare] = useState("");
  const [agentMatchCommission, setAgentMatchCommission] = useState("");
  const [agentSessionCommission, setAgentSessionCommission] = useState("");
  const [fixLimit, setFixLimit] = useState("");
  const [creditReference, setCreditReference] = useState("");
  const [exposureLimit, setExposureLimit] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [newCreatedUserName, setNewCreatedUserName] = useState(null);
  const [showError, setShowError] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [iCasinoEnabled, setICasinoEnabled] = useState(false);
  const [iCasinoShare, setICasinoShare] = useState(0);
  const [agentICasinoShare, setAgentICasinoShare] = useState(0);

  useEffect(() => {
    dispatch(clearMessage());
  }, [])

  const { message } = useSelector(state => state.message);
  const dispatch = useDispatch();

  const onChangeFirstName = (e) => {
    const fname = e.target.value;
    setFirstName(fname);
  };

  const onChangeLastName = (e) => {
    const lname = e.target.value;
    setLastName(lname);
  };

  const onChangeUserName = (e) => {
    const username = e.target.value;
    setUserName(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const onChangeConfirmPassword = (e) => {
    const confirmPassword = e.target.value;
    setConfirmPassword(confirmPassword);
  };

  const onChangeYourPassword = (e) => {
    const yp = e.target.value;
    setYourPassword(yp);
  };

  const onChangeMyMatchShare = (e) => {
    const newValue = e.target.value;
    if (newValue === '' || (/^\d+$/.test(newValue))) {
      if (Number(newValue) > Number(user.share)) {
        setMyMatchShare(user.share);
      } else if (Number(newValue) < 0) {
        setMyMatchShare(0);
      } else {
        setMyMatchShare(Number(newValue));
      }
    } else {
      setMyMatchShare(0);
    }
  };

  useEffect(() => {
    setAgentMatchShare(Number(user.share) - Number(myMatchShare));
  }, [myMatchShare])

  const onChangeAgentMatchShare = (e) => {
    const ams = e.target.value;
    setAgentMatchShare(ams);
  };

  const onChangeAgentMatchCommission = (e) => {
    const newValue = e.target.value;
    // Allow up to 2 decimal places
    if (newValue === '' || (/^\d*\.?\d{0,2}$/.test(newValue))) {
      if (Number(newValue) > Number(user.matchCommission)) {
        setAgentMatchCommission(Number(user.matchCommission).toFixed(2));
      } else if (Number(newValue) < 0) {
        setAgentMatchCommission('0.00');
      } else {
        setAgentMatchCommission(newValue);
      }
    } else {
      setAgentMatchCommission('');
    }
  };

  const onChangeAgentSessionCommission = (e) => {
    const newValue = e.target.value;
    // Allow up to 2 decimal places
    if (newValue === '' || (/^\d*\.?\d{0,2}$/.test(newValue))) {
      if (Number(newValue) > Number(user.sessionCommission)) {
        setAgentSessionCommission(Number(user.sessionCommission).toFixed(2));
      } else if (Number(newValue) < 0) {
        setAgentSessionCommission('0.00');
      } else {
        setAgentSessionCommission(newValue);
      }
    } else {
      setAgentSessionCommission('');
    }
  };

  const onChangeFixLimit = (e) => {
    const newValue = e.target.value;
    if (newValue === '' || (/^\d+$/.test(newValue))) {
      if (Number(newValue) > Number(user.balance)) {
        setFixLimit(user.balance);
      } else if (Number(newValue) < 0) {
        setFixLimit(0);
      } else {
        setFixLimit(newValue);
      }
    } else {
      setFixLimit('');
    }
  };

  const onChangeCreditReference = (e) => {
    const cr = e.target.value;
    setCreditReference(cr);
  };

  const onChangeExposureLimit = (e) => {
    const el = e.target.value;
    setExposureLimit(el);
  };

  // Calculate maxCasinoShare for subagents
  const maxCasinoShare = (user.icasinoShare !== undefined && user.icasinoShare !== null)
    ? Number(user.icasinoShare)
    : 0;

  const onChangeIcasinoShare = (e) => {
    const newValue = e.target.value;
    if (newValue === '' || (/^\d+$/.test(newValue))) {
      if (Number(newValue) > maxCasinoShare) {
        setICasinoShare(maxCasinoShare);
      } else if (Number(newValue) < 0) {
        setICasinoShare(0);
      } else {
        setICasinoShare(Number(newValue));
      }
    } else {
      setICasinoShare(0);
    }
  };

  useEffect(() => {
    setAgentICasinoShare(maxCasinoShare - Number(iCasinoShare));
  }, [iCasinoShare, maxCasinoShare]);

  const [input, setInput] = useState({
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState({
    password: '',
    confirmPassword: ''
  });

  const onInputChange = e => {
    const { name, value } = e.target;
    setInput(prev => ({
      ...prev,
      [name]: value
    }));
    validateInput(e);
  }

  const validateInput = e => {
    let { name, value } = e.target;
    setError(prev => {
      const stateObj = { ...prev, [name]: "" };
      // console.log("Password", name, value);
      switch (name) {
        case "password":
          if (input.confirmPassword && value !== input.confirmPassword) {
            stateObj[name] = "Password and Confirm Password does not match.";
          } else if (input.confirmPassword && value === input.confirmPassword) {
            stateObj[name] = "";
          } else {
            stateObj[name] = input.confirmPassword ? "" : error.confirmPassword;
          }
          setPassword(value)
          break;

        case "confirmPassword":
          if (input.password && value !== input.password) {
            stateObj[name] = "Password and Confirm Password does not match.";
          } else if (input.password && value === input.password) {
            stateObj[name] = "";
          } else {
            stateObj[name] = input.password ? "" : error.password;
          }
          setConfirmPassword(value)
          break;
        default:
          break;
      }
      return stateObj;
    });
  }

  const cancel = (e) => {
    e.preventDefault();
    navigate(-1);
  }

  const handleRegister = (e) => {
    dispatch(clearMessage());
    e.preventDefault();
    setSuccessful(false);
    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0 && !error.password && !error.confirmPassword && (!iCasinoEnabled || (iCasinoEnabled && (iCasinoShare >= 0 && iCasinoShare <= maxCasinoShare)))) {
      // Send agentICasinoShare as iCasinoShare to update the agent's value in the API
      const iCasinoShareToSend = iCasinoEnabled ? Number(agentICasinoShare) : undefined;
      dispatch(register(
        firstName,
        lastName,
        password,
        registerType,
        fixLimit,
        agentMatchShare,
        agentMatchCommission,
        agentSessionCommission,
        iCasinoEnabled,
        iCasinoShareToSend,
        role
      ))
        .then((data) => {
          console.log("reg data: ", data);
          if (data.status === 401) {
            if (data.data === "Wrong password") {
              setSuccessful(false);
            } else {
              logout();
            }
          } else if (data.status === 200) {
            setNewCreatedUserName(data.data.userId);
            setSuccessful(true);
            let eType = data.data.entityType;
            let entt = "New User ";
            if (eType !== "user")
              entt = "New Agent ";
            let uid = data.data.userId;
            let msg = { msg: entt + " is Created Successfully!", uid: uid };
            console.log("new user", registerType);
            if (registerType.includes("user")) {
              // navigate(`/showuser/${data.data.userId}/`);
              navigate('/clients', { state: { msg } });
            } else if (registerType.includes("subsubcompany")) {
              // navigate(`/showsc/${data.data.userId}/`);
              navigate('/showsm', { state: { msg } });
            } else if (registerType.includes("subcompany")) {
              // navigate(`/showsc/${data.data.userId}/`);
              navigate('/showsc', { state: { msg } });
            } else if (registerType.includes("superstockist")) {
              // navigate(`/showsst/${data.data.userId}/`);
              navigate('/showsst', { state: { msg } });
            } else if (registerType.includes("stockist")) {
              // navigate(`/showst/${data.data.userId}/`);
              navigate('/showst', { state: { msg } });
            } else if (registerType.includes("agent")) {
              // navigate(`/showagent/${data.data.userId}/`);
              navigate('/showagent', { state: { msg } });
            }
          } else {
            setSuccessful(false);
            dispatch({
              type: SET_MESSAGE,
              payload: data.data,
              role: role
            });
          }
        })
        .catch(() => {
        });
    }
  };

  const handleAddMore = () => {
    setFirstName("");
    setLastName("");
    setUserName("");
    setPassword("");
    setConfirmPassword("");
    setMyMatchShare("");
    setAgentMatchShare("");
    setFixLimit("");
    setAgentMatchCommission("");
    setAgentSessionCommission("");
    setICasinoEnabled(false);
    setICasinoShare(0);
    setAgentICasinoShare(0);
    setSuccessful(false);
    setNewCreatedUserName(null);
  }

  const [value, setValue] = useState('');
  const borderRadiusStyle = { borderRadius: 2 };

  // const handleChange = (e) => {
  //   const newValue = e.target.value;
  //   if (newValue === '' || (/^\d+$/.test(newValue))) {
  //     if (Number(newValue) > 100) {
  //       setValue('100');
  //     } else {
  //       setValue(newValue);
  //     }
  //   }
  // };

  // const handleBlur = () => {
  //   if (value !== '' && Number(value) > 100) {
  //     setValue('100');
  //   }
  // };

  useEffect(() => {
    if (input.password === input.confirmPassword)
      setError('');
  }, [input.password, input.confirmPassword]);

  // Only admin can create iCasino users or see iCasino fields
  const isAdmin = user && user.entityType === 'admin';

  return (
    <div className="cric-register-top-container">
      <div className="register-container">
        <div className="cric-card">
          {!successful && <div>
            {/* <label className="cric-register-header">Add {regType}</label> */}
            <TableTitle
              text={"New " + formHeader}
              color="#ffffff"
              fontSize="14px"
              textAlign="left"
              width="100%"
              height="42px"
              marginLeft="0px"
              marginRight="0px"
              paddingLeft="10px"
            />
          </div>}
          <div className="cric-card-container">
            {/* <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        /> */}
            {newCreatedUserName && <label style={{ marginTop: "250px", fontSize: "30px", fontWeight: "bold" }}>{newCreatedUserName}</label>}
            {(message || successful) && (<div className="form-group" style={{ marginTop: "10px" }}>
              <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                {message ? message : ("New User " + newCreatedUserName + " is Created Successfully!")}
              </div>
            </div>)}
            {successful && (<div>
              <button className="board-buttons board-buttons-nav-bar-dark-small" onClick={() => handleAddMore()}>Add More</button>
            </div>)}

            <Form onSubmit={handleRegister} ref={form}>
              {!successful && (
                <div>
                  {/* <div className="form-group">
                    <div className="div-label-form">
                        <label className="label-form" htmlFor="username">User Name</label>
                    </div>
                <Input
                  id="reg_username"
                  type="text"
                  className="form-control"
                  name="username"
                  value={userName}
                  onChange={onChangeUserName}
                  validations={!successful && [required]}
                />
              </div> */}
                  {/* <input
                    type="tel"
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />   */}
                  <div className="form-group">
                    <div className="cric-form-label-input-container-add">
                      <div className="cric-div-label-form">
                        <label className="label-form" htmlFor="name">First Name</label>
                      </div>
                      <div className="cric-div-input-form">
                        <Input
                          placeholder="First Name"
                          id="reg_fname"
                          type="text"
                          className="form-control"
                          name="fname"
                          maxLength="20"
                          value={firstName || ""}
                          onChange={onChangeFirstName}
                          validations={!successful && [required]}
                          style={{ fontSize: "14px" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="cric-form-label-input-container-add">
                      <div className="cric-div-label-form">
                        <label className="label-form" htmlFor="name">Last Name</label>
                      </div>
                      <div className="cric-div-input-form">
                        <Input
                          placeholder="Last Name"
                          id="reg_lname"
                          type="text"
                          className="form-control"
                          name="lname"
                          maxLength="20"
                          value={lastName || ""}
                          onChange={onChangeLastName}
                          // validations={!successful && [required]}
                          style={{ fontSize: "14px" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="cric-form-label-input-container-add">
                      <div className="cric-div-label-form">
                        <label className="label-form" htmlFor="openingbalance">Initial Balance</label>
                      </div>
                      <div className="cric-div-input-form">
                        <Input
                          placeholder="0"
                          type="tel"
                          id="reg_flimit"
                          className="form-control"
                          name="openingbalance"
                          value={fixLimit}
                          onChange={onChangeFixLimit}
                          validations={!successful && [required]}
                          style={{ fontSize: "14px" }}
                          maxLength={(user.balance.toString().length).toString()}
                        />
                        <div className="div-note">
                          <label className="label-note">Note :</label>
                          <div className="div-note-1">
                            <label>Initial Balance can be set from 0 to</label>
                          </div>
                          <div className="div-note-2">
                            <label>{user.balance}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="div-note">
                  <label className="label-note">Note :</label>
                  <div className="div-note-1">
                    <label>My Match Share can be set from 0 to</label>
                  </div>
                  <div className="div-note-2">
                    <label>95</label>
                  </div>
                </div> */}
                  </div>
                  <div className="form-group">
                    <div className="cric-form-label-input-container-add">
                      <div className="cric-div-label-form">
                        <label className="label-form" htmlFor="share">My Match Share</label>
                      </div>
                      <div className="cric-div-input-form">
                        <Input
                          placeholder="Enter Share"
                          type="tel"
                          id="reg_mmshare"
                          className="form-control"
                          name="share"
                          value={registerType.includes("user") ? user.share : myMatchShare}
                          onChange={onChangeMyMatchShare}
                          validations={!successful && [required]}
                          style={{ fontSize: "14px", color: "#676a6c", backgroundColor: registerType.includes("user") ? "#feefee" : "white" }}
                          disabled={registerType.includes("user")}
                          maxLength={(user.share.toString().length).toString()}
                        />
                        <div className="div-note">
                          <label className="label-note">Note :</label>
                          <div className="div-note-1">
                            <label>My Match Share can be set from 0 to</label>
                          </div>
                          <div className="div-note-2">
                            <label>{user.share}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!registerType.includes("user") &&
                    <div className="form-group">
                      <div className="cric-form-label-input-container-add">
                        <div className="cric-div-label-form">
                          <label className="label-form" htmlFor="share">{regType} Match Share</label>
                        </div>
                        <div className="cric-div-input-form">
                          <input
                            placeholder="Enter Partnership"
                            type="tel"
                            id="reg_amshare"
                            className="form-control"
                            name="ams"
                            value={agentMatchShare}
                            disabled
                            style={{ backgroundColor: "#feefee", fontSize: "14px", color: "#999999" }}
                          />
                          <div className="div-note">
                            <label className="label-note">Note :</label>
                            <div className="div-note-1">
                              <label>{regType} Match Share can be set from 0 to</label>
                            </div>
                            <div className="div-note-2">
                              <label>{user.share - myMatchShare}</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>}
                  <div className="form-group">
                    <div className="cric-form-label-input-container-add">
                      <div className="cric-div-label-form">
                        <label className="label-form" htmlFor="share">{regType} Match Commission</label>
                      </div>
                      <div className="cric-div-input-form">
                        <Input
                          placeholder={formHeader + " Match Commission"}
                          type="tel"
                          id="reg_amc"
                          className="form-control"
                          name="amc"
                          value={agentMatchCommission}
                          onChange={onChangeAgentMatchCommission}
                          validations={!successful && [required]}
                          style={{ fontSize: "14px" }}
                          inputMode="decimal"
                        />
                        <div className="div-note">
                          <label className="label-note">Note :</label>
                          <div className="div-note-1">
                            <label>{regType} Match Commission can be set from 0 to</label>
                          </div>
                          <div className="div-note-2">
                            <label>{user.matchCommission}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="cric-form-label-input-container-add">
                      <div className="cric-div-label-form">
                        <label className="label-form" htmlFor="share">{regType} Session Commission</label>
                      </div>
                      <div className="cric-div-input-form">
                        <Input
                          placeholder={"Enter " + formHeader + " Session Commission"}
                          type="tel"
                          id="reg_asc"
                          className="form-control"
                          name="asc"
                          value={agentSessionCommission}
                          onChange={onChangeAgentSessionCommission}
                          validations={!successful && [required]}
                          style={{ fontSize: "14px" }}
                          inputMode="decimal"
                        />
                        <div className="div-note">
                          <label className="label-note">Note :</label>
                          <div className="div-note-1">
                            <label>{regType} Session Commission can be set from 0 to</label>
                          </div>
                          <div className="div-note-2">
                            <label>{user.sessionCommission}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* iCasino toggle and fields - ADMIN ONLY */}
                  {!registerType.includes("user") && (
                    <>
                      <div className="form-group">
                        <div className="cric-form-label-input-container-add">
                          <div className="cric-div-label-form">
                            <label className="label-form" htmlFor="icasino">
                              iCasino
                            </label>
                          </div>
                          <div className="cric-div-input-form">
                            <div className="cric-toggle-button-container">
                              <ToggleButton
                                value={iCasinoEnabled}
                                inactiveLabel={"Off"}
                                activeLabel={"On"}
                                thumbStyle={borderRadiusStyle}
                                trackStyle={borderRadiusStyle}
                                onToggle={value => {
                                  setICasinoEnabled(!value);
                                  if (value) {
                                    setICasinoShare(0);
                                    setAgentICasinoShare(0);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {iCasinoEnabled && (
                        <div className="form-group">
                          <div className="cric-form-label-input-container-add">
                            <div className="cric-div-label-form">
                              <label className="label-form" htmlFor="icasinoshare"> My iCasino Share</label>
                            </div>
                            <div className="cric-div-input-form">
                              <Input
                                placeholder="Enter iCasino Share"
                                type="tel"
                                id="reg_icasinoshare"
                                className="form-control"
                                name="icasinoshare"
                                value={iCasinoShare}
                                onChange={onChangeIcasinoShare}
                                validations={!successful && [required]}
                                style={{ fontSize: "14px" }}
                                min="0"
                                max={maxCasinoShare}
                                maxLength={(maxCasinoShare.toString().length || 2).toString()}
                              />
                              <div className="div-note">
                                <label className="label-note">Note :</label>
                                <div className="div-note-1">
                                  <label>iCasino Share can be set from 0 to</label>
                                </div>
                                <div className="div-note-2">
                                  <label>{maxCasinoShare}</label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {iCasinoEnabled && !registerType.includes("user") && (
                        <div className="form-group">
                          <div className="cric-form-label-input-container-add">
                            <div className="cric-div-label-form">
                              <label className="label-form" htmlFor="icasinoagentshare">{regType} iCasino Share</label>
                            </div>
                            <div className="cric-div-input-form">
                              <Input
                                placeholder="Enter iCasino Partnership"
                                type="tel"
                                id="reg_icasinoagentshare"
                                className="form-control"
                                name="icasinoagentshare"
                                value={agentICasinoShare}
                                disabled
                                style={{ backgroundColor: "#feefee", fontSize: "14px", color: "#999999" }}
                              />
                              <div className="div-note">
                                <label className="label-note">Note :</label>
                                <div className="div-note-1">
                                  <label>{regType} iCasino Share can be set from 0 to</label>
                                </div>
                                <div className="div-note-2">
                                  <label>{maxCasinoShare}</label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {/* <div className="form-group">
                <div className="div-label-form">
                  <label className="label-form" htmlFor="sessioncommission">
                    {regType} Session Commission
                  </label>
                </div>
                <Input
                  type="tel"
                  id="reg_sessioncommission"
                  className="form-control"
                  name="sessioncommision"
                  value={sessionCommission}
                  onChange={onChangeSessionCommission}
                  validations={!successful && [required]}
                />
                <div className="div-note">
                  <label className="label-note">Note :</label>
                  <div className="div-note-1">
                    <label>
                      {regType} Session Commission can be set from 0 to
                    </label>
                  </div>
                  <div className="div-note-2">
                    <label>3</label>
                  </div>
                </div>
              </div> */}
                  <div className="form-group">
                    <div className="cric-form-label-input-container-add">
                      <div className="cric-div-label-form">
                        <label className="label-form" htmlFor="password">Password</label>
                      </div>
                      <div className="cric-div-input-form">
                        <div className="password-wrapper">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            id="reg_password"
                            className="form-control"
                            name="password"
                            value={password}
                            onChange={onInputChange}
                            onBlur={validateInput}
                            validations={!successful && [required, vpassword]}
                            style={{ fontSize: "14px" }}
                          />
                          <span
                            className="show-password-toggle-icon"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? '🙈' : '👁️'}
                          </span>
                        </div>
                      </div>
                      {error.password && <div className="alert alert-danger" role="alert">{error.password}</div>}
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="cric-form-label-input-container-add">
                      <div className="cric-div-label-form">
                        <label className="label-form" htmlFor="confirmPassword">Confirm Password</label>
                      </div>
                      <div className="cric-div-input-form">
                        <div className="password-wrapper">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            id="reg_confirmpassword"
                            className="form-control"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={onInputChange}
                            onBlur={validateInput}
                            validations={!successful && [required, vpassword]}
                            style={{ fontSize: "14px" }}
                          />
                          <span
                            className="show-password-toggle-icon"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? '🙈' : '👁️'}
                          </span>
                        </div>
                      </div>
                      {error.confirmPassword && <div className="alert alert-danger" role="alert">{error.confirmPassword}</div>}
                    </div>
                  </div>
                  {/* <div className="hr-solid"></div>
                  <div className="form-group">
                    <div className="div-label-form">
                      <label className="label-form" htmlFor="yourpassword">Your Password</label>
                    </div>
                    <Input
                      id="reg_yourpassword"
                      type="password"
                      className="form-control"
                      name="yourpassword"
                      value={yourPassword}
                      onChange={onChangeYourPassword}
                      validations={!successful && [required, vpassword]}
                    />
                  </div> */}
                  <div className="form-buttons-cancel-submit">
                    <button className="board-buttons board-buttons-nav-bar-dark-smaller-white"
                      onClick={(e) => cancel(e)}>Cancel</button>
                    <div className="form-group">
                      <button className="board-buttons board-buttons-nav-bar-dark-small-save-changes">Save Changes</button>
                    </div>
                  </div>
                </div>
              )}
              <CheckButton style={{ display: "none" }} ref={checkBtn} />
            </Form>
          </div>
        </div>
      </div >
    </div >
  );
};

export default CricRegister;