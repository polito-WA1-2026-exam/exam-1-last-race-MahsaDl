import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';

import {
  getUser,
  getUserById,
  getNetwork,
  createGame,
  getGame,
  submitRoute,
  getRanking
} from './dao.js';

const app = express();
const port = 3001;

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(session({
  secret: 'last-race-secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async function verify(username, password, done) {
  try {
    const user = await getUser(username, password);

    if (!user) {
      return done(null, false, { message: 'Invalid username or password' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    error: 'Not authenticated'
  });
}

// ---------- AUTH APIs ----------

app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
  res.status(201).json(req.user);
});

app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({
      error: 'Not authenticated'
    });
  }
});

app.delete('/api/sessions/current', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        error: 'Logout failed'
      });
    }

    res.status(204).end();
  });
});

// ---------- PUBLIC APIs ----------

app.get('/api/network', isLoggedIn, async (req, res) => {
  try {
    const network = await getNetwork();
    res.json(network);
  } catch (err) {
    res.status(500).json({
      error: 'Cannot retrieve network'
    });
  }
});

app.get('/api/ranking', isLoggedIn, async (req, res) => {
  try {
    const ranking = await getRanking();
    res.json(ranking);
  } catch (err) {
    res.status(500).json({
      error: 'Cannot retrieve ranking'
    });
  }
});

// ---------- GAME APIs ----------

app.post('/api/games', isLoggedIn, async (req, res) => {
  try {
    const game = await createGame(req.user.id);
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({
      error: 'Cannot create game'
    });
  }
});

app.get('/api/games/:gameId', isLoggedIn, async (req, res) => {
  try {
    const gameId = Number(req.params.gameId);

    if (!Number.isInteger(gameId)) {
      return res.status(400).json({
        error: 'Invalid game id'
      });
    }

    const game = await getGame(gameId);

    if (!game) {
      return res.status(404).json({
        error: 'Game not found'
      });
    }

    if (game.userId !== req.user.id) {
      return res.status(403).json({
        error: 'This game belongs to another user'
      });
    }

    res.json(game);
  } catch (err) {
    res.status(500).json({
      error: 'Cannot retrieve game'
    });
  }
});

app.post('/api/games/:gameId/submit', isLoggedIn, async (req, res) => {
  try {
    const gameId = Number(req.params.gameId);
    const { segments } = req.body;

    if (!Number.isInteger(gameId)) {
      return res.status(400).json({
        error: 'Invalid game id'
      });
    }

    if (!Array.isArray(segments) || !segments.every(Number.isInteger)) {
      return res.status(422).json({
        error: 'segments must be an array of integer ids'
      });
    }

    const result = await submitRoute(gameId, req.user.id, segments);

    if (!result) {
      return res.status(404).json({
        error: 'Game not found or already completed'
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: 'Cannot submit route'
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});