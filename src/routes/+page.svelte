<script>
	import hljs from 'highlight.js/lib/core'; // Import core
	import { CodeBlock } from '@skeletonlabs/skeleton'; // Import CodeBlock
	import { initializeStores, Toast } from '@skeletonlabs/skeleton';
	initializeStores();
	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	const nCLINPMInstall = 'npm i -g neko-cli';
	const nCLIYarnInstall = 'yarn global add neko-cli';

	// Import the bash language explicitly
	import bash from 'highlight.js/lib/languages/bash';
	import { computePosition } from '@floating-ui/dom';

	export const visitCount = writable(0);

	// Register bash language
	hljs.registerLanguage('bash', bash);

	let copiedNPM = false; // State for managing button animation
	let copiedYarn = false;

	async function handleCopyNPM() {
		try {
			await navigator.clipboard.writeText(nCLINPMInstall);
			copiedNPM = true;
			setTimeout(() => {
				copiedNPM = false;
			}, 1000);

			// Trigger toast notification for NPM
			const toastNPM = {
				message: nCLINPMInstall,
				background: 'bg-gradient-to-tr from-[#111827] via-[#111827] to-[#111827] text-white', // Using #111827 for the dark midnight background
				classes: 'border-4 border-[#1f2937]', // Darker border for a subtle contrast
				transitionOutParams: 100,
				autohide: true
			};
			toastStore.trigger(toastNPM);
		} catch (err) {
			console.error('Error copying NPM command:', err);
		}
	}

	async function handleCopyYarn() {
		try {
			await navigator.clipboard.writeText(nCLIYarnInstall);
			copiedYarn = true;
			setTimeout(() => {
				copiedYarn = false;
			}, 1000);

			// Trigger toast notification for Yarn
			const toastYarn = {
				message: nCLIYarnInstall,
				background: 'bg-gradient-to-tr from-[#111827] via-[#111827] to-[#111827] text-white', // Using #111827 for the dark midnight background
				classes: 'border-4 border-[#1f2937]', // Darker border for a subtle contrast
				transitionOutParams: 100,
				autohide: true
			};

			toastStore.trigger(toastYarn);
		} catch (err) {
			console.error('Error copying Yarn command:', err);
		}
	}

	onMount(() => {
		if (typeof document !== 'undefined') {
			// Statcounter Script code
			var sc_project = 13065098;
			var sc_invisible = 0;
			var sc_security = '7d44ca53';
			var scJsHost = 'https://';

			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = scJsHost + 'statcounter.com/counter/counter.js';
			document.head.appendChild(script);
		}
	});
</script>

<Toast
	position="bl"
	buttonDismissLabel="❌"
	buttonDismiss="variant-filled-[#111827] rounded-full"
	max={2}
	transitionInParams={{}}
	transitionOutParams={{ duration: 100 }}
/>

<!-- Welcome Section -->
<section class="text-center mb-4" style="user-select: none;">
	<h1 class="text-2xl font-extrabold text-primary-500 mb-2" style="user-select: none;">
		Welcome to Neko-CLI PackageManager
	</h1>
	<p class="text-md text-gray-400 mb-3" style="user-select: none;">
		The ultimate CLI for modern developers, easy to install and use.
	</p>
	<div style="user-select: none;">
		<a
			style="user-select: none;"
			href="https://nekocli.unstackss.dev/"
			class="mt-2 inline-block px-6 py-3 bg-transparent text-primary-500 border-2 border-primary-500 rounded-full hover:bg-primary-500 hover:text-white transition-colors duration-300 mr-4"
			target="_blank"
		>
			Learn More
		</a>

		<a
			style="user-select: none; font-weight: bold; font-family: 'Roboto', sans-serif;"
			href="https://github.com/UnStackss/Neko-CLI/releases/download/0.0.1/NekoCLISetup.exe"
			class="mt-2 inline-block px-6 py-3 bg-primary-500 text-white border-2 border-primary-500 rounded-full transition-all duration-300 hover:bg-primary-600 hover:border-primary-600 hover:text-white-400 hover:shadow-lg"
		>
			Download Installer
		</a>
	</div>
</section>

<!-- Installation Commands Section (Compact) -->
<section class="my-4 p-4 text-center rounded-lg" style="user-select: none;">
	<h2 class="text-xl font-bold text-primary-400 mb-3">Install Neko-CLI by line</h2>
	<div class="flex justify-center items-center">
		<div
			class="relative bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg border border-white/20 flex items-center"
		>
			<code class="text-sm text-white font-mono">install command</code>
			<button
				on:click={handleCopyNPM}
				class="ml-3 bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-2 py-1 rounded transition flex items-center space-x-2"
			>
				<span>{copiedNPM ? '✅' : '📋'}</span>
				<span>{copiedNPM ? 'Copied' : 'NPM'}</span>
			</button>
			<button
				on:click={handleCopyYarn}
				class="ml-3 bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-2 py-1 rounded transition flex items-center space-x-2"
			>
				<span>{copiedYarn ? '✅' : '📋'}</span>
				<span>{copiedYarn ? 'Copied' : 'Yarn'}</span>
			</button>
		</div>
	</div>
</section>

<!-- Features Section -->
<section
	class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
	style="user-select: none;"
>
	<div
		class="card p-4 rounded-lg shadow-lg bg-dark-700 hover:bg-dark-600 transition-all duration-300"
	>
		<div class="flex items-center space-x-3">
			<span class="text-3xl text-primary-400">🚀</span>
			<h3 class="text-xl font-bold text-primary-500">Unmatched Performance</h3>
		</div>
		<p class="mt-2 text-gray-400">
			Neko-CLI delivers exceptional performance, executing even the most resource-intensive tasks
			quickly and reliably. Optimized for speed and efficiency, it handles large datasets and
			complex operations with minimal latency, ensuring fast results without compromising stability.
		</p>
	</div>
	<div
		class="card p-4 rounded-lg shadow-lg bg-dark-700 hover:bg-dark-600 transition-all duration-300"
	>
		<div class="flex items-center space-x-3">
			<span class="text-3xl text-primary-400">📦</span>
			<h3 class="text-xl font-bold text-primary-500">Seamless Package Manager Integration</h3>
		</div>
		<p class="mt-2 text-gray-400">
			Neko-CLI integrates smoothly with package managers like <strong>npm</strong> and
			<strong>yarn</strong>, simplifying dependency management. Whether installing, updating, or
			uninstalling packages, Neko-CLI offers a flexible interface to streamline your workflow.
		</p>
	</div>
	<div
		class="card p-4 rounded-lg shadow-lg bg-dark-700 hover:bg-dark-600 transition-all duration-300"
	>
		<div class="flex items-center space-x-3">
			<span class="text-3xl text-primary-400">🔒</span>
			<h3 class="text-xl font-bold text-primary-500">Prioritizing Security</h3>
		</div>
		<p class="mt-2 text-gray-400">
			Security is a top priority in Neko-CLI. It uses best security practices, including encrypted
			data transmission and secure package installations, ensuring that your tasks are always safe
			from threats and vulnerabilities.
		</p>
	</div>
</section>

<!-- Sponsors Section -->
<section class="mt-6 text-center" style="user-select: none;">
	<h2 class="text-xl font-bold text-primary-400 mb-4">Our Sponsors</h2>
	<div class="flex flex-wrap justify-center gap-8">
		<div class="flex flex-col items-center max-w-xs">
			<h3 class="text-sm text-primary-500 font-semibold mb-2">DBD Team</h3>
			<a href="https://discord.gg/TrcRRzAtNQ" target="_blank" class="inline-block">
				<img
					src="https://i.imgur.com/ki2Qpld.png"
					alt="DBD Team"
					class="hover:opacity-80 transition-opacity duration-300 w-20 h-auto"
				/>
			</a>
		</div>
		<div class="flex flex-col items-center max-w-xs">
			<h3 class="text-sm text-primary-500 font-semibold mb-2">BIT.DEV</h3>
			<a href="https://bit.dev/" target="_blank" class="inline-block">
				<img
					src="https://i.imgur.com/p7np28O.png"
					alt="BIT.DEV"
					class="hover:opacity-80 transition-opacity duration-300 w-20 h-auto"
				/>
			</a>
		</div>
		<div class="flex flex-col items-center max-w-xs">
			<h3 class="text-sm text-primary-500 font-semibold mb-2">SANITY.IO</h3>
			<a href="https://www.sanity.io/" target="_blank" class="inline-block">
				<img
					src="https://i.imgur.com/7cHxAb6.png"
					alt="SANITY.IO"
					class="hover:opacity-80 transition-opacity duration-300 w-20 h-auto"
				/>
			</a>
		</div>
		<div class="flex flex-col items-center max-w-xs">
			<h3 class="text-sm text-primary-500 font-semibold mb-2">DISCORD</h3>
			<a href="https://discord.com/" target="_blank" class="inline-block">
				<img
					src="https://i.imgur.com/0ajwXst.png"
					alt="DISCORD"
					class="hover:opacity-80 transition-opacity duration-300 w-20 h-auto"
				/>
			</a>
		</div>
		<div class="flex flex-col items-center max-w-xs">
			<h3 class="text-sm text-primary-500 font-semibold mb-2">VITE</h3>
			<a href="https://vite.dev/" target="_blank" class="inline-block">
				<img
					src="https://i.imgur.com/5EgKxHi.png"
					alt="VITE"
					class="hover:opacity-80 transition-opacity duration-300 w-20 h-auto"
				/>
			</a>
		</div>
		<div class="flex flex-col items-center max-w-xs">
			<h3 class="text-sm text-primary-500 font-semibold mb-2">CODERABBIT</h3>
			<a href="https://www.coderabbit.ai/" target="_blank" class="inline-block">
				<img
					src="https://i.imgur.com/2Ut1vNt.png"
					alt="CODERABBIT"
					class="hover:opacity-80 transition-opacity duration-300 w-20 h-auto"
				/>
			</a>
		</div>
		<div class="flex flex-col items-center max-w-xs">
			<h3 class="text-sm text-primary-500 font-semibold mb-2">INTEL</h3>
			<a href="https://www.intel.com/" target="_blank" class="inline-block">
				<img
					src="https://i.imgur.com/bDQQpZq.png"
					alt="INTEL"
					class="hover:opacity-80 transition-opacity duration-300 w-20 h-auto"
				/>
			</a>
		</div>
	</div>
</section>

<style>
	* {
		user-select: none;
	}
</style>
