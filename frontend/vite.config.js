import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/

const env = loadEnv(
  'mock', 
  process.cwd(),
  '' 
)

const processEnvValues = {
  'process.env': Object.entries(env).reduce(
    (prev, [key, val]) => {
      return {
        ...prev,
        [key]: val,
      }
    },
    {},
  )
}

export default defineConfig({
  plugins: [react()],
  define: processEnvValues,
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    }
  }
})
