<script>
	import { onMount, onDestroy } from 'svelte';
	import '../app.postcss';
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs, ProgressBar } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml';
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';
	import { initializeStores, Toast } from '@skeletonlabs/skeleton';
	initializeStores();
	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	hljs.registerLanguage('xml', xml);
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	import { ConicGradient, Avatar, FileDropzone, Stepper, Step } from '@skeletonlabs/skeleton';

	import { text } from '@sveltejs/kit';

	let conicStops = [
		{ label: 'Weekly', color: 'rgba(59, 130, 246, 1)', start: 0, end: 10 },
		{ label: 'Monthly', color: 'rgba(59, 130, 246, 0.6)', start: 10, end: 35 },
		{ label: 'Yearly', color: 'rgba(59, 130, 246, 0.3)', start: 35, end: 100 }
	];

	let weeklyDownloads = 0;
	let monthlyDownloads = 0;
	let yearlyDownloads = 0;

	function formatNumber(num) {
		if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
		if (num >= 1e3) return (num / 1e3).toFixed(1) + 'k';
		return num.toString();
	}

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

			const totalDownloads = weeklyDownloads + monthlyDownloads + yearlyDownloads;

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

	onMount(() => {
		fetchDownloadData();
		const interval = setInterval(fetchDownloadData, 5000);
		return () => clearInterval(interval);
	});

	let time = new Date();
	let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});

	let lockedState = true;

	let progress = 0;
	let isLoading = true;

	onMount(() => {
		const interval = setInterval(() => {
			progress += 20;
			if (progress >= 120) {
				progress = 120;
				isLoading = false;
				clearInterval(interval);
			}
		}, 170);
	});

	let originalOverflow;

	onMount(() => {
		if (typeof window !== 'undefined') {
			originalOverflow = window.getComputedStyle(document.documentElement).overflow;
			document.documentElement.style.overflow = 'hidden';
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			document.documentElement.style.overflow = originalOverflow || 'auto';
		}
	});

	let blockedUserDT = false;

	async function blockUserDT() {
		try {
			blockedUserDT = true;
			setTimeout(() => {
				blockedUserDT = false;
			}, 1000);

			const toastBUDT = {
				message:
					'<strong style="font-family: Roboto, sans-serif;">This shortcut is disabled.</strong>',
				background: 'bg-gradient-to-tr from-[#111827] via-[#111827] to-[#111827] text-white',
				classes: 'border-4 border-[#1f2937]',
				transitionOutParams: 100,
				autohide: true
			};
			toastStore.trigger(toastBUDT);
		} catch (err) {
			console.error('Error:', err);
		}
	}

	onMount(() => {
		if (typeof document !== 'undefined') {
			const disableShortcuts = (event) => {
				if (
					(event.ctrlKey || event.metaKey) &&
					(event.key === 'I' || event.key === 'i' || event.key === 'U' || event.key === 'u')
				) {
					event.preventDefault();
					blockUserDT();
				}
			};

			document.addEventListener('keydown', disableShortcuts);
			return () => {
				document.removeEventListener('keydown', disableShortcuts);
			};
		}
	});

	let version = '';

	onMount(async () => {
		const response = await fetch('https://registry.npmjs.org/neko-cli/latest');
		const data = await response.json();
		version = data.version;
	});
</script>

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

{#if isLoading}
	<div class="progress-container">
		<ProgressBar
			value={progress}
			height="h-2"
			rounded="rounded-lg"
			track="#111827"
			meter="bg-[#3b82f6]"
		/>
	</div>
	<div class="loading-overlay">
		<span class="loading-text">Loading...</span>
	</div>
{/if}

<div
	class="min-h-screen flex flex-col bg-dark-900 text-white"
	style="font-family: 'Roboto', sans-serif; color: rgb(var(--color-text-primary));"
>
	<div class={isLoading ? 'blurred' : ''}>
		<div class="responsive-layout">
			<header class="bg-dark-800 py-4 appbar">
				<div class="container mx-auto flex justify-between items-center">
					<a href="/" class="flex items-center gap-2 flex-shrink-0 relative">
						<img src="https://i.imgur.com/EjscrL8.png" alt="Neko-CLI Logo" class="w-12 h-12" />
						<span class="text-2xl font-bold text-primary-500">Neko-CLI</span>
						<span class="text-sm font-bold absolute bottom-[-4px] right-[-6px] text-[#3b82f6]">{version}</span>
					</a>
					
					
					

					<nav class="flex gap-6">
						<button
							type="button"
							class="bg-transparent text-white hover:bg-[#1f2937] rounded-full px-6 py-3 flex items-center gap-2 transition-all appbar-button"
							onclick="window.location.href='/'"
						>
							Home
							<svg width="16" height="16" fill="currentColor" class="ml-2" viewBox="0 0 16 16">
								<path d="M8 3.293l6 6V14h-4v-4H6v4H2V9.293l6-6z"></path>
							</svg>
						</button>

						<button
							class="bg-transparent text-white hover:bg-[#1f2937] rounded-full px-6 py-3 flex items-center gap-2 transition-all appbar-button"
							onclick="window.open('https://nekocli.unstackss.dev/', '_blank')"
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
									<polygon points="28.626,205.785 28.626,334.199 304.937,512 304.937,383.552"
									></polygon>
									<polygon points="335.307,468.724 335.307,509.664 478.927,354.511 478.927,313.616"
									></polygon>
									<polygon points="335.307,383.238 335.307,424.025 478.927,268.916 478.927,228.064"
									></polygon>
									<polygon points="205.903,0 41.297,177.826 318.803,356.361 483.374,178.548"
									></polygon>
								</g>
							</svg>
						</button>

						<button
							type="button"
							class="bg-transparent text-white hover:bg-[#1f2937] rounded-full px-6 py-3 flex items-center gap-2 transition-all appbar-button"
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
							class="bg-transparent text-white hover:bg-[#1f2937] rounded-full px-6 py-3 flex items-center gap-2 transition-all appbar-button"
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

				<div class="stepper-container responsive-page-stepper">
					<!-- svelte-ignore a11y-missing-attribute -->
					<Stepper
						buttonCompleteLabel="Nothing to do 🤧"
						buttonCompleteType="reset"
						badge
						active
						stepTerm="Installation Mode"
					>
						<Step>
							<svelte:fragment slot="header">Neko-CLI Installation with npm</svelte:fragment>
							<div style="font-size: 0.75rem;">
								<p>Click 📋NPM to copy the command, then run it in your terminal:</p>
								<pre><code>> npm i -g neko-cli</code> <code
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
						<Step locked={lockedState}>
							<svelte:fragment slot="header">Neko-CLI Installation with yarn</svelte:fragment>
							<div style="font-size: 0.75rem;">
								<p>Click 📋YARN to copy the command, then run it in your terminal:</p>
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

				<div
					class="absolute responsive-page-downloads"
					style="top: 10%; left: 10%; transform: translate(-10%, -10%);"
				>
					<h5
						class="text-3xl font-bold mb-8"
						style="color: rgb(59, 130, 246); margin-left: 20%; user-select: none;"
					>
						downloads
					</h5>

					<div class="flex items-center gap-12">
						<div class="flex flex-col items-start">
							<p
								class="text-lg mb-2"
								style="user-select: none; font-family: 'Roboto', sans-serif; font-weight: bold;"
							>
								Weekly:
								<span style="color: rgb(59, 130, 246);">
									{formatNumber(weeklyDownloads)}
								</span>
							</p>
							<p
								class="text-lg mb-2"
								style="user-select: none; font-family: 'Roboto', sans-serif; font-weight: bold;"
							>
								Monthly:
								<span style="color: rgb(59, 130, 246);">
									{formatNumber(monthlyDownloads)}
								</span>
							</p>
							<p
								class="text-lg"
								style="user-select: none; font-family: 'Roboto', sans-serif; font-weight: bold;"
							>
								Yearly:
								<span style="color: rgb(59, 130, 246);">
									{formatNumber(yearlyDownloads)}
								</span>
							</p>
						</div>

						<!-- Chart Section -->
						<div style="user-select: none;">
							<ConicGradient stops={conicStops} legend>
								<span slot="caption" class="text-sm" style="color: rgb(59, 130, 246);"
									>Download Distribution</span
								>
							</ConicGradient>
						</div>
					</div>
				</div>

				<style>
					.stepper-container {
						position: absolute;
						top: 8%;
						right: 5%;
						z-index: 10;
						user-select: none;
					}

					pre code {
						background-color: #29303d;
						padding: 1px 4px;
						border-radius: 4px;
						color: #fff;
						overflow-x: auto;
						user-select: none;
					}

					.badge {
						background-color: #3b82f6;
						color: #ffffff;
						padding: 5px 10px;
						border-radius: 12px;
						user-select: none;
					}

					.active {
						background-color: #3b82f6;
						color: #ffffff;
						padding: 5px 10px;
						border-radius: 12px;
						user-select: none;
					}
					.btn {
						font-size: 12px;
						padding: 1px 8px;
						border-radius: 8px;
						user-select: none;
					}
					.btn.variant-filled {
						background-color: #3b82f6;
						color: #ffffff;
						font-weight: bold;
						user-select: none;
					}
					.btn.variant-filled-primary {
						background-color: #ed5463;
						color: #ffffff;
						font-weight: bold;
						user-select: none;
					}
					.btn.variant-ghost {
						background-color: #1f2937;
						color: #ffffff;
						font-weight: bold;
						user-select: none;
					}
				</style>
			</main>

			<footer class="bg-dark-800 py-4 text-center relative responsive-footer">
				<p class="footer-text">© {time.getFullYear()} Neko-CLI. All rights reserved. ❤️</p>
				<p class="footer-time">
					Time: {time.getHours().toString().padStart(2, '0')}h:{time
						.getMinutes()
						.toString()
						.padStart(2, '0')}m:{time.getSeconds().toString().padStart(2, '0')}s {timezone}
				</p>
			</footer>

			<style>
				.bg-dark-800 {
					background-color: #111827;
					color: #ffffff;
					user-select: none;
				}
				footer {
					padding: 20px;
					text-align: center;
					user-select: none;
				}
			</style>

			<!--LiveChat-->
			<script type="text/javascript">
				window.onload = function () {
					var chatContainer = document.querySelector('.smartsupp-chat');
					if (chatContainer) {
						chatContainer.style.userSelect = 'none';
					}
				};

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
				* {
					user-select: none;
				}

				.smartsupp-chat {
					user-select: none;
				}

				.donate-btn {
					animation: pulse 1.5s infinite ease-in-out;
					user-select: none;
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
	</div>
</div>

<style>
	.responsive-layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		padding: 10px;
		box-sizing: border-box;
		align-items: center;
	}

	@media (min-width: 7680px) {
		.responsive-layout {
			width: 90%;
			margin: 0 auto;
		}
	}

	@media (min-width: 5120px) {
		.responsive-layout {
			width: 90%;
			margin: 0 auto;
		}
	}

	@media (min-width: 3840px) {
		.responsive-layout {
			width: 90%;
			margin: 0 auto;
		}
	}

	@media (min-width: 2048px) {
		.responsive-layout {
			width: 90%;
			margin: 0 auto;
		}
	}

	@media (min-width: 1600px) {
		.responsive-layout {
			width: 85%;
			margin: 0 auto;
		}
	}

	@media (min-width: 1280px) {
		.responsive-layout {
			width: 80%;
			margin: 0 auto;
		}
	}

	@media (min-width: 1024px) {
		.responsive-layout {
			width: 75%;
			margin: 0 auto;
		}
	}

	@media (min-width: 800px) {
		.responsive-layout {
			width: 70%;
			margin: 0 auto;
		}
	}

	@media (min-width: 640px) {
		.responsive-layout {
			width: 60%;
			margin: 0 auto;
		}
	}

	@media (max-width: 480px) {
		.responsive-layout {
			width: 100%;
			margin: 0;
			padding: 5px;
		}

		.appbar,
		.appbar-button {
			display: none;
		}
	}

	@media (max-width: 600px) {
		.responsive-layout {
			width: 100%;
			margin: 0;
			padding: 5px;
		}

		.appbar,
		.appbar-button {
			display: none;
		}
	}

	@media (max-width: 800px) {
		.responsive-layout {
			width: 100%;
			margin: 0;
			padding: 5px;
		}

		.appbar,
		.appbar-button {
			display: none;
		}
	}

	@media (max-width: 1024px) {
		.responsive-layout {
			width: 90%;
			margin: 0 auto;
		}
	}

	@media (min-width: 768px) and (max-width: 1024px) {
		.responsive-layout {
			width: 85%;
			margin: 0 auto;
		}
	}

	@media (max-width: 1366px) {
		.responsive-layout {
			width: 90%;
			margin: 0 auto;
		}
	}

	@media (max-width: 1920px) {
		.responsive-layout {
			width: 90%;
			margin: 0 auto;
		}
	}

	header,
	main,
	footer {
		width: 100%;
		padding: 20px;
		box-sizing: border-box;
	}

	main {
		flex-grow: 1;
		padding: 15px;
	}

	footer {
		padding-top: 10px;
		text-align: center;
	}

	.appbar {
		display: flex;
		justify-content: space-between;
		padding: 10px;
	}

	.appbar-button {
		border: none;
		padding: 10px 20px;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	@media (max-width: 600px) {
		.appbar,
		.appbar-button {
			display: none;
		}
	}

	@media (max-width: 820px) {
		.appbar,
		.appbar-button {
			display: none;
		}
	}

	@media (max-width: 1024px) {
		.appbar,
		.appbar-button {
			display: none;
		}
	}

	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		backdrop-filter: blur(10px);
		z-index: 9999;
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: auto;
		user-select: none;
	}
	.progress-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 1000;
		user-select: none;
	}
	.blurred {
		overflow: hidden;
		pointer-events: none;
		opacity: 0.5;
		filter: blur(5px);
		cursor: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zY3JpcHQtMS4yIj4KPHBhdGggZD0iTTEuOTggMTEuNzIgYy0wLjg1IC0wLjg1IDAtMS45MCAwLTEuOTIgMCAwLTIuMDEgMi4wMiA0LjA1bDEuOTIgMS45MmMwLjE2LjIuMTEgMC4yMS0wLjEgMCAwLTEuMiAyLjE5LCAyLjIyIC0uNjkgMy4wMjAgbC0uODUyIC0uODUyYzAsMC4wMDQuOTIuNTEgMS4zNSw0LjM1IiBzdHJva2U9IiNGRjZBQkMiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVuIHBhdGgiIHJlc3BvbnNlLXRvPSJ0ZXh0IiB0c3BhY2U9IlJ1c3QiIHN0eWxlPSJmZWF0dXJlOiBvYmplY3Q7PC9wYXRoPjwvc3ZnPg=='),
			not-allowed;
		user-select: none;
	}
	.loading-text {
		font-size: 4rem;
		font-weight: bold;
		color: #2d87f0;
		pointer-events: none;
		user-select: none;
		position: relative;
		z-index: 10000;
		text-decoration: underline;
	}
	footer {
		background-color: transparent;
		color: #3b82f6;
		padding: 16px 0;
		font-family: 'Roboto', sans-serif;
		position: fixed;
		bottom: 0;
		user-select: none;
		left: 50%;
		width: 80%;
		transform: translateX(-50%);
		text-align: center;
		z-index: 1000;
	}
	footer p {
		margin: 0;
		font-size: 14px;
		user-select: none;
		line-height: 1.4;
	}
	footer .footer-text {
		font-weight: bold;
		user-select: none;
	}
	footer .footer-time {
		font-style: italic;
		user-select: none;
	}
	footer .footer-text,
	footer .footer-time {
		margin-bottom: 8px;
		user-select: none;
	}
	footer p:last-child {
		margin-bottom: 0;
		user-select: none;
	}

	@media (max-width: 480px) {
		.responsive-page-stepper {
			display: none;
		}
	}

	@media (max-width: 768px) {
		.responsive-page-stepper {
			display: none;
		}
	}

	@media (max-width: 820px) {
		.responsive-page-stepper {
			display: none;
		}
	}

	@media (max-width: 1024px) {
		.responsive-page-stepper {
			display: none;
		}
	}

	@media (max-width: 1280px) and (max-height: 800px) {
		.responsive-page-stepper {
			display: none;
		}
	}

	@media (max-width: 480px) {
		.responsive-page-downloads {
			position: relative;
			top: 0.3rem !important;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
		}

		.responsive-page-downloads h5 {
			display: none;
		}
	}

	@media (max-width: 820px) {
		.responsive-page-downloads {
			position: relative;
			top: 0.3rem !important;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
		}

		.responsive-page-downloads h5 {
			display: none;
		}
	}

	@media (max-width: 1024px) {
		.responsive-page-downloads {
			position: relative;
			top: 15rem !important;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
		}

		.responsive-page-downloads h5 {
			display: none;
		}
	}

	@media (max-width: 1024px) and (max-height: 600px) {
		.responsive-page-downloads {
			position: relative;
			top: 1rem !important;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
		}

		.responsive-page-downloads h5 {
			display: none;
		}
	}

	@media (max-width: 1280px) and (max-height: 800px) {
		.responsive-page-downloads {
			position: relative;
			top: 1rem !important;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
		}

		.responsive-page-downloads h5 {
			display: none;
		}
	}

	@media (max-width: 768px) {
		.responsive-page-downloads {
			position: relative;
			top: 0.5rem !important;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
		}

		.responsive-page-downloads h5 {
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

	@media (max-width: 480px) {
		.responsive-footer {
			font-size: 0.7rem;
			padding: 1.5rem 0;
		}

		.footer-text,
		.footer-time {
			font-size: 0.65rem;
		}
	}

	@media (max-width: 768px) {
		.responsive-footer {
			font-size: 0.8rem;
			padding: 2rem 0;
		}

		.footer-text,
		.footer-time {
			font-size: 0.75rem;
		}
	}
</style>
