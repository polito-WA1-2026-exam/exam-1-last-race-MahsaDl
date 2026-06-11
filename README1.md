# Last Race

Last Race is a web application developed for the Web Applications I course.

The application implements a route-planning game on an underground network. Registered users receive a random starting station and a random destination, then select a sequence of segments to reach the destination before time expires.

The server validates the selected route, applies random events, computes the final score, and updates the ranking.

## React Client Application Routes

| Route | Description |
|---|---|
| `/` | Home page with game instructions |
| `/login` | Login page |
| `/game` | Protected game page |
| `/result/:gameId` | Protected game result page |
| `/ranking` | Protected ranking page |

## API Server

### Authentication

#### POST `/api/sessions`

Login a user.

Request body:

```json
{
  "username": "alice",
  "password": "password"
}

edamash dar chatGpt