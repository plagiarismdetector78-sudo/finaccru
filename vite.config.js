import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/bills': {
                target: 'https://finaccrustorage.blob.core.windows.net',
                changeOrigin: true,
                secure: false,
            },
            '/tax-invoices': {
                target: 'https://finaccrustorage.blob.core.windows.net',
                changeOrigin: true,
                secure: false,
            },
            '/n8n-webhook': {
                target: 'https://n8n-staging.finaccru.com',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/n8n-webhook/, '/webhook/ai-chat'),
            },
        },
    },
});