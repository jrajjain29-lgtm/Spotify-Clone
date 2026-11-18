import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Cover from './Cover';

const PlayerCtx = createContext(null);
export const usePlayer = () => useContext(PlayerCtx);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const current = queue[index] || null;

  // Whenever the current track changes, load and play it.
  useEffect(() => {
    if (!current) return;
    audioRef.current.src = current.uri;
    audioRef.current.play().catch(() => {});
  }, [current]);

  const toggle = () => {
    const a = audioRef.current;
    a.paused ? a.play() : a.pause();
  };

  function play(track, list = [track]) {
    if (current?._id === track._id) return toggle();
    setQueue(list);
    setIndex(list.findIndex((t) => t._id === track._id));
  }

  const next = () => index < queue.length - 1 && setIndex(index + 1);
  const prev = () => index > 0 && setIndex(index - 1);
  const seek = (t) => { audioRef.current.currentTime = t; };

  return (
    <PlayerCtx.Provider value={{ play, toggle, next, prev, seek, current, playing, time, duration }}>
      {children}
      <audio
        ref={audioRef}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.target.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onEnded={next}
      />
    </PlayerCtx.Provider>
  );
}

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export function PlayerBar() {
  const { current, playing, toggle, next, prev, seek, time, duration } = usePlayer();
  if (!current) return null;
  return (
    <div className="playerbar">
      <div className="now">
        <Cover title={current.title} size={48} />
        <div>
          <strong>{current.title}</strong>
          <small>{current.artist?.name || 'Unknown artist'}</small>
        </div>
      </div>
      <div className="controls">
        <button onClick={prev} aria-label="Previous">«</button>
        <button className="main" onClick={toggle}>{playing ? 'Pause' : 'Play'}</button>
        <button onClick={next} aria-label="Next">»</button>
      </div>
      <div className="seek">
        <span>{fmt(time)}</span>
        <input type="range" min="0" max={duration || 0} step="1" value={time}
               onChange={(e) => seek(Number(e.target.value))} aria-label="Seek" />
        <span>{fmt(duration || 0)}</span>
      </div>
    </div>
  );
}
