import "../customized/MasterDownlineTableLite.css";
import { useState, useEffect } from "react";
import { httpHelpers } from "../../services/httpHelpers";
import "rsuite/dist/rsuite.min.css";
import './LiveMatches.css';
import { allMatches, completedMatches } from '../tables/Columns';
import {
    MATCH_STATUS_LIVE,
    MATCH_STATUS_UPCOMING,
    MATCH_STATUS_COMPLETED,
} from "../../common/constants";
import MatchesTable from "../tables/MatchesTable";

export default function LiveMatches({ role, logout, isSmallScreen }) {
    console.log("show", role);

    const href = window.location.href;
    let liveMatches = true;
    if (href.includes("complete-matches")) {
        liveMatches = false;
    }

    const [sportType] = useState("cricket"); // Always cricket
    const [matchStatus, setMatchStatus] = useState();
    const getMatches = "/beta/getAllMatches?sportType=";
    const api = httpHelpers();
    const [matches, setMatches] = useState(null);
    const [noMatches, setNoMatches] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMatches = () => {
        setIsLoading(true);
        setNoMatches(false);
        api
            .get(`${getMatches}${sportType}&matchStatus=${matchStatus}`)
            .then(res => {
                if (res && res.data) {
                    if (res.data === "") {
                        setNoMatches(true);
                    } else {
                        setMatches(res.data);
                        setNoMatches(false);
                    }
                } else {
                    setMatches(null);
                    setNoMatches(true);
                }
            })
            .catch(err => {
                console.log("error error", err);
                if (err?.data?.status === 401 || err?.response?.status === 401) {
                    logout();
                }
                setNoMatches(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const inPlayMatches = (e) => {
        e.preventDefault();
        setMatchStatus(MATCH_STATUS_LIVE);
    };

    const upcomingMatches = (e) => {
        e.preventDefault();
        setMatchStatus(MATCH_STATUS_UPCOMING);
    };

    // Set initial match status based on the page
    useEffect(() => {
        if (!liveMatches) {
            // For completed matches page, always show completed matches
            setMatchStatus(MATCH_STATUS_COMPLETED);
        } else {
            // For live matches page, default to live matches
            setMatchStatus(MATCH_STATUS_LIVE);
        }
    }, [liveMatches]);

    useEffect(() => {
        if (sportType && matchStatus) {
            fetchMatches();
        }
    }, [sportType, matchStatus]);

    let getRowsPerPage = "alpha/getGlobalProperty/rowsPerPage";
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const fetchRowsPerPage = () => {
        api
            .get(getRowsPerPage)
            .then(res => {
                if (res?.data) {
                    setRowsPerPage(res.data);
                }
            })
            .catch(err => {
                console.log("error error", err);
                if (err?.data?.status === 401 || err?.response?.status === 401) {
                    logout();
                }
            });
    };

    useEffect(() => {
        fetchRowsPerPage();
    }, []);

    return (
        <div>
            {!isLoading && noMatches && (
                <div>
                    <label style={{ color: "#48aaad", fontSize: "30px" }}>
                        {!liveMatches ? "No Completed Matches!" : "No Live Matches!"}
                    </label>
                </div>
            )}

            {/* Only show tabs for live matches page */}
            {liveMatches && (
                <div className={`match-tabs ${matchStatus === MATCH_STATUS_LIVE ? "tab-1" : "tab-2"}`}>
                    <button
                        className={`tab-button ${matchStatus === MATCH_STATUS_LIVE ? "active-tab" : ""}`}
                        onClick={(e) => inPlayMatches(e)}
                    >
                        Inplay
                    </button>
                    <button
                        className={`tab-button ${matchStatus === MATCH_STATUS_UPCOMING ? "active-tab" : ""}`}
                        onClick={(e) => upcomingMatches(e)}
                    >
                        Upcoming
                    </button>
                </div>
            )}

            {isLoading && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '200px',
                    color: "#48aaad", 
                    fontSize: isSmallScreen ? "16px" : "20px",
                    fontWeight: "500",
                    textAlign: 'center',
                    padding: '20px',
                    marginTop: '20px'
                }}>
                    {liveMatches ? "Loading Live Matches..." : "Loading Completed Matches..."}
                </div>
            )}

            <div className="App" style={{ marginTop: "10px", marginLeft: "5px", marginRight: "5px", background: "white" }}>
                {!isLoading && matches && (
                    <MatchesTable
                        columns={liveMatches ? allMatches : completedMatches}
                        data={matches}
                        sport={sportType}
                        liveMatches={liveMatches}
                        isSmallScreen={isSmallScreen}
                        rowsPerPage={rowsPerPage}
                    />
                )}
            </div>
        </div>
    );
}
