import React from 'react';
import './CustomTableHeader.css';

const TableHeader = ({ title = "Table Title", onCreateClick, createButtonText = "Create", customButton = null }) => {
  return (
    <div className="custom-table-header">
      <div className="custom-table-title">
        <h3 className="table-title-text">{title}</h3>
      </div>
      <div className="custom-table-actions">
        {customButton ? (
          customButton
        ) : (
          <button 
            className="create-button" 
            onClick={onCreateClick}
          >
            <span className="plus-icon">+</span>
            {createButtonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default TableHeader;