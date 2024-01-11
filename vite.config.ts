import {defineConfig} from "vite";
import path from "path";
import removeConsole from "vite-plugin-remove-console";
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig(async () => ({
    plugins: [
        preact(),
        removeConsole(),
    ],

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
    },
    build: {
        sourcemap: true,
        rollupOptions: {
            input: {
                atodo: path.resolve(__dirname, "atodo/index.html"),
                worker: path.resolve(__dirname, "worker/index.html"),
            }
        }
    }
}));
