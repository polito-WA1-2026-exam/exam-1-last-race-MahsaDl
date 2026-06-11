import { useEffect, useState } from 'react';
import { Alert, Button, Col, ListGroup, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import NetworkMap from '../components/NetworkMap.jsx';

import API from '../api/API.js';
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
  const [timeExpired, setTimeExpired] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

useEffect(() => {
  async function initializeGame() {
    setLoading(true);
    setError('');
    setSelectedSegments([]);
    setTimeExpired(false);

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


async function startNewGame() {
  setLoading(true);
  setError('');
  setSelectedSegments([]);
  setTimeExpired(false);
  setTimerKey((key) => key + 1);

  try {
    const gameData = await API.startGame();
    setGame(gameData);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

  function toggleSegment(segmentId) {
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

  function handleTimeExpired() {
    setTimeExpired(true);
    setError('Time expired. You cannot submit this route anymore.');
  }

  async function handleSubmit() {
    if (!game) {
      return;
    }

    if (timeExpired) {
      setError('Time expired. Start a new game.');
      return;
    }

    if (selectedSegments.length === 0) {
      setError('Select at least one segment.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await API.submitGameRoute(game.id, selectedSegments);
      navigate(`/result/${game.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Game</h1>

<Button
  variant="outline-primary"
  onClick={startNewGame}
  disabled={submitting}
>
  Start new game
</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {game && (
        <Alert variant="info">
          Start from <strong>{game.startStationName}</strong> and reach{' '}
          <strong>{game.destinationStationName}</strong>.
        </Alert>
      )}

      <Timer
        key={timerKey}
        initialSeconds={60}
        stopped={submitting || timeExpired}
        onTimeExpired={handleTimeExpired}
      />

      {network && <NetworkMap network={network} />}

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

        <Col md={5}>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Your route</h2>

            <Button
              variant="outline-secondary"
              size="sm"
              onClick={clearRoute}
              disabled={selectedSegments.length === 0 || submitting}
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
                    <br />
                    <small style={{ color: segment.lineColor }}>
                      {segment.lineName}
                    </small>
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
            disabled={submitting || timeExpired}
          >
            {submitting ? 'Submitting...' : 'Submit route'}
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default GamePage;