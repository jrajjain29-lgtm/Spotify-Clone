// Your backend stores no cover images, so we draw one from the title.
// Same title => same cover, every time.
function hash(str) {
  let h = 0;
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

export default function Cover({ title = '?', size = 160 }) {
  const h = hash(title);
  const hue = h % 360;
  const bg = `hsl(${hue} 45% 32%)`;
  const disc = `hsl(${(hue + 150) % 360} 70% 70%)`;
  const x = 20 + (h % 40);
  const y = 20 + ((h >> 3) % 40);
  return (
    <div className="cover" style={{ width: size, height: size, background: bg }}>
      <span style={{ left: `${x}%`, top: `${y}%`, background: disc }} />
      <i>{title.slice(0, 1).toUpperCase()}</i>
    </div>
  );
}
