import React, { useState, useEffect } from "react";
import {
    MARKET_MATCH_ODDS,
    MARKET_BOOKMAKER,
    MARKET_TOSS_ODDS,
    MATCH_ODDS,
    BOOKMAKER,
    TOSS_ODDS,
    MARKET_FANCY_BET
} from '../../../common/constants';
import './SessionMarket.css';

export default function SessionMarket({ onMarketPositionClick, marketType, oddsList, minBet, maxBet, waitTime, backPref, layPref }) {
    let hasOdds = false;

    if (oddsList.length > 0)
        hasOdds = true;

    const handleSessionClick = (e, index, rate, type, marketId, yesValue, noValue, nation) => {
        e.preventDefault();
        onMarketPositionClick(MARKET_FANCY_BET, marketType, rate, nation, type, waitTime, true, marketId, yesValue, noValue);
    };

    const handleMarketClick = (e, index, rate, type, marketId, nation) => {
        e.preventDefault();
        onMarketPositionClick(betType, marketType, rate, nation, type, waitTime, true, marketId);
    };

    const [betType, setBetType] = useState();

    useEffect(() => {
        if (marketType === MATCH_ODDS) {
            setBetType(MARKET_MATCH_ODDS);
        } else if (marketType === BOOKMAKER) {
            setBetType(MARKET_BOOKMAKER);
        } else if (marketType === TOSS_ODDS) {
            setBetType(MARKET_TOSS_ODDS);
        }
    }, []);

    return (
        <div>
            {hasOdds && <div className="market-section">
                <div className="market-header">
                    <div className="market-title">
                        Session Market
                        <div className="info-icon">i</div>
                    </div>
                </div>
                <div className="odds-table">
                    <div className="table-header session-header">
                        <div className="min-max-container">
                          <b>Min/Max</b> {minBet}-{maxBet}
                        </div>
                        <div className="header-box-container">
                            <div className="back-header">
                                <div>No</div>
                            </div>
                            <div className="lay-header">
                                <div>Yes</div>
                            </div>
                        </div>
                        <div className="position-header" style={{ flexDirection: 'column' }}>
                            <div>POS</div>
                            <div style={{ fontSize: '10px', marginTop: '2px' }}>NO/YES</div>
                        </div>
                    </div>
                    {oddsList.map((team, index) => (
                        <div key={index} className="team-row session-row">
                            <div className="team-name">{team.marketName}</div>
                            <div className="odd-box-container">
                                {(team.status === "ACTIVE" || team.status === "OPEN") ? 
                                <>
                                    <div key={team.noRate + team.noValue + index + "no"}
                                        className="flash-blue">
                                        <div className="odds-box back"
                                            onClick={(e) => handleSessionClick(e, index, team.noRate, "no", team.marketId, team.yesValue, team.noValue, team.marketName)}>
                                            <span className="price">{team.noValue}</span>
                                            <span className="amount">{team.noRate}</span>
                                        </div>
                                    </div>
                                    <div key={team.yesRate + team.yesValue + index + "yes"}
                                        className="flash-blue">
                                        <div className="odds-box lay"
                                            onClick={(e) => handleSessionClick(e, index, team.yesRate, "yes", team.marketId, team.yesValue, team.noValue, team.marketName)}>
                                            <span className="price">{team.yesValue}</span>
                                            <span className="amount">{team.yesRate}</span>
                                        </div>
                                    </div>
                                </> 
                                : <div className="odds-box suspended">{team.status.replace('_', ' ').toUpperCase()}</div>}
                            </div>
                            <div className="position-value session-position">
                                <div style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>NO: {team.noPosition}</div>
                                <div style={{ fontSize: '11px', color: '#666' }}>YES: {team.yesPosition}</div>
                            </div>
                        </div>
                    ))}
                 
                </div>
                <div className="bet-limits2">
                        {/* Min/Max info moved above table header */}
                </div>
            </div>}
        </div>
    )
};