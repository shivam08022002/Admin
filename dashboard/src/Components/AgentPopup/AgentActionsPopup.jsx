import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail, isMobilePhone } from "validator";
import TokenService from "../../services/token-service.js";
import { makeTransaction} from "../../actions/auth.js";
import "../../index.css";
import { clearMessage } from "../../actions/message.js";
import { SET_MESSAGE } from "../../actions/types.js";
import { DEPOSIT_COINS, WITHDRAW_COINS } from "../../common/constants.jsx";
import ConfirmationPopup from "./ConfirmationPopup.jsx";
import Modal from "../Settings/Modal.jsx";

const required = (value) => {
    if (!value) {
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
    console.log(value)
    if (value > 100 || value < 0) {
        return (
            <div className="alert alert-danger" role="alert">
                Please enter in valid range (0 - 100).
            </div>
        );
    }
};

const AgentActionsPopup = ({ role, logout, action, child, closeAgentActionsPopup, onMakeTransactionSuccessful }) => {
    let registerBy = role;
    const user = TokenService.getUser();

    if (user === null) {
        logout();
    }

    let actionHeader = "Password Change for " + child.userId;
    if (action === WITHDRAW_COINS) {
        actionHeader = "Withdraw from " + child.userId;
    } else if (action === DEPOSIT_COINS) {
        actionHeader = "Deposit in " + child.userId;
    }

    const [userId, setUserId] = useState(child ? child.userId : "");
    const [amount, setAmount] = useState(0);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [showError, setShowError] = useState(null);
    const form = useRef();
    const checkBtn = useRef();

    useEffect(() => {
        dispatch(clearMessage());
    }, [])

    const { message } = useSelector(state => state.message);
    const dispatch = useDispatch();

    const onChangeAmount = (e) => {
        const newValue = e.target.value;
        if (newValue === '' || (/^\d+$/.test(newValue))) {
            setAmount(newValue);
        } else {
            setAmount(0);
        }
    };

    // const onChangeNote = (e) => {
    //     const n = e.target.value;
    //     setNote(n);
    // };

    // const onChangePassword = (e) => {
    //     const p = e.target.value;
    //     setPassword(p);
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        setConfirmationPopupOpen(false);
        setShowError(null);
        setSuccessful(false);
        form.current.validateAll();
        dispatch(clearMessage());

        if (checkBtn.current.context._errors.length === 0) {
            console.log("make transaction coins", role, action);
            dispatch(makeTransaction(userId, "", action, amount))
                .then((data) => {
                    console.log("make transaction coins data: ", data);
                    if (data.status === 401) {
                        if (data.data === "Wrong password") {
                            setSuccessful(false);
                        } else {
                            logout();
                        }
                    } else if (data.status === 200) {
                        setSuccessful(true);
                        let msg = "Deposited " + amount + " to " + userId + " Successfully!";
                        if (action === WITHDRAW_COINS)
                            msg = "Withdraw " + amount + " from " + userId + " Successfully!";
                        onMakeTransactionSuccessful(msg);
                    } else if (data.status === 400) {
                        console.log("errorerror", data.data);
                        setShowError(data.data);
                        setSuccessful(false);
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

    const [isConfirmationPopupOpen, setConfirmationPopupOpen] = useState(false);
    const closeConfirmationPopup = (e) => {
        e.preventDefault();
        setConfirmationPopupOpen(false);
    };

    const showConfirmationPopup = (e) => {
        e.preventDefault();
        if (amount === 0 || amount === "0") {
            setShowError("Please Enter Amount.");
            return;
        }

        setConfirmationPopupOpen(true);
    };

    return (
        <div className="agent-deposit-withdraw-popup-container">
            {isConfirmationPopupOpen && (
                <Modal onClose={() => setConfirmationPopupOpen(false)}>
                    <ConfirmationPopup userId={child.userId} action={action} amount={amount} closeConfirmationPopup={closeConfirmationPopup} handleSubmit={handleSubmit} />
                </Modal>
            )}
            <div className="agent-deposit-withdraw-popup-header">
                <label>{actionHeader}</label>
            </div>
            <div className="agent-deposit-withdraw-popup-body">
                {showError && !successful && (<div className="form-group" style={{ marginTop: "10px" }}>
                    <div className="alert alert-danger" role="alert">
                        {showError}
                    </div>
                </div>)}
                {(message || successful) && (<div className="form-group" style={{ marginTop: "10px" }}>
                    <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                        {message ? message : (action + " Successfully!")}
                    </div>
                </div>)}
                <Form onSubmit={showConfirmationPopup} ref={form} style={{ padding: "10px" }}>
                    {!successful && (
                        <div>
                            <div className="form-group">
                                <div className="cric-form-label-input-container">
                                    <div className="cric-div-label-form">
                                        <label className="label-form" htmlFor="amount">Amount</label>
                                    </div>
                                    <div className="cric-div-input-form">
                                        <Input
                                            placeholder="0"
                                            type="tel"
                                            id="reg_amount"
                                            className="form-control"
                                            name="amount"
                                            value={amount || ""}
                                            onChange={onChangeAmount}
                                            validations={!successful && [required]}
                                            style={{ fontSize: "14px" }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group" style={{ marginTop: "30px", textAlign: "center" }}>
                                <button className="board-buttons board-buttons-nav-bar-dark-small">Submit</button>
                                <button className="board-buttons board-buttons-nav-bar-dark-small" style={{ background: "#E34234" }} onClick={(e) => closeAgentActionsPopup(e)}>Cancel</button>
                            </div>
                        </div>
                    )}
                    <CheckButton style={{ display: "none" }} ref={checkBtn} />
                </Form>
            </div>

        </div>
    );
};

export default AgentActionsPopup;