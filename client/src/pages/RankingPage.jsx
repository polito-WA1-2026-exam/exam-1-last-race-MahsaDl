import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Alert, Button, Spinner } from 'react-bootstrap';

import API from '../api/API.js';
import useAuth from '../hooks/useAuth.js';

function RankingPage() {
  const { user } = useAuth();
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
      <div className="ranking-page">
        <Spinner animation="border" />
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const topThree = ranking.slice(0, 3);

  return (
    <div className="ranking-page">
      <div className="page-container">
        <header className="ranking-header">
          <div>
            <h1>🏆 Leaderboard</h1>
            <p>Best scores from all players</p>
          </div>

          <Button as={Link} to="/game" className="ranking-play-button">
            Play
          </Button>
        </header>

        {ranking.length === 0 ? (
          <Alert variant="info">No completed games yet.</Alert>
        ) : (
          <>
            <section className="podium">
              {topThree.map((row, index) => (
                <article
                  className={`podium-card podium-${index + 1}`}
                  key={row.username}
                >
                  <div className="podium-rank">
                    #{index + 1}
                    {index === 0 && <span>👑</span>}
                  </div>

                  {row.username === user.username && (
                    <span className="you-badge">YOU</span>
                  )}

                  <h2>{row.username}</h2>
                  <strong>{row.bestScore}</strong>
                  <small>coins</small>
                </article>
              ))}
            </section>

            <section className="ranking-table-card">
              <div className="ranking-table-head">
                <span>Rank</span>
                <span>Player</span>
                <span>Best score</span>
              </div>

              {ranking.map((row, index) => (
                <div className="ranking-row" key={row.username}>
                  <span>{index + 1}</span>

                  <span>
                    {row.username}

                    {row.username === user.username && (
                      <span className="you-inline">YOU</span>
                    )}
                  </span>

                  <strong>{row.bestScore}</strong>
                </div>
              ))}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default RankingPage;