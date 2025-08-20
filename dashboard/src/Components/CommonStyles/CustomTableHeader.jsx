import React from 'react';
import './CustomTableHeader.css';

const TableHeader = ({ title = "Table Title", onCreateClick, createButtonText = "Create"  }) => {
  return (
    <div className="custom-table-header">
      <div className="custom-table-title">
        <h3 className="table-title-text">{title}</h3>
      </div>
      <div className="custom-table-actions">
        <button 
          className="create-button" 
          onClick={onCreateClick}
        >
        {createButtonText}
        </button>
      </div>
    </div>
  );
};

export default TableHeader;