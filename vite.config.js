import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],

  define: {
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
