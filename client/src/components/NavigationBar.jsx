import { Link, NavLink, useNavigate } from 'react-router';
import { Container, Nav, Navbar } from 'react-bootstrap';

import useAuth from '../hooks/useAuth.js';

function NavigationBar() {
  const { user, loggedIn, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogoutClick() {
    const shouldLogout = window.confirm('Do you want to logout?');

    if (!shouldLogout) {
      return;
    }

    await logout();
    navigate('/login');
  }

  const initials = user?.username?.slice(0, 2).toUpperCase() || '';

  return (
    <Navbar variant="dark" expand="lg" className="app-navbar">
      <Container fluid className="app-navbar-container">
        <Navbar.Brand as={Link} to="/" className="app-navbar-brand">
          LAST RACE
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="app-navbar-links">
            <Nav.Link as={NavLink} to="/">
              Home
            </Nav.Link>

            {loggedIn && (
              <>
                <Nav.Link as={NavLink} to="/game">
                  Game
                </Nav.Link>

                <Nav.Link as={NavLink} to="/ranking">
                  Ranking
                </Nav.Link>
              </>
            )}
          </Nav>

          {loggedIn && (
            <button
              type="button"
              className="user-avatar-button"
              onClick={handleLogoutClick}
              title={`Signed in as ${user.username}`}
            >
              {initials}
            </button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;