import React from 'react';
import PropTypes from 'prop-types';
import './TableTitle.css';

const TableTitle = ({ text, text2 = "", color, fontSize, textAlign, width, height, marginLeft, marginRight, paddingLeft, marginBottom, exportButton }) => {
    const titleStyle = {
        fontSize: fontSize || '28px',
        width: width || '100%',
        height: height || 'auto',
        marginLeft: marginLeft || '4px',
        marginBottom: marginBottom || '0px',
        paddingLeft: paddingLeft || '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: textAlign === 'left' ? 'space-between' :
        textAlign === 'right' ? 'flex-end' : 'center',
    };

    return (
        <div className="table-title" style={titleStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <label>{text}</label><label style={{ fontSize: "16px" }}>&nbsp;{text2}</label>
            </div>
            {exportButton && (
                <div style={{ marginRight: '10px' }}>
                    {exportButton}
                </div>
            )}
        </div>
    );
};

TableTitle.propTypes = {
    text: PropTypes.string.isRequired,
    color: PropTypes.string,
    fontSize: PropTypes.string,
    textAlign: PropTypes.oneOf(['left', 'center', 'right']),
    width: PropTypes.string,
    height: PropTypes.string,
    marginLeft: PropTypes.string,
    marginRight: PropTypes.string,
    paddingLeft: PropTypes.string,
    exportButton: PropTypes.node,
};

export default TableTitle;