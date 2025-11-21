import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_WAGEMANAGER || 'http://localhost:8080'

  return {
    plugins: [react()],
    server: {
      port: 5174, // 원하는 포트 번호를 입력하세요
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false, // localhost의 self-signed 인증서를 위해 false로 설정
        }
      }
    },
  }
})
