import "../../customized/MasterDownlineTableLite.css";
import { useState } from "react";
import { httpHelpers } from "../../../services/httpHelpers";
import { useLocation } from 'react-router-dom';
import DateRangePicker from "../../tables/DateRangePicker";
import { profitAndLoss } from "../../tables/Columns";
import TokenService from "../../../services/token-service";
import TableTitle from "../../customized/TableTitle";
import ProfitAndLossTable from "../../tables/ProfitAndLossTable";
import ProfitAndLossSummary from "../../tables/ProfitAndLossSummary";

export default function ProfitAndLoss({ logout, isSmallScreen }) {

    let user = TokenService.getUser();
    if (!user) {
        logout();
    }

    const [sportType] = useState("cricket");
    let userId = null;
    const { state } = useLocation();
    console.log("profitloss", state);

    if (state) {
        const { child } = state ? state : null;
        console.log("profitloss", child);
        userId = child.userId;
    }

    let getProfitAndLoss = "beta/profitLoss?offset=0&limit=10000";
    if (userId) {
        getProfitAndLoss = "beta/profitLoss?userId=" + userId + "&offset=0&limit=10000";
    } else {
        userId = user.userId;
    }
    const api = httpHelpers();
    const [profitLoss, setProfitLoss] = useState([]);
    const [allTimeTotal, setAllTimeTotal] = useState(0);

    const fetchProfitAndLoss = (startDate, endDate) => {
        if (!startDate || !endDate) {
            startDate = "";
            endDate = "";
        }
        api
            .get(`${getProfitAndLoss}` + "&startDate=" + startDate + "&endDate=" + endDate)
            .then(res => {
                console.log("profit loss res", res);
                if (res && res.data && res.data.length > 0) {
                    setProfitLoss(res.data);
                } else {
                    setProfitLoss([]);
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

    return (
        <div>
            <div className="date-range-presets-picker-container">
                <DateRangePicker fetchStatement={fetchProfitAndLoss} isSmallScreen={isSmallScreen} fetchLast7DaysOnLoad={true} />
            </div>
            <div className="entity-ledger-root">
                <div style={{ paddingBottom: "0px", marginBottom: "20px" }}>
                    <TableTitle
                        text="Summary"
                        color="#ffffff"
                        fontSize="14px"
                        textAlign="left"
                        width={isSmallScreen ? "98.5%" : "100%"}
                        height="36px"
                        marginLeft="0px"
                        paddingLeft="10px"
                    />
                    <ProfitAndLossSummary allTimeTotal={allTimeTotal} />
                </div>
                <TableTitle
                    text={"Earning Report " + userId}
                    color="#ffffff"
                    fontSize="14px"
                    textAlign="left"
                    width={isSmallScreen ? "98.5%" : "100%"}
                    height="46px"
                    marginLeft="0px"
                    paddingLeft="10px"
                />
                <ProfitAndLossTable columns={profitAndLoss} data={profitLoss} setAllTimeTotal={setAllTimeTotal} sport={sportType} />
            </div>
        </div>
    );
};
