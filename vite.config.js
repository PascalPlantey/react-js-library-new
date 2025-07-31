import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteStaticCopy } from 'vite-plugin-static-copy'

import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'src/styles/react-js-library.css', dest: 'dist' },
        { src: 'src/components/**/*.css', dest: 'dist/components' }
      ]
    })
  ],
  build: {
    lib: {
      entry: {
        index: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/index.js'),
        'components/index': resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/components/index.js'),
        'components/ui': resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/components/ui/index.js'),
        'hooks/index': resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/hooks/index.js'),
        'hooks/browser': resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/hooks/browser/index.js'),
        'hooks/react': resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/hooks/react/index.js'),
        'hooks/timers': resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/hooks/timers/index.js'),
        'hooks/utils': resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/hooks/utils/index.js'),
        'tools/index': resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/tools/index.js'),
        'tools/browser': resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/tools/browser/index.js'),
        'tools/classes': resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/tools/classes/index.js'),
        'tools/is': resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/tools/is/index.js'),
        'tools/misc': resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/tools/misc/index.js'),
      },
      name: 'ReactJsLibrary',
      fileName: (format, entryName) => `${entryName}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].js',
          chunkFileNames: '[name]-[hash].js'
        }
      ]
    }
  }
})









