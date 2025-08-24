import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CollectionReportTable.css';

const CollectionReportTable = ({ columns, data, total, clientNameStatic }) => {

  let navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setItemsPerPage(500);
      } else {
        setItemsPerPage(500);
      }
    };

    handleResize(); // Initial check
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

  const openAgentDashboard = (e, child) => {
    e.preventDefault();
    navigate(`/icdashboard/${child.userId}/${child.entityType}`, { state: { child } });
  };

  return (
    <div className="collection-report-table-container">
      <table className="collection-report-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th style={{ width: "60%", maxWidth: "60%" }} key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData && currentData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td style={{ width: "40%", maxWidth: "40%" }}>
                {!clientNameStatic && <button className="collection-report-name-link"
                  onClick={(e) => openAgentDashboard(e, row)}>{row.displayName}
                </button>}
                {clientNameStatic && row.displayName}
              </td>
              <td>
                {row.balance.toFixed(1)}
              </td>
            </tr>
          ))}
          <tr>
            <td style={{ fontWeight: "bold" }}>
              Total
            </td>
            <td style={{ fontWeight: "bold" }}>
              {total && total.toFixed(1)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* <div className="pagination">
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
      </div> */}
    </div>
  );
};

export default CollectionReportTable;
