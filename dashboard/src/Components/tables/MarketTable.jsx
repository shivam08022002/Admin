import React, { useState, useEffect } from 'react';
import './MarketTable.css';
import CustomizedCheckBox from '../customized/CustomizedCheckBox';
import { MARKET_STATUS_BLOCKED, MARKET_STATUS_UNBLOCKED, MARKET_STATUS_BLOCKEDUP } from '../../common/constants';
import { Link } from 'react-router-dom';
import TableTitle from '../customized/TableTitle';

const MarketTable = ({ columns, data, onCheckBoxClick, hideTitle, userId }) => {
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

  function capitalizeEachWord(sport) {
    if (!sport) return ''; // Handle empty or null strings
    return sport
      .split('_') // Split the string into an array of words
      .map(word => {
        if (word.length === 0) return ''; // Handle empty words
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize first letter, lowercase rest
      })
      .join(' '); // Join the words back into a string
  }

  return (
    <div className={hideTitle ? "market-table-container-popup" : "market-table-container"}>
      {hideTitle && <TableTitle
        text={"Sport List for " + userId}
        color="#ffffff"
        fontSize="14px"
        textAlign="center"
        width="100%"
        height="30px"
        marginLeft="0px"
        marginRight="0px"
      />}
      <table className={hideTitle ? "market-table-popup" : "market-table"}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} style={{ textAlign: column.includes("Action") ? "center" : "left" }} >{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData && currentData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>
                {rowIndex + 1}
              </td>
              <td>
                <Link className="td-market-sport-link" style={{ textDecoration: "none" }}>
                  {row.sportType}
                </Link>
              </td>
              {row.status === MARKET_STATUS_UNBLOCKED && <td>
                <div className="td-market-unblocked">
                  {/* {row.sportType !== LIVE_CASINO && row.sportType !== VIRTUAL_CASINO && row.sportType[0].toUpperCase() + row.sportType.slice(1) + " is ON"}
                  {row.sportType === LIVE_CASINO && LIVE_CASINO_STRING + " is ON"}
                  {row.sportType === VIRTUAL_CASINO && VIRTUAL_CASINO_STRING + " is ON"} */}
                  {capitalizeEachWord(row.sportType) + " is ON"}
                </div>
              </td>}
              {row.status === MARKET_STATUS_BLOCKED && <td>
                <div className="td-market-blocked">
                  {/* {row.sportType !== LIVE_CASINO && row.sportType !== VIRTUAL_CASINO && row.sportType[0].toUpperCase() + row.sportType.slice(1) + " is OFF"}
                  {row.sportType === LIVE_CASINO && LIVE_CASINO_STRING + " is OFF"}
                  {row.sportType === VIRTUAL_CASINO && VIRTUAL_CASINO_STRING + " is OFF"} */}
                  {capitalizeEachWord(row.sportType) + " is OFF"}
                </div>
              </td>}
              {row.status === MARKET_STATUS_BLOCKEDUP && <td>
                <div className="td-market-blockedup">
                  {/* {row.sportType !== LIVE_CASINO && row.sportType !== VIRTUAL_CASINO && row.sportType[0].toUpperCase() + row.sportType.slice(1) + " is Blocked"}
                  {row.sportType === LIVE_CASINO && LIVE_CASINO_STRING + " is Blocked"}
                  {row.sportType === VIRTUAL_CASINO && VIRTUAL_CASINO_STRING + " is Blocked"} */}
                  {capitalizeEachWord(row.sportType) + " is Blocked"}
                </div>
              </td>}
              <td style={{ textAlign: "center" }}>
                <CustomizedCheckBox market={row} onCheckBoxClick={onCheckBoxClick} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarketTable;
