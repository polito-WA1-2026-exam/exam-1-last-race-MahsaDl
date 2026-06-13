import { useEffect, useState } from 'react';
import { Alert, Button, Col, ListGroup, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router';

import API from '../api/API.js';
import NetworkMap from '../components/NetworkMap.jsx';
import SegmentCard from '../components/SegmentCard.jsx';
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
        <>
          <Alert variant="warning">
            Planning phase: select the ordered sequence of segments. The map now
            shows only stations, while the segment list is used to build the
            route.
          </Alert>

          {game && (
            <Alert variant="info">
              Start from <strong>{game.startStationName}</strong> and reach{' '}
              <strong>{game.destinationStationName}</strong>.
            </Alert>
          )}

          <Timer
            key={timerKey}
            initialSeconds={90}
            stopped={submitting || submitted}
            onTimeExpired={handleTimeExpired}
          />

          <NetworkMap network={network} showLines={false} />

          <Row>
            <Col md={7}>
              <h2>Available segments</h2>

              {network.segments.map((segment) => (
                <SegmentCard
                  key={segment.id}
                  segment={segment}
                  selected={selectedSegments.includes(segment.id)}
                  onToggle={toggleSegment}
                />
              ))}
            </Col>

            <Col
              md={5}
              style={{
                position: 'sticky',
                top: '90px',
                alignSelf: 'flex-start'
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h2>Your route</h2>

                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={clearRoute}
                  disabled={
                    selectedSegments.length === 0 ||
                    submitting ||
                    submitted
                  }
                >
                  Clear route
                </Button>
              </div>

              {selectedSegments.length === 0 ? (
                <p>No segment selected yet.</p>
              ) : (
                <ListGroup as="ol" numbered>
                  {selectedSegments.map((id) => {
                    const segment = getSegmentById(id);

                    return (
                      <ListGroup.Item as="li" key={id}>
                        <strong>
                          {segment.station1Name} ↔ {segment.station2Name}
                        </strong>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}

              <p className="mt-3">
                Selected segments: <strong>{selectedSegments.length}</strong>
              </p>

              <Button
                className="mt-2"
                onClick={handleSubmit}
                disabled={submitting || submitted}
              >
                {submitting ? 'Submitting...' : 'Submit route'}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default GamePage;