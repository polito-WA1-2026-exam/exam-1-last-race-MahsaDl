import { Link } from 'react-router';
import { Button, Card, Col, Row } from 'react-bootstrap';

import useAuth from '../hooks/useAuth.js';

function HomePage() {
  const { loggedIn, user, logout } = useAuth();

  return (
    <>
      <h1>Last Race</h1>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Game instructions</Card.Title>

          <Card.Text>
            Last Race is a route-planning game. The player receives a random
            start station and a random destination station, then selects a
            sequence of network segments to reach the destination before time
            expires.
          </Card.Text>

          <Card.Text>
            The server validates the selected route, applies random events to
            the travelled segments, computes the final score, and updates the
            ranking.
          </Card.Text>
        </Card.Body>
      </Card>

      <Row>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Authentication</Card.Title>

              {loggedIn ? (
                <>
                  <Card.Text>
                    Logged in as <strong>{user.username}</strong>.
                  </Card.Text>

                  <Button as={Link} to="/game" className="me-2">
                    Start game
                  </Button>

                  <Button
                    variant="outline-danger"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Card.Text>
                    Anonymous users can read the instructions. Login is required
                    to play and access the ranking.
                  </Card.Text>

                  <Button as={Link} to="/login">
                    Login
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Ranking</Card.Title>

              <Card.Text>
                Registered users can view the best score achieved by each
                player.
              </Card.Text>

              {loggedIn && (
                <Button as={Link} to="/ranking" variant="secondary">
                  View ranking
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default HomePage;