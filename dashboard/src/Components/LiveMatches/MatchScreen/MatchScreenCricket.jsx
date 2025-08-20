import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { httpHelpers } from "../../../services/httpHelpers";
import "./Video.css";
import "./CricketBattersBowlersTable.css";
import "./MatchDetailsPage.css";
import { clearMessage } from "../../../actions/message";
import { useDispatch } from "react-redux";
import {
    MATCH_ODDS, 
    BOOKMAKER,
    TOSS_ODDS,
    FANCY_BET,
} from "../../../common/constants";
import OddsMarket from "./OddsMarket";
import SessionMarket from "./SessionMarket";
import DeclaredSessions from "./DeclaredSessions";
import RemainingMatches from "./RemainingMatches";

// Move renderDeclaredSessions outside the component
const renderDeclaredSessions = (declaredSessions) => {
    if (!declaredSessions) return null;
    return (
        <div className="bet-history-section">
            {declaredSessions.length > 0 && (
                <DeclaredSessions declaredSessionsTitle={"Declared Sessions"} declaredSessions={declaredSessions} />
            )}
        </div>
    );
};

export default function MatchScreenCricket({ role, logout, isSmallScreen }) {
    const { sport, id } = useParams();
    const api = httpHelpers();
    const getOFBRates = "/beta/getMatchById?matchId=" + id;
    const getAllMatches = "/beta/getAllMatches?sportType=" + sport + "&matchStatus=LIVE";
    const dispatch = useDispatch();
    const [matchResponse, setMatchResponse] = useState();
    const [fancyContainer, setFancyContainer] = useState();
    const [matchOddsContainer, setMatchOddsContainer] = useState();
    const [bookmakerOddsContainer, setBookmakerContainer] = useState();
    const [matchDetails, setMatchDetails] = useState();
    const [videoLink, setVideoLink] = useState();
    const [tossContainer, setTossContainer] = useState();
    const [doPoll, setDoPoll] = useState(true);
    const [showStream, setShowStream] = useState(false);
    const [declaredSessions, setDeclaredSessions] = useState();
    const [allMatches, setAllMatches] = useState(null);

    useEffect(() => {
        dispatch(clearMessage());
    }, []);

    // Reset polling when match ID changes
    useEffect(() => {
        setDoPoll(true);
    }, [id]);

    const fetchMatchMarkets = () => {
        api
            .get(`${getOFBRates}`)
            .then(res => {
                console.log("live markets", res);
                if (res && res.data) {
                    if (res.data.matchResponse) {
                        setMatchResponse(res.data.matchResponse);
                        if (res.data.matchResponse.matchStatus === "COMPLETED")
                            setDoPoll(false);
                        if (res.data.matchResponse.matchStatus === "LIVE" || res.data.matchResponse.matchStatus === "UPCOMING"
                            || res.data.matchResponse.matchStatus === "COMPLETED") {
                            if (res.data.matchOddsContainer) {
                                if (res.data.matchOddsContainer.marketList.length > 0)
                                    setMatchOddsContainer(res.data.matchOddsContainer);
                            } else {
                                setMatchOddsContainer(null);
                            }
                            if (res.data.bookMakerOddsContainer) {
                                if (res.data.bookMakerOddsContainer.marketList.length > 0)
                                    setBookmakerContainer(res.data.bookMakerOddsContainer);
                            } else {
                                setBookmakerContainer(null);
                            }
                            if (res.data.fancyContainer) {
                                if (res.data.fancyContainer.marketList.length > 0)
                                    setFancyContainer(res.data.fancyContainer);
                            } else {
                                setFancyContainer(null);
                            }
                            if (res.data.matchScore) {
                                console.log(res.data.matchScore);
                                setMatchDetails(res.data.matchScore);
                            }
                            if (res.data.videoLink && !videoLink) {
                                console.log(res.data.videoLink);
                                setVideoLink(res.data.videoLink);
                            }
                            if (res.data.tossContainer) {
                                if (res.data.tossContainer.marketList.length > 0)
                                    setTossContainer(res.data.tossContainer);
                                // declared session condition
                                if (res.data.declaredSessions) {
                                    setDeclaredSessions(res.data.declaredSessions);
                                } else {
                                    setDeclaredSessions(null);
                                }
                            } else {
                                setTossContainer(null);
                                setDeclaredSessions(null);
                            }

                        } else {
                            setMatchOddsContainer(null);
                            setBookmakerContainer(null);
                            setFancyContainer(null);
                            setMatchDetails(null);
                            setTossContainer(null);
                            setDeclaredSessions(null);
                        }
                    } else {
                        setMatchResponse(null);
                    }
                }
            })
            .catch(err => {
                console.log("error error", err);
                if (err) {
                    if (err.data) {
                        if (err.data.status && err.data.status === 401) {
                            logout();
                        }
                    } else if (err.response) {
                        if (err.response.status && err.response.status === 401) {
                            logout();
                        }
                    }
                }
            });
    };

    const fetchAllMatches = () => {
        api
            .get(`${getAllMatches}`)
            .then(res => {
                console.log("fetch all matches", res);
                if (res && res.data) {
                    if (res.data !== "") {
                        setAllMatches(res.data);
                    } else {
                        setAllMatches(null);
                    }
                } else {
                    setAllMatches(null);
                }
            })
            .catch(err => {
                console.log("error fetching all matches", err);
                if (err) {
                    if (err.data) {
                        if (err.data.status && err.data.status === 401) {
                            logout();
                        }
                    } else if (err.response) {
                        if (err.response.status && err.response.status === 401) {
                            logout();
                        }
                    }
                }
            });
    };

    useEffect(() => {
        fetchMatchMarkets();
        fetchAllMatches();
        const intervalId = setInterval(() => {
            if (doPoll)
                fetchMatchMarkets();
        }, 1000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array since we're using page reload

    const toggleScoreStream = (e, state) => {
        if (state === 0) {
            setShowStream(false);
        } else {
            setShowStream(true);
        }
    }

    return (
        <>
            <div className="live-match-container">
                <div className="live-match-left-column">
                    <div className="score-stream-toggle-container">
                        <button className="score-stream-toggle-button" onClick={(e) => toggleScoreStream(e, 0)}>Score</button>
                        <button className="score-stream-toggle-button" onClick={(e) => toggleScoreStream(e, 1)}>Video + Score</button>
                    </div>
                    <div>
                        <iframe
                                src={matchDetails}
                                title="Cricket Match Scoreboard"
                                className="live-score-frame"
                                style={{ 
                                    width: '100%', 
                                    height: '149px', 
                                    border: 'none',
                                    backgroundColor: 'transparent'
                                }}
                                allowFullScreen
                           /> 
                    </div>
                    {showStream && matchDetails && <div>
                        <iframe className="live-match-screen-stream-container" src={videoLink}></iframe>
                    </div>}
                    {!matchDetails && <div className="live-match-screen-scoreboard-container" style={{ height: "auto", marginTop: isSmallScreen ? "10px" : "0px" }}>
                        {sport === "cricket" && <label style={{ color: "#f8f8f8", fontSize: "14px" }}>{matchResponse && matchResponse.name}</label>}
                    </div>}
                    {!isSmallScreen && renderDeclaredSessions(declaredSessions)}
                </div>
                <div className="live-match-right-column">
                    <div className="bet-panel-root">
                        <div className="bet-panel-header-1">
                            {tossContainer && tossContainer.marketList && tossContainer.marketList.length > 0 && <OddsMarket marketType={TOSS_ODDS} oddsList={tossContainer.marketList} userPosition={tossContainer.userPosition} isSmallScreen={isSmallScreen} minBet={tossContainer.minBet} maxBet={tossContainer.maxBet} />}
                        </div>
                        <div className="bet-panel-header-1">
                            {matchOddsContainer && matchOddsContainer.marketList && matchOddsContainer.marketList.length > 0 && <OddsMarket marketType={MATCH_ODDS} oddsList={matchOddsContainer.marketList} minLimit={matchOddsContainer} minBet={matchOddsContainer.minBet} maxBet={matchOddsContainer.maxBet} />}
                        </div>
                        <div className="bet-panel-header-2">
                            {bookmakerOddsContainer && bookmakerOddsContainer.marketList && bookmakerOddsContainer.marketList.length > 0 && <OddsMarket marketType={BOOKMAKER} oddsList={bookmakerOddsContainer.marketList} minBet={bookmakerOddsContainer.minBet} maxBet={bookmakerOddsContainer.maxBet} />}
                        </div>
                        <div className="bet-panel-header-2">
                            {fancyContainer && fancyContainer.marketList && fancyContainer.marketList.length > 0 && <SessionMarket role={role} marketType={FANCY_BET} oddsList={fancyContainer.marketList} isFancy={true} userPosition={fancyContainer.userPosition} isSmallScreen={isSmallScreen} minBet={fancyContainer.minBet} maxBet={fancyContainer.maxBet} logout={logout} />}
                        </div>
                    </div>
                </div>
            </div>
            {isSmallScreen && (
                <div style={{ marginBottom: '50px' }}>
                    {renderDeclaredSessions(declaredSessions)}
                </div>
            )}
            
            {/* Remaining Matches Component */}
            <RemainingMatches 
                matches={allMatches}
                currentMatchId={id}
                sport={sport}
                currentMatchStatus={matchResponse?.matchStatus}
            />
        </>
    );
}
