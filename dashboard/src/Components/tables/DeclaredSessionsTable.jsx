import React, { useEffect, useState } from 'react';
import './DeclaredSessionsTable.css';

const DeclaredSessionsTable = ({ declaredSessions, isFancy }) => {
    const [declaredSessionsStatusTotal, setDeclaredSessionsStatusTotal] = useState();

    useEffect(() => {
        let statusTotal = 0;
        declaredSessions.forEach(record => {
            statusTotal = statusTotal + Number(record.status);
        });
        setDeclaredSessionsStatusTotal(statusTotal);
    }, [declaredSessions]);

    const formatNumber = (rate) => {
        return Number(rate).toFixed(2);
    };

    if (!declaredSessions || declaredSessions.length === 0) {
        return (
            <div className="declared-sessions-grid-container">
                <div className="declared-sessions-grid-header">
                    <div className="declared-sessions-grid-header-cell session">Session</div>
                    <div className="declared-sessions-grid-header-cell result">Result</div>
                    <div className="declared-sessions-grid-header-cell status">Status</div>
                </div>
                <div className="no-bets-message">No Sessions Declared</div>
            </div>
        );
    }

    return (
        <div className="declared-sessions-grid-container">
            <div className="declared-sessions-grid-header">
                <div className="declared-sessions-grid-header-cell session">Session</div>
                <div className="declared-sessions-grid-header-cell result">Result</div>
                <div className="declared-sessions-grid-header-cell status">Status</div>
            </div>
            {declaredSessions.map((declaredSession, index) => (
                <div className="declared-sessions-grid-row" key={index}>
                    <div className="declared-sessions-grid-cell session">
                        <div className="bet-name">{declaredSession.marketName}</div>
                    </div>
                    <div className="declared-sessions-grid-cell result">
                        {formatNumber(declaredSession.result)}
                    </div>
                    <div className="declared-sessions-grid-cell status">
                        {declaredSession.status}
                    </div>
                </div>
            ))}
            <div className="declared-sessions-grid-row total">
                <div className="declared-sessions-grid-cell session" style={{fontWeight: 600}}>Declared Sessions Total</div>
                <div className="declared-sessions-grid-cell result"></div>
                <div className="declared-sessions-grid-cell status" style={{fontWeight: 700}}>{formatNumber(declaredSessionsStatusTotal)}</div>
            </div>
        </div>
    );
};

export default DeclaredSessionsTable;