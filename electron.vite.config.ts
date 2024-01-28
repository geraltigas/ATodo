import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import preact from '@preact/preset-vite'
import removeConsole from 'vite-plugin-remove-console'

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin(),
      removeConsole()
    ]
  },
  preload: {
    plugins: [
      externalizeDepsPlugin(),
      removeConsole()
    ]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      preact(),
      removeConsole()
    ]
  }
})
