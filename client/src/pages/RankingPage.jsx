import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Alert, Button, Spinner, Table } from 'react-bootstrap';

import API from '../api/API.js';

function RankingPage() {
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRanking() {
      try {
        const rankingData = await API.getRanking();
        setRanking(rankingData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadRanking();
  }, []);

  if (loading) {
    return (
      <>
        <Spinner animation="border" />
        <p>Loading ranking...</p>
      </>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <h1>Ranking</h1>

      {ranking.length === 0 ? (
        <Alert variant="info">
          No completed games yet.
        </Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Position</th>
              <th>User</th>
              <th>Best score</th>
            </tr>
          </thead>

          <tbody>
            {ranking.map((row, index) => (
              <tr key={row.username}>
                <td>{index + 1}</td>
                <td>{row.username}</td>
                <td>{row.bestScore}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Button as={Link} to="/game" className="me-2">
        Play
      </Button>

      <Button as={Link} to="/" variant="secondary">
        Home
      </Button>
    </>
  );
}

export default RankingPage;