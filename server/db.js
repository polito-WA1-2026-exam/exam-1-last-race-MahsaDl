import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('last-race.sqlite', (err) => {
  if (err) {
    console.error('Database opening error:', err);
  }
});

export default db;