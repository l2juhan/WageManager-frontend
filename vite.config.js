import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // 원하는 포트 번호를 입력하세요
    proxy: {
      '/api': {
        target: '',
        changeOrigin: true,
        secure: true, // HTTPS를 사용하는 경우 true로 설정
      }
    }
  },
})
