import "./NotificationsPopup.css";

const NotificationsPopup = ({ title, message, closeNotificationsPopup }) => {

    return (
        <div className="notifications-popup-container">
            <div className="notifications-popup-body">
                <label className="notifications-popup-title">{title}</label>
                <label className="notifications-popup-value">{message}</label>
            </div>
            {/* <span style={{ color: "green" }}>{message}</span> */}
            <div className="notifications-popup-close-button">
                <button
                    className="board-buttons board-buttons-nav-bar-dark-small-downline-balance-close"
                    onClick={(e) => closeNotificationsPopup(e)} >OK</button>
            </div>
        </div>
    );
};

export default NotificationsPopup;