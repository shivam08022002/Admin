import React, { useState, useEffect } from "react";
import {
    DRAW_MATCH,
    MARKET_MATCH_ODDS,
    MARKET_BOOKMAKER,
    MARKET_TOSS_ODDS,
    MATCH_ODDS,
    BOOKMAKER,
    TOSS_ODDS
} from '../../../common/constants';
import './OddsMarket.css';
import { FaArrowRight } from "react-icons/fa";

export default function OddsMarket({ onMarketPositionClick, marketType, oddsList, minBet, maxBet, waitTime, backPref, layPref }) {
    console.log("OddsMarket", marketType, oddsList);
    let teamA;
    let teamB;
    let theDraw;
    let tiedYes;
    let tiedNo;

    let hasOdds = false;

    oddsList.forEach((odds) => {
        if (odds.nation === "Yes" || odds.nation === "YES") {
            if (odds.marketName === "Tied Match" || odds.marketName === "TIED_MATCH") {
                hasOdds = true;
                tiedYes = odds;
            }
        } else if (odds.nation === "No" || odds.nation === "NO") {
            if (odds.marketName === "Tied Match" || odds.marketName === "TIED_MATCH") {
                hasOdds = true;
                tiedNo = odds;
            }
        } else if (odds.nation !== "No" && odds.nation !== "NO"
            && odds.nation !== "Yes" && odds.nation !== "YES") {
            if (odds.nation === DRAW_MATCH) {
                hasOdds = true;
                theDraw = odds;
            } else if (teamA) {
                hasOdds = true;
                teamB = odds;
            } else {
                hasOdds = true;
                teamA = odds;
            }
        }
    });

    let teams = null;
    let tied = null;

    if (teamA && teamB) {
        teams = [
            {
                name: teamA.nation, backRate: teamA.backRate, backStake: teamA.backStake,
                layRate: teamA.layRate, layStake: teamA.layStake, status: teamA.status,
                marketId: teamA.marketId, userPosition: teamA.userPosition
            },
            {
                name: teamB.nation, backRate: teamB.backRate, backStake: teamB.backStake,
                layRate: teamB.layRate, layStake: teamB.layStake, status: teamB.status,
                marketId: teamB.marketId, userPosition: teamB.userPosition
            }
        ];

        if (theDraw) {
            teams.push({
                name: theDraw.nation, backRate: theDraw.backRate, backStake: theDraw.backStake,
                layRate: theDraw.layRate, layStake: theDraw.layStake, status: theDraw.status,
                marketId: theDraw.marketId, userPosition: theDraw.userPosition
            });
        }
    }

    if (tiedYes && tiedNo) {
        tied = [
            {
                name: tiedYes.nation, backRate: tiedYes.backRate, backStake: tiedYes.backStake,
                layRate: tiedYes.layRate, layStake: tiedYes.layStake, status: tiedYes.status,
                marketId: tiedYes.marketId, userPosition: tiedYes.userPosition
            },
            {
                name: tiedNo.nation, backRate: tiedNo.backRate, backStake: tiedNo.backStake,
                layRate: tiedNo.layRate, layStake: tiedNo.layStake, status: tiedNo.status,
                marketId: tiedNo.marketId, userPosition: tiedNo.userPosition
            }
        ];
    }

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
        <div className="market-section">
            <div className="market-header">
                <div className="market-title">
                {marketType}
                <span className="info-icon"></span>
                </div>
                <div className="cash-out-container">
                  <button className="cash-out">
                    <span className="cash-out-icon">
                      <span className="cash-out-icon-dot"></span>
                    </span>
                    <span className="cash-out-text">Cash Out</span>
                  </button>
                </div>
            </div>

            <div className="odds-table-container">
                <div className="odds-table">
                    <div className="table-header">
                        <div className="min-max-container">
                          <b>Min/Max</b> {minBet}-{maxBet}
                        </div>
                        <div className="header-box-container">
                            <div className="back-header">
                                <div>BACK</div>
                            </div>
                            <div className="lay-header">
                                <div>LAY</div>
                            </div>
                        </div>
                        <div className="position-header">POSITION</div>
                    </div>
                    {teams && teams.map((team, index) => (
                        <div key={index} className="team-row">
                            <div className="team-name">{team.name}</div>
                            <div className="odd-box-container">
                                {(team.status === "ACTIVE" || team.status === "OPEN") ? 
                                <>
                                    <div key={team.backRate + team.backStake + index + "back"}
                                        className="flash-blue odds-box">
                                        <div key={`back-${index}`} className="odds-box back"
                                            onClick={(e) => handleMarketClick(e, index, team.backRate, "back", team.marketId, team.name)}>
                                            <span className="price">{team.backRate}</span>
                                            <span className="amount">{team.backStake}K</span>
                                        </div>
                                    </div>
                                    <div key={team.layRate + team.layStake + index + "lay"}
                                        className="flash-yellow odds-box">
                                        <div key={`lay-${index}`} className="odds-box lay"
                                            onClick={(e) => handleMarketClick(e, index, team.layRate, "lay", team.marketId, team.name)}>
                                            <span className="price">{team.layRate}</span>
                                            <span className="amount">{team.layStake}K</span>
                                        </div>
                                    </div>
                                </> 
                                : <div className="odds-box suspended">{team.status.replace('_', ' ').toUpperCase()}</div>}
                            </div>
                            <div className={`position-value ${parseFloat(team.userPosition) > 0 ? 'positive' : parseFloat(team.userPosition) < 0 ? 'negative' : ''}`}>
                                {team.userPosition > 0 ? '+' : ''}{team.userPosition}
                            </div>
                        </div>
                    ))}
                  
                </div>
                <div className="bet-limits2">
                        {/* Min/Max info moved above table header */}
                </div>
            </div>
        </div>
    )
};