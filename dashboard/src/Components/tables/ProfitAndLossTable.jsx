import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProfitAndLossTable.css';

const ProfitAndLossTable = ({ columns, data, setAllTimeTotal }) => {
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

    const [totalEarnings, setTotalEarnings] = useState(0);
    const [matchEarnings, setMatchEarnings] = useState(0);
    const [commissionEarnings, setCommissionEarnings] = useState(0);

    const [expandedGroups, setExpandedGroups] = useState({});

    const toggleGroup = (index) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const groupConsecutiveByMatchName = (rows) => {
        const groups = [];
        let currentGroup = [];

        rows.forEach((row) => {
            if (
                currentGroup.length === 0 ||
                currentGroup[currentGroup.length - 1].matchName === row.matchName
            ) {
                currentGroup.push(row);
            } else {
                groups.push(currentGroup);
                currentGroup = [row];
            }
        });

        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }

        return groups;
    };

    const groupedData = groupConsecutiveByMatchName(currentData);

    useEffect(() => {
        let totalEarnings = 0;
        let matchEarnings = 0;
        let commissionEarnings = 0;

        currentData.forEach(record => {
            console.log("currentData ", record);

            totalEarnings = totalEarnings + record.totalEarnings;
            matchEarnings = matchEarnings + record.matchEarnings;
            commissionEarnings = commissionEarnings + record.commissionEarnings;
        });

        setTotalEarnings(totalEarnings);
        setAllTimeTotal(totalEarnings);
        setMatchEarnings(matchEarnings);
        setCommissionEarnings(commissionEarnings);
    }, [data]);

    return (
        <div className="profit-loss-table-root">
            <table className="profit-loss-table-custom">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                className="profit-loss-table-header-cell-grey"
                                key={index}
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {groupedData.map((group, groupIndex) => {
                        const firstRow = group[0];
                        const isExpandable = group.length > 1;
                        const isExpanded = expandedGroups[groupIndex] || false;

                        const matchTotal = group.reduce(
                            (acc, row) => ({
                                matchEarnings: acc.matchEarnings + row.matchEarnings,
                                commissionEarnings: acc.commissionEarnings + row.commissionEarnings,
                                totalEarnings: acc.totalEarnings + row.totalEarnings,
                            }),
                            { matchEarnings: 0, commissionEarnings: 0, totalEarnings: 0 }
                        );

                        return (
                            <React.Fragment key={groupIndex}>
                                <tr
                                    className="profit-loss-table-row"
                                    style={isExpandable ? { backgroundColor: '#f9f9f9', cursor: 'pointer' } : {}}
                                    onClick={isExpandable ? () => toggleGroup(groupIndex) : undefined}
                                >
                                    <td className="profit-loss-table-custom-td" style={{ whiteSpace: 'nowrap' }}>
                                        {isExpandable && <span  style={{ marginRight: '6px', marginLeft: '0px' }}>{isExpanded ? '▼' : '▶'} </span>}
                                        {firstRow.date}
                                    </td>
                                    <td className="profit-loss-table-custom-td" style={{ whiteSpace: 'nowrap' }}>{firstRow.matchId}</td>
                                    <td className="matches-table-custom-td-link" style={{ whiteSpace: 'nowrap' }}>
                                        <Link style={{ textDecoration: "none", color: "#337ab7" }}>
                                            {firstRow.matchName}{isExpandable ? ` (${group.length})` : ''}
                                        </Link>
                                    </td>
                                    <td className="profit-loss-table-custom-td" style={{ whiteSpace: 'nowrap' }}>{matchTotal.matchEarnings.toFixed(2)}</td>
                                    <td className="profit-loss-table-custom-td" style={{ whiteSpace: 'nowrap' }}>{matchTotal.commissionEarnings.toFixed(2)}</td>
                                    <td className="profit-loss-table-custom-td" style={{ whiteSpace: 'nowrap' }}>{matchTotal.totalEarnings.toFixed(2)}</td>
                                </tr>

                                {isExpandable && isExpanded && group.map((row, rowIndex) => (
                                    <tr key={`${groupIndex}-${rowIndex}`} className="profit-loss-table-row">
                                        <td className="profit-loss-table-custom-td" style={{ whiteSpace: 'nowrap' }}>{row.date}</td>
                                        <td className="profit-loss-table-custom-td" style={{ whiteSpace: 'nowrap' }}>{row.matchId}</td>
                                        <td className="matches-table-custom-td-link" style={{ whiteSpace: 'nowrap' }}>
                                            <Link style={{ textDecoration: "none", color: "#337ab7" }}>
                                                {row.matchName}
                                            </Link>
                                        </td>
                                        <td className="profit-loss-table-custom-td" style={{ whiteSpace: 'nowrap' }}>{row.matchEarnings.toFixed(2)}</td>
                                        <td className="profit-loss-table-custom-td" style={{ whiteSpace: 'nowrap' }}>{row.commissionEarnings.toFixed(2)}</td>
                                        <td className="profit-loss-table-custom-td" style={{ whiteSpace: 'nowrap' }}>{row.totalEarnings.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        );
                    })}
                    <tr className="profit-loss-table-row-total">
                        <td className="profit-loss-table-custom-td-total" colSpan={3} style={{ whiteSpace: 'nowrap' }}>
                            All Page Total
                        </td>
                        <td className="profit-loss-table-custom-td-earnings" style={{ whiteSpace: 'nowrap' }}>
                            {matchEarnings.toFixed(2)}
                        </td>
                        <td className="profit-loss-table-custom-td-earnings" style={{ whiteSpace: 'nowrap' }}>
                            {commissionEarnings.toFixed(2)}
                        </td>
                        <td className="profit-loss-table-custom-td-earnings" style={{ whiteSpace: 'nowrap' }}>
                            {totalEarnings.toFixed(2)}
                        </td>
                    </tr>
                </tbody>
            </table>
            {/* </div> */}
            {/* {currentData && <div className="pagination">
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
                        className={`profit-loss-table-pagination-button ${currentPage === page ? 'active' : ''}`}
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
            </div>} */}
        </div>
    );
};

export default ProfitAndLossTable;
