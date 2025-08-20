import { useState, useEffect } from 'react';
import './ClientTable.css';
import { Button } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import Pagination from './AgentTablePagination.jsx';
import { CSVLink } from "react-csv";
import { csvPdfHeaders } from './Columns.jsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import PropTypes from 'prop-types';

import Modal from '../Settings/Modal.jsx';
import DepositWithdrawPopup from '../AgentPopup/DepositWithdrawPopup.jsx';
import DownlineBalancePopup from '../AgentPopup/DownlineBalancePopup.jsx';
import { FaSortAmountDownAlt, FaLongArrowAltUp, FaLongArrowAltDown } from 'react-icons/fa';

// Icon Components for the 5 Action Buttons
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

const BalanceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
);

const ClientTable = ({ clients, user, edit, handleImmediateChildren, changeUserPassword }) => {
    const userType = "CLIENT";
    const [table, setTable] = useState(clients);
    const [csvPdfRows, setCsvPdfRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isDepositWithdrawModalOpen, setDepositWithdrawModalOpen] = useState(false);
    const [isBalanceModalOpen, setBalanceModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [activeTab, setActiveTab] = useState('deposit');

    useEffect(() => {
        setTable(clients);
    }, [clients]);

    useEffect(() => {
        updateCsvPdfRows();
    }, [table]); // eslint-disable-line react-hooks/exhaustive-deps

    const updateCsvPdfRows = () => {
        const csvPdfData = table.map((row) => ({
            col1: row.userId,
            col2: row.displayName,
            col3: row.firstName,
            col4: row.balance.toFixed(2),
            col5: row.share,
            col6: user.share
        }));
        setCsvPdfRows(csvPdfData);
    };

    const generatePDF = (e) => {
        e.preventDefault();
        const doc = new jsPDF();
        const tableColumn = csvPdfHeaders.map(header => header.label);
        const tableRows = csvPdfRows.map(row => [row.col1, row.col2, row.col3, row.col4, row.col5, row.col6]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [32, 75, 153], textColor: 255 }
        });

        doc.save(userType + "-table-data.pdf");
    };



    const handleDeposit = (e, child) => {
        e.preventDefault();
        setSelectedUser(child);
        setActiveTab('deposit');
        setDepositWithdrawModalOpen(true);
    };

    const handleWithdraw = (e, child) => {
        e.preventDefault();
        setSelectedUser(child);
        setActiveTab('withdraw');
        setDepositWithdrawModalOpen(true);
    };

    const handleBalance = (e, child) => {
        e.preventDefault();
        setSelectedUser(child);
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
            setTable(clients);
            return;
        }
        const filterBySearch = clients.filter((item) => (
            item.userId.toLowerCase().includes(searchVal) ||
            item.firstName.toLowerCase().includes(searchVal) ||
            item.lastName.toLowerCase().includes(searchVal) ||
            item.balance.toString().toLowerCase().includes(searchVal) ||
            item.share.toString().toLowerCase().includes(searchVal)
        ));
        setTable(filterBySearch);
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
                    <CSVLink
                        data={csvPdfRows}
                        headers={csvPdfHeaders}
                        filename={userType + "-table-data.csv"}
                        className="export-button export-csv"
                    >
                        <span className="button-icon">📊</span>
                        CSV
                    </CSVLink>
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
                        placeholder="Search Users..."
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
                                <div className="client-table-header-title">M Comm.</div>
                                <div className="client-table-header-icons"><FaLongArrowAltDown className="client-table-up-down-arrow-icons" /><FaLongArrowAltUp className="client-table-up-down-arrow-icons" /></div>
                            </th>
                            <th className="client-table-header-cell-small">
                                <div className="client-table-header-title">S Comm.</div>
                                <div className="client-table-header-icons"><FaLongArrowAltDown className="client-table-up-down-arrow-icons" /><FaLongArrowAltUp className="client-table-up-down-arrow-icons" /></div>
                            </th>
                            <th className="client-table-header-cell-small">
                                <div className="client-table-header-title">Share</div>
                                <div className="client-table-header-icons"><FaLongArrowAltDown className="client-table-up-down-arrow-icons" /><FaLongArrowAltUp className="client-table-up-down-arrow-icons" /></div>
                            </th>
                            <th className="client-table-header-cell-actions">
                                <div className="client-table-header-title">Actions</div>
                                <div className="client-table-header-icons"><FaLongArrowAltDown className="client-table-up-down-arrow-icons" /><FaLongArrowAltUp className="client-table-up-down-arrow-icons" /></div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {table && (rowsPerPage > 0
                            ? table.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : table
                        ).map((client, index) => (
                            <tr key={index} className="client-table-row">
                                <td className="client-table-custom-td-grey">{client.userId}</td>
                                <td className="client-table-custom-td">
                                    <Button
                                        appearance="link"
                                        className="client-display-name-link"
                                        onClick={(e) => handleImmediateChildren(e, client)}
                                    >
                                        <div className="client-name-container">
                                            <span className="client-user-id">{client.userId}</span>
                                            <span className="client-name">{client.firstName}</span>
                                        </div>
                                    </Button>
                                </td>
                                <td className="client-table-custom-td">{client.firstName}</td>
                                <td className="client-table-custom-td-small">{client.matchCommission}</td>
                                <td className="client-table-custom-td-small">{client.sessionCommission}</td>
                                <td className="client-table-custom-td-small">{user.share}</td>
                                <td className="client-table-custom-td-actions">
                                    <div className="client-table-actions-container">
                                        <button
                                            className="client-table-edit-button"
                                            onClick={(e) => edit(e, client)}
                                            title="Edit User"
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            className="client-table-pwd-button"
                                            onClick={(e) => changeUserPassword(e, client)}
                                            title="Change Password"
                                        >
                                            <PasswordIcon />
                                        </button>
                                        <button
                                            className="dw-action-button balance"
                                            onClick={(e) => handleBalance(e, client)}
                                            title="Balance"
                                        >
                                            <BalanceIcon />
                                        </button>
                                        <button
                                            className="dw-action-button deposit"
                                            onClick={(e) => handleDeposit(e, client)}
                                            title="Deposit"
                                        >
                                            D
                                        </button>
                                        <button
                                            className="dw-action-button withdraw"
                                            onClick={(e) => handleWithdraw(e, client)}
                                            title="Withdraw"
                                        >
                                            W
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="client-table-pagination-container">
                {table && (
                    <Pagination
                        totalEntries={table.length}
                        rowsPerPageOptions={[10, 20, 50]}
                        page={page}
                        setPage={setPage}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                    />
                )}
            </div>
        </div>
    );
};

ClientTable.propTypes = {
    clients: PropTypes.arrayOf(PropTypes.shape({
        userId: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        balance: PropTypes.number.isRequired,
        share: PropTypes.number.isRequired,
        matchCommission: PropTypes.number.isRequired,
        sessionCommission: PropTypes.number.isRequired,
        displayName: PropTypes.string.isRequired
    })).isRequired,
    user: PropTypes.shape({
        share: PropTypes.number.isRequired
    }).isRequired,
    edit: PropTypes.func.isRequired,
    handleImmediateChildren: PropTypes.func.isRequired,
    changeUserPassword: PropTypes.func.isRequired
};

export default ClientTable;
