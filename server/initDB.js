import db from './db.js';
import crypto from 'crypto';

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 32).toString('hex');
}

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  db.run(`DROP TABLE IF EXISTS game_segments`);
  db.run(`DROP TABLE IF EXISTS games`);
  db.run(`DROP TABLE IF EXISTS events`);
  db.run(`DROP TABLE IF EXISTS segments`);
  db.run(`DROP TABLE IF EXISTS stations`);
  db.run(`DROP TABLE IF EXISTS lines`);
  db.run(`DROP TABLE IF EXISTS users`);

  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE stations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  db.run(`
    CREATE TABLE lines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE segments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      station1_id INTEGER NOT NULL,
      station2_id INTEGER NOT NULL,
      line_id INTEGER NOT NULL,
      FOREIGN KEY (station1_id) REFERENCES stations(id),
      FOREIGN KEY (station2_id) REFERENCES stations(id),
      FOREIGN KEY (line_id) REFERENCES lines(id),
      UNIQUE(station1_id, station2_id, line_id)
    )
  `);

  db.run(`
    CREATE TABLE events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      coin_effect INTEGER NOT NULL CHECK(coin_effect >= -4 AND coin_effect <= 4)
    )
  `);

  db.run(`
CREATE TABLE games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  start_station_id INTEGER NOT NULL,
  destination_station_id INTEGER NOT NULL,
  score INTEGER,
  completed INTEGER NOT NULL DEFAULT 0,
  valid INTEGER,
  failure_reason TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (start_station_id) REFERENCES stations(id),
  FOREIGN KEY (destination_station_id) REFERENCES stations(id)
)
  `);

  db.run(`
    CREATE TABLE game_segments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER NOT NULL,
      segment_id INTEGER NOT NULL,
      sequence_number INTEGER NOT NULL,
      event_id INTEGER,
      FOREIGN KEY (game_id) REFERENCES games(id),
      FOREIGN KEY (segment_id) REFERENCES segments(id),
      FOREIGN KEY (event_id) REFERENCES events(id),
      UNIQUE(game_id, sequence_number)
    )
  `);

  const users = [
    ['alice', 'password'],
    ['bob', 'password'],
    ['carol', 'password']
  ];

  for (const [username, password] of users) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPassword(password, salt);
    db.run(
      `INSERT INTO users(username, password_hash, salt) VALUES (?, ?, ?)`,
      [username, hash, salt]
    );
  }

  const stations = [
    'Centrale',
    'Porta Valeria',
    'Crocevia del Falco',
    'Piazza delle Lanterne',
    'Fontana Oscura',
    'Borgo Sereno',
    'Viale dei Mosaici',
    'Torre Cinerea',
    "Campo dell'Eco",
    'Giardino Nord',
    'Mercato Vecchio',
    'Porto Sud'
  ];

  for (const s of stations) {
    db.run(`INSERT INTO stations(name) VALUES (?)`, [s]);
  }

  const lines = [
    ['Red Line', 'red'],
    ['Blue Line', 'blue'],
    ['Green Line', 'green'],
    ['Yellow Line', 'gold']
  ];

  for (const line of lines) {
    db.run(`INSERT INTO lines(name, color) VALUES (?, ?)`, line);
  }

  const events = [
    ['Quiet journey', 0],
    ['Wrong platform', -2],
    ['Kind passenger', 1],
    ['Ticket inspection', -1],
    ['Lucky shortcut', 3],
    ['Crowded carriage', -3],
    ['Found coin', 2],
    ['Signal delay', -4]
  ];

  for (const e of events) {
    db.run(`INSERT INTO events(description, coin_effect) VALUES (?, ?)`, e);
  }

const segments = [
  // Red Line: Centrale - Porta Valeria - Crocevia del Falco - Piazza delle Lanterne
  [1, 2, 1],
  [2, 3, 1],
  [3, 4, 1],

  // Blue Line: Centrale - Fontana Oscura - Borgo Sereno - Viale dei Mosaici
  [1, 5, 2],
  [5, 6, 2],
  [6, 7, 2],

  // Green Line: Porta Valeria - Mercato Vecchio - Torre Cinerea - Campo dell'Eco
  [2, 11, 3],
  [11, 8, 3],
  [8, 9, 3],

  // Yellow Line: Piazza delle Lanterne - Porto Sud - Torre Cinerea - Giardino Nord
  [4, 12, 4],
  [12, 8, 4],
  [8, 10, 4]
];

  for (const seg of segments) {
    db.run(
      `INSERT INTO segments(station1_id, station2_id, line_id) VALUES (?, ?, ?)`,
      seg
    );
  }

const completedGames = [
  [1,1,4,23,1,1,null,new Date().toISOString()],
  [1,2,7,19,1,1,null,new Date().toISOString()],

  [2,1,7,18,1,1,null,new Date().toISOString()],
  [2,5,9,21,1,1,null,new Date().toISOString()]
];

for (const game of completedGames) {
  db.run(
    `
    INSERT INTO games(
      user_id,
      start_station_id,
      destination_station_id,
      score,
      completed,
      valid,
      failure_reason,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    game
  );
}

  console.log('Database initialized.');
});