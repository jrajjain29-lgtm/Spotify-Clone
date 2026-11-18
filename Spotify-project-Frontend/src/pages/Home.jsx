import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorText } from '../api';
import Cover from '../components/Cover';
import { usePlayer } from '../components/Player';

export default function Home() {
  const [musics, setMusics] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { play, current, playing } = usePlayer();

  useEffect(() => {
    Promise.all([api.get('/music'), api.get('/music/albums')])
      .then(([m, a]) => {
        setMusics(m.data.musics);
        setAlbums(a.data.albums);
      })
      .catch((err) => setError(errorText(err)))
      .finally(() => setLoading(false));
  }, []);

  // Search runs in the browser on data we already loaded.
  // An empty query matches everything, so the full lists show by default.
  const q = query.trim().toLowerCase();
  const matches = (...fields) => fields.some((f) => f?.toLowerCase().includes(q));
  const shownSongs = musics.filter((m) => matches(m.title, m.artist?.name));
  const shownAlbums = albums.filter((a) => matches(a.title, a.artist?.name));

  if (loading) return <p className="muted">Loading the library…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <div className="search">
        <input
          type="search"
          placeholder="Search songs, albums or artists"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search"
        />
      </div>

      <h1>Albums</h1>
      {albums.length === 0 ? (
        <p className="muted">No albums yet. Artists haven't published any.</p>
      ) : shownAlbums.length === 0 ? (
        <p className="muted">No albums match "{query}".</p>
      ) : (
        <div className="album-row">
          {shownAlbums.map((a) => (
            <Link to={`/albums/${a._id}`} key={a._id} className="album">
              <Cover title={a.title} size={168} />
              <strong>{a.title}</strong>
              <small>{a.artist?.name}</small>
            </Link>
          ))}
        </div>
      )}

      <h1>Songs</h1>
      {musics.length === 0 ? (
        <p className="muted">Nothing uploaded yet.</p>
      ) : shownSongs.length === 0 ? (
        <p className="muted">No songs match "{query}".</p>
      ) : (
        <ul className="tracks">
          {shownSongs.map((m) => (
            <li key={m._id} className={current?._id === m._id ? 'on' : ''}>
              <Cover title={m.title} size={44} />
              <div>
                <strong>{m.title}</strong>
                <small>{m.artist?.name || 'Unknown artist'}</small>
              </div>
              <button onClick={() => play(m, shownSongs)}>
                {current?._id === m._id && playing ? 'Pause' : 'Play'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
