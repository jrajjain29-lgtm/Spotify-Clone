import { NavLink, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { PlayerBar, PlayerProvider } from './components/Player';
import Auth from './pages/Auth';
import Home from './pages/Home';
import AlbumPage from './pages/AlbumPage';
import Studio from './pages/Studio';

// Wraps every logged-in page: sidebar on the left, page content, player at the bottom.
function Layout() {
  const { user, logout } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="shell">
      <aside>
        <div className="brand">Spotify<br />Project</div>
        <nav>
          <NavLink to="/" end>Browse</NavLink>
          {user.role === 'artist' && <NavLink to="/studio">Studio</NavLink>}
        </nav>
        <div className="me">
          <span>{user.name}</span>
          <button className="link" onClick={logout}>Log out</button>
        </div>
      </aside>
      <main className="content"><Outlet /></main>
      <PlayerBar />
    </div>
  );
}

// Only artists may open /studio (the backend enforces this too; this is just for the UI).
function ArtistOnly({ children }) {
  const { user } = useAuth();
  return user.role === 'artist' ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/albums/:id" element={<AlbumPage />} />
            <Route path="/studio" element={<ArtistOnly><Studio /></ArtistOnly>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PlayerProvider>
    </AuthProvider>
  );
}
