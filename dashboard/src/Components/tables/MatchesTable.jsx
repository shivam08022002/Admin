import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DynamicTable.css';
import './MatchesTable.css';
import './AgentTablePagination.css';
import Clock_Icon from '../../assets/clock_icon.svg';

const MatchesTable = ({ data, sport, liveMatches, isSmallScreen, rowsPerPage }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(rowsPerPage);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 600) {
                setItemsPerPage(rowsPerPage);
            } else {
                setItemsPerPage(rowsPerPage);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);

    const pageNumbers = [];
    const visiblePages = isSmallScreen ? 3 : 3;
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (endPage - startPage + 1 < visiblePages) {
        startPage = Math.max(1, endPage - visiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    let navigate = useNavigate();
    const openLiveReport = (e, id, title) => {
        e.preventDefault();
        navigate(`/matchscreen/${sport}/${id}/${title}`);
    };

    return (
        <div className="matches-table-root">
            <table className="matches-table-custom">
                <thead>
                    <tr>
                        <th className="matches-table-header-cell-grey">Match ID</th>
                        <th className="matches-table-header-cell-grey">Name</th>
                        <th className="matches-table-header-cell-grey">Sport</th>
                        <th className="matches-table-header-cell-grey">Date</th>
                        {/* ✅ Bet Count header placed AFTER Date */}
                        <th className="matches-table-header-cell-grey">Bet Count</th>
                        {!liveMatches && <th className="matches-table-header-cell-grey">Winner</th>}
                        <th className="matches-table-header-cell-grey">
                            {liveMatches ? 'Live Report' : 'Profit/Loss'}
                        </th>
                        {/* ✅ Live Report column for completed matches */}
                        {!liveMatches && <th className="matches-table-header-cell-grey">Live Report</th>}
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="matches-table-row">
                            <td className="matches-table-custom-td">{row.id}</td>
                            <td className="matches-table-custom-td-link">
                                <Link to={`/matchesdashboard/${sport}/${row.id}/${row.name}`} style={{ textDecoration: "none", color: "#337ab7" }}>
                                    {row.name}
                                </Link>
                            </td>
                            <td className="matches-table-custom-td">{sport && sport.toUpperCase()}</td>
                            <td className="matches-table-custom-td">
                                <img src={Clock_Icon} className="clock-icon" alt="Clock Icon" />{row.openDate}
                            </td>

                            {/* ✅ Bet Count cell - single line with 2px gap */}
                            <td className="matches-table-custom-td">
                                <div style={{ display: 'inline-flex', gap: '8px', whiteSpace: 'nowrap' }}>
                                    <span style={{ backgroundColor: '#e0f2ff', padding: '2px 6px', borderRadius: '4px',margin:'0' }}>
                                        M: {row.oddsBetCount}
                                    </span>
                                    <span style={{ backgroundColor: '#c8facc', padding: '2px 6px', borderRadius: '4px',margin:'0' }}>
                                        S: {row.sessionBetCount}
                                    </span>
                                </div>
                            </td>

                            {!liveMatches && <td className="matches-table-custom-td">{row.winner}</td>}
                            <td className="matches-table-custom-td">
                                {!liveMatches ? (
                                    <label className={row.profitLoss < 0 ? "label-loss" : "label-profit"}>
                                        {row.profitLoss.toFixed(1)}
                                    </label>
                                ) : (
                                    <button
                                        className="cric-board-buttons board-buttons-nav-bar-dark-small2-live-report"
                                        style={{ marginLeft: "5px", fontSize: "14px", fontWeight: "400" }}
                                        onClick={(e) => openLiveReport(e, row.id, row.name)}
                                    >
                                        Live Report
                                    </button>
                                )}
                            </td>
                            {/* ✅ Live Report column for completed matches */}
                            {!liveMatches && (
                                <td className="matches-table-custom-td">
                                    <button
                                        className="cric-board-buttons board-buttons-nav-bar-dark-small2-live-report"
                                        style={{ marginLeft: "5px", fontSize: "14px", fontWeight: "400" }}
                                        onClick={(e) => openLiveReport(e, row.id, row.name)}
                                    >
                                        Live Report
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {currentData && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="agent-table-pagination-prev-button"
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {startPage > 1 && <span className="pagination-ellipsis">...</span>}
                    {pageNumbers.map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`matches-table-pagination-button ${currentPage === page ? 'active' : ''}`}
                        >
                            {page}
                        </button>
                    ))}
                    {endPage < totalPages && <span className="pagination-ellipsis">...</span>}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="agent-table-pagination-next-button"
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default MatchesTable;
