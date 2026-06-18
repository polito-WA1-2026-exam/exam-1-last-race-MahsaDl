import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Alert, Button, Spinner } from 'react-bootstrap';

import API from '../api/API.js';

function ResultPage() {
  const { gameId } = useParams();

  const [game, setGame] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGame() {
      try {
        const gameData = await API.getGame(gameId);
        setGame(gameData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadGame();
  }, [gameId]);

  if (loading) {
    return (
      <>
        <Spinner animation="border" />
        <p>Loading result...</p>
      </>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const travelledSegments = game.travelledSegments || [];

  const gained = travelledSegments
    .filter((segment) => segment.coinEffect > 0)
    .reduce((sum, segment) => sum + segment.coinEffect, 0);

  const lost = travelledSegments
    .filter((segment) => segment.coinEffect < 0)
    .reduce((sum, segment) => sum + Math.abs(segment.coinEffect), 0);

  const routeStations = [game.startStationName];

  for (const segment of travelledSegments) {
    const lastStation = routeStations[routeStations.length - 1];

    if (segment.station1Name === lastStation) {
      routeStations.push(segment.station2Name);
    } else if (segment.station2Name === lastStation) {
      routeStations.push(segment.station1Name);
    }
  }

  const routeText =
    travelledSegments.length > 0
      ? routeStations.join(' → ')
      : `${game.startStationName} → ${game.destinationStationName}`;

  return (
    <div className="result-page">
      <div className="page-container">
        <div className="confetti-dot dot-1"></div>
        <div className="confetti-dot dot-2"></div>
        <div className="confetti-dot dot-3"></div>
        <div className="confetti-square square-1"></div>
        <div className="confetti-square square-2"></div>

        <h1 className="result-title">
          {game.valid ? 'JOURNEY COMPLETE' : 'JOURNEY FAILED'}
        </h1>

        <section className="result-card">
          <div className="result-trophy">
            {game.valid ? '🏆' : '⚠️'}
          </div>

          <p className="result-label">FINAL SCORE</p>

          <div className={game.valid ? 'result-score' : 'result-score invalid'}>
            {game.score}
          </div>

          <p className="result-coins">coins</p>

          {!game.valid && game.failureReason && (
            <div className="result-failure">
              {game.failureReason}
            </div>
          )}

          <div className="result-divider"></div>

          <div className="result-route">
            <span>{game.valid ? 'ROUTE' : 'TARGET ROUTE'}</span>
            <p>{routeText}</p>
          </div>

          <div className="result-stats">
            <div>
              <span>SEGMENTS</span>
              <strong>{travelledSegments.length}</strong>
            </div>

            <div>
              <span>STARTED WITH</span>
              <strong>20 🪙</strong>
            </div>

            <div>
              <span>GAINED</span>
              <strong className="gain">+{gained}</strong>
            </div>

            <div>
              <span>LOST</span>
              <strong className="loss">-{lost}</strong>
            </div>
          </div>
        </section>

        {travelledSegments.length > 0 && (
          <section className="events-card">
            <h2>Segment events</h2>

            <div className="events-list">
              {travelledSegments.map((segment) => (
                <div className="event-row" key={segment.sequenceNumber}>
                  <div>
                    <strong>Step {segment.sequenceNumber}</strong>
                    <p>
                      {segment.station1Name} ↔ {segment.station2Name}
                    </p>
                    <small>{segment.eventDescription}</small>
                  </div>

                  <span
                    className={
                      segment.coinEffect >= 0
                        ? 'event-effect positive'
                        : 'event-effect negative'
                    }
                  >
                    {segment.coinEffect > 0
                      ? `+${segment.coinEffect}`
                      : segment.coinEffect}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="result-actions">
          <Button as={Link} to="/game" className="result-play-button">
            Play Again
          </Button>

          <Button as={Link} to="/ranking" className="result-outline-button">
            View Ranking
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;