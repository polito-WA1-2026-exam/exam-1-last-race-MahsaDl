import { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { Navigate, useNavigate, Link } from 'react-router';
import { FiChevronLeft } from 'react-icons/fi';

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
    <div className="login-page">
      <div className="login-bg-lines"></div>

      <main className="login-card">

<Button
  as={Link}
  to="/"
  className="login-back-button"
>
  <FiChevronLeft size={22} />
</Button>

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