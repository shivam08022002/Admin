import React, { useState, useEffect } from 'react';
import './ProfitAndLossTable.css';

const CasinoBetHistoryTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);

  const formatDate = (arr) => {
    if (!arr) return '';
    const [year, month, day, hour, minute, second] = arr;
    const date = new Date(year, month - 1, day, hour, minute, second);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    const result =
      data?.filter((item) =>
        item.userName?.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];
    setFilteredData(result);
    setCurrentPage(1);
  }, [searchTerm, data]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="profit-loss-table-root">
      {/* Search & Page Size */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
          background: '#f9f9f9',
          padding: '10px',
          borderRadius: '6px',
          border: '1px solid #ccc',
        }}
      >
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search by username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '4px',
              border: '1px solid#1FABB5',
              outlineColor: '#1FABB5',
              minWidth: '200px',
            }}
          />
        </div>

        {/* Page Size */}
        <div>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            style={{
              padding: '6px 10px',
              borderRadius: '4px',
              border: '1px solid#1FABB5',
              color: '#fff',
              fontWeight: 'bold',
              backgroundColor: '#1FABB5',
              cursor: 'pointer',
            }}
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table className="profit-loss-table-custom" style={{ minWidth: '600px' }}>
          <thead>
            <tr>
              <th className="profit-loss-table-header-cell-grey">Date</th>
              <th className="profit-loss-table-header-cell-grey">User Name</th>
              <th className="profit-loss-table-header-cell-grey">Game ID</th>
              <th className="profit-loss-table-header-cell-grey">Game Name</th>
              <th className="profit-loss-table-header-cell-grey">Agent Profit/Loss</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.length ? (
              paginatedData.map((item, idx) => {
                const agentPL = item.agentProfitLoss || 0;
                return (
                  <tr key={idx} className="profit-loss-table-row">
                    <td
                      className="profit-loss-table-custom-td"
                      style={{ whiteSpace: 'nowrap' }} // 👈 Added this line to prevent wrapping
                    >
                      {formatDate(item.gameStartTime)}
                    </td>
                    <td className="profit-loss-table-custom-td">{item.userName || '-'}</td>
                    <td className="profit-loss-table-custom-td">{item.gameId}</td>
                    <td className="profit-loss-table-custom-td">{item.gameName}</td>
                    <td
                      className="profit-loss-table-custom-td"
                      style={{ color: agentPL >= 0 ? 'green' : 'red', fontWeight: '600' }}
                    >
                      {agentPL.toFixed(2)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="profit-loss-table-custom-td" colSpan="5" style={{ textAlign: 'center' }}>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '6px 12px',
              backgroundColor: '#1FABB5',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              marginRight: '10px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1,
            }}
          >
            Prev
          </button>

          <span style={{ lineHeight: '30px', margin: '0 12px', fontWeight: 'bold', color: '#1FABB5' }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '6px 12px',
              backgroundColor: '#1FABB5',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1,
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CasinoBetHistoryTable;
