import { useEffect, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router';

import API from '../api/API.js';
import NetworkMap from '../components/NetworkMap.jsx';
import Timer from '../components/Timer.jsx';

function GamePage() {
  const navigate = useNavigate();

  const [network, setNetwork] = useState(null);
  const [game, setGame] = useState(null);
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [phase, setPhase] = useState('setup');
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    async function initializeGame() {
      setLoading(true);
      setError('');
      setSelectedSegments([]);
      setSubmitted(false);
      setPhase('setup');

      try {
        const [networkData, gameData] = await Promise.all([
          API.getNetwork(),
          API.startGame()
        ]);
        const shuffled = [...networkData.segments].sort(() => Math.random() - 0.5);

        setNetwork({
          ...networkData,
          segments: shuffled
        });
        setGame(gameData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    initializeGame();
  }, []);


  function startPlanning() {
    setError('');
    setSelectedSegments([]);
    setSubmitted(false);
    setPhase('planning');
    setTimerKey((key) => key + 1);
  }

  function toggleSegment(segmentId) {
    if (phase !== 'planning' || submitted) {
      return;
    }

    setError('');

    setSelectedSegments((oldSegments) => {
      if (oldSegments.includes(segmentId)) {
        return oldSegments.filter((id) => id !== segmentId);
      }

      return [...oldSegments, segmentId];
    });
  }

  function clearRoute() {
    setSelectedSegments([]);
    setError('');
  }

  async function submitCurrentRoute() {
    if (!game || submitted) {
      return;
    }

    setSubmitting(true);
    setSubmitted(true);
    setError('');

    try {
      await API.submitGameRoute(game.id, selectedSegments);
      navigate(`/result/${game.id}`);
    } catch (err) {
      setSubmitted(false);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit() {
    if (selectedSegments.length < 3) {
      setError('Select at least 3 segments to submit your route.');
      return;
    }

    await submitCurrentRoute();
  }

  async function handleTimeExpired() {
    await submitCurrentRoute();
  }


  if (loading) {
    return (
      <>
        <Spinner animation="border" />
        <p>Loading game...</p>
      </>
    );
  }

  if (error && !network) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>



      {phase === 'setup' && (
        <div className="game-page-shell">
          <div className="page-container">
            <div className="page-header setup-header">
              <div>
                <h2>Study the Map</h2>
                <p>Memorize the network before the race begins</p>
              </div>

              <div className="coins-pill">
                🪙 20 starting coins
              </div>
            </div>

            <NetworkMap
              network={network}
              showLines
              onStartPlanning={startPlanning}
            />
          </div>
        </div>
      )}

      {phase === 'planning' && (
        <div className="planning-page">
          <div className="page-container">
            <div className="page-header phase-header">
              <div>
                <h2>Your Mission :</h2>

                <p className="mission-inline">
                  <span className="start">{game.startStationName}</span>
                  <span>→</span>
                  <span className="end">{game.destinationStationName}</span>
                </p>
              </div>

              <div className="timer-card">
                <Timer
                  key={timerKey}
                  initialSeconds={90}
                  stopped={submitting || submitted}
                  onTimeExpired={handleTimeExpired}
                />
              </div>
            </div>

            <div className="planning-layout">
              <div className="planning-main-column">
                <div className="route-preview route-preview-outside">
                  <div className="route-preview-header">
                    <h3>Your Route</h3>
                    <span>at least 3 segments</span>
                  </div>

                  <p>
                    {selectedSegments.length === 0 ? (
                      'No segment selected yet.'
                    ) : (
                      selectedSegments.map((id, index) => {
                        const segment = network.segments.find((item) => item.id === id);

                        return (
                          <span key={id}>
                            {index > 0 && <span className="route-arrow"> → </span>}
                            {segment.station1Name} ↔ {segment.station2Name}
                          </span>
                        );
                      })
                    )}
                  </p>
                </div>

                <div className="planning-map-card">
                  <NetworkMap
                    network={network}
                    showLines={false}
                    selectedSegments={selectedSegments}
                    startStationName={game.startStationName}
                    destinationStationName={game.destinationStationName}
                  />
                </div>
              </div>

              <aside className="planning-side-panel">
                <div className="planning-side-panel-header">
                  <h3>SEGMENTS</h3>

                  <button
                    type="button"
                    className="clear-all-button"
                    onClick={clearRoute}
                    disabled={selectedSegments.length === 0 || submitting || submitted}
                  >
                    Clear
                  </button>
                </div>

                <div className="planning-segment-list">
                  {network.segments.map((segment) => (
                    <button
                      key={segment.id}
                      type="button"
                      className={
                        selectedSegments.includes(segment.id)
                          ? 'planning-segment selected'
                          : 'planning-segment'
                      }
                      onClick={() => toggleSegment(segment.id)}
                      disabled={submitting || submitted}
                    >
                      <span>
                        {segment.station1Name} ↔ {segment.station2Name}
                      </span>

                      <strong>
                        {selectedSegments.includes(segment.id) ? 'Remove' : 'Add'}
                      </strong>
                    </button>
                  ))}
                </div>

                {error && <div className="route-error">{error}</div>}

                <button
                  className="submit-route-button"
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || submitted}
                >
                  {submitting ? 'Submitting...' : 'Submit Route'}
                </button>
              </aside>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default GamePage;