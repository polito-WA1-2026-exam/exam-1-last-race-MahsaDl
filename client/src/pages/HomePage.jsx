import { Link } from 'react-router';
import { Button } from 'react-bootstrap';

import useAuth from '../hooks/useAuth.js';

function HomePage() {
  const { loggedIn, user, logout } = useAuth();

  return (
    <div className="home-landing">

      <main className="home-panel">
        <h1>Last Race</h1>

        <p className="home-subtitle">
          Navigate the Underground • Beat the Clock • Collect Coins
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

        <div className="home-how-to-play">
          <h2>HOW TO PLAY</h2>

          <div className="home-how-steps">
            <div>
              <span>1</span>
              <p>Study the map</p>
            </div>

            <div>
              <span>2</span>
              <p>Plan your route</p>
            </div>

            <div>
              <span>3</span>
              <p>Race to win!</p>
            </div>
          </div>
        </div>

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