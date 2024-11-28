import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte'],
	// Utilizza il preprocessore per altre funzionalità (SCSS, PostCSS, etc)
	preprocess: [
		vitePreprocess(), // Il preprocessore Vite
		sveltePreprocess({
			babel: {
				plugins: ['@babel/plugin-transform-react-jsx'], // Aggiungi il supporto per JSX
			  },
			  typescript: true, // Se stai usando TypeScript
		}),
	],

	kit: {
		// Adapter per l'ambiente di produzione
		adapter: adapter(),
	},
};

export default config;
