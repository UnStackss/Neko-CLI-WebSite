<script>
	import hljs from 'highlight.js/lib/core';
	import { CodeBlock } from '@skeletonlabs/skeleton';
	import { initializeStores, Toast } from '@skeletonlabs/skeleton';
	initializeStores();
	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	const nCLINPMInstall = 'npm i -g neko-cli';
	const nCLIYarnInstall = 'yarn global add neko-cli';

	import bash from 'highlight.js/lib/languages/bash';
	import { computePosition } from '@floating-ui/dom';

	export const visitCount = writable(0);

	hljs.registerLanguage('bash', bash);

	let copiedNPM = false;
	let copiedYarn = false;

	async function handleCopyNPM() {
		try {
			await navigator.clipboard.writeText(nCLINPMInstall);
			copiedNPM = true;
			setTimeout(() => {
				copiedNPM = false;
			}, 1000);

			const toastNPM = {
				message: nCLINPMInstall,
				background: 'bg-gradient-to-tr from-[#111827] via-[#111827] to-[#111827] text-white',
				classes: 'border-4 border-[#1f2937]',
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

			const toastYarn = {
				message: nCLIYarnInstall,
				background: 'bg-gradient-to-tr from-[#111827] via-[#111827] to-[#111827] text-white',
				classes: 'border-4 border-[#1f2937]',
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

<div id="tsparticles"></div>

<div class="responsive-toast">
	<Toast
		position="bl"
		buttonDismissLabel="❌"
		buttonDismiss="variant-filled-[#111827] rounded-full"
		max={2}
		transitionInParams={{}}
		transitionOutParams={{ duration: 100 }}
	/>
</div>

<section class="text-center mb-4" style="user-select: none;">
	<div class="responsive-page-welcome">
		<img
			src="https://i.imgur.com/EjscrL8.png"
			alt="Neko-CLI Logo"
			class="w-12 h-12 responsive-logo"
		/>
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
				href="https://github.com/UnStackss/Neko-CLI/releases/download/0.0.1/Neko-CLI-Installer.exe"
				class="mt-2 inline-block px-6 py-3 bg-primary-500 text-white border-2 border-primary-500 rounded-full transition-all duration-300 hover:bg-primary-600 hover:border-primary-600 hover:text-white-400 hover:shadow-lg"
			>
				Download Installer
			</a>
		</div>
	</div>
</section>

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

<section
	class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 responsive-page-features"
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

<section class="mt-6 text-center responsive-page-sponsors" style="user-select: none;">
	<h2 class="text-xl font-bold text-primary-400 mb-4">Our Sponsors</h2>
	<div class="flex flex-wrap justify-center gap-8">
		<div class="flex flex-col items-center max-w-xs">
			<h3 class="text-sm text-primary-500 font-semibold mb-2">DBD Team</h3>
			<a href="https://discord.gg/TrcRRzAtNQ" target="_blank" class="inline-block">
				<img
					src="https://i.imgur.com/ki2Qpld.png"
					alt="DBD Team"
					class="hover:opacity-80 transition-opacity duration-300 w-16 h-auto"
				/>
			</a>
		</div>
		<div class="flex flex-col items-center max-w-xs">
			<h3 class="text-sm text-primary-500 font-semibold mb-2">BIT.DEV</h3>
			<a href="https://bit.dev/" target="_blank" class="inline-block">
				<img
					src="https://i.imgur.com/p7np28O.png"
					alt="BIT.DEV"
					class="hover:opacity-80 transition-opacity duration-300 w-16 h-auto"
				/>
			</a>
		</div>
		<div class="flex flex-col items-center max-w-xs">
			<h3 class="text-sm text-primary-500 font-semibold mb-2">SANITY.IO</h3>
			<a href="https://www.sanity.io/" target="_blank" class="inline-block">
				<img
					src="https://i.imgur.com/7cHxAb6.png"
					alt="SANITY.IO"
					class="hover:opacity-80 transition-opacity duration-300 w-16 h-auto"
				/>
			</a>
		</div>
		<div class="flex flex-col items-center max-w-xs">
			<h3 class="text-sm text-primary-500 font-semibold mb-2">DISCORD</h3>
			<a href="https://discord.com/" target="_blank" class="inline-block">
				<img
					src="https://i.imgur.com/OG8wUOJ.png"
					alt="DISCORD"
					class="hover:opacity-80 transition-opacity duration-300 w-16 h-auto"
				/>
			</a>
		</div>
		<div class="flex flex-col items-center max-w-xs">
			<h3 class="text-sm text-primary-500 font-semibold mb-2">VITE</h3>
			<a href="https://vite.dev/" target="_blank" class="inline-block">
				<img
					src="https://i.imgur.com/5EgKxHi.png"
					alt="VITE"
					class="hover:opacity-80 transition-opacity duration-300 w-16 h-auto"
				/>
			</a>
		</div>
		<div class="flex flex-col items-center max-w-xs">
			<h3 class="text-sm text-primary-500 font-semibold mb-2">CODERABBIT</h3>
			<a href="https://www.coderabbit.ai/" target="_blank" class="inline-block">
				<img
					src="https://i.imgur.com/ghxQuT1.png"
					alt="CODERABBIT"
					class="hover:opacity-80 transition-opacity duration-300 w-16 h-auto"
				/>
			</a>
		</div>
		<div class="flex flex-col items-center max-w-xs">
			<h3 class="text-sm text-primary-500 font-semibold mb-2">INTEL</h3>
			<a href="https://www.intel.com/" target="_blank" class="inline-block">
				<img
					src="https://i.imgur.com/bDQQpZq.png"
					alt="INTEL"
					class="hover:opacity-80 transition-opacity duration-300 w-16 h-auto"
				/>
			</a>
		</div>
		<div class="flex flex-col items-center max-w-xs">
			<h3 class="text-sm text-primary-500 font-semibold mb-2">EVERCRAFT</h3>
			<a href="https://evercraft.it/" target="_blank" class="inline-block">
				<img
					src="https://i.imgur.com/UZtPdxl.png"
					alt="EVERCRAFT"
					class="hover:opacity-80 transition-opacity duration-300 w-16 h-auto"
				/>
			</a>
		</div>
		<div class="flex flex-col items-center max-w-xs">
			<h3 class="text-sm text-primary-500 font-semibold mb-2">FullStack Italia</h3>
			<a href="https://t.me/fullstack" target="_blank" class="inline-block">
				<img
					src="https://i.imgur.com/R03hly6.png"
					alt="FullStack Italia"
					class="hover:opacity-80 transition-opacity duration-300 w-16 h-auto"
				/>
			</a>
		</div>
		<div class="flex flex-col items-center max-w-xs">
			<h3 class="text-sm text-primary-500 font-semibold mb-2">EvosHosting</h3>
			<a href="https://www.evoshosting.com/" target="_blank" class="inline-block">
				<img
					src="https://i.imgur.com/94FwhbZ.png"
					alt="EvosHosting"
					class="hover:opacity-80 transition-opacity duration-300 w-16 h-auto"
				/>
			</a>
		</div>
		<div class="flex flex-col items-center max-w-xs">
			<h3 class="text-sm text-primary-500 font-semibold mb-2">UnixDevelopment</h3>
			<a href="https://discord.gg/j6Q4SQfQFd" target="_blank" class="inline-block">
				<img
					src="https://i.imgur.com/hYmzuDE.png"
					alt="UnixDevelopment"
					class="hover:opacity-80 transition-opacity duration-300 w-16 h-auto"
				/>
			</a>
		</div>
	</div>
	<div class="mt-4 text-center become-a-sponsor">
		<a
			href="mailto:nekoclisupp@gmail.com?cc=thomasgarau2002@gmail.com&subject=Proposal%20Sponsor%20Neko-CLI%20x%20%5Bname%20here%5D&body=Dear...%20%5Btext%20here%5D"
			class="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-semibold py-2 px-4 rounded-full shadow-md relative overflow-hidden transform transition-all duration-300 hover:scale-110 hover:shadow-lg"
			style="
				font-family: 'Roboto', sans-serif;
				text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
			"
		>
			<span class="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-700 opacity-0 rounded-full transition-opacity duration-500 transform scale-125 hover:opacity-20"></span>
			<span class="relative">✨ Become a Sponsor 📢</span>
		</a>
	</div>
	
	
</section>

<style>
	@media (max-width: 768px) {
		.become-a-sponsor {
			display: none;
		}
	}

	.responsive-page-welcome {
		text-align: center;
		padding: 20px;
	}

	.responsive-page-welcome h1 {
		font-size: 2rem;
		font-weight: 800;
		margin-bottom: 10px;
	}

	.responsive-page-welcome p {
		font-size: 1rem;
		margin-bottom: 15px;
	}

	.responsive-page-welcome a {
		padding: 12px 24px;
		border-radius: 9999px;
		font-weight: bold;
		transition: all 0.3s ease;
	}

	.responsive-page-welcome a:nth-child(1) {
		margin-right: 15px;
	}

	@media (max-width: 768px) {
		.responsive-page-welcome {
			padding: 10px;
		}

		.responsive-page-welcome h1 {
			font-size: 1.5rem;
		}

		.responsive-page-welcome p {
			font-size: 0.9rem;
		}

		.responsive-page-welcome a {
			padding: 10px 20px;
		}

		.responsive-page-welcome a:nth-child(1) {
			margin-right: 10px;
		}
	}

	@media (max-width: 1024px) and (max-height: 600px) {
		.responsive-page-welcome {
			padding: 10px;
		}

		.responsive-page-welcome h1 {
			font-size: 1.5rem;
		}

		.responsive-page-welcome p {
			font-size: 0.9rem;
		}

		.responsive-page-welcome a {
			padding: 10px 20px;
		}

		.responsive-page-welcome a:nth-child(1) {
			margin-right: 10px;
		}

		.responsive-page-welcome a:nth-child(2) {
			display: none;
		}
	}

	@media (max-width: 1280px) and (max-height: 800px) {
		.responsive-page-welcome {
			padding: 10px;
		}

		.responsive-page-welcome h1 {
			font-size: 1.5rem;
		}

		.responsive-page-welcome p {
			font-size: 0.9rem;
		}

		.responsive-page-welcome a {
			padding: 10px 20px;
		}

		.responsive-page-welcome a:nth-child(1) {
			margin-right: 10px;
		}

		.responsive-page-welcome a:nth-child(2) {
			display: none;
		}
	}

	@media (max-width: 480px) {
		.responsive-page-welcome h1 {
			font-size: 1.25rem;
		}

		.responsive-page-welcome p {
			font-size: 0.875rem;
		}

		.responsive-page-welcome a {
			padding: 8px 16px;
			font-size: 0.875rem;
		}

		.responsive-page-welcome div {
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.responsive-page-welcome a:nth-child(1) {
			margin-bottom: 10px;
		}

		.responsive-page-welcome a:nth-child(2) {
			display: none;
		}
	}

	@media (max-width: 480px) {
		.responsive-page-features {
			grid-template-columns: 1fr;
			padding: 0.25rem;
			display: none;
		}

		.card {
			padding: 0.125rem;
			margin-bottom: 0.25rem;
			height: 6rem;
			overflow: hidden;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}

		.card .text-primary-400 {
			font-size: 0.75rem;
		}

		.card h3 {
			font-size: 0.625rem;
			line-height: 1.2;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.card p {
			font-size: 0.5rem;
			line-height: 1.1;
			height: 2.5rem;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	@media (max-width: 1024px) and (max-height: 600px) {
		.responsive-page-features {
			grid-template-columns: 1fr;
			padding: 0.25rem;
			display: none;
		}

		.card {
			padding: 0.125rem;
			margin-bottom: 0.25rem;
			height: 6rem;
			overflow: hidden;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}

		.card .text-primary-400 {
			font-size: 0.75rem;
		}

		.card h3 {
			font-size: 0.625rem;
			line-height: 1.2;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.card p {
			font-size: 0.5rem;
			line-height: 1.1;
			height: 2.5rem;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	@media (max-width: 1280px) and (max-height: 800px) {
		.responsive-page-features {
			grid-template-columns: 1fr;
			padding: 0.25rem;
			display: none;
		}

		.card {
			padding: 0.125rem;
			margin-bottom: 0.25rem;
			height: 6rem;
			overflow: hidden;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}

		.card .text-primary-400 {
			font-size: 0.75rem;
		}

		.card h3 {
			font-size: 0.625rem;
			line-height: 1.2;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.card p {
			font-size: 0.5rem;
			line-height: 1.1;
			height: 2.5rem;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	@media (max-width: 768px) {
		.responsive-page-features {
			display: none;
		}

		.card {
			padding: 0.125rem;
			margin-bottom: 0.25rem;
			height: 8rem;
			overflow: hidden;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}

		.card .text-primary-400 {
			font-size: 0.75rem;
		}

		.card h3 {
			font-size: 0.75rem;
			line-height: 1.2;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.card p {
			font-size: 0.625rem;
			line-height: 1.1;
			height: 3rem;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	@media (max-width: 480px) {
		.responsive-page-sponsors {
			overflow: hidden;
			display: none;
		}
	}

	@media (max-width: 768px) {
		.responsive-page-sponsors {
			overflow: hidden;
			display: none;
		}
	}

	@media (max-width: 820px) {
		.responsive-page-sponsors {
			overflow: hidden;
			display: none;
		}
	}

	@media (max-width: 1024px) {
		.responsive-page-sponsors {
			overflow: hidden;
			display: none;
		}
	}

	@media (max-width: 1280px) and (max-height: 800px) {
		.responsive-page-sponsors {
			overflow: hidden;
			display: none;
		}
	}

	@media (max-width: 480px) {
		.responsive-toast {
			display: none;
		}
	}

	@media (max-width: 768px) {
		.responsive-toast {
			display: none;
		}
	}

	@media (max-width: 820px) {
		.responsive-toast {
			display: none;
		}
	}

	@media (max-width: 1024px) {
		.responsive-toast {
			display: none;
		}
	}

	.responsive-logo {
		display: none;
	}

	@media (max-width: 768px) {
		.responsive-logo {
			display: block;
			margin: 0 auto 1rem auto;
		}

		.responsive-logo {
			width: 50px;
			height: 50px;
		}
	}

	* {
		user-select: none;
	}
</style>
