import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc'
import { VitePluginRadar } from 'vite-plugin-radar'

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

const env_mode = process.env.env_mode ? process.env.env_mode : 'dev'

export default defineConfig({
  plugins: [react(), 
  VitePluginRadar({
    enableDev: env_mode == 'dev',
    analytics: {
      id: 'G-V8GQHHTLPC',
      disabled: false,
      send_page_view: true,
      allow_google_signals: true,
      allow_ad_personalization_signals: true,
    },
    consentDefaults: {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      wait_for_update: 500
    },
  })
  ],
  define: processEnvValues,
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    }
  }
})
