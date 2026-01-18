import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@public': resolve('./resources/'),
        '@utils': resolve('./src/renderer/src/utils/'),
        '@api': resolve('./src/renderer/src/api/'),
        '@hooks': resolve('./src/renderer/src/hooks/'),
        '@store': resolve('./src/renderer/src/store/'),
        '@pages': resolve('./src/renderer/src/pages/'),
        '@routes': resolve('./src/renderer/src/routes/'),
        '@components': resolve('./src/renderer/src/components/'),
        '@interface': resolve('./src/renderer/src/interface/'),
        '@services': resolve('./src/renderer/src/services/'),
        '@assets': resolve('./resources/asset/s')
      }
    },
    plugins: [react(), tailwindcss()]
  }
})
