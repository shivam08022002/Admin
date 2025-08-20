import React, { useState } from 'react';
import './DeclaredSessions.css';
import DeclaredSessionsTable from '../../tables/DeclaredSessionsTable';

const DeclaredSessions = ({ declaredSessionsTitle, declaredSessions, isFancy }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleHeaderClick = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="declared-sessions">
            <div className="declared-sessions-header" onClick={handleHeaderClick}>
                <div className="declared-sessions-title">
                    <label>{declaredSessionsTitle}</label>
                </div>
                <div className="declared-sessions-plus">
                    <button className="expand-button">
                        {isExpanded ? '-' : '+'}
                    </button>
                </div>
            </div>
            {isExpanded && (
                <DeclaredSessionsTable declaredSessions={declaredSessions} isFancy={isFancy} />
            )}
        </div>
    );
};

export default DeclaredSessions;
