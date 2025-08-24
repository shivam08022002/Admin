import { useState, useEffect } from "react";
import { httpHelpers } from "../../../services/httpHelpers";
import TableTitle from "../../customized/TableTitle";
import CasinoBetHistoryTable from "../../tables/CasinoBetHistoryTable";
import CasinoProfitLossTable from "../../tables/CasinoProfitLossTable";
import "../Casino.css";

export default function VirtualCasino({ logout, isSmallScreen }) {
  const [selectedGameType, setSelectedGameType] = useState(null);
  const [games, setGames] = useState([]);
  const [noGames, setNoGames] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const api = httpHelpers();

  useEffect(() => {
    if (selectedGameType === "history") {
      const today = new Date();
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);

      const formatDate = (date) => date.toISOString().slice(0, 10);
      setFromDate(formatDate(weekAgo));
      setToDate(formatDate(today));
    }
  }, [selectedGameType]);

  const parseGameStartTime = (arr) => {
    if (!Array.isArray(arr) || arr.length < 6) return new Date(0);
    const [year, month, day, hour, minute, second, nano] = arr;
    return new Date(year, month - 1, day, hour, minute, second, Math.floor((nano || 0) / 1e6));
  };

  const fetchGamesByType = async (gameType, isSearch = false, fromDateParam = "", toDateParam = "") => {
    setNoGames(false);
    setGames([]);
    setSelectedGameType(gameType);

    try {
      if (gameType === "history") {
        let aviatorUrl = "/beta/getAllGamesByType?betType=aviatorgame";
        let virtualUrl = "/beta/getAllGamesByType?betType=virtualgame";

        if (isSearch && fromDateParam && toDateParam) {
          aviatorUrl += `&fromDate=${fromDateParam}&toDate=${toDateParam}`;
          virtualUrl += `&fromDate=${fromDateParam}&toDate=${toDateParam}`;
        }

        const [aviatorRes, virtualRes] = await Promise.all([
          api.get(aviatorUrl),
          api.get(virtualUrl),
        ]);

        const aviatorGames = aviatorRes?.data || [];
        const virtualGames = virtualRes?.data || [];

        const mergedGames = [...aviatorGames, ...virtualGames].sort(
          (a, b) => parseGameStartTime(b.gameStartTime) - parseGameStartTime(a.gameStartTime)
        );

        mergedGames.length > 0 ? setGames(mergedGames) : setNoGames(true);
      } else if (gameType === "live") {
        const res = await api.get("/beta/getVirtualCurrentDayProfitLoss");
        const resultGames = res?.data || [];
      
        // ✅ Filter out games with "casino" in gameName (case-insensitive)
        const filteredGames = resultGames.filter(
          (game) => !game?.gameName?.toLowerCase().includes("casino")
        );
      
        filteredGames.length > 0 ? setGames(filteredGames) : setNoGames(true);
      }
    } catch (err) {
      console.error("API Error:", err);
      if ((err.data && err.data.status === 401) || (err.response && err.response.status === 401)) {
        logout();
      }
      setNoGames(true);
    }
  };

  return (
    <div className="casino-container">
      <TableTitle
        text="Virtual Casino Games Overview"
        color="#ffffff"
        fontSize="14px"
        textAlign="left"
        width={isSmallScreen ? "97%" : "99.2%"}
        height="42px"
        marginLeft="5px"
        marginRight="0px"
        paddingLeft="10px"
      />

      <div className="casino-controls">
        <div className="casino-button-group" >
          <button
            className={`cric-board-buttons board-buttons-nav-bar-dark-large ${selectedGameType === "live" ? "selected" : ""}`}
            onClick={() => fetchGamesByType("live")}
          >
            Live PnL
          </button>

          <button
            className={`cric-board-buttons board-buttons-nav-bar-dark-large ${selectedGameType === "history" ? "selected" : ""}`}
            onClick={() => fetchGamesByType("history")}
          >
            Bet History
          </button>
        </div>

        {selectedGameType === "history" && (
          <>
            <div>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="casino-date-input"
              />
            </div>

            <div>
              <label className="casino-date-label">
                To
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="casino-date-input"
              />
            </div>

            <button
              onClick={() => {
                if (fromDate && toDate) {
                  fetchGamesByType("history", true, fromDate, toDate);
                } else {
                  alert("Please select both From and To dates.");
                }
              }}
              className="casino-search-btn"
            >
              Search
            </button>
          </>
        )}
      </div>

      {noGames && (
        <div className="casino-no-games">
          No Games Found!
        </div>
      )}

      {games && games.length > 0 && (
        <div className="casino-table-container">
          {selectedGameType === "history" ? (
            <CasinoBetHistoryTable data={games} />
          ) : (
            <CasinoProfitLossTable data={games} />
          )}
        </div>
      )}
    </div>
  );
}
