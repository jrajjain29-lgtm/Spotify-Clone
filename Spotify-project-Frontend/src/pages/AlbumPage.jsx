import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { errorText } from '../api';
import Cover from '../components/Cover';
import { usePlayer } from '../components/Player';

export default function AlbumPage() {
  const { id } = useParams(); // the :id part of the URL
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState('');
  const { play, current, playing } = usePlayer();

  useEffect(() => {
    api.get(`/music/albums/${id}`)
      .then((res) => setAlbum(res.data.album))
      .catch((err) => setError(errorText(err)));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!album) return <p className="muted">Loading album…</p>;

  return (
    <>
      <header className="album-head">
        <Cover title={album.title} size={200} />
        <div>
          <h1>{album.title}</h1>
          <p className="muted">by {album.artist?.name} · {album.musics.length} songs</p>
          {album.musics.length > 0 && (
            <button className="primary" onClick={() => play(album.musics[0], album.musics)}>
              Play album
            </button>
          )}
        </div>
      </header>

      <ul className="tracks">
        {album.musics.map((m) => (
          <li key={m._id} className={current?._id === m._id ? 'on' : ''}>
            <Cover title={m.title} size={44} />
            <div><strong>{m.title}</strong></div>
            <button onClick={() => play(m, album.musics)}>
              {current?._id === m._id && playing ? 'Pause' : 'Play'}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
