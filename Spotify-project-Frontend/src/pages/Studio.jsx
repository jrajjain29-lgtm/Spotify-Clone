import { useEffect, useState } from 'react';
import api, { errorText } from '../api';

export default function Studio() {
  const [songs, setSongs] = useState([]);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // upload form
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // album form
  const [albumTitle, setAlbumTitle] = useState('');
  const [picked, setPicked] = useState([]);

  const loadSongs = () =>
    api.get('/music').then((r) => setSongs(r.data.musics)).catch(() => {});
  useEffect(() => { loadSongs(); }, []);

  async function uploadSong(e) {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    setUploading(true);
    const form = e.target;
    try {
      // Files must travel as multipart/form-data. The field name 'music'
      // must match upload.single('music') in your music.routes.js.
      const fd = new FormData();
      fd.append('title', title);
      fd.append('music', file);
      await api.post('/music/upload', fd);
      setMsg({ type: 'ok', text: `"${title}" uploaded.` });
      setTitle(''); setFile(null); form.reset();
      loadSongs();
    } catch (err) {
      setMsg({ type: 'error', text: errorText(err) });
    } finally {
      setUploading(false);
    }
  }

  const togglePick = (id) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  async function createAlbum(e) {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      await api.post('/music/album', { title: albumTitle, musics: picked });
      setMsg({ type: 'ok', text: `Album "${albumTitle}" created.` });
      setAlbumTitle(''); setPicked([]);
    } catch (err) {
      setMsg({ type: 'error', text: errorText(err) });
    }
  }

  return (
    <>
      <h1>Studio</h1>
      {msg.text && <p className={msg.type === 'ok' ? 'ok' : 'error'} role="status">{msg.text}</p>}

      <div className="studio">
        <form onSubmit={uploadSong}>
          <h2>Upload a song</h2>
          <label>Song title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>Audio file
            <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files[0])} required />
          </label>
          <button className="primary" disabled={uploading}>
            {uploading ? 'Uploading…' : 'Upload song'}
          </button>
        </form>

        <form onSubmit={createAlbum}>
          <h2>Bundle songs into an album</h2>
          <label>Album title
            <input value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} required />
          </label>
          <div className="picklist">
            {songs.length === 0 && <p className="muted">Upload a song first, then pick it here.</p>}
            {songs.map((s) => (
              <label key={s._id} className="radio">
                <input type="checkbox" checked={picked.includes(s._id)} onChange={() => togglePick(s._id)} />
                {s.title}
              </label>
            ))}
          </div>
          <button className="primary" disabled={!picked.length}>Create album</button>
        </form>
      </div>
    </>
  );
}
