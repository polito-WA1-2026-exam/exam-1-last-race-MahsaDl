import { Link, NavLink, useNavigate } from 'react-router';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';

import useAuth from '../hooks/useAuth.js';

function NavigationBar() {
  const { user, loggedIn, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Last Race
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
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

          <Nav>
            {loggedIn ? (
              <>
                <Navbar.Text className="me-3">
                  Signed in as <strong>{user.username}</strong>
                </Navbar.Text>

                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button as={Link} to="/login" variant="outline-light" size="sm">
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;