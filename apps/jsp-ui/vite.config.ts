import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv'
import postPresetEnv from 'postcss-preset-env'
import { defineConfig } from 'vite'

const mode = process.env.NODE_ENV
dotenv.config({
  path: 'env/.env.' + mode,
})

const apiPath = process.env.VITE_API_PATH

const postcss =
  mode === 'development'
    ? {}
    : {
        postcss: {
          plugins: [postPresetEnv()],
        },
      }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  css: {
    ...postcss,
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@zj-astro/ui/var.scss"; ',
      },
    },
    modules: {
      generateScopedName: '[local]_[hash:5]',
      scopeBehaviour: 'local',
      // globalModulePaths: ['theme/*.sass'],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: apiPath,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
