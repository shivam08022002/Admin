import React, { useState, useEffect } from 'react';
import './AgentTable.css'; 
import { FaSortAmountDownAlt, FaLongArrowAltUp, FaLongArrowAltDown } from 'react-icons/fa';
import { Button } from 'rsuite';
import Pagination from './AgentTablePagination';
import { CSVLink } from "react-csv";
import { csvPdfHeaders } from './Columns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Modal from '../Settings/Modal.jsx';
import DepositWithdrawPopup from '../AgentPopup/DepositWithdrawPopup.jsx';
import DownlineBalancePopup from '../AgentPopup/DownlineBalancePopup.jsx';

// Icon Components for the Action Buttons
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
);

const PasswordIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        <circle cx="12" cy="16" r="1"/>
    </svg>
);

const BlockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="m4.9 4.9 14.2 14.2"/>
    </svg>
);

const BalanceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
);

const AgentTable = ({ agents, user, block, edit, handleImmediateChildren, changeUserPassword, agentType }) => {
    console.log("agents", agents);
    const [table, setTable] = useState(agents);
    const [csvPdfRows, setCsvPdfRows] = useState();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isDepositWithdrawModalOpen, setDepositWithdrawModalOpen] = useState(false);
    const [isBalanceModalOpen, setBalanceModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [activeTab, setActiveTab] = useState('deposit');

    const handleDeposit = (e, agent) => {
        e.preventDefault();
        setSelectedUser(agent);
        setActiveTab('deposit');
        setDepositWithdrawModalOpen(true);
    };

    const handleWithdraw = (e, agent) => {
        e.preventDefault();
        setSelectedUser(agent);
        setActiveTab('withdraw');
        setDepositWithdrawModalOpen(true);
    };

    const handleBalance = (e, agent) => {
        e.preventDefault();
        setSelectedUser(agent);
        setBalanceModalOpen(true);
    };

    const closeDepositWithdrawModal = () => {
        setDepositWithdrawModalOpen(false);
        setSelectedUser(null);
    };

    const closeBalanceModal = () => {
        setBalanceModalOpen(false);
        setSelectedUser(null);
    };

    const onSearchInputChange = (e) => {
        const searchVal = e.target.value.toLowerCase();
        if (searchVal === "") {
            setTable(agents);
            return;
        }
        const filterBySearch = agents.filter((item) => (
            item.userId.toLowerCase().includes(searchVal) ||
            item.firstName.toLowerCase().includes(searchVal) ||
            item.lastName.toLowerCase().includes(searchVal) ||
            item.balance.toString().toLowerCase().includes(searchVal) ||
            item.share.toString().toLowerCase().includes(searchVal)
        ));
        setTable(filterBySearch);
    };

    useEffect(() => {
        setTable(agents);
    }, [agents]);

    useEffect(() => {
        updateCsvPdfRows();
    }, [table]); // eslint-disable-line react-hooks/exhaustive-deps

    const updateCsvPdfRows = () => {
        let csvPdfData = [];
        table.map((row) => (
            csvPdfData.push(
                {
                    col1: row.userId,
                    col2: row.displayName,
                    col3: row.firstName,
                    col4: row.balance.toFixed(2),
                    col5: row.share,
                    col6: user.share,
                    col7: row.icasinoEnabled ? 'Yes' : 'No',
                    col8: row.icasinoShare !== undefined ? row.icasinoShare : '-'
                }
            )
        ));
        console.log("csv data", csvPdfData);
        setCsvPdfRows(csvPdfData);
    };

    const generatePDF = (e) => {
        e.preventDefault();
        const doc = new jsPDF();
        const tableColumn = csvPdfHeaders.map(header => header.label);
        const tableRows = csvPdfRows.map(row => [row.col1, row.col2, row.col3, row.col4, row.col5, row.col6, row.col7, row.col8]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [32, 75, 153], textColor: 255 }
        });

        doc.save(agentType + "-table-data.pdf");
    };

    return (
        <div className="client-table-root">
            {isDepositWithdrawModalOpen && selectedUser && (
                <Modal onClose={closeDepositWithdrawModal}>
                    <DepositWithdrawPopup 
                        user={selectedUser}
                        onClose={closeDepositWithdrawModal}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </Modal>
            )}

            {isBalanceModalOpen && selectedUser && (
                <Modal onClose={closeBalanceModal}>
                    <DownlineBalancePopup 
                        child={selectedUser}
                        closeDownlineBalancePopup={closeBalanceModal}
                    />
                </Modal>
            )}

            <div className="client-table-top">
                <div className="export-actions">
                    {csvPdfRows && (
                        <CSVLink
                            data={csvPdfRows}
                            headers={csvPdfHeaders}
                            filename={agentType + "-table-data.csv"}
                            className="export-button export-csv"
                        >
                            <span className="button-icon">📊</span>
                            CSV
                        </CSVLink>
                    )}
                    <button 
                        className="export-button export-pdf" 
                        onClick={generatePDF}
                    >
                        <span className="button-icon">📄</span>
                        PDF
                    </button>
                </div>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search Agents..."
                        onChange={onSearchInputChange}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="client-table-container">
                <table className="client-table-custom">
                    <thead>
                        <tr className="client-table-header">
                            <th className="client-table-header-cell-grey">
                                <div className="client-table-header-title">ID</div>
                                <div className="client-table-header-icons"><FaSortAmountDownAlt /></div>
                            </th>
                            <th className="client-table-header-cell">
                                <div className="client-table-header-title">User Name</div>
                                <div className="client-table-header-icons"><FaLongArrowAltDown className="client-table-up-down-arrow-icons" /><FaLongArrowAltUp className="client-table-up-down-arrow-icons" /></div>
                            </th>
                            <th className="client-table-header-cell">
                                <div className="client-table-header-title">Name</div>
                                <div className="client-table-header-icons"><FaLongArrowAltDown className="client-table-up-down-arrow-icons" /><FaLongArrowAltUp className="client-table-up-down-arrow-icons" /></div>
                            </th>
                            <th className="client-table-header-cell-small">
                                <div className="client-table-header-title">Initial Balance</div>
                                <div className="client-table-header-icons"><FaLongArrowAltDown className="client-table-up-down-arrow-icons" /><FaLongArrowAltUp className="client-table-up-down-arrow-icons" /></div>
                            </th>
                            <th className="client-table-header-cell-small">
                                <div className="client-table-header-title">Agent Share</div>
                                <div className="client-table-header-icons"><FaLongArrowAltDown className="client-table-up-down-arrow-icons" /><FaLongArrowAltUp className="client-table-up-down-arrow-icons" /></div>
                            </th>
                            <th className="client-table-header-cell-small">
                                <div className="client-table-header-title">My Share</div>
                                <div className="client-table-header-icons"><FaLongArrowAltDown className="client-table-up-down-arrow-icons" /><FaLongArrowAltUp className="client-table-up-down-arrow-icons" /></div>
                            </th>
                            {!user.entityType?.toLowerCase().includes('user') && (
                              <>
                                <th className="client-table-header-cell-small">
                                  <div className="client-table-header-title">iCasino Enabled</div>
                                  <div className="client-table-header-icons"><FaLongArrowAltDown className="client-table-up-down-arrow-icons" /><FaLongArrowAltUp className="client-table-up-down-arrow-icons" /></div>
                                </th>
                                <th className="client-table-header-cell-small">
                                  <div className="client-table-header-title"> Agent iCasino Share</div>
                                  <div className="client-table-header-icons"><FaLongArrowAltDown className="client-table-up-down-arrow-icons" /><FaLongArrowAltUp className="client-table-up-down-arrow-icons" /></div>
                                </th>
                              </>
                            )}
                            <th className="client-table-header-cell-actions">
                                <div className="client-table-header-title">Actions</div>
                                <div className="client-table-header-icons"><FaLongArrowAltDown className="client-table-up-down-arrow-icons" /><FaLongArrowAltUp className="client-table-up-down-arrow-icons" /></div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {table && table.length > 0 ? (
                            (rowsPerPage > 0
                                ? table.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : table
                            ).map((agent, index) =>
                                <tr key={index} className="client-table-row">
                                    <td className="client-table-custom-td-grey">{agent.userId}</td>
                                    <td className="client-table-custom-td">
                                        <Button
                                            appearance="link"
                                            className="client-display-name-link"
                                            onClick={(e) => handleImmediateChildren(e, agent)}
                                        >
                                            <div className="client-name-container">
                                                <span className="client-user-id">{agent.userId}</span>
                                                <span className="client-name">{agent.firstName}</span>
                                            </div>
                                        </Button>
                                    </td>
                                    <td className="client-table-custom-td">{agent.firstName}</td>
                                    <td className="client-table-custom-td-small">{agent.balance.toFixed(2)}</td>
                                    <td className="client-table-custom-td-small">{agent.share}</td>
                                    <td className="client-table-custom-td-small">{user.share - agent.share}</td>
                                    {!user.entityType?.toLowerCase().includes('user') && (
                                      <>
                                        <td className="client-table-custom-td-small">{agent.icasinoEnabled ? 'Yes' : 'No'}</td>
                                        <td className="client-table-custom-td-small">{agent.icasinoShare !== undefined ? agent.icasinoShare : '-'}</td>
                                      </>
                                    )}
                                    <td className="client-table-custom-td-actions">
                                        <div className="client-table-actions-container">
                                            <button
                                                className="client-table-edit-button"
                                                onClick={(e) => edit(e, agent)}
                                                title="Edit Agent"
                                            >
                                                <EditIcon />
                                            </button>
                                            <button
                                                className="client-table-pwd-button"
                                                onClick={(e) => changeUserPassword(e, agent)}
                                                title="Change Password"
                                            >
                                                <PasswordIcon />
                                            </button>
                                            <button
                                                className="client-table-blk-button"
                                                onClick={(e) => block(e, agent)}
                                                title="Block Agent"
                                            >
                                                <BlockIcon />
                                            </button>
                                            <button
                                                className="dw-action-button balance"
                                                onClick={(e) => handleBalance(e, agent)}
                                                title="Balance"
                                            >
                                                <BalanceIcon />
                                            </button>
                                            <button
                                                className="dw-action-button deposit"
                                                onClick={(e) => handleDeposit(e, agent)}
                                                title="Deposit"
                                            >
                                                D
                                            </button>
                                            <button
                                                className="dw-action-button withdraw"
                                                onClick={(e) => handleWithdraw(e, agent)}
                                                title="Withdraw"
                                            >
                                                W
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        ) : (
                            <tr>
                                <td 
                                    colSpan={user && !user.entityType?.toLowerCase().includes('user') ? 9 : 7}
                                    style={{
                                        textAlign: 'center',
                                        padding: '40px 20px',
                                        color: '#333',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        backgroundColor: '#ffffff',
                                        borderBottom: '1px solid #e0e0e0'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <div style={{
                                            fontSize: '48px',
                                            color: '#1e3c72'
                                        }}>
                                            📊
                                        </div>
                                        <div style={{
                                            color: '#1e3c72',
                                            fontSize: '18px',
                                            fontWeight: '600'
                                        }}>
                                            No {agentType || 'agent'} accounts found.
                                        </div>
                                        {agents && agents.length > 0 && table && table.length === 0 && (
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#666',
                                                marginTop: '5px'
                                            }}>
                                                Try adjusting your search criteria.
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {table && table.length > 0 && (
                <div className="client-table-pagination-container">
                    <Pagination
                        totalEntries={table.length}
                        rowsPerPageOptions={[10, 20, 50]}
                        page={page}
                        setPage={setPage}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                    />
                </div>
            )}
        </div>
    );
};

export default AgentTable;