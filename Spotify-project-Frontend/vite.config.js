import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Any request starting with /api is forwarded to your Express server.
// The browser thinks it is talking to one origin, so cookies and CORS just work.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:3000' }, // change 3000 to your backend port
  },
});
