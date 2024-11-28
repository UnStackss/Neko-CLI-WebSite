import { join } from 'path';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			container: {
				center: true,
				screens: {
					sm: '100%', // Mobile
					md: '100%', // Tablet
					lg: '1200px', // Desktop standard
					xl: '1400px', // Desktop ampio
					'2xl': '1600px', // Desktop molto ampio
				},
			},
			screens: {
				// Mobile
				xs: '360px', // Per dispositivi più piccoli
				sm: '390px', // iPhone 12 Mini
				// Tablet
				md: '601px', // Tablet più piccolo
				tablet: '768px', // iPad (768x1024)
				// Desktop
				lg: '1024px', // Desktop standard
				xl: '1280px', // Desktop risoluzione media
				'2xl': '1366px', // Laptop comune
				'3xl': '1920px', // Desktop Full HD
			},
			maxWidth: {
				'full-hd': '1920px', // Larghezza massima per desktop 1920x1080
				'desktop-standard': '1366px', // Laptop
				'tablet-landscape': '1024px', // Tablet orizzontale
				'tablet-portrait': '768px', // Tablet verticale
				'mobile': '480px', // Smartphone
			},
		},
	},
	plugins: [
		forms,
		typography,
		skeleton({
			themes: {
				preset: ['wintry'],
			},
		}),
	],
};
