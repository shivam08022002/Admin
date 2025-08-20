import "../customized/MasterDownlineTableLite.css";
import { useState, useEffect } from "react";
import { httpHelpers } from "../../services/httpHelpers";
import "rsuite/dist/rsuite.min.css";
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/system';
import TablePagination, { tablePaginationClasses as classes } from '@mui/material/TablePagination';
import TokenService from "../../services/token-service";
import '../CommonStyles/MyDownline.css';
import '../CommonStyles/OverlayPopups.css';
import Modal from '../Settings/Modal';
import CustomTableHeader from '../CommonStyles/CustomTableHeader';
import BlockMarketPopup from "../AgentPopup/BlockMarketPopup";
import AgentTable from "../tables/AgentTable";
import NotificationsPopup from "../AgentPopup/NotificationsPopup";

export default function MyDownlines({ role, logout, isSmallScreen }) {
    console.log("mydownlines", role);
    const location = useLocation();
    const href = window.location.href;
    
    // Determine agent type from URL path or location state
    let agentType = "agent"; // Default to agent instead of user
    let addType = "Agent";
    let tableHeader = "Agent";
    
    if (href.includes("showsm") || location.pathname.includes("/users/sm")) {
        agentType = "submaster";
        addType = "SM";
        tableHeader = "Sub Master";
    } else if (href.includes("showsc") || location.pathname.includes("/users/sc")) {
        agentType = "subcompany";
        addType = "SC";
        tableHeader = "Sub Company";
    } else if (href.includes("showsst") || location.pathname.includes("/users/sst")) {
        agentType = "superstockist";
        addType = "SST";
        tableHeader = "Super Stockist";
    } else if (href.includes("showst") || location.pathname.includes("/users/stockist")) {
        agentType = "stockist";
        addType = "Stockist";
        tableHeader = "Stockist";
    } else if (href.includes("showagent") || location.pathname.includes("/users/agents")) {
        agentType = "agent";
        addType = "Agent";
        tableHeader = "Agent";
    }
    console.log("agentType", agentType, "pathname:", location.pathname);
    
    const { state } = useLocation();
    const { msg } = state ? state : "";

    const getChildrenByType = "/beta/getChildrenByType?type=" + agentType + "&offset=0&limit=1000";
    const api = httpHelpers();
    const [childrenByType, setChildrenByType] = useState([]);
    let navigate = useNavigate();
    const user = TokenService.getUser();

    const fetchChildrenByType = () => {
        api
            .get(`${getChildrenByType}`)
            .then(res => {
                console.log("children", res);
                if (res && res.data && res.data.length > 0) {
                    setChildrenByType(res.data);
                } else {
                    setChildrenByType(null);
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

    const openRegister = (e) => {
        e.preventDefault();
        if (agentType.includes("submaster")) {
            navigate('/register/sm');
        } else if (agentType.includes("subcompany")) {
            navigate('/register/sc');
        } else if (agentType.includes("superstockist")) {
            navigate('/register/sst');
        } else if (agentType.includes("stockist")) {
            navigate('/register/stockist');
        } else if (agentType.includes("agent")) {
            navigate('/register/agent');
        } else if (agentType.includes("user")) {
            navigate('/register/user');
        }
    };

    const block = (e, child) => {
        e.preventDefault();
        setActionChild(child);
        setBlockMarketModalOpen(true);
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
    }, [agentType]); // eslint-disable-line react-hooks/exhaustive-deps

    const [actionChild, setActionChild] = useState();
    const [isBlockMarketModalOpen, setBlockMarketModalOpen] = useState(false);

    const closeBlockMarketPopup = (e) => {
        e.preventDefault();
        setBlockMarketModalOpen(false);
    };

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
            {isBlockMarketModalOpen && (
                <Modal
                    onClose={(e) => closeBlockMarketPopup(e)}
                    showCloseButton={true}
                    noTopPadding={false}
                    maxWidth="80%"
                    borderRadius={true}
                >
                    <BlockMarketPopup role={role} logout={logout} hideTitle={true} actionChild={actionChild} />
                </Modal>
            )}
            {isNotificationsModalOpen && (
                <Modal onClose={() => closeNotificationsPopup(false)} borderRadius={true}>
                    <NotificationsPopup title={msg.msg ? msg.msg : msg} message={msg.uid} closeNotificationsPopup={closeNotificationsPopup} />
                </Modal>
            )}
            <div className="my-downline-root">
                {msg && (<div className="form-group" style={{ marginTop: "10px", marginLeft: "5px", marginRight: "0px" }}>
                    <div className="alert alert-success" role="alert">
                        {msg && msg.msg ? msg.msg : msg}
                    </div>
                </div>)}
                
                <CustomTableHeader 
                    title={tableHeader}
                    showCreateButton={true}
                    createButtonText={`Create ${addType}`}
                    onCreateClick={openRegister}
                    isSmallScreen={isSmallScreen}
                />
                
                {childrenByType && <AgentTable
                    agents={childrenByType}
                    user={user}
                    block={block}
                    edit={edit}
                    handleImmediateChildren={handleImmediateChildren}
                    changeUserPassword={changeUserPassword}
                    agentType={addType} />}
            </div>
        </div>
    );
};

const blue = {
    50: '#F0F7FF',
    200: '#A5D8FF',
    400: '#3399FF',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const Root = styled('div')(
    ({ theme }) => `
  border-radius: 2px;
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
  overflow: clip;
  border-right: none;

  table {
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.775rem;
    border-collapse: collapse;
    border: none;
    width: 100%;
    min-width: 600px;
    margin: -1px;
    background: white;
  }

  th {
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    text-align: left;
    padding: 12px;
    background: white;
    font-weight: bold;
  }

  td {
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    text-align: left;
    padding: 8px;
  }

  tr:nth-of-type(odd) {
    background: #f8f8f8;
  }

  @media (orientation: portrait) {
      table {
    min-width: 100wh;
  }
    }
  `,
);

const CustomTablePagination = styled(TablePagination)(
    ({ theme }) => `
    background: white;
  & .${classes.spacer} {
    display: none;
  }

  & .${classes.toolbar}  {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 8px;
    padding: 4px 0;

    @media (orientation: portrait) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .${classes.selectLabel} {
    margin: 0;
  }

  & .${classes.select}{
    font-family: 'IBM Plex Sans', sans-serif;
    padding: 2px 0 2px 4px;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    border-radius: 6px; 
    background-color: transparent;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    transition: all 100ms ease;

    &:hover {
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
    }

    &:focus {
      outline: 3px solid ${theme.palette.mode === 'dark' ? blue[400] : blue[200]};
      border-color: ${blue[400]};
    }
  }

  & .${classes.displayedRows} {
    margin-left: auto;
    margin-top: 3px;
    align-items: center;

    @media (orientation: portrait) {
      margin-left: 30px;
    }
  }

  & .${classes.actions} {
    display: flex;
    gap: 6px;
    border: transparent;
    text-align: center;
  }

  & .${classes.actions} > button {
    display: flex;
    align-items: center;
    padding: 0;
    border: transparent;
    border-radius: 50%;
    background-color: transparent;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    transition: all 120ms ease;

    > svg {
      font-size: 22px;
    }

    &:hover {
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
    }

    &:focus {
      outline: 3px solid ${theme.palette.mode === 'dark' ? blue[400] : blue[200]};
      border-color: ${blue[400]};
    }

    &:disabled {
      opacity: 0.3;
      &:hover {
        border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
        background-color: transparent;
      }
    }
  }
  `,
);
