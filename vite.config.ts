import { defineConfig } from 'vite'
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
