import { useState} from 'react';
import './DynamicTable.css';
import './EntityStatementTable.css';
import './AgentTablePagination.css';
import { DEPOSIT_COINS, WITHDRAW_COINS } from '../../common/constants';

const EntityStatementTable = ({ columns, data }) => {
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
        <div className="estatement-table-root">
            <table className="estatement-table-custom">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th className="estatement-table-header-cell-grey" key={index}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="estatement-table-row">
                            <td className="estatement-table-custom-td">
                                {row.transactionTime}
                            </td>
                            <td className="estatement-table-custom-td">
                                {row.remark}
                            </td>
                            <td className="estatement-table-custom-td">
                                {row.transactionType === DEPOSIT_COINS && "-"}
                                {row.transactionType === WITHDRAW_COINS && row.amount.toFixed(1)}
                            </td>
                            <td className="estatement-table-custom-td">
                                {row.transactionType === DEPOSIT_COINS && row.amount.toFixed(1)}
                                {row.transactionType === WITHDRAW_COINS && "-"}
                            </td>
                            <td className="estatement-table-custom-td">
                                0
                            </td>
                            <td className="estatement-table-custom-td">
                                0
                            </td>
                            <td className="estatement-table-custom-td">
                                {row.toUserBalance.toFixed(1)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EntityStatementTable;
