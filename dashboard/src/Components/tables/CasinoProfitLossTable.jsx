import React from 'react';
import './ProfitAndLossTable.css';

const CasinoProfitLossTable = ({ data }) => {
  const totalNetProfitLoss = data?.reduce((sum, item) => sum + (item.agentProfitLoss || 0), 0);

  return (
    <div className="profit-loss-table-root">
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }

          .summary-box {
            background-color: #f8fafd;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            padding: 14px 24px;
            margin: 0 auto 20px auto;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            max-width: 400px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          }

          .profit-icon {
            margin-right: 8px;
            font-size: 18px;
          }

          .profit-loss-table-custom th,
          .profit-loss-table-custom td {
            padding: 12px 16px;
            text-align: left;
            font-size: 14px;
          }

          .profit-loss-table-custom th {
            background-color: #1FABB5;
            color: white;
            font-weight: 600;
          }

          .profit-loss-table-row:nth-child(even) {
            background-color: #f4f7fb;
          }

          .profit-loss-table-row:hover {
            background-color: #eaf0fa;
          }

          .profit-loss-table-custom {
            border-radius: 8px;
            overflow: hidden;
          }
        `}
      </style>

      {/* Summary Box */}
      <div
        className="summary-box"
        style={{
          color: totalNetProfitLoss >= 0 ? '#166534' : '#b91c1c',
          backgroundColor: totalNetProfitLoss >= 0 ? '#ecfdf5' : '#fef2f2',
          borderColor: totalNetProfitLoss >= 0 ? '#bbf7d0' : '#fecaca',
        }}
      >
        <span className="profit-icon">
          {totalNetProfitLoss >= 0 ? '📈' : '📉'}
        </span>
        Today's Total Profit/Loss: {totalNetProfitLoss.toFixed(2)}
      </div>

      {/* Table */}
      <div
        className="hide-scrollbar"
        style={{
          overflowX: 'auto',
          width: '100%',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <table
          className="profit-loss-table-custom"
          style={{
            minWidth: '300px',
            borderCollapse: 'collapse',
            width: '100%',
            backgroundColor: '#fff',
          }}
        >
          <thead>
            <tr>
              <th className="profit-loss-table-header-cell-grey">Title</th>
              <th className="profit-loss-table-header-cell-grey">Profit/Loss</th>
            </tr>
          </thead>
          <tbody>
            {data?.length ? (
              data.map((item, idx) => (
                <tr key={idx} className="profit-loss-table-row">
                  <td className="profit-loss-table-custom-td">{item.gameName || '-'}</td>
                  <td
                    className="profit-loss-table-custom-td"
                    style={{
                      color: item.agentProfitLoss >= 0 ? 'green' : 'red',
                      fontWeight: '600',
                    }}
                  >
                    {item.agentProfitLoss?.toFixed(2) || '0.00'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="profit-loss-table-custom-td"
                  colSpan="2"
                  style={{ textAlign: 'center', padding: '16px', fontStyle: 'italic', color: '#999' }}
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CasinoProfitLossTable;
