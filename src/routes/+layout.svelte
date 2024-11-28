<script>
	import { onMount } from 'svelte';
	import '../app.postcss'; // File CSS per il tema scuro
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css'; // Tema per codice
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml';
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	// Registrazione delle lingue per il highlighting
	hljs.registerLanguage('xml', xml);
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	import {
		ConicGradient,
		Avatar,
		Autocomplete,
		FileDropzone,
		Stepper,
		Step
	} from '@skeletonlabs/skeleton'; // Ensure Skeleton is installed and imported
	import { text } from '@sveltejs/kit';

	let conicStops = [
		{ label: 'Weekly', color: 'rgba(59, 130, 246, 1)', start: 0, end: 10 },
		{ label: 'Monthly', color: 'rgba(59, 130, 246, 0.6)', start: 10, end: 35 },
		{ label: 'Yearly', color: 'rgba(59, 130, 246, 0.3)', start: 35, end: 100 }
	];

	// Download stats
	let weeklyDownloads = 0;
	let monthlyDownloads = 0;
	let yearlyDownloads = 0;

	// Helper to format numbers (e.g., 1k, 1M)
	function formatNumber(num) {
		if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
		if (num >= 1e3) return (num / 1e3).toFixed(1) + 'k';
		return num.toString();
	}

	// Fetch and update data
	async function fetchDownloadData() {
		try {
			const weekly = await fetch('https://api.npmjs.org/downloads/point/last-week/neko-cli').then(
				(res) => res.json()
			);
			const monthly = await fetch('https://api.npmjs.org/downloads/point/last-month/neko-cli').then(
				(res) => res.json()
			);
			const yearly = await fetch('https://api.npmjs.org/downloads/point/last-year/neko-cli').then(
				(res) => res.json()
			);

			weeklyDownloads = weekly.downloads || 0;
			monthlyDownloads = monthly.downloads || 0;
			yearlyDownloads = yearly.downloads || 0;

			// Calculate total for percentages
			const totalDownloads = weeklyDownloads + monthlyDownloads + yearlyDownloads;

			// Update gradient stops
			conicStops = [
				{
					label: 'Weekly',
					color: 'rgba(59, 130, 246, 1)',
					start: 0,
					end: (weeklyDownloads / totalDownloads) * 100
				},
				{
					label: 'Monthly',
					color: 'rgba(59, 130, 246, 0.6)',
					start: (weeklyDownloads / totalDownloads) * 100,
					end: ((weeklyDownloads + monthlyDownloads) / totalDownloads) * 100
				},
				{
					label: 'Yearly',
					color: 'rgba(59, 130, 246, 0.3)',
					start: ((weeklyDownloads + monthlyDownloads) / totalDownloads) * 100,
					end: 100
				}
			];
		} catch (error) {
			console.error('Failed to fetch download data:', error);
		}
	}

	// Refresh data every 5 seconds
	onMount(() => {
		fetchDownloadData();
		const interval = setInterval(fetchDownloadData, 5000);
		return () => clearInterval(interval);
	});

	let time = new Date();
	let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	// Aggiorna l'orario ogni secondo
	onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});

	let lockedState = true;
</script>

<div
	class="min-h-screen flex flex-col bg-dark-900 text-white"
	style="font-family: 'Inter', sans-serif; color: rgb(var(--color-text-primary));"
>
	<header class="bg-dark-800 py-4 shadow-md">
		<div class="container mx-auto flex justify-between items-center">
			<a href="/" class="flex items-center gap-2">
				<!-- Logo Neko-CLI più grande -->
				<a href="/"
					><img src="https://i.imgur.com/EjscrL8.png" alt="Neko-CLI Logo" class="w-12 h-12" /></a
				>
				<span class="text-2xl font-bold text-primary-500">Neko-CLI</span>
			</a>
			<nav class="flex gap-6">
				<button
					type="button"
					class="bg-transparent text-white hover:bg-[#1f2937] rounded-full px-6 py-3 flex items-center gap-2 transition-all"
					onclick="window.location.href='/'"
				>
					Home
					<svg width="16" height="16" fill="currentColor" class="ml-2" viewBox="0 0 16 16">
						<path d="M8 3.293l6 6V14h-4v-4H6v4H2V9.293l6-6z"></path>
					</svg>
				</button>

				<button
					class="bg-transparent text-white hover:bg-[#1f2937] rounded-full px-6 py-3 flex items-center gap-2 transition-all"
					onclick="window.location.href='https://nekocli.unstackss.dev/'"
				>
					Docs
					<svg
						fill="white"
						height="16px"
						width="16px"
						version="1.1"
						id="Layer_1"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						viewBox="0 0 512 512"
						xml:space="preserve"
					>
						<g>
							<polygon points="28.626,205.785 28.626,334.199 304.937,512 304.937,383.552 "
							></polygon>
							<polygon points="335.307,468.724 335.307,509.664 478.927,354.511 478.927,313.616 "
							></polygon>
							<polygon points="335.307,383.238 335.307,424.025 478.927,268.916 478.927,228.064 "
							></polygon>
							<polygon points="205.903,0 41.297,177.826 318.803,356.361 483.374,178.548 "></polygon>
						</g>
					</svg>
				</button>

				<button
					type="button"
					class="bg-transparent text-white hover:bg-[#1f2937] rounded-full px-6 py-3 flex items-center gap-2 transition-all"
					onclick="window.open('https://github.com/UnStackss/Neko-CLI', '_blank')"
				>
					GitHub
					<svg
						width="13.5"
						height="13.5"
						aria-hidden="true"
						viewBox="0 0 24 24"
						class="ml-2"
						style="max-width: 100%; height: auto;"
					>
						<path
							fill="currentColor"
							d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"
						></path>
					</svg>
				</button>

				<button
					type="button"
					class="bg-transparent text-white hover:bg-[#1f2937] rounded-full px-6 py-3 flex items-center gap-2 transition-all"
					onclick="window.open('https://www.paypal.com/paypalme/UnStackss?country.x=IT&locale.x=en_US', '_blank')"
				>
					Donate
					<div class="heart-icon">
						<svg
							width="24px"
							height="24px"
							viewBox="0 0 50 50"
							xmlns="http://www.w3.org/2000/svg"
							class="heart"
						>
							<path
								d="M25 39.7l-.6-.5C11.5 28.7 8 25 8 19c0-5 4-9 9-9 4.1 0 6.4 2.3 8 4.1 1.6-1.8 3.9-4.1 8-4.1 5 0 9 4 9 9 0 6-3.5 9.7-16.4 20.2l-.6.5zM17 12c-3.9 0-7 3.1-7 7 0 5.1 3.2 8.5 15 18.1 11.8-9.6 15-13 15-18.1 0-3.9-3.1-7-7-7-3.5 0-5.4 2.1-6.9 3.8L25 17.1l-1.1-1.3C22.4 14.1 20.5 12 17 12z"
								fill="white"
							/>
						</svg>
					</div>
				</button>
			</nav>
		</div>
	</header>

	<main class="container mx-auto py-8 flex-grow relative">
		<slot />

		<div class="stepper-container">
			<Stepper
				buttonCompleteLabel="Go Back"
				buttonCompleteType="reset"
				badge
				active
				stepTerm="Installation Mode"
			>
				<Step>
					<svelte:fragment slot="header">Neko-CLI Installation with npm</svelte:fragment>
					<div style="font-size: 0.75rem;">
						<p>Click 📋NPM to copy the command, then run it in your terminal:</p>
						<!-- svelte-ignore a11y-missing-attribute -->
						<pre><code>> npm i -g neko-cli</code> <code
								>Enter <img
									src="https://img.icons8.com/offices/30/enter-key.png"
									style="height: 12px; vertical-align: middle; margin-left: 6px; display: inline-block;"
								/></code
							></pre>
						<p>To verify, run:</p>
						<!-- svelte-ignore a11y-missing-attribute -->
						<pre><code>> meow help</code> <code
								>Enter <img
									src="https://img.icons8.com/offices/30/enter-key.png"
									style="height: 12px; vertical-align: middle; margin-left: 6px; display: inline-block;"
								/></code
							></pre>
					</div>
				</Step>
				<Step locked={lockedState}>
					<svelte:fragment slot="header">Neko-CLI Installation with yarn</svelte:fragment>
					<!-- svelte-ignore a11y-missing-attribute -->
					<div style="font-size: 0.75rem;">
						<p>Click 📋YARN to copy the command, then run it in your terminal:</p>
						<!-- svelte-ignore a11y-missing-attribute -->
						<pre><code>> yarn global add neko-cli</code> <code
								>Enter <img
									src="https://img.icons8.com/offices/30/enter-key.png"
									style="height: 12px; vertical-align: middle; margin-left: 6px; display: inline-block;"
								/></code
							></pre>
						<p>To verify, run:</p>
						<pre><code>> meow help</code> <code
								>Enter <img
									src="https://img.icons8.com/offices/30/enter-key.png"
									style="height: 12px; vertical-align: middle; margin-left: 6px; display: inline-block;"
								/></code
							></pre>
					</div>
				</Step>
			</Stepper>
		</div>

		<div class="absolute" style="top: 10%; left: 10%; transform: translate(-10%, -10%);">
			<h5 class="text-3xl font-bold mb-8" style="color: rgb(59, 130, 246); margin-left: 20%;">
				downloads
			</h5>

			<div class="flex items-center gap-12">
				<!-- Stats Section -->
				<div class="flex flex-col items-start">
					<p class="text-lg mb-2">
						Weekly:
						<span class="font-bold" style="color: rgb(59, 130, 246);"
							>{formatNumber(weeklyDownloads)}</span
						>
					</p>
					<p class="text-lg mb-2">
						Monthly:
						<span class="font-bold" style="color: rgb(59, 130, 246);"
							>{formatNumber(monthlyDownloads)}</span
						>
					</p>
					<p class="text-lg">
						Yearly:
						<span class="font-bold" style="color: rgb(59, 130, 246);"
							>{formatNumber(yearlyDownloads)}</span
						>
					</p>
				</div>

				<!-- Chart Section -->
				<ConicGradient stops={conicStops} legend>
					<span slot="caption" class="text-sm" style="color: rgb(59, 130, 246);"
						>Download Distribution</span
					>
				</ConicGradient>
			</div>
		</div>

		<style>
			.stepper-container {
				position: absolute;
				top: 8%; /* Move it slightly higher */
				right: 5%; /* Move it further to the right side of the page */
				z-index: 10; /* Ensure it stays on top of other elements */
			}

			pre code {
				background-color: #29303d; /* Light background for contrast */
				padding: 1px 4px; /* Add padding for readability */
				border-radius: 4px; /* Optional: smooth edges */
				color: #fff; /* Dark text for readability */
				overflow-x: auto; /* Ensure long lines don't overflow */
			}

			.badge {
				background-color: #3b82f6; /* Set background color */
				color: #ffffff; /* Set text color to white */
				padding: 5px 10px; /* Optional: add padding for better spacing */
				border-radius: 12px; /* Optional: rounded corners */
			}

			.active {
				background-color: #3b82f6; /* Set background color */
				color: #ffffff; /* Set text color to white */
				padding: 5px 10px; /* Optional: add padding for better spacing */
				border-radius: 12px; /* Optional: rounded corners */
			}

			.btn {
				font-size: 12px; /* Ridurre la dimensione del font */
				padding: 1px 8px; /* Ridurre il padding per un bottone più compatto */
				border-radius: 8px;
			}

			.btn.variant-filled {
				background-color: #3b82f6; /* Set background color */
				color: #ffffff; /* Set text color to white */
				font-weight: bold; /* Make text bold */
			}

			.btn.variant-filled-primary {
				background-color: #3b82f6; /* Set background color */
				color: #ffffff; /* Set text color to white */
				font-weight: bold; /* Make text bold */
			}

			.btn.variant-ghost {
				background-color: #1f2937; /* Set background color */
				color: #ffffff; /* Set text color to white */
				font-weight: bold; /* Make text bold */
			}
		</style>
	</main>

	<footer class="bg-dark-800 py-4 text-center relative">
		<p>
			© {time.getFullYear()} Neko-CLI. All rights reserved. ❤️ Time ({time
				.getHours()
				.toString()
				.padStart(2, '0')}h:{time.getMinutes().toString().padStart(2, '0')}m:{time
				.getSeconds()
				.toString()
				.padStart(2, '0')}s) {timezone}
		</p>
	</footer>

	<style>
		.bg-dark-800 {
			background-color: #111827;
			color: #ffffff;
		}
		footer {
			padding: 20px;
			text-align: center;
		}
	</style>

	<!-- Smartsupp Live Chat script -->
	<script type="text/javascript">
		var _smartsupp = _smartsupp || {};
		_smartsupp.key = '06f9f5981510c00f7a4635697322688d95910d8d';
		window.smartsupp ||
			(function (d) {
				var s,
					c,
					o = (smartsupp = function () {
						o._.push(arguments);
					});
				o._ = [];
				s = d.getElementsByTagName('script')[0];
				c = d.createElement('script');
				c.type = 'text/javascript';
				c.charset = 'utf-8';
				c.async = true;
				c.src = 'https://www.smartsuppchat.com/loader.js?';
				s.parentNode.insertBefore(c, s);
			})(document);
	</script>

	<style>
		.donate-btn {
			animation: pulse 1.5s infinite ease-in-out;
		}

		@keyframes pulse {
			0% {
				transform: scale(1);
			}
			50% {
				transform: scale(1.1);
			}
			100% {
				transform: scale(1);
			}
		}
	</style>
</div>
