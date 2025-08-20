import React from 'react';
import Clock_Icon from '../../../assets/clock_icon.svg';
import './RemainingMatches.css';

const RemainingMatches = ({ matches, currentMatchId, sport, currentMatchStatus }) => {

    // Debug logging
    console.log("RemainingMatches Debug:", {
        currentMatchStatus,
        currentMatchId,
        matchesCount: matches ? matches.length : 0,
        matches: matches,
        sport: sport
    });

    // Only show this component if the current match is LIVE
    if (currentMatchStatus !== "LIVE") {
        console.log("Component not showing - current match is not LIVE:", currentMatchStatus);
        return null;
    }

    // Filter out the current match and get only live matches
    const remainingMatches = matches ? matches.filter(match => {
        // Convert both IDs to strings for comparison to handle different data types
        const matchIdStr = String(match.id);
        const currentMatchIdStr = String(currentMatchId);
        const isNotCurrent = matchIdStr !== currentMatchIdStr;
        const isLive = match.matchStatus === "LIVE";
        
        console.log("Match filter:", { 
            matchId: match.id, 
            matchIdStr: matchIdStr,
            currentMatchId: currentMatchId,
            currentMatchIdStr: currentMatchIdStr,
            matchStatus: match.matchStatus, 
            isNotCurrent,
            isLive,
            shouldInclude: isNotCurrent && isLive
        });
        
        // Only include matches that are not the current match AND are LIVE
        return isNotCurrent && isLive;
    }) : [];

    console.log("Remaining matches after filter:", remainingMatches);

    if (!remainingMatches || remainingMatches.length === 0) {
        console.log("No remaining matches found");
        return (
            <div className="remaining-matches-container">
                <div className="remaining-single-match-message">
                    <p>This is the only live match available at the moment.</p>
                </div>
            </div>
        );
    }



    const handleMatchClick = (matchId, matchName) => {
        // Reload the page when clicking on a match
        window.location.href = `/matchscreen/${sport}/${matchId}/${matchName}`;
    };

    return (
        <div className="remaining-matches-container">
            <div className="remaining-matches-list">
                {remainingMatches.map((match, index) => (
                    <div 
                        key={match.id || index}
                        className="remaining-match-item"
                        onClick={() => handleMatchClick(match.id, match.name)}
                    >
                        <div className="remaining-match-item-content">
                            <div className="remaining-match-title-section">
                                <h4 className="remaining-match-title">{match.name}</h4>
                                {match.id && (
                                    <span className="remaining-match-id">ID: {match.id}</span>
                                )}
                            </div>
                            
                            <div className="remaining-match-details-section">
                                <div className="remaining-match-date-time">
                                    <img src={Clock_Icon} className="remaining-clock-icon-small" alt="Clock Icon" />
                                    <span className="remaining-date-time-text">{match.openDate}</span>
                                </div>
                                
                                <div className="remaining-match-sport">
                                    <span className="remaining-sport-badge">{sport && sport.toUpperCase()}</span>
                                    <span className="remaining-live-badge">
                                        <span className="live-dot"></span>
                                        LIVE
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="remaining-match-arrow">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RemainingMatches;
