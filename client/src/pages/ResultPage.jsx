import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Alert, Button, Card, ListGroup, Spinner } from 'react-bootstrap';

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

  return (
    <>
      <h1>Game Result</h1>

      <Card className="mb-3">
        <Card.Body>
          <Card.Title>
            {game.startStationName} → {game.destinationStationName}
          </Card.Title>

          <Card.Text>
            Final score: <strong>{game.score}</strong>
          </Card.Text>

          <Card.Text>
            Status:{' '}
            <strong>
              {game.completed ? 'Completed' : 'Not completed'}
            </strong>
          </Card.Text>

          <Card.Text>
            Route validity:{' '}
            <strong>
              {game.valid ? 'Valid route' : 'Invalid route'}
            </strong>
          </Card.Text>

          {!game.valid && game.failureReason && (
            <Alert variant="danger">
              Reason: {game.failureReason}
            </Alert>
          )}
        </Card.Body>
      </Card>

      <h2>Travelled segments</h2>

      {game.travelledSegments.length === 0 ? (
        <Alert variant="warning">
          No valid route was saved for this game.
        </Alert>
      ) : (
        <ListGroup className="mb-3">
          {game.travelledSegments.map((segment) => (
            <ListGroup.Item key={segment.sequenceNumber}>
              <strong>Step {segment.sequenceNumber}</strong>
              <br />

              {segment.station1Name} ↔ {segment.station2Name}
              <br />

              <span style={{ color: segment.lineColor }}>
                {segment.lineName}
              </span>
              <br />

              Event: {segment.eventDescription}
              <br />

              Coin effect:{' '}
              <strong>
                {segment.coinEffect > 0
                  ? `+${segment.coinEffect}`
                  : segment.coinEffect}
              </strong>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <Button as={Link} to="/game" className="me-2">
        Play again
      </Button>

      <Button as={Link} to="/ranking" variant="secondary">
        View ranking
      </Button>
    </>
  );
}

export default ResultPage;