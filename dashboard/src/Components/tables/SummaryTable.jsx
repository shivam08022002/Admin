// src/DynamicTable.js
import React, { useState, useEffect } from 'react';
import './DynamicTable.css';
import './MatchesTable.css';
import './AgentTablePagination.css';
import TokenService from '../../services/token-service';
import { summaryTable } from './Columns';
import { useDispatch} from "react-redux";
import { clearMessage } from '../../actions/message';
import { httpHelpers } from '../../services/httpHelpers';


const SummaryTable = ({ logout }) => {
    const user = TokenService.getUser();
    let getDownlineBalance = "beta/getDownLineBalance?userId=" + user.userId;
    const api = httpHelpers();
    const dispatch = useDispatch();
    const [downlineBalance, setDownlineBalance] = useState();

    const fetchDownlineBalance = () => {
        api
            .get(`${getDownlineBalance}`)
            .then(res => {
                console.log("get downline balance res", res);
                if (res && res.data) {
                    setDownlineBalance(res.data);
                } else {
                    setDownlineBalance(null);
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
        fetchDownlineBalance();
    }, []);

    return (
        <div className="matches-table-root">
            <table className="summary-table-custom">
                <thead>
                    <tr>
                        {summaryTable.map((column, index) => (
                            <th className="summary-table-header-cell-grey" key={index}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr className="summary-table-row">
                        <td className="summary-table-custom-td">
                            {user && user.balance}
                        </td>
                        <td className="summary-table-custom-td">
                            {downlineBalance && downlineBalance.toFixed(2)}
                        </td>
                        <td className="summary-table-custom-td">
                            {user && user.exposure && user.exposure.toFixed(2)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SummaryTable;