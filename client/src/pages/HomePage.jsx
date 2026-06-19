import { Link } from 'react-router';
import { Button } from 'react-bootstrap';

import useAuth from '../hooks/useAuth.js';

function HomePage() {
  const { loggedIn, user } = useAuth();
  return (
    <div className="home-landing">
      <div className="page-container">
        <div className="page-header home-header">
          <h1>
            {loggedIn ? `Welcome back, ${user.username}!` : 'Welcome to Last Race!'}
          </h1>

          <p>
            {loggedIn ? 'Ready for your next race?' : 'Login to start your first race.'}
          </p>
        </div>

        <div className="home-layout">
          <section className="home-panel home-main-card">
            <div className="home-train">
              <span></span>
              <span></span>
              <span></span>
            </div>
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

            {loggedIn ? (
              <Button as={Link} to="/game" className="home-main-button">
                Start Game
              </Button>
            ) : (
              <Button as={Link} to="/login" className="home-main-button">
                Login to Play
              </Button>
            )}
          </section>

          <aside className="home-side-card">
            <div className="home-how-to-play">
              <h2>HOW TO PLAY</h2>

              <div className="home-how-cards">
                <div>
                  <strong>🗺 Study Map</strong>
                  <p>Memorize stations and line connections.</p>
                </div>

                <div>
                  <strong>🧠 Plan Route</strong>
                  <p>Select segments in the right order.</p>
                </div>

                <div>
                  <strong>🏁 Beat The Clock</strong>
                  <p>Submit before the timer runs out.</p>
                </div>
              </div>
            </div>

            <div className="home-quick-rules">
              <h2>RACE RULES</h2>

              <div>
                <strong>🪙 20</strong>
                <span>starting coins</span>
              </div>

              <div>
                <strong>⏱ 90s</strong>
                <span>planning time</span>
              </div>

              <div className="home-minimum-segments">
                <strong>3+</strong>
                <span>minimum segments</span>
              </div>
            </div>
          </aside>
        </div>

      </div>
    </div>
  );
}

export default HomePage;