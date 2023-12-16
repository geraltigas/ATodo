import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import removeConsole from "vite-plugin-remove-console";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
    plugins: [
        react(),
        removeConsole()
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
