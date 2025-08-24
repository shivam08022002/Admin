import React, { useState, useEffect } from 'react';
import './CompanyLenDenTable.css';
import Clock_Icon from '../../assets/clock_icon.svg';

const CompanyLenDenTable = ({ columns, data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [expandedGroups, setExpandedGroups] = useState({});

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 600) {
                setItemsPerPage(500);
            } else {
                setItemsPerPage(500);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalPages = Math.ceil(data && data.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data && data.slice(startIndex, startIndex + itemsPerPage);

    // Group sequential entries
    const groupSequentialEntries = (data) => {
        const groups = [];
        let currentGroup = [];

        for (let i = 0; i < data.length; i++) {
            const currentEntry = data[i].entry;
            if (currentGroup.length === 0 || currentGroup[0].entry === currentEntry) {
                currentGroup.push(data[i]);
            } else {
                groups.push(currentGroup);
                currentGroup = [data[i]];
            }
        }

        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }

        return groups;
    };

    const groupedData = groupSequentialEntries(currentData);

    const toggleGroup = (groupIndex) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupIndex]: !prev[groupIndex],
        }));
    };

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
        <div className="company-len-den-table-root">
            <div className="company-len-den-table-container">
                <table className="company-len-den-table">
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {groupedData.map((group, groupIndex) => {
                            const isExpanded = expandedGroups[groupIndex] || false;
                            const firstRow = group[0];

                            // Calculate group totals
                            const totalDebit = group.reduce((sum, row) => sum + (row.debit || 0), 0);
                            const totalCredit = group.reduce((sum, row) => sum + (row.credit || 0), 0);

                            // Calculate the difference between total debit and total credit
                            const difference = totalDebit - totalCredit;

                            return (
                                <React.Fragment key={groupIndex}>
                                    {/* Group header row with totals */}
                                    {group.length > 1 && ['diamondgame', 'virtualgame', 'aviatorgame'].some(game => (firstRow.type || '').toLowerCase().includes(game)) ? (
                                    <>
                                      <tr
                                        onClick={() => toggleGroup(groupIndex)}
                                        style={{
                                          cursor: 'pointer',
                                          backgroundColor: '#f5f5f5',
                                          fontWeight: 'bold',
                                        }}
                                      >
                                        <td>
                                          <span style={{ marginRight: '6px',marginLeft: '0' }}>
                                            {isExpanded ? '▼' : '▶'}
                                          </span>
                                          {firstRow.date || '-'}
                                        </td>
                                        <td>{firstRow.entryId || '-'}</td>
                                        <td>{firstRow.entry} ({group.length})</td>
                                        <td>{difference > 0 ? difference.toFixed(2) : '-'}</td>
                                        <td>{difference < 0 ? Math.abs(difference).toFixed(2) : '-'}</td>
                                        <td>{firstRow.balance.toFixed(2)}</td>
                                        <td>-</td>
                                      </tr>

                                      {isExpanded &&
                                        group.map((row, rowIndex) => (
                                          <tr key={`${groupIndex}-${rowIndex}`}>
                                            <td>
                                              <img src={Clock_Icon} className="clock-icon" alt="clock" />
                                              {row.date}
                                            </td>
                                            <td>{row.entryId || '-'}</td>
                                            <td>
                                                {row.entry}
                                            </td>
                                            <td>{row.debit === 0 ? '-' : row.debit.toFixed(2)}</td>
                                            <td>{row.credit === 0 ? '-' : row.credit.toFixed(2)}</td>
                                            <td>{row.balance.toFixed(2)}</td>
                                            <td>{row.note}</td>
                                          </tr>
                                        ))}
                                    </>
                                  ) : (
                                    group.map((row, rowIndex) => (
                                      <tr key={`${groupIndex}-${rowIndex}`}>
                                        <td>
                                          <img src={Clock_Icon} className="clock-icon" alt="clock" />
                                          {row.date}
                                        </td>
                                        <td>{row.entryId || '-'}</td>
                                        <td>{row.entry}</td>
                                        <td>{row.debit === 0 ? '-' : row.debit.toFixed(2)}</td>
                                        <td>{row.credit === 0 ? '-' : row.credit.toFixed(2)}</td>
                                        <td>{row.balance.toFixed(2)}</td>
                                        <td>{row.note}</td>
                                      </tr>
                                    ))
                                  )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>

                {/* Pagination controls - Uncomment if needed */}
                {/* 
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="pagination-button"
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {startPage > 1 && <span className="pagination-ellipsis">...</span>}
                    {pageNumbers.map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                        >
                            {page}
                        </button>
                    ))}
                    {endPage < totalPages && <span className="pagination-ellipsis">...</span>}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="pagination-button"
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
                */}
            </div>
        </div>
    );
};

export default CompanyLenDenTable;
