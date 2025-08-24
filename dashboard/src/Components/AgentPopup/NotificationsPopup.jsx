import "./NotificationsPopup.css";

const NotificationsPopup = ({ title, message, closeNotificationsPopup }) => {

    return (
        <div className="notifications-popup-container">
            <div className="notifications-popup-header">
                Notification
            </div>
            <div className="notifications-popup-body">
                <div className="notifications-popup-title">{title}</div>
                <div className="notifications-popup-value">{message}</div>
            </div>
            <div className="notifications-popup-separator"></div>
            <div className="notifications-popup-close-button">
                <button onClick={(e) => closeNotificationsPopup(e)}>
                    OK
                </button>
            </div>
        </div>
    );
};

export default NotificationsPopup;