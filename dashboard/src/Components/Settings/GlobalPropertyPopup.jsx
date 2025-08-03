import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TokenService from "../../services/token-service.js";
import { updateGlobalProperty } from "../../actions/auth.js";
import "../../index.css";
import { clearMessage } from "../../actions/message";
import { SET_MESSAGE } from "../../actions/types";
import {
    AGENT_BANNER_MESSAGE,
    AGENT_NOTIFICATION_MESSAGE,
    ROWS_PER_PAGE,
    USER_BANNER_MESSAGE,
    USER_NOTIFICATION_MESSAGE,
    USER_SESSION_MESSAGE
} from "../../common/constants.jsx";
import { httpHelpers } from "../../services/httpHelpers.js";

const GlobalPropertyPopup = ({
    role,
    logout,
    propertyKey,
    closePropertyUpdatePopup,
    onPropertyUpdateSuccessful,
    actionHeader,
    actionTitle
}) => {
    const user = TokenService.getUser();
    if (user === null) {
        logout();
    }

    const [propertyValue, setPropertyValue] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [showError, setShowError] = useState(null);

    const api = httpHelpers();
    const getGlobalProperty = "alpha/getGlobalProperty/" + propertyKey;

    const dispatch = useDispatch();
    const { message } = useSelector(state => state.message);

    // ✅ Fetch current property value
    const fetchGlobalProperty = () => {
        api.get(getGlobalProperty)
            .then(res => {
                if (res && res.data) {
                    setPropertyValue(res.data === "undefined" ? "" : res.data);
                } else {
                    setPropertyValue("");
                }
            })
            .catch(err => {
                if (err?.data?.status === 401 || err?.response?.status === 401) {
                    logout();
                }
            });
    };

    useEffect(() => {
        dispatch(clearMessage());
        fetchGlobalProperty();
    }, []);

    const onPropertyValueChange = (e) => {
        setPropertyValue(e.target.value);
    };

    // ✅ Handle submit with custom validation
    const handleSubmit = (e) => {
        e.preventDefault();

        // Required validation
        if (!propertyValue || propertyValue.trim().length === 0) {
            setShowError("Please Enter Message.");
            return;
        }

        // Numeric check for ROWS_PER_PAGE
        if (propertyKey === ROWS_PER_PAGE && isNaN(propertyValue)) {
            setShowError("Please enter a valid number.");
            return;
        }

        setShowError(null);
        setSuccessful(false);
        dispatch(clearMessage());

        dispatch(updateGlobalProperty(propertyKey, propertyValue))
            .then((data) => {
                if (data.status === 401) {
                    if (data.data === "Wrong password") {
                        setSuccessful(false);
                    } else {
                        logout();
                    }
                } else if (data.status === 200) {
                    let msg = "Agent Banner Updated Successfully!";
                    if (propertyKey === AGENT_NOTIFICATION_MESSAGE)
                        msg = "Agent Notification Updated Successfully!";
                    else if (propertyKey === USER_BANNER_MESSAGE)
                        msg = "User Banner Updated Successfully!";
                    else if (propertyKey === USER_NOTIFICATION_MESSAGE)
                        msg = "User Notification Updated Successfully!";
                    else if (propertyKey === ROWS_PER_PAGE)
                        msg = "Rows Per Page Count Updated Successfully!";
                    else if (propertyKey === USER_SESSION_MESSAGE)
                        msg = "User Session Message Updated Successfully!";

                    onPropertyUpdateSuccessful(msg);
                    setSuccessful(true);
                } else {
                    setSuccessful(false);
                    dispatch({
                        type: SET_MESSAGE,
                        payload: data.data,
                        role: role
                    });
                }
            })
            .catch(() => {});
    };

    return (
        <div className="admin-global-porperty-popup-container">
            <div className="admin-global-porperty-popup-header">
                <label>{actionHeader}</label>
            </div>
            <div className="admin-global-porperty-popup-body">
                <div>
                    {showError && !successful && (
                        <div className="form-group" style={{ marginTop: "10px" }}>
                            <div className="alert alert-danger" role="alert">
                                {showError}
                            </div>
                        </div>
                    )}
                    {(message || successful) && (
                        <div className="form-group" style={{ marginTop: "10px" }}>
                            <div
                                className={
                                    successful ? "alert alert-success" : "alert alert-danger"
                                }
                                role="alert"
                            >
                                {message ? message : propertyKey + " Successfully!"}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ padding: "10px" }}>
                        {!successful && (
                            <div>
                                <div className="form-group">
                                    <div className="cric-form-label-textarea-container">
                                        <div className="cric-div-gp-label-form">
                                            <label className="label-form" htmlFor="pvalue">
                                                {actionTitle}
                                            </label>
                                        </div>
                                        <div className="cric-div-textarea-form">
                                            <textarea
                                                className="global-property-text-area"
                                                placeholder={
                                                    propertyKey === ROWS_PER_PAGE
                                                        ? "Enter Page Count"
                                                        : "Enter Message"
                                                }
                                                id="gp_value"
                                                name="pvalue"
                                                rows="6"
                                                cols="50"
                                                value={propertyValue || ""}
                                                onChange={onPropertyValueChange}
                                                style={{ fontSize: "12px" }}
                                                maxLength={
                                                    propertyKey === AGENT_BANNER_MESSAGE ||
                                                    propertyKey === USER_BANNER_MESSAGE
                                                        ? 200
                                                        : 500
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                              <div className="form-group" style={{ marginTop: "30px" }}>
                                <div className="board-buttons-container">
                                    <button
                                    type="submit"
                                    className="board-buttons board-buttons-submit"
                                    >
                                    Submit
                                    </button>
                                    <button
                                    type="button"
                                    className="board-buttons board-buttons-cancel"
                                    style={{ background: "#E34234" }}
                                    onClick={(e) => closePropertyUpdatePopup(e)}
                                    >
                                    Cancel
                                    </button>
                                </div>
                                </div>

                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GlobalPropertyPopup;
