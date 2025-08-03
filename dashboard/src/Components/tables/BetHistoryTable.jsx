import { useState} from 'react';
import './DynamicTable.css';
import './BetHistoryTable.css';
import './AgentTablePagination.css';
import {
    MATCH_ODDS,
    BOOKMAKER,
    TOSS_ODDS,
    FANCY_BET,
    MARKET_MATCH_ODDS,
    MARKET_BOOKMAKER,
    MARKET_TOSS_ODDS,
    MARKET_FANCY_BET
} from "../../common/constants";

const BetHistoryTable = ({ columns, data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(1000);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);

    // Generate pagination buttons
    const pageNumbers = [];
    const visiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (endPage - startPage + 1 < visiblePages) {
        startPage = Math.max(1, endPage - visiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="bet-history-table-root">
            <table className="bet-history-table-custom">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th className="bet-history-table-header-cell-grey" key={index}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="bet-history-table-row">
                            <td className="bet-history-table-custom-td">
                                {row.betDate}
                            </td>
                            <td className="bet-history-table-custom-td">
                                {row.matchName}
                            </td>
                            <td className="bet-history-table-custom-td">
                                {row.marketName}
                            </td>
                            <td className="bet-history-table-custom-td">
                                {row.betType === MARKET_MATCH_ODDS && MATCH_ODDS}
                                {row.betType === MARKET_BOOKMAKER && BOOKMAKER}
                                {row.betType === MARKET_TOSS_ODDS && TOSS_ODDS}
                                {row.betType === MARKET_FANCY_BET && FANCY_BET}
                            </td>
                            <td className="bet-history-table-custom-td">
                                {row.candidate === "back" && "LAGAI"}
                                {row.candidate === "lay" && "KHAI"}
                                {(row.candidate === "yes" || row.candidate === "no") && row.candidate.toUpperCase()}
                            </td>
                            <td className="bet-history-table-custom-td">
                            {row.betType === MARKET_FANCY_BET && row.sessionValue}
                            {row.betType !== MARKET_FANCY_BET && "-"}
                            </td>
                            <td className="bet-history-table-custom-td">
                                {row.rate}
                            </td>
                            <td className="bet-history-table-custom-td">
                                {row.amount.toFixed(1)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BetHistoryTable;
