import db from './db.js';
import crypto from 'crypto';
import dayjs from 'dayjs';

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 32).toString('hex');
}

export async function getUser(username, password) {
  const user = await dbGet(
    `SELECT * FROM users WHERE username = ?`,
    [username]
  );

  if (!user) {
    return false;
  }

  const hash = hashPassword(password, user.salt);

  if (hash !== user.password_hash) {
    return false;
  }

  return {
    id: user.id,
    username: user.username
  };
}

export async function getUserById(id) {
  const user = await dbGet(
    `SELECT id, username FROM users WHERE id = ?`,
    [id]
  );

  return user || false;
}

export async function getNetwork() {
  const stations = await dbAll(
    `SELECT id, name FROM stations ORDER BY name`
  );

  const lines = await dbAll(
    `SELECT id, name, color FROM lines ORDER BY id`
  );

  const segments = await dbAll(`
    SELECT 
      s.id,
      s.station1_id AS station1Id,
      st1.name AS station1Name,
      s.station2_id AS station2Id,
      st2.name AS station2Name,
      s.line_id AS lineId,
      l.name AS lineName,
      l.color AS lineColor
    FROM segments s
    JOIN stations st1 ON s.station1_id = st1.id
    JOIN stations st2 ON s.station2_id = st2.id
    JOIN lines l ON s.line_id = l.id
    ORDER BY s.id
  `);

  return {
    stations,
    lines,
    segments
  };
}

export async function createGame(userId) {
  const stations = await dbAll(`SELECT id FROM stations`);

  let start;
  let destination;
  let distance = 0;

  while (distance < 3) {
    start = stations[Math.floor(Math.random() * stations.length)].id;
    destination = stations[Math.floor(Math.random() * stations.length)].id;

    if (start !== destination) {
      distance = await shortestDistance(start, destination);
    }
  }

const result = await dbRun(
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
  VALUES (?, ?, ?, NULL, 0, NULL, NULL, ?)
  `,
  [userId, start, destination, dayjs().toISOString()]
);

  return getGame(result.lastID);
}

async function shortestDistance(startId, destinationId) {
  const segments = await dbAll(
    `SELECT station1_id, station2_id FROM segments`
  );

  const graph = new Map();

  for (const s of segments) {
    if (!graph.has(s.station1_id)) graph.set(s.station1_id, []);
    if (!graph.has(s.station2_id)) graph.set(s.station2_id, []);

    graph.get(s.station1_id).push(s.station2_id);
    graph.get(s.station2_id).push(s.station1_id);
  }

  const queue = [{ station: startId, dist: 0 }];
  const visited = new Set([startId]);

  while (queue.length > 0) {
    const current = queue.shift();

    if (current.station === destinationId) {
      return current.dist;
    }

    for (const next of graph.get(current.station) || []) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push({
          station: next,
          dist: current.dist + 1
        });
      }
    }
  }

  return Infinity;
}

export async function getGame(gameId) {
  const game = await dbGet(
    `
SELECT 
  g.id,
  g.user_id AS userId,
  g.start_station_id AS startStationId,
  ss.name AS startStationName,
  g.destination_station_id AS destinationStationId,
  ds.name AS destinationStationName,
  g.score,
  g.completed,
  g.valid,
  g.failure_reason AS failureReason,
  g.created_at AS createdAt
    FROM games g
    JOIN stations ss ON g.start_station_id = ss.id
    JOIN stations ds ON g.destination_station_id = ds.id
    WHERE g.id = ?
    `,
    [gameId]
  );

  if (!game) {
    return false;
  }

 const travelledSegments = await dbAll(
  `
  SELECT 
    gs.sequence_number AS sequenceNumber,
    gs.segment_id AS segmentId,

    s.station1_id AS station1Id,
    st1.name AS station1Name,
    s.station2_id AS station2Id,
    st2.name AS station2Name,

    l.name AS lineName,
    l.color AS lineColor,

    e.description AS eventDescription,
    e.coin_effect AS coinEffect
  FROM game_segments gs
  JOIN segments s ON gs.segment_id = s.id
  JOIN stations st1 ON s.station1_id = st1.id
  JOIN stations st2 ON s.station2_id = st2.id
  JOIN lines l ON s.line_id = l.id
  LEFT JOIN events e ON gs.event_id = e.id
  WHERE gs.game_id = ?
  ORDER BY gs.sequence_number
  `,
  [gameId]
);

  return {
    ...game,
    travelledSegments
  };
}

export async function submitRoute(gameId, userId, segmentIds) {
  const game = await getGame(gameId);

  if (!game || game.userId !== userId || game.completed) {
    return false;
  }

  const validation = await validateRoute(
    segmentIds,
    game.startStationId,
    game.destinationStationId
  );

  if (!validation.valid) {
await dbRun(
  `
  UPDATE games
  SET score = 0,
      completed = 1,
      valid = 0,
      failure_reason = ?
  WHERE id = ?
  `,
  [validation.reason, gameId]
);

    return {
      valid: false,
      score: 0,
      reason: validation.reason,
      events: []
    };
  }

  let score = 20;
  const events = [];

  for (let i = 0; i < segmentIds.length; i++) {
    const event = await getRandomEvent();
    score += event.coin_effect;

    await dbRun(
      `
      INSERT INTO game_segments(game_id, segment_id, sequence_number, event_id)
      VALUES (?, ?, ?, ?)
      `,
      [gameId, segmentIds[i], i + 1, event.id]
    );

    events.push({
      segmentId: segmentIds[i],
      description: event.description,
      coinEffect: event.coin_effect,
      scoreAfterEvent: score
    });
  }

  if (score < 0) {
    score = 0;
  }

await dbRun(
  `
  UPDATE games
  SET score = ?,
      completed = 1,
      valid = 1,
      failure_reason = NULL
  WHERE id = ?
  `,
  [score, gameId]
);

  return {
    valid: true,
    score,
    events
  };
}

async function validateRoute(segmentIds, startStationId, destinationStationId) {
  if (!Array.isArray(segmentIds) || segmentIds.length === 0) {
    return {
      valid: false,
      reason: 'The route is empty.'
    };
  }

  const usedSegments = new Set();

  const fullSegments = [];

  for (const id of segmentIds) {
    if (usedSegments.has(id)) {
      return {
        valid: false,
        reason: 'A segment was used more than once.'
      };
    }

    usedSegments.add(id);

    const segment = await dbGet(
      `
      SELECT id, station1_id AS station1Id, station2_id AS station2Id, line_id AS lineId
      FROM segments
      WHERE id = ?
      `,
      [id]
    );

    if (!segment) {
      return {
        valid: false,
        reason: 'One selected segment does not exist.'
      };
    }

    fullSegments.push(segment);
  }

  let currentStation = startStationId;
  let currentLine = null;

  for (const segment of fullSegments) {
    let nextStation;

    if (segment.station1Id === currentStation) {
      nextStation = segment.station2Id;
    } else if (segment.station2Id === currentStation) {
      nextStation = segment.station1Id;
    } else {
      return {
        valid: false,
        reason: 'The selected segments are not connected in sequence.'
      };
    }

    if (currentLine !== null && currentLine !== segment.lineId) {
      const isInterchange = await isInterchangeStation(currentStation);

      if (!isInterchange) {
        return {
          valid: false,
          reason: 'Line change occurred outside an interchange station.'
        };
      }
    }

    currentLine = segment.lineId;
    currentStation = nextStation;
  }

  if (currentStation !== destinationStationId) {
    return {
      valid: false,
      reason: 'The route does not end at the assigned destination.'
    };
  }

  return {
    valid: true
  };
}

async function isInterchangeStation(stationId) {
  const rows = await dbAll(
    `
    SELECT DISTINCT line_id
    FROM segments
    WHERE station1_id = ? OR station2_id = ?
    `,
    [stationId, stationId]
  );

  return rows.length > 1;
}

async function getRandomEvent() {
  const events = await dbAll(`SELECT * FROM events`);
  return events[Math.floor(Math.random() * events.length)];
}

export async function getRanking() {
  return dbAll(`
    SELECT 
      u.username,
      MAX(g.score) AS bestScore
    FROM games g
    JOIN users u ON g.user_id = u.id
    WHERE g.completed = 1
      AND g.valid = 1
    GROUP BY g.user_id
    ORDER BY bestScore DESC, u.username ASC
  `);
}