import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 40000,
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: ["**/node_modules/**"]
    }
  }
})
