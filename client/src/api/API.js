const SERVER_URL = 'http://localhost:3001/api';

async function getJson(response) {
  if (response.status === 204) {
    return null;
  }

  let body;

  try {
    body = await response.json();
  } catch {
    body = {};
  }

  if (!response.ok) {
    throw new Error(
      body.error || `HTTP error ${response.status}`
    );
  }

  return body;
}

async function login(username, password) {
  const response = await fetch(`${SERVER_URL}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  });

  return getJson(response);
}

async function logout() {
  const response = await fetch(`${SERVER_URL}/sessions/current`, {
    method: 'DELETE',
    credentials: 'include'
  });

  return getJson(response);
}

async function getCurrentUser() {
  const response = await fetch(`${SERVER_URL}/sessions/current`, {
    credentials: 'include'
  });

  return getJson(response);
}

async function getNetwork() {
  const response = await fetch(`${SERVER_URL}/network`, {
    credentials: 'include'
  });

  return getJson(response);
}

async function startGame() {
  const response = await fetch(`${SERVER_URL}/games`, {
    method: 'POST',
    credentials: 'include'
  });

  return getJson(response);
}

async function getGame(gameId) {
  const response = await fetch(`${SERVER_URL}/games/${gameId}`, {
    credentials: 'include'
  });

  return getJson(response);
}

async function submitGameRoute(gameId, segments) {
  const response = await fetch(`${SERVER_URL}/games/${gameId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ segments })
  });

  return getJson(response);
}

async function getRanking() {
  const response = await fetch(`${SERVER_URL}/ranking`, {
    credentials: 'include'
  });

  return getJson(response);
}

const API = {
  login,
  logout,
  getCurrentUser,
  getNetwork,
  startGame,
  getGame,
  submitGameRoute,
  getRanking
};

export default API;