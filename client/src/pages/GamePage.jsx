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

        setNetwork(networkData);
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
    if (selectedSegments.length === 0) {
      setError('Select at least one segment.');
      return;
    }

    await submitCurrentRoute();
  }

  async function handleTimeExpired() {
    await submitCurrentRoute();
  }

  function getSegmentById(segmentId) {
    return network.segments.find((segment) => segment.id === segmentId);
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

      {error && <Alert variant="danger">{error}</Alert>}


      {phase === 'setup' && (
        <>
          <div className="setup-header">
            <div>
              <h2>SETUP PHASE</h2>
              <p>Study the network map before you begin</p>
            </div>

            <div className="coins-pill">
              🪙 Starting coins: <strong>20</strong>
            </div>
          </div>

          <NetworkMap
            network={network}
            showLines
            onStartPlanning={startPlanning}
          />
        </>
      )}

      {phase === 'planning' && (
        <div className="planning-page">
          <div className="planning-topbar">
            <div className="timer-card">
              <Timer
                key={timerKey}
                initialSeconds={90}
                stopped={submitting || submitted}
                onTimeExpired={handleTimeExpired}
              />
            </div>

            <div className="planning-mission compact">
              <span className="mission-station start">{game.startStationName}</span>
              <span className="mission-arrow">→</span>
              <span className="mission-station end">{game.destinationStationName}</span>
              <span className="mission-min">at least 3 segments</span>
            </div>

            <div className="coins-card">
              🪙 20
            </div>
          </div>

          <div className="planning-map-card">
            <h3>STATIONS</h3>

            <NetworkMap
              network={network}
              showLines={false}
            />
          </div>

          <div className="planning-bottom">
            <div className="planning-segments-card">
              <h3>AVAILABLE SEGMENTS</h3>

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
            </div>

            <div className="route-builder">
              <div className="route-header">
                <div>
                  <h3>Your Route</h3>
                  <p>
                    Selected segments: <strong>{selectedSegments.length}</strong>
                  </p>
                </div>

                <button
                  className="clear-route-button"
                  type="button"
                  onClick={clearRoute}
                  disabled={
                    selectedSegments.length === 0 ||
                    submitting ||
                    submitted
                  }
                >
                  Clear
                </button>
              </div>

              {selectedSegments.length === 0 ? (
                <p className="empty-route">No segment selected yet.</p>
              ) : (
                <ol className="route-list">
                  {selectedSegments.map((id) => {
                    const segment = getSegmentById(id);

                    return (
                      <li key={id}>
                        {segment.station1Name} ↔ {segment.station2Name}
                      </li>
                    );
                  })}
                </ol>
              )}

              <button
                className="submit-route-button"
                type="button"
                onClick={handleSubmit}
                disabled={submitting || submitted}
              >
                {submitting ? 'Submitting...' : 'Submit Route'}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default GamePage;