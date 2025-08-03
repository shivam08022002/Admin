import "rsuite/dist/rsuite.min.css";
import './Settings.css';
import {
    AGENT_BANNER_MESSAGE,
    AGENT_NOTIFICATION_MESSAGE,
    ROWS_PER_PAGE,
    USER_BANNER_MESSAGE,
    USER_NOTIFICATION_MESSAGE,
    USER_SESSION_MESSAGE
} from "../../common/constants";
import GlobalPropertyPopup from "./GlobalPropertyPopup";
import { useState } from "react";
import Modal from './Modal';
import { useTheme } from '@mui/material';

export default function AdminSettings({ role, logout, isSmallScreen }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const [propertyKey, setPropertyKey] = useState(null);
    const [actionHeader, setActionHeader] = useState(null);
    const [actionTitle, setActionTitle] = useState(null);

    const theme = useTheme(); // ✅ Access current MUI theme

    const closePropertyUpdatePopup = (e) => {
        e.preventDefault();
        setModalOpen(false);
    };

    const onPropertyUpdateSuccessful = (msg) => {
        setMessage(msg);
        setModalOpen(false);
    };

    const showUpdatePropertyPoppup = (e, key, header, title) => {
        e.preventDefault();
        setPropertyKey(key);
        setActionHeader(header);
        setActionTitle(title);
        setMessage(null);
        setModalOpen(true);
    };

    return (
        <div 
            style={{ 
                background: theme.palette.background.default,
                paddingBottom: "50px",
                color: theme.palette.text.primary,
                minHeight: "100vh",
                transition: "all 0.3s ease"
            }}
        >
            {isModalOpen && (
                <Modal onClose={() => setModalOpen(false)} isSmallScreen={isSmallScreen}>
                    <GlobalPropertyPopup
                        role={role}
                        logout={logout}
                        propertyKey={propertyKey}
                        closePropertyUpdatePopup={closePropertyUpdatePopup}
                        onPropertyUpdateSuccessful={onPropertyUpdateSuccessful}
                        actionHeader={actionHeader}
                        actionTitle={actionTitle}
                    />
                </Modal>
            )}

            <div style={{ paddingTop: "30px" }}>
                {message && (
                    <div className="form-group" style={{ marginTop: "10px", padding: "0 10px" }}>
                        <div 
                            className="alert alert-success" 
                            role="alert"
                            style={{
                                background: theme.palette.mode === 'dark' ? '#1e3a2a' : '#dcfce7',
                                color: theme.palette.mode === 'dark' ? '#bbf7d0' : '#166534',
                                border: `1px solid ${theme.palette.mode === 'dark' ? '#065f46' : '#bbf7d0'}`
                            }}
                        >
                            {message}
                        </div>
                    </div>
                )}

                {/* ✅ Settings Button Grid */}
                <div className="settings-button-grid">
                    {[
                        { key: AGENT_BANNER_MESSAGE, label: "Agent Banner Message", header: "Agent Banner Message", title: "Banner Message" },
                        { key: AGENT_NOTIFICATION_MESSAGE, label: "Agent Notification Message", header: "Agent Notification Message", title: "Notification Message" },
                        { key: USER_BANNER_MESSAGE, label: "User Banner Message", header: "User Banner Message", title: "Banner Message" },
                        { key: USER_NOTIFICATION_MESSAGE, label: "User Notification Message", header: "User Notification Message", title: "Notification Message" },
                        { key: ROWS_PER_PAGE, label: "Rows Per Page", header: "Rows Per Page", title: "Rows Per Page" },
                        { key: USER_SESSION_MESSAGE, label: "User Session Message", header: "User Session Message", title: "User Session Message" },
                    ].map((btn) => (
                        <button
                            key={btn.key}
                            className="cric-board-buttons cric-board-admin-settings-buttons-large"
                            style={{
                                background: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                boxShadow: theme.palette.mode === 'dark' ? '0 2px 6px rgba(0,0,0,0.6)' : '0 2px 6px rgba(0,0,0,0.1)',
                            }}
                            onClick={(e) => showUpdatePropertyPoppup(e, btn.key, btn.header, btn.title)}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
