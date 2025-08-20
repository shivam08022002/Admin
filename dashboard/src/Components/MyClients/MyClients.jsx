import "../../Components/customized/MasterDownlineTableLite.css";
import { useState, useEffect } from "react";
import { httpHelpers } from "../../services/httpHelpers";
import "rsuite/dist/rsuite.min.css";
import { useNavigate, useLocation } from 'react-router-dom';
import TokenService from "../../services/token-service";
import '../CommonStyles/MyDownline.css';
import '../CommonStyles/OverlayPopups.css';
import Modal from '../Settings/Modal';
import CustomTableHeader from '../CommonStyles/CustomTableHeader';
import ClientTable from "../tables/ClientTable";
import NotificationsPopup from "../AgentPopup/NotificationsPopup";

export default function MyClients({ role, logout, open, isSmallScreen }) {
    const href = window.location.href;
    let blockedStatus = false;
    if (href.includes("blockedclients"))
        blockedStatus = true;
    const user = TokenService.getUser();
    const { state } = useLocation();
    const { msg } = state ? state : "";

    const getChildrenByType = "/beta/getChildrenByType?type=user&offset=0&limit=1000&blocked=";
    const api = httpHelpers();
    const [childrenByType, setChildrenByType] = useState([]);
    let navigate = useNavigate();

    const fetchChildrenByType = () => {
        api
            .get(`${getChildrenByType}` + blockedStatus)
            .then(res => {
                if (res && res.data && res.data.length > 0) {
                    setChildrenByType(res.data);
                } else {
                    setChildrenByType(null);
                }
            })
            .catch(err => {
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

    const openRegister = (e) => {
        e.preventDefault();
        navigate('/register/user');
    };

    const handleImmediateChildren = (e, child) => {
        e.preventDefault();
        navigate(`/icdashboard/${child.userId}/${child.entityType}`, { state: { child } });
    };

    const edit = (e, child) => {
        e.preventDefault();
        navigate('/updateuser', { state: { child } });
    };

    const changeUserPassword = (e, child) => {
        e.preventDefault();
        navigate('/changeuserpassword', { state: { child } });
    };

    useEffect(() => {
        fetchChildrenByType();
    }, [blockedStatus]); // eslint-disable-line react-hooks/exhaustive-deps

    const [isNotificationsModalOpen, setNotificationsModalOpen] = useState(false);

    const closeNotificationsPopup = (e) => {
        e.preventDefault();
        setNotificationsModalOpen(false);
    };

    useEffect(() => {
        if (msg) {
            setNotificationsModalOpen(true);
        } else {
            setNotificationsModalOpen(false);
        }
    }, [msg]);

    useEffect(() => {
        window.history.replaceState({}, '');
    }, []);

    return (
        <div>
            {isNotificationsModalOpen && (
                <Modal onClose={() => closeNotificationsPopup(false)} isSmallScreen={isSmallScreen} borderRadius={true}>
                    <NotificationsPopup title={msg.msg ? msg.msg : msg} message={msg.uid} closeNotificationsPopup={closeNotificationsPopup} />
                </Modal>
            )}
            <div className="my-downline-root">
                {msg && (<div className="form-group" style={{ marginTop: "10px", marginLeft: "5px", marginRight: "5px" }}>
                    <div className="alert alert-success" role="alert">
                        {msg && msg.msg ? msg.msg : msg}
                    </div>
                </div>)}
                
                <CustomTableHeader 
                    title={blockedStatus === true ? "Blocked Clients" : "All Clients"}
                    showCreateButton={!blockedStatus}
                    createButtonText="Create User"
                    onCreateClick={openRegister}
                    isSmallScreen={isSmallScreen}
                />
                
                {childrenByType && <ClientTable
                    clients={childrenByType}
                    user={user}
                    edit={edit}
                    handleImmediateChildren={handleImmediateChildren}
                    changeUserPassword={changeUserPassword} />}
            </div>
        </div>
    );
};
