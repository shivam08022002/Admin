import React, { useState } from "react";
import TableTitle from "../../customized/TableTitle";
import api from "../../../services/api";
import cards from "../52-cards";
import "./SearchCasinoResult.css";

// Game type mapping
const GAME_TYPES = {
  lucky7: "Lucky 7A",
  teen20: "Teenpatti 20-20",
  dt20: "Dragon Tiger 20-20",
  ab20: "Andar Bahar",
  card32: "Cards 32A",
  btable: "Bollywood Casino",
  aaa: "Amar Akbar Anthony",
  dtl20: "DTL 20"
};

// API game type to component game type mapping
const API_GAME_TYPE_MAPPING = {
  'CARD_32_A': 'card32',
  'LUCKY_7_A': 'lucky7',
  'TEEN_20_20': 'teen20',
  'DRAGON_TIGER_20_20': 'dt20',
  'ANDAR_BAHAR': 'ab20',
  'BOLLYWOOD_CASINO': 'btable',
  'AMAR_AKBAR_ANTHONY': 'aaa',
  'DTL_20': 'dtl20'
};

export default function SearchCasinoResult() {
  const [searchTerm, setSearchTerm] = useState("");
  const [gameType, setGameType] = useState("dtl20");
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a Round ID");
      return;
    }

    setIsLoading(true);
    setError("");
    setSearchResults(null);

    try {
      const response = await api.get(`/beta/api/diamondgames/getGameResult/${gameType}/${searchTerm}`);
      console.log("API Response:", response);
      if (response && response.data) {
        // Check if selected game type matches API response game type
        const apiGameType = response.data.gameType;
        if (apiGameType && API_GAME_TYPE_MAPPING[apiGameType]) {
          const detectedGameType = API_GAME_TYPE_MAPPING[apiGameType];
          if (detectedGameType !== gameType) {
            setError(`Game type mismatch! This Round ID belongs to ${GAME_TYPES[detectedGameType]} game, but you selected ${GAME_TYPES[gameType]}. Please select the correct game type.`);
            setIsLoading(false);
            return;
          }
        }
        setSearchResults(response.data);
      } else {
        setError("No results found for this Round ID");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Error fetching results. Please check the Round ID and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const _clearResults = () => {
    setSearchResults(null);
    setError("");
  };

  return (
    <div className="search-casino-result-container">
      <TableTitle
        text="Search Casino Result"
        color="#ffffff"
        fontSize="14px"
        textAlign="left"
        width="100%"
        height="40px"
        marginLeft="0px"
        marginRight="0px"
      />
      
             {/* Search Controls */}
       <div className="search-controls">
         <div className="search-input-group">
           <label className="search-label">Round ID</label>
           <input
             type="text"
             className="search-input"
             placeholder="Enter Round ID"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             onKeyPress={handleKeyPress}
           />
         </div>

                   <div className="search-input-group">
            <label className="search-label">Game Type</label>
            <select
              className="search-select"
              value={gameType}
              onChange={(e) => setGameType(e.target.value)}
              disabled={isLoading}
            >
              {Object.entries(GAME_TYPES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

         <button
           className="search-button"
           onClick={handleSearch}
           disabled={isLoading}
         >
           {isLoading ? "Searching..." : "Search"}
         </button>
       </div>

             {/* Error Display */}
       {error && (
         <div className="error-message">
           {error}
         </div>
       )}

               {/* Result Display */}
        {searchResults && (
          <div className="result-container">
            <GameResult
              gameType={gameType}
              gameData={searchResults}
              roundId={searchTerm}
            />
          </div>
        )}
    </div>
  );
}

// Game Result Component
const GameResult = ({ gameType, gameData, roundId }) => {
  const renderGameResult = () => {
    switch (gameType) {
      case "dt20":
        return <DragonTigerResult gameData={gameData} roundId={roundId} />;
      case "lucky7":
        return <Lucky7Result gameData={gameData} roundId={roundId} />;
      case "teen20":
        return <TeenPattiResult gameData={gameData} roundId={roundId} />;
      case "dtl20":
        return <DTLResult gameData={gameData} roundId={roundId} />;
      case "btable":
        return <BollywoodResult gameData={gameData} roundId={roundId} />;
      case "ab20":
        return <AndarBaharResult gameData={gameData} roundId={roundId} />;
      case "aaa":
        return <AAAResult gameData={gameData} roundId={roundId} />;
      case "card32":
        return <Card32Result gameData={gameData} roundId={roundId} />;
      default:
        return <DefaultResult gameData={gameData} roundId={roundId} />;
    }
  };

  return (
    <div className="game-result-container">
      {renderGameResult()}
    </div>
  );
};

// Dragon Tiger Result Component
const DragonTigerResult = ({ gameData, roundId }) => {
  const descParts = gameData?.newdesc?.split('#') || [];
  const winner = descParts[0] || '-';
  const pair = descParts[1] || '-';
  const oddEven = descParts[2] || '-';
  const color = descParts[3] || '-';
  const card = descParts[4] || '-';

  const [dragonCardKey, tigerCardKey] = (gameData?.cards?.split(',') || ['1', '1']);
  const isDragonWinner = winner.toLowerCase().includes('dragon');
  const isTigerWinner = winner.toLowerCase().includes('tiger');

    return (
    <>
      <div className="result-header">
        <h2>20-20 Dragon Tiger 2 Result</h2>
      </div>

      <div className="result-round-id">
        <strong>Round Id:</strong> {roundId}
      </div>

      <div className="card-container">
        <div className="card-section">
          <span className="card-label">Dragon</span>
          <div className="card-image-container">
            <div className="card-image">
              <img src={cards[dragonCardKey] || cards['1']} alt="Dragon" />
            </div>
            {isDragonWinner && <div className="winner-icon">🏆</div>}
          </div>
        </div>

        <div className="card-section">
          <span className="card-label">Tiger</span>
          <div className="card-image-container">
            <div className="card-image">
              <img src={cards[tigerCardKey] || cards['1']} alt="Tiger" />
            </div>
            {isTigerWinner && <div className="winner-icon">🏆</div>}
          </div>
        </div>
      </div>

      <div className="result-info">
        <div className="info-row">
          <span>Winner</span>
          <span>{winner}</span>
        </div>
        <div className="info-row">
          <span>Pair</span>
          <span>{pair}</span>
        </div>
        <div className="info-row">
          <span>Odd/Even</span>
          <span>{oddEven}</span>
        </div>
        <div className="info-row">
          <span>Color</span>
          <span>{color}</span>
        </div>
        <div className="info-row">
          <span>Card</span>
          <span>{card}</span>
        </div>
      </div>
    </>
  );
};

// Lucky 7 Result Component
const Lucky7Result = ({ gameData, roundId }) => {
  const descParts = gameData?.newdesc?.split('#') || [];
  const winner = descParts[0] || '-';
  const oddEven = descParts[1] || '-';
  const color = descParts[2] || '-';
  const card = descParts[3] || '-';
  const line = descParts[4] || '-';

  const cardKey = gameData?.cards || '1';

    return (
    <>
      <div className="result-header">
        <h2>Lucky 7A Result</h2>
      </div>

      <div className="result-round-id">
        <strong>Round Id:</strong> {roundId}
      </div>

      <div className="single-card-container">
        <div className="card-image">
          <img src={cards[cardKey] || cards['1']} alt={cardKey} />
        </div>
      </div>

      <div className="result-info">
        <div className="info-row">
          <span>Winner</span>
          <span>{winner}</span>
        </div>
        <div className="info-row">
          <span>Odd/Even</span>
          <span>{oddEven}</span>
        </div>
        <div className="info-row">
          <span>Color</span>
          <span>{color}</span>
        </div>
        <div className="info-row">
          <span>Card</span>
          <span>{card}</span>
        </div>
        <div className="info-row">
          <span>Line</span>
          <span>{line}</span>
        </div>
      </div>
    </>
  );
};

// Teen Patti Result Component
const TeenPattiResult = ({ gameData, roundId }) => {
  const cardsStr = gameData?.cards || '';
  const newdescStr = gameData?.newdesc || '';

  let playerACards = [], playerBCards = [];
  if (cardsStr) {
    const cardArr = cardsStr.split(',');
    playerACards = [cardArr[0], cardArr[2], cardArr[4]].filter(Boolean);
    playerBCards = [cardArr[1], cardArr[3], cardArr[5]].filter(Boolean);
  }

  let winner = '', pairPlus = '';
  if (newdescStr) {
    const parts = newdescStr.split('#');
    winner = (parts[0] || '').trim();
    pairPlus = (parts[3] || '').trim();
  }

  const renderCard = (card, idx) => (
    <div key={idx} className="teenpatti-card">
      <img src={cards[card] || cards['1']} alt={card} />
    </div>
  );

    return (
    <>
      <div className="result-header">
        <h2>20-20 Teenpatti Result</h2>
      </div>

      <div className="result-round-id">
        Round Id: {roundId}
      </div>

      <div className="teenpatti-players">
        <div className="player-row">
          <div className="player-label">Player A</div>
          <div className="player-cards">
            {playerACards.map(renderCard)}
          </div>
          <div className="player-trophy">
            {winner === 'Player A' && <span className="winner-icon">🏆</span>}
          </div>
        </div>

        <div className="player-row">
          <div className="player-label">Player B</div>
          <div className="player-cards">
            {playerBCards.map(renderCard)}
          </div>
          <div className="player-trophy">
            {winner === 'Player B' && <span className="winner-icon">🏆</span>}
          </div>
        </div>
      </div>

      <div className="teenpatti-details">
        <div className="detail-row">
          Winner: <span className="winner-name">{winner}</span>
        </div>
        {pairPlus && (
          <div className="detail-row">
            Pair Plus: <span className="pair-plus">{pairPlus}</span>
          </div>
        )}
      </div>
    </>
  );
};

// DTL Result Component
const DTLResult = ({ gameData, roundId }) => {
  const descParts = gameData?.newdesc?.split('#') || [];
  const winner = descParts[0] || '-';
  const colorLine = descParts[1] || '-';
  const oddEvenLine = descParts[2] || '-';
  const cardLine = descParts[3] || '-';

  const [dragonCardKey, tigerCardKey, lionCardKey] = (gameData?.cards?.split(',') || ['1', '1', '1']);
  const isDragonWinner = winner.toLowerCase().includes('dragon');
  const isTigerWinner = winner.toLowerCase().includes('tiger');
  const isLionWinner = winner.toLowerCase().includes('lion');

    return (
    <>
      <div className="result-header">
        <h2>DTL 20 Result</h2>
      </div>

      <div className="result-round-id">
        <strong>Round Id:</strong> {roundId}
      </div>

      <div className="three-card-container">
        <div className="card-section">
          <span className="card-label">Dragon</span>
          <div className="card-image-container">
            <div className="card-image">
              <img src={cards[dragonCardKey] || cards['1']} alt="Dragon" />
            </div>
            {isDragonWinner && <div className="winner-icon">🏆</div>}
          </div>
        </div>

        <div className="card-section">
          <span className="card-label">Tiger</span>
          <div className="card-image-container">
            <div className="card-image">
              <img src={cards[tigerCardKey] || cards['1']} alt="Tiger" />
            </div>
            {isTigerWinner && <div className="winner-icon">🏆</div>}
          </div>
        </div>

        <div className="card-section">
          <span className="card-label">Lion</span>
          <div className="card-image-container">
            <div className="card-image">
              <img src={cards[lionCardKey] || cards['1']} alt="Lion" />
            </div>
            {isLionWinner && <div className="winner-icon">🏆</div>}
          </div>
        </div>
      </div>

      <div className="result-info">
        <div className="info-row">
          <span>Winner</span>
          <span>{winner}</span>
        </div>
        <div className="info-row">
          <span>Colors</span>
          <span>{colorLine}</span>
        </div>
        <div className="info-row">
          <span>Odd/Even</span>
          <span>{oddEvenLine}</span>
        </div>
        <div className="info-row">
          <span>Cards</span>
          <span>{cardLine}</span>
        </div>
      </div>
    </>
  );
};

// Bollywood Casino Result Component
const BollywoodResult = ({ gameData, roundId }) => {
  const descParts = gameData?.newdesc?.split('#') || [];
  const winner = descParts[0] || '-';
  const odd = descParts[1] || '-';
  const dulhaStatus = descParts[2] || '-';
  const color = descParts[3] || '-';
  const card = descParts[4] || '-';

  const cardKey = gameData?.cards || '1';

    return (
    <>
      <div className="result-header">
        <h2>Bollywood Casino Result</h2>
      </div>

      <div className="result-round-id">
        <strong>Round Id:</strong> {roundId}
      </div>

      <div className="single-card-container">
        <div className="card-image">
          <img src={cards[cardKey] || cards['1']} alt={cardKey} />
        </div>
      </div>

      <div className="result-info">
        <div className="info-row">
          <span>Winner</span>
          <span>{winner}</span>
        </div>
        <div className="info-row">
          <span>Odd</span>
          <span>{odd}</span>
        </div>
        <div className="info-row">
          <span>Dulha Dulhan/Barati</span>
          <span>{dulhaStatus}</span>
        </div>
        <div className="info-row">
          <span>Color</span>
          <span>{color}</span>
        </div>
        <div className="info-row">
          <span>Card</span>
          <span>{card}</span>
        </div>
      </div>
    </>
  );
};

// Andar Bahar Result Component
const AndarBaharResult = ({ gameData, roundId }) => {
  const winner = gameData?.name || '';
  const cardData = gameData?.cards?.split(',') || [];

  const andarCards = cardData.filter((_, i) => i % 2 !== 0);
  const baharCards = cardData.filter((_, i) => i % 2 === 0);

  const renderCard = (card, idx) => (
    <div key={idx} className="ab-card">
      <img src={cards[card] || cards['1']} alt={card} />
    </div>
  );

    return (
    <>
      <div className="result-header">
        <h2>Andar Bahar Result</h2>
      </div>

      <div className="result-round-id">
        <strong>Round Id:</strong> {roundId}
      </div>

      <div className="ab-container">
        <div className="ab-section">
          <div className="ab-label">Andar</div>
          <div className="ab-cards">
            {andarCards.map(renderCard)}
          </div>
        </div>

        <div className="ab-section">
          <div className="ab-label">Bahar</div>
          <div className="ab-cards">
            {baharCards.map(renderCard)}
          </div>
        </div>
      </div>

      <div className="ab-winner">
        <strong>Result:</strong> {winner}
      </div>
    </>
  );
};

// Amar Akbar Anthony Result Component
const AAAResult = ({ gameData, roundId }) => {
  const descParts = gameData?.newdesc?.split('#') || [];
  const winner = descParts[0] || '-';
  const player = descParts[1] || '-';
  const oddEven = descParts[2] || '-';
  const UnderOver = descParts[3] || '-';
  const card = descParts[4] || '-';

  const cardKey = gameData?.cards || '1';

    return (
    <>
      <div className="result-header">
        <h2>Amar Akbar Anthony Result</h2>
      </div>

      <div className="result-round-id">
        <strong>Round Id:</strong> {roundId}
      </div>

      <div className="single-card-container">
        <div className="card-image">
          <img src={cards[cardKey] || cards['1']} alt={cardKey} />
        </div>
      </div>

      <div className="result-info">
        <div className="info-row">
          <span>Winner</span>
          <span>{winner}</span>
        </div>
        <div className="info-row">
          <span>Player</span>
          <span>{player}</span>
        </div>
        <div className="info-row">
          <span>Odd/Even</span>
          <span>{oddEven}</span>
        </div>
        <div className="info-row">
          <span>Under/Over</span>
          <span>{UnderOver}</span>
        </div>
        <div className="info-row">
          <span>Card</span>
          <span>{card}</span>
        </div>
      </div>
    </>
  );
};

// Card 32 Result Component
const Card32Result = ({ gameData, roundId }) => {
  const cardsStr = gameData?.cards || '';
  const winner = gameData?.name || '';

  let playerCards = [[], [], [], []];
  let playerNames = ['Player 8', 'Player 9', 'Player 10', 'Player 11'];
  
  if (cardsStr) {
    const cardArr = cardsStr.split(',');
    for (let i = 0; i < cardArr.length; i++) {
      if (cardArr[i] !== '1') { // Only add non-placeholder cards
        playerCards[i % 4].push(cardArr[i]);
      }
    }
  }

  const renderCard = (card, idx) => {
    return (
      <div key={idx} className="card32-card">
        <img src={cards[card] || cards['1']} alt={card} />
      </div>
    );
  };

    return (
    <>
      <div className="result-header">
        <h2>32 Cards - A Result</h2>
      </div>

      <div className="result-round-id">
        Round Id: {roundId}
      </div>

             <div className="card32-players">
         {playerNames.map((pName, idx) => (
           <div key={pName} className="card32-player-row">
             <span className="card32-player-name">{pName}</span>
             <div className="card32-player-cards">
               {playerCards[idx] && playerCards[idx].map(renderCard)}
             </div>
           </div>
         ))}
       </div>

      <div className="card32-winner-section">
        Winner: <span className="card32-winner-name">{winner}</span>
      </div>
    </>
  );
};

// Default Result Component
const DefaultResult = ({ gameData, roundId }) => {
    return (
    <>
      <div className="result-header">
        <h2>Game Result</h2>
      </div>

      <div className="result-round-id">
        <strong>Round Id:</strong> {roundId}
      </div>

      <div className="result-info">
        <div className="info-row">
          <span>Raw Data</span>
          <span>{JSON.stringify(gameData, null, 2)}</span>
        </div>
      </div>
    </>
  );
};

