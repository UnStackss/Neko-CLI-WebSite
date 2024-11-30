import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte'],
	preprocess: [
		vitePreprocess(),
		sveltePreprocess({
			babel: {
				plugins: ['@babel/plugin-transform-react-jsx'],
			  },
			  typescript: true,
		}),
	],

	kit: {
		adapter: adapter(),
	},
};

export default config;
