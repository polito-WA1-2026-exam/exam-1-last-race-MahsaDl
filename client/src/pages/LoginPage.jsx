import { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
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
      navigate('/');
    } catch {
      setError('Invalid username or password.');
    } finally {
      setSubmitting(false);
    }
  }

  if (checkingAuth) {
    return <p>Checking authentication...</p>;
  }

  if (loggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-page">

      <main className="login-card">

        <h1>Last Race</h1>
        <p className="login-subtitle">Welcome back, traveler</p>

        <div className="login-train">
          <span></span>
          <span></span>
          <span></span>
        </div>

        {error && <Alert variant="danger" className="login-error">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>USERNAME</Form.Label>
            <Form.Control
              className="login-input"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError('');
              }}
              placeholder="Enter your username"
              autoFocus
              disabled={submitting}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>PASSWORD</Form.Label>
            <Form.Control
              className="login-input"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError('');
              }
              }
              placeholder="Enter your password"
              disabled={submitting}
            />
          </Form.Group>

          <Button type="submit"
            className="login-submit-button"
            disabled={submitting}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form>
      </main>
    </div>
  );
}

export default LoginPage;