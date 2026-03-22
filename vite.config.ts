import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app':       path.resolve(__dirname, './src/app'),
      '@pages':     path.resolve(__dirname, './src/pages'),
      '@workflows': path.resolve(__dirname, './src/workflows'),
      '@features':  path.resolve(__dirname, './src/features'),
      '@entities':  path.resolve(__dirname, './src/entities'),
      '@shared':    path.resolve(__dirname, './src/shared'),
      '@services':  path.resolve(__dirname, './src/services'),
      '@contracts': path.resolve(__dirname, './src/contracts'),
      '@lib':       path.resolve(__dirname, './src/lib'),
    },
  },
})
