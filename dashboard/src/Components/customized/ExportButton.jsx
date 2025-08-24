import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const ExportButton = ({ onClick, disabled = false }) => {
    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!disabled && onClick) {
            console.log('Export button clicked');
            onClick();
        } else {
            console.log('Export button disabled or no onClick handler');
        }
    };

    const buttonStyle = {
        backgroundColor: 'transparent',
        color: '#1fabb5',
        border: 'none',
        borderRadius: '2px',
        padding: '8px 12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        opacity: disabled ? 0.6 : 1,
        transition: 'opacity 0.2s ease',
        minWidth: 'fit-content',
        userSelect: 'none',
    };

    const iconStyle = {
        fontSize: '16px',
    };

    const textStyle = {
        display: 'inline',
    };

    // CSS for mobile responsiveness
    const mobileStyles = `
        @media (max-width: 768px) {
            .export-button-text {
                display: none !important;
            }
            .export-button {
                padding: 8px !important;
                min-width: 30px !important;
                justify-content: center !important;
            }
        }
    `;

    return (
        <>
            <style>{mobileStyles}</style>
            <button
                className="export-button"
                style={buttonStyle}
                onClick={handleClick}
                disabled={disabled}
                title="Export to PDF"
                type="button"
            >
                <FontAwesomeIcon icon={faFilePdf} style={iconStyle} />
                <span className="export-button-text" style={textStyle}>Export PDF</span>
            </button>
        </>
    );
};

ExportButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default ExportButton; 