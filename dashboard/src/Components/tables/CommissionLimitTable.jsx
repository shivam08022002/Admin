import React, { useState, useEffect } from 'react';
import './CommissionLimitTable.css'; // Custom styling
import { styled } from '@mui/system';
import TablePagination, { tablePaginationClasses as classes } from '@mui/material/TablePagination'; // ✅ CORRECT


const UpArrowIcon = () => (
    <svg className="commission-limit-table-directional-arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 40V4" />
        <path d="M5 12l7-7 7 7" />
        <path d="M5 12h14" />
    </svg>
);

const DownArrowIcon = () => (
    <svg className="commission-limit-table-directional-arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4v36" />
        <path d="M5 32l7 7 7-7" />
        <path d="M5 32h14" />
    </svg>
);

const CommissionLimitTable = ({ rows, deposit, withdraw, profitAndLoss, statement, tableHeader, isUser, message, isSmallScreen, downlineBalanceExposure }) => {
    console.log("commission limit", rows);
    const [table, setTable] = useState(rows);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(rows && rows.length);
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const onSearchInputChange = (e) => {
        const searchVal = e.target.value;
        if (searchVal === "") { setTable(rows); return; }
        const filterBySearch = rows.filter((item) => {
            if ((item.userId.toLowerCase().includes(searchVal.toLowerCase())
              
            )) {
                return item;
            }
        })
        setTable(filterBySearch);
    }

    useEffect(() => {
        setTable(rows);
    }, [rows]);

    const [currentPage, setCurrentPage] = useState(1);
    // const [rowsPerPage, setRowsPerPage] = useState(10);
    const rowsPerPageOptions = [10, 20, 50];
    const totalEntries = 100; // Example value

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (rows) => {
        setRowsPerPage(rows);
        setCurrentPage(1); // Reset to the first page when rows per page changes
    };

    return (
        <div className="commission-limit-table-root">
            <div>
                {message && (<div className="form-group" style={{ marginTop: "10px", marginRight: "5px" }}>
                    <div className="alert alert-success" role="alert">
                        {message}
                    </div>
                </div>)}
                <div className="my-downlines-csv-pdf-search-container">
                    {/* <div className="my-downlines-csv-pdf-container">
                        <button className="agent-table-csv-pdf-button">
                            CSV
                        </button>
                        <button className="agent-table-csv-pdf-button">
                            PDF
                        </button>
                    </div> */}
                    <div className="my-downlines-search-container">
                        <div style={{ justifyContent: "left", textAlign: "left", maxWidth: "300px" }}>
                            <input onChange={(e) => onSearchInputChange(e)} className="form-control" placeholder='Search'></input>
                        </div>
                    </div>
                </div>
            </div>
            <div className="commission-limit-table-container">
                <table className="commission-limit-table-custom">
                    <thead>
                        <tr className="commission-limit-table-header">
                            <th className="commission-limit-table-master-header-cell-grey">
                            </th>
                            <th className="commission-limit-table-master-header-cell-grey2" colSpan={2} style={{ textAlign: 'center' }}>
                                Client Commission
                            </th>
                            <th className="commission-limit-table-master-header-cell-grey3" colSpan={2} style={{ textAlign: 'center' }}>
                                Client Limit
                            </th>
                            <th className="commission-limit-table-header-cell-actions"></th>
                        </tr>
                        <tr className="commission-limit-table-header">
                            <th rowSpan={2} className="commission-limit-table-header-cell">
                                <div className="commission-limit-table-header-title">Client Name</div>
                                {/* <div className="commission-limit-table-header-icons"><FaLongArrowAltDown className="commission-limit-table-up-down-arrow-icons" /><FaLongArrowAltUp className="commission-limit-table-up-down-arrow-icons" /></div> */}
                            </th>
                            <th rowSpan={2} className="commission-limit-table-header-cell-small">
                                <div className="commission-limit-table-header-title">Match Comm.</div>
                                {/* <div className="commission-limit-table-header-icons"><FaLongArrowAltDown className="commission-limit-table-up-down-arrow-icons" /><FaLongArrowAltUp className="commission-limit-table-up-down-arrow-icons" /></div> */}
                            </th>
                            <th rowSpan={2} className="commission-limit-table-header-cell-small">
                                <div className="commission-limit-table-header-title">Ssn Comm.</div>
                                {/* <div className="commission-limit-table-header-icons"><FaLongArrowAltDown className="commission-limit-table-up-down-arrow-icons" /><FaLongArrowAltUp className="commission-limit-table-up-down-arrow-icons" /></div> */}
                            </th>
                            <th rowSpan={2} className="commission-limit-table-header-cell-small-same">
                                <div className="commission-limit-table-header-title-full">Current Limit</div>
                                {/* <div className="commission-limit-table-header-icons"><FaLongArrowAltDown className="commission-limit-table-up-down-arrow-icons" /><FaLongArrowAltUp className="commission-limit-table-up-down-arrow-icons" /></div> */}
                            </th>
                            <th rowSpan={2} className="commission-limit-table-header-cell-small2">
                                <div className="commission-limit-table-header-title-full">{isUser ? "Show Expo" : "Down Balance"}</div>
                                {/* <div className="commission-limit-table-header-icons"><FaLongArrowAltDown className="commission-limit-table-up-down-arrow-icons" /><FaLongArrowAltUp className="commission-limit-table-up-down-arrow-icons" /></div> */}
                            </th>
                            <th className="commission-limit-table-header-cell-actions">
                                <div className="commission-limit-table-header-title">Actions</div>
                                {/* <div className="commission-limit-table-header-icons"><FaLongArrowAltDown className="commission-limit-table-up-down-arrow-icons" /><FaLongArrowAltUp className="commission-limit-table-up-down-arrow-icons" /></div> */}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {table && (rowsPerPage > 0
                            ? table.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : table
                        ).map((client, index) =>
                            <tr key={index} className="commission-limit-table-row">
                                <td className="commission-limit-table-custom-td">
                                    {client.displayName}
                                </td>
                                <td className="commission-limit-table-custom-td-small">
                                    <input className="commission-limit-input-commission" disabled value={client.matchCommission}></input>
                                </td>
                                <td className="commission-limit-table-custom-td-small">
                                    <input className="commission-limit-input-commission" disabled value={client.sessionCommission}></input>
                                </td>
                                <td className="commission-limit-table-custom-td-small-same">
                                    <input className="commission-limit-input-current-limit" readOnly value={client.balance}></input>
                                </td>
                                <td className="commission-limit-table-custom-td-small2">
                                    <button className={isUser ? "commission-limit-table-expo-button" : "commission-limit-table-db-button"} style={{ fontSize: "14px" }}
                                        onClick={(e) => downlineBalanceExposure(e, client)}
                                    >
                                        {isUser ? "Expo" : "Balance"}
                                    </button>
                                </td>
                                <td className="commission-limit-table-custom-td-actions">
                                    <button className="commission-limit-table-d-button" style={{ fontSize: "14px" }}
                                        onClick={(e) => deposit(e, client)}
                                    >
                                        D
                                    </button>
                                    <button className="commission-limit-table-w-button" style={{ fontSize: "14px" }}
                                        onClick={(e) => withdraw(e, client)}
                                    >
                                        W
                                    </button>
                                    <button className="commission-limit-table-pl-button" style={{ fontSize: "14px" }}
                                        onClick={(e) => profitAndLoss(e, client)}
                                    >
                                        P&L
                                    </button>
                                    <button className="commission-limit-table-stmt-button" style={{ fontSize: "14px" }}
                                        onClick={(e) => statement(e, client)}
                                    >
                                        STMT.
                                    </button>
                                </td>
                            </tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CommissionLimitTable;

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