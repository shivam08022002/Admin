import "../../customized/MasterDownlineTableLite.css";
import { useState } from "react";
import { httpHelpers } from "../../../services/httpHelpers";
import { useNavigate, useLocation } from 'react-router-dom';
import DateRangePicker from "../../tables/DateRangePicker";
import { statementTable } from "../../tables/Columns";
import TokenService from "../../../services/token-service";
import TableTitle from "../../customized/TableTitle";
import EntityStatementTable from "../../tables/EntityStatementTable";

export default function EntityStatement({ logout, isSmallScreen }) {

    let user = TokenService.getUser();
    if (!user) {
        logout();
    }

    let userId = null;
    const { state } = useLocation();
    console.log("estatement", state);

    if (state) {
        const { child } = state ? state : null;
        console.log("estatement", child);
        userId = child.userId;
    }

    let getCoinLedger = "beta/getCoinLedger?userId=&offset=0&limit=1000";
    if (userId) {
        getCoinLedger = "beta/getCoinLedger?userId=" + userId + "&offset=0&limit=1000";
    } else {
        userId = user.userId;
    }
    const api = httpHelpers();
    const [coinLedger, setCoinLedger] = useState([]);
    let navigate = useNavigate();

    const fetchStatement = (startDate, endDate) => {
        if (!startDate || !endDate) {
            startDate = "";
            endDate = "";
        }
        api
            .get(`${getCoinLedger}` + "&startDate=" + startDate + "&endDate=" + endDate)
            .then(res => {
                console.log("coin ledger res", res);
                if (res && res.data && res.data.length > 0) {
                    setCoinLedger(res.data);
                } else {
                    setCoinLedger([]);
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
                <DateRangePicker fetchStatement={fetchStatement} isSmallScreen={isSmallScreen} fetchLast7DaysOnLoad={true} />
            </div>
            <div className="entity-ledger-root">
                <TableTitle
                    text={"Statement of " + userId}
                    color="#ffffff"
                    fontSize="14px"
                    textAlign="left"
                    width={isSmallScreen ? "98.5%" : "100%" }
                    height="46px"
                    marginLeft="0px"
                    paddingLeft="10px"
                />
                <EntityStatementTable columns={statementTable} data={coinLedger} tableHeader={"Statement of " + userId} />
            </div>
        </div>
    );
};
