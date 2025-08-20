import "../customized/MasterDownlineTableLite.css";
import { useState, useEffect } from "react";
import { httpHelpers } from "../../services/httpHelpers";
import "rsuite/dist/rsuite.min.css";
import { useNavigate, useLocation } from 'react-router-dom';
import TokenService from "../../services/token-service";
import '../CommonStyles/MyDownline.css';
import '../CommonStyles/OverlayPopups.css';
import AgentActionsPopup from "../AgentPopup/AgentActionsPopup";
import Modal from '../Settings/Modal';
import { DEPOSIT_COINS, WITHDRAW_COINS } from "../../common/constants";
import SummaryTable from "../tables/SummaryTable";
import CommissionLimitTable from "../tables/CommissionLimitTable";
import TableTitle from "../customized/TableTitle";
import DownlineBalancePopup from "../AgentPopup/DownlineBalancePopup";
import ExposurePopup from "../AgentPopup/ExposurePopup";

export default function MyDownlines({ role, logout, isSmallScreen }) {
    console.log("show", role);
    const href = window.location.href;
    let agentType = "user";
    let addType = "User";
    if (href.includes("showsc")) {
        agentType = "subcompany";
        addType = "SC";
    } else if (href.includes("showsst")) {
        agentType = "superstockist";
        addType = "SST";
    } else if (href.includes("showst")) {
        agentType = "stockist";
        addType = "ST";
    } else if (href.includes("showagent")) {
        agentType = "agent";
        addType = "Agent";
    }
    console.log("agentType", agentType);
    const user = TokenService.getUser();
    const { state } = useLocation();

    // if (state === null) {
    //     logout();
    // }
    const { msg } = state ? state : "";

    const getImmediateChildren = "/beta/getImmediateChildren?agentId=" + user.userId;
    const api = httpHelpers();
    const [immediateSubMaster, setImmediateSubMaster] = useState(null);
    const [immediateSubCompany, setImmediateSubCompany] = useState(null);
    const [immediateSuperStockist, setImmediateSuperStockist] = useState(null);
    const [immediateStockist, setImmediateStockist] = useState(null);
    const [immediateAgent, setImmediateAgent] = useState(null);
    const [immediateUser, setImmediateUser] = useState(null);
    let navigate = useNavigate();

    const fetchChildrenByType = () => {
        api
            .get(`${getImmediateChildren}`)
            .then(res => {
                console.log("children", res);
                if (res && res.data) {
                    if (res.data.submaster)
                        setImmediateSubMaster(res.data.submaster);
                    if (res.data.subcompany)
                        setImmediateSubCompany(res.data.subcompany);
                    if (res.data.superstockist)
                        setImmediateSuperStockist(res.data.superstockist);
                    if (res.data.stockist)
                        setImmediateStockist(res.data.stockist);
                    if (res.data.agent)
                        setImmediateAgent(res.data.agent);
                    if (res.data.user)
                        setImmediateUser(res.data.user);
                } else {
                    setImmediateSubMaster(null);
                    setImmediateSubCompany(null);
                    setImmediateSuperStockist(null);
                    setImmediateStockist(null);
                    setImmediateAgent(null);
                    setImmediateUser(null);
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
        if (agentType.includes("subcompany")) {
            navigate('/registersc');
        } else if (agentType.includes("superstockist")) {
            navigate('/registersst');
        } else if (agentType.includes("stockist")) {
            navigate('/registerst');
        } else if (agentType.includes("agent")) {
            navigate('/registeragent');
        } else if (agentType.includes("user")) {
            navigate('/registeruser');
        }
    };

    const deposit = (e, child) => {
        e.preventDefault();
        // navigate('/deposit', { state: { child } });
        // navigate(`/paycash/${child.userId}`, { state: { child } });
        setActionChild(child);
        setActionType(DEPOSIT_COINS);
        // setShowActionPopup(true);
        setModalOpen(true);
    };

    const withdraw = (e, child) => {
        e.preventDefault();
        // navigate('/withdraw', { state: { child } });
        // navigate(`/receivecash/${child.userId}`, { state: { child } });
        setActionChild(child);
        setActionType(WITHDRAW_COINS);
        // setShowActionPopup(true);
        setModalOpen(true);
    };

    const handleImmediateChildren = (e, child) => {
        e.preventDefault();
        navigate(`/icdashboard/${child.userId}/${child.entityType}`, { state: { child } });
    };

    const edit = (e, child) => {
        e.preventDefault();
        // navigate('/edit', { state: { child } });
        navigate('/update', { state: { child } });
    };

    const profitAndLoss = (e, child) => {
        e.preventDefault();
        navigate('/profitandloss', { state: { child } });
        // navigate(`/paycash/${child.userId}`, { state: { child } });
    };

    const statement = (e, child) => {
        e.preventDefault();
        navigate('/estatement', { state: { child } });
    };

    const changeUserPassword = (e, child) => {
        e.preventDefault();
        // navigate('/changeuserpassword', { state: { child } });
        setActionChild(child);
        setActionType("C");
        // setShowActionPopup(true)
        setModalOpen(true);
    };

    useEffect(() => {
        fetchChildrenByType();
    }, [agentType]);

    const [showActionPopup, setShowActionPopup] = useState(false);
    const [actionType, setActionType] = useState();
    const [actionChild, setActionChild] = useState();
    const [isModalOpen, setModalOpen] = useState(false);
    const [isDownlineBalanceModalOpen, setDownlineBalanceModalOpen] = useState(false);
    const [isExposureModalOpen, setExposureModalOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const [successful, setSuccessful] = useState(false);

    const closeAgentActionsPopup = (e) => {
        e.preventDefault();
        setModalOpen(false);
    };

    const onMakeTransactionSuccessful = (msg) => {
        fetchChildrenByType();
        setModalOpen(false);
        setMessage(msg);
    };

    const downlineBalancePopup = (e, child) => {
        e.preventDefault();
        setActionChild(child);
        setDownlineBalanceModalOpen(true);
    };

    const closeDownlineBalancePopup = (e) => {
        e.preventDefault();
        setDownlineBalanceModalOpen(false);
    };

    const exposurePopup = (e, child) => {
        e.preventDefault();
        setActionChild(child);
        setExposureModalOpen(true);
    };

    const closeExposurePopup = (e) => {
        e.preventDefault();
        setExposureModalOpen(false);
    };

    return (
        <div>

            {isModalOpen && (
                <Modal onClose={() => setModalOpen(false)} isSmallScreen={isSmallScreen}>
                    <AgentActionsPopup role={role} logout={logout} action={actionType} child={actionChild} closeAgentActionsPopup={closeAgentActionsPopup} onMakeTransactionSuccessful={onMakeTransactionSuccessful} />
                </Modal>
            )}
            {isDownlineBalanceModalOpen && (
                <Modal onClose={() => setDownlineBalanceModalOpen(false)} isSmallScreen={isSmallScreen} borderRadius={true}>
                    <DownlineBalancePopup role={role} logout={logout} child={actionChild} closeDownlineBalancePopup={closeDownlineBalancePopup} />
                </Modal>
            )}
            {isExposureModalOpen && (
                <Modal onClose={() => setExposureModalOpen(false)} isSmallScreen={isSmallScreen}>
                    <ExposurePopup role={role} logout={logout} child={actionChild} closeExposurePopup={closeExposurePopup} />
                </Modal>
            )}
            {/* <div className="my-downline-commission-limit-root">
                <div className="table-top-container-commission-limit"> */}
            <div className="my-downline-table-container-commission-limit">
                <div>
                    {immediateSubMaster && <div>
                        <div style={{ paddingBottom: "30px" }}>
                            {/* <CommisionAndLimitsTable rows={immediateSubMaster} deposit={deposit} withdraw={withdraw} tableHeader={"Sub Master"} message={actionChild && actionChild.entityType === "submaster" ? message : null} /> */}
                            <TableTitle
                                text="SSC"
                                color="#ffffff"
                                fontSize="14px"
                                textAlign="left"
                                width="100%"
                                height="36px"
                                marginLeft="0px"
                                paddingLeft="10px"
                            />
                            <CommissionLimitTable rows={immediateSubMaster} deposit={deposit} withdraw={withdraw} profitAndLoss={profitAndLoss} statement={statement} tableHeader={"SSC"} message={actionChild && actionChild.entityType === "subsubcompany" ? message : null} isSmallScreen={isSmallScreen} downlineBalanceExposure={downlineBalancePopup} />
                        </div>
                    </div>}
                    {immediateSubCompany && <div>
                        <div style={{ paddingBottom: "30px" }}>
                            {/* <CommisionAndLimitsTable rows={immediateSubCompany} deposit={deposit} withdraw={withdraw} tableHeader={"Sub Company"} message={actionChild && actionChild.entityType === "subcompany" ? message : null} /> */}
                            <TableTitle
                                text="Sub Company"
                                color="#ffffff"
                                fontSize="14px"
                                textAlign="left"
                                width="100%"
                                height="36px"
                                marginLeft="0px"
                                paddingLeft="10px"
                            />
                            <CommissionLimitTable rows={immediateSubCompany} deposit={deposit} withdraw={withdraw} profitAndLoss={profitAndLoss} statement={statement} tableHeader={"Sub Company"} message={actionChild && actionChild.entityType === "subcompany" ? message : null} downlineBalanceExposure={downlineBalancePopup} />
                        </div>
                    </div>}
                    {immediateSuperStockist && <div>
                        <div style={{ paddingBottom: "30px" }}>
                            {/* <CommisionAndLimitsTable rows={immediateSuperStockist} deposit={deposit} withdraw={withdraw} tableHeader={"Super Stockist"} message={actionChild && actionChild.entityType === "superstockist" ? message : null} /> */}
                            <TableTitle
                                text="Super Stockist"
                                color="#ffffff"
                                fontSize="14px"
                                textAlign="left"
                                width="100%"
                                height="36px"
                                marginLeft="0px"
                                paddingLeft="10px"
                            />
                            <CommissionLimitTable rows={immediateSuperStockist} deposit={deposit} withdraw={withdraw} profitAndLoss={profitAndLoss} statement={statement} tableHeader={"Super Stockist"} message={actionChild && actionChild.entityType === "superstockist" ? message : null} downlineBalanceExposure={downlineBalancePopup} />
                        </div>
                    </div>}
                    {immediateStockist && <div>
                        <div style={{ paddingBottom: "30px" }}>
                            {/* <CommisionAndLimitsTable rows={immediateStockist} deposit={deposit} withdraw={withdraw} tableHeader={"Stockist"} message={actionChild && actionChild.entityType === "stockist" ? message : null} /> */}
                            <TableTitle
                                text="Stockist"
                                color="#ffffff"
                                fontSize="14px"
                                textAlign="left"
                                width="100%"
                                height="36px"
                                marginLeft="0px"
                                paddingLeft="10px"
                            />
                            <CommissionLimitTable rows={immediateStockist} deposit={deposit} withdraw={withdraw} profitAndLoss={profitAndLoss} statement={statement} tableHeader={"Stockist"} message={actionChild && actionChild.entityType === "stockist" ? message : null} downlineBalanceExposure={downlineBalancePopup} />
                        </div>
                    </div>}
                    {immediateAgent && <div>
                        <div style={{ paddingBottom: "30px" }}>
                            {/* <CommisionAndLimitsTable rows={immediateAgent} deposit={deposit} withdraw={withdraw} tableHeader={"Agent"} message={actionChild && actionChild.entityType === "agent" ? message : null} /> */}
                            <TableTitle
                                text="Agent"
                                color="#ffffff"
                                fontSize="14px"
                                textAlign="left"
                                width="100%"
                                height="36px"
                                marginLeft="0px"
                                paddingLeft="10px"
                            />
                            <CommissionLimitTable rows={immediateAgent} deposit={deposit} withdraw={withdraw} profitAndLoss={profitAndLoss} statement={statement} tableHeader={"Agent"} message={actionChild && actionChild.entityType === "agent" ? message : null} downlineBalanceExposure={downlineBalancePopup} />
                        </div>
                    </div>}
                    {immediateUser && <div>
                        <div style={{ paddingBottom: "30px" }}>
                            {/* <CommisionAndLimitsTable rows={immediateUser} deposit={deposit} withdraw={withdraw} tableHeader={"All Users"} isUser={true} message={actionChild && actionChild.entityType === "user" ? message : null} /> */}
                            <TableTitle
                                text="User"
                                color="#ffffff"
                                fontSize="14px"
                                textAlign="left"
                                width="100%"
                                height="36px"
                                marginLeft="0px"
                                paddingLeft="10px"
                            />
                            <CommissionLimitTable rows={immediateUser} deposit={deposit} withdraw={withdraw} profitAndLoss={profitAndLoss} statement={statement} tableHeader={"All Users"} isUser={true} message={actionChild && actionChild.entityType === "user" ? message : null} downlineBalanceExposure={exposurePopup} />
                        </div>
                    </div>}
                    <div>
                        <div style={{ paddingBottom: "0px" }}>
                            <TableTitle
                                text="Summary"
                                color="#ffffff"
                                fontSize="14px"
                                textAlign="left"
                                width="100%"
                                height="36px"
                                marginLeft="0px"
                                paddingLeft="10px"
                            />
                            <SummaryTable logout={logout} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
