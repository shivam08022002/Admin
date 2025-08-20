import React from 'react';
import './AgentTablePagination.css';

const Pagination = ({ totalEntries, page, setPage, rowsPerPage, setRowsPerPage }) => {

    const totalPages = Math.ceil(totalEntries / rowsPerPage);

    const handlePageChange = (page) => {
        if (page >= 0 && page <= totalPages - 1) {
            setPage(page);
            // setCurrentPage(page);
        }
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page when rows per page changes
    };

    // useEffect(() => {
    //     setCurrentPage(0);
    // }, [totalEntries]);

    return (
        <div className="agent-table-pagination-container">
            {/* Left Section: Rows Per Page & Entries Information */}
            <div className="agent-table-pagination-info">
                <label className="agent-table-showing-entries">
                    Showing {(page) * rowsPerPage + 1} to{" "}
                    {Math.min((page + 1) * rowsPerPage, totalEntries)} of {totalEntries} entries
                </label>
            </div>

            {/* Right Section: Pagination Controls */}
            <div className="agent-table-pagination-controls">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className="agent-table-pagination-prev-button"
                >
                    Previous
                </button>
                <label className="agent-table-page-number">
                    {page + 1}
                </label>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages - 1}
                    className="agent-table-pagination-next-button"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
