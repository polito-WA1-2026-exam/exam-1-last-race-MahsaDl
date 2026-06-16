import { useEffect, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';

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

  const podiumOrder = [
    topThree[1], // #2
    topThree[0], // #1
    topThree[2], // #3
  ].filter(Boolean);


  return (
    <div className="ranking-page">
      <div className="page-container">
        <div className="ranking-header">
          <div>
            <h1>🏆 Leaderboard</h1>
            <p>Best scores from all players</p>
          </div>
        </div>

        {ranking.length === 0 ? (
          <Alert variant="info">No completed games yet.</Alert>
        ) : (
          <>
            <section className="podium">
              {podiumOrder.map((row) => {
                const realRank = ranking.findIndex((player) => player.username === row.username) + 1;

                return (
                  <article
                    className={`podium-card podium-${realRank}`}
                    key={row.username}
                  >
                    <div className="podium-rank">
                      #{realRank}
                      {realRank === 1 && <span>👑</span>}
                    </div>

                    {row.username === user.username && (
                      <span className="you-badge">YOU</span>
                    )}

                    <div className="podium-avatar">
                      {row.username.slice(0, 2).toUpperCase()}
                    </div>

                    <h2>{row.username}</h2>
                    <strong>{row.bestScore}</strong>
                    <small>coins</small>
                  </article>
                );
              })}
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