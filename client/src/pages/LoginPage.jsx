import { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router';

import useAuth from '../hooks/useAuth.js';

function LoginPage() {
  const { login, loggedIn, checkingAuth } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('alice');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);


  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setError('');

    try {
      await login(username, password);
      navigate('/game');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (checkingAuth) {
    return <p>Checking authentication...</p>;
  }

  if (loggedIn) {
    return <Navigate to="/game" replace />;
  }

  return (
    <>
      <h1>Login</h1>

      <Card>
        <Card.Body>
          <Card.Title>Access Last Race</Card.Title>
          <Card.Text>
            Use one of the provided test accounts to start a game.
          </Card.Text>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={username}
                onChange={(event) => {
  setUsername(event.target.value);
  setError('');
}}
                disabled={submitting}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(event) => {
  setPassword(event.target.value);
  setError('');
}
}
                disabled={submitting}
              />
            </Form.Group>

            <Button type="submit" disabled={submitting}>
              {submitting ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

export default LoginPage;