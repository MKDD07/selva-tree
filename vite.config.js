import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleBookingApi } from './worker/booking-api.js';
import { LocalD1 } from './worker/local-d1.js';

const devDb = new LocalD1();

function bookingApiPlugin() {
  return {
    name: 'booking-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost:5173'}`);
        if (url.pathname.startsWith('/api/admin/') || url.pathname.startsWith('/api/availability') || url.pathname === '/api/inquiries') {
          try {
            // Wait for LocalD1 to load from file before first request
            await devDb._ready;
            const chunks = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined;
            const webReq = new Request(url.href, {
              method: req.method,
              headers: req.headers,
              body: ['GET', 'HEAD'].includes(req.method) ? undefined : body,
            });
            const webRes = await handleBookingApi(webReq, { DB: devDb });
            res.statusCode = webRes.status;
            webRes.headers.forEach((v, k) => res.setHeader(k, v));
            const text = await webRes.text();
            res.end(text);
          } catch (e) {
            console.error('API middleware error:', e);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: e.message }));
          }
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), bookingApiPlugin()],
  server: {
    watch: {
      usePolling: true,
    },
  },
});
