import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: true, // cần thiết để Ngrok truy cập được
  //   port: 5173,
  //   hmr: {
  //     protocol: 'https',
  //     host: '8a2d3abbfcab.ngrok-free.app',
  //     clientPort: 443,
  //   },
  //   allowedHosts: 'all',
  // }
})
