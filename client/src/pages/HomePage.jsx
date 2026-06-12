import { Link } from 'react-router';
import { Button } from 'react-bootstrap';

import useAuth from '../hooks/useAuth.js';

function HomePage() {
  const { loggedIn, user, logout } = useAuth();

  return (
    <div className="home-landing">
      <div className="home-bg-lines"></div>

      <main className="home-panel">
        <h1>Last Race</h1>

        <p className="home-subtitle">
          Build the fastest route before the clock runs out.
        </p>

<div className="mini-map">
  <span className="map-label start-label">START</span>
  <span className="map-label destination-label">DESTINATION</span>

<div className="route-line red-line"></div>

<div className="route-line blue-horz"></div>
<div className="route-line blue-vert"></div>


<div className="route-line green-top"></div>
<div className="route-line green-down"></div>
<div className="route-line green-diag"></div>

<div className="route-line yellow-vert"></div>
<div className="route-line yellow-horz"></div>

  <span className="map-station p1"></span>
  <span className="map-station p2 hot"></span>
  <span className="map-station p3"></span>
  <span className="map-station p4 hot"></span>
  <span className="map-station p5"></span>
  <span className="map-station p6"></span>
  <span className="map-station p7"></span>
  <span className="map-station p8"></span>
  <span className="map-station p9"></span>
  <span className="map-station p10"></span>
</div>

        <section className="home-steps">
          <div>
            <span>1</span>
            <strong>Setup</strong>
            <small>study the network</small>
          </div>

          <div>
            <span>2</span>
            <strong>Planning</strong>
            <small>90 seconds</small>
          </div>

          <div>
            <span>3</span>
            <strong>Result</strong>
            <small>events + ranking</small>
          </div>
        </section>

        {loggedIn ? (
          <>
            <p className="home-user">
              Signed in as <strong>{user.username}</strong>
            </p>

            <Button as={Link} to="/game" className="home-main-button">
              Start Game
            </Button>

            <Button variant="link" onClick={logout} className="home-link-button">
              Logout
            </Button>
          </>
        ) : (
          <Button as={Link} to="/login" className="home-main-button">
            Login to Play
          </Button>
        )}
      </main>
    </div>
  );
}

export default HomePage;