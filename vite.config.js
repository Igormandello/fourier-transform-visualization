import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default ({ mode }) => {
  return defineConfig({
    plugins: [vue()],

    define: mode === 'production' ? undefined : {
        global: {}
    },

    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src')
        }
      ]
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
                @import "@/styles/core/_settings.scss";
              `
        }
      }
    }
  })
}
