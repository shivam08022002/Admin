// import "../parvati/style/MasterDownlineTableLite.css";
import { useState, useEffect } from "react";
import { httpHelpers } from "../../services/httpHelpers";
import { statementTable, betHistoryTable, userInfoTable } from "../tables/Columns";
import TableTitle from "../customized/TableTitle";
import EntityStatementTable from "../tables/EntityStatementTable";
import SearchBar from "./SearchBar";
import BetHistoryTable from "../tables/BetHistoryTable";
import OrgChart from "./orgchart/OrgChart";
import './SearchUsers.css';
import UserInfo from "./orgchart/UserInfo";

export default function SearchUsers({ role, logout, isSmallScreen }) {

    let getUserInfo = "alpha/getUserInfo?userId=";
    const api = httpHelpers();
    const [userId, setUserId] = useState();
    const [userInfo, setUserInfo] = useState();
    const [betHistory, setBetHistory] = useState();
    const [coinHistory, setCoinHistory] = useState();
    const [hierarchy, setHierarchy] = useState();
    const [error, setError] = useState();

    const fetchUserInfo = () => {
        api
            .get(`${getUserInfo}` + userId)
            .then(res => {
                console.log("search mole res", res);
                if (res && res.data && res.data.coinHistory) {
                    setCoinHistory(res.data.coinHistory);
                } else {
                    setCoinHistory(null);
                }
                if (res && res.data && res.data.betHistory) {
                    setBetHistory(res.data.betHistory);
                } else {
                    setBetHistory(null);
                }
                if (res && res.data && res.data.userInfo) {
                    setUserInfo(res.data.userInfo);
                } else {
                    setUserInfo(null);
                }
                if (res && res.data && res.data.hierarchy) {
                    setHierarchy(res.data.hierarchy);
                } else {
                    setHierarchy(null);
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
        if (userId) {
            setError(null);
            fetchUserInfo();
        }
    }, [userId]);

    return (
        <div>
            <div className="date-range-presets-picker-container">
                <SearchBar setId={setUserId} setError={setError} isSmallScreen={isSmallScreen} />
            </div>
            {error && (<div className="form-group" style={{ marginTop: "10px" }}>
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>)}
            {userInfo && hierarchy && <div>
                <div className="user-info-root">
                    <div className="hierarchy-container">
                        <TableTitle
                            text="User Hierarchy"
                            color="#ffffff"
                            fontSize="14px"
                            textAlign="left"
                            width="100%"
                            height="46px"
                            marginLeft="0px"
                            paddingLeft="10px"
                            marginBottom="20px"
                        />
                        <OrgChart hierarchy={hierarchy} />
                    </div>
                    <div className="user-details-container">
                        <TableTitle
                            text="User Info"
                            color="#ffffff"
                            fontSize="14px"
                            textAlign="left"
                            width="100%"
                            height="46px"
                            marginLeft="0px"
                            paddingLeft="10px"
                            marginBottom="20px"
                        />
                        <UserInfo columns={userInfoTable} userInfo={userInfo} />
                    </div>
                </div>
            </div>}
            {coinHistory && <div className="entity-ledger-root">
                <TableTitle
                    text="Coin History"
                    color="#ffffff"
                    fontSize="14px"
                    textAlign="left"
                    width={isSmallScreen ? "98.5%" : "100%"}
                    height="46px"
                    marginLeft="0px"
                    paddingLeft="10px"
                />
                <EntityStatementTable columns={statementTable} data={coinHistory} tableHeader={"Statement of " + userId} />
            </div>}
            {betHistory && <div className="entity-ledger-root">
                <TableTitle
                    text="Bet History"
                    color="#ffffff"
                    fontSize="14px"
                    textAlign="left"
                    width={isSmallScreen ? "98.5%" : "100%"}
                    height="46px"
                    marginLeft="0px"
                    paddingLeft="10px"
                />
                <BetHistoryTable columns={betHistoryTable} data={betHistory} tableHeader={"Statement of " + userId} />
            </div>}
        </div>
    );
};
