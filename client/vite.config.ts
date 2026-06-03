import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const CLIENT_PORT = 5173;
const DEFAULT_SERVER_PORT = 3001;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '..', '');
  const serverPort = Number(env.PORT) || DEFAULT_SERVER_PORT;

  return {
    plugins: [react()],
    server: {
      port: CLIENT_PORT,
      proxy: {
        '/api': {
          target: `http://localhost:${serverPort}`,
          changeOrigin: true,
        },
      },
    },
  };
});
