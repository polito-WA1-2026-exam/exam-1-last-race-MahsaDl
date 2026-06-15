import { Routes, Route, Navigate, useLocation } from 'react-router';
import { Container } from 'react-bootstrap';

import { AuthProvider } from './contexts/AuthContext.jsx';
import useAuth from './hooks/useAuth.js';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import NavigationBar from './components/NavigationBar.jsx';

import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import GamePage from './pages/GamePage.jsx';
import ResultPage from './pages/ResultPage.jsx';
import RankingPage from './pages/RankingPage.jsx';

import './App.css';

function AppContent() {
  const location = useLocation();
  const { loggedIn } = useAuth();

  const hideNavbar =
    (location.pathname === '/' && !loggedIn) ||
    location.pathname === '/login';

  return (
    <>
      {!hideNavbar && <NavigationBar />}

      <Container fluid className="p-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <GamePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/result/:gameId"
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ranking"
            element={
              <ProtectedRoute>
                <RankingPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </>
  );
}

function App() {
  return (
    <div className="app-background">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  );
}

export default App;