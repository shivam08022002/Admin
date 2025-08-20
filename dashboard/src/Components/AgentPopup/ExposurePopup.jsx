import React, { useState, useEffect } from "react";
import "../../index.css";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../../actions/message";
import { httpHelpers } from "../../services/httpHelpers";
import ExposureTable from "../tables/ExposureTable";

const ExposurePopup = ({ role, logout, child, closeExposurePopup }) => {

    let getExposure = "beta/getUserExposure?userId=" + child.userId;
    const { message } = useSelector(state => state.message);
    const dispatch = useDispatch();
    const api = httpHelpers();
    const [exposure, setExposure] = useState();

    const fetchExposure = () => {
        api
            .get(`${getExposure}`)
            .then(res => {
                console.log("get exposure res", res);
                if (res && res.data) {
                    setExposure(res.data);
                } else {
                    setExposure(null);
                }
            })

            .catch(err => {
                console.log("error error", err);
                if (err) {
                    if (err.data) {
                        if (err.data.status && err.data.status === 401) {
                            logout();
                        }
                    } else if (err.response) {
                        if (err.response.status && err.response.status === 401) {
                            logout();
                        }
                    }
                }
            });
    };

    useEffect(() => {
        dispatch(clearMessage());
        fetchExposure();
    }, []);

    return (
        <div className="user-exposure-popup-container">
            <div className="user-exposure-popup-header">
                <label>USER EXPOSURE INFORMATION</label>
                <button className="x-button" onClick={(e) => closeExposurePopup(e)}>X</button>
            </div>
            <div className="user-exposure-popup-body">
                {exposure && <ExposureTable exposure={exposure} />}
            </div>
            {message && <span style={{ color: "red" }}>{message}</span>}
            {/* <div className="user-exposure-popup-separator"></div>
            <div className="user-exposure-popup-close-button">
                <button
                    className="board-buttons board-buttons-nav-bar-dark-small-agent-notification-close"
                    onClick={(e) => closeExposurePopup(e)} >Close</button>
            </div> */}
        </div>
    );
};

export default ExposurePopup;