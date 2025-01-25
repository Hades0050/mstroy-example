import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
	build: {
		minify: 'esbuild',
		rollupOptions: {
			// external: ['vue'],
			output: {
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@app': path.resolve(__dirname, './src/app'),
			'@layout': path.resolve(__dirname, './src/layout'),
			'@pages': path.resolve(__dirname, './src/pages'),
			'@shared': path.resolve(__dirname, './src/shared'),
			'@components': path.resolve(__dirname, './src/components'),
		},
	},
	plugins: [vue()],
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler',
				// additionalData: `@use "@/style.scss" as *;`,
			},
		},
	},
})
