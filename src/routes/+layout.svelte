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
		{ label: 'Monthly', color: 'rgba(59, 130, 246, 0.6)', start: 10, end: 35 },
		{ label: 'Yearly', color: 'rgba(59, 130, 246, 0.3)', start: 35, end: 100 }
	];

	let monthlyDownloads = 0;
	let yearlyDownloads = 0;

	function formatNumber(num) {
		if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
		if (num >= 1e3) return (num / 1e3).toFixed(1) + 'k';
		return num.toString();
	}

	async function fetchDownloadData() {
		try {
			const monthly = await fetch('https://api.npmjs.org/downloads/point/last-month/neko-cli').then(
				(res) => res.json()
			);
			const yearly = await fetch('https://api.npmjs.org/downloads/point/last-year/neko-cli').then(
				(res) => res.json()
			);

			monthlyDownloads = monthly.downloads || 0;
			yearlyDownloads = yearly.downloads || 0;

			const totalDownloads = monthlyDownloads + yearlyDownloads;

			conicStops = [
				{
					label: 'Monthly',
					color: 'rgba(59, 130, 246, 0.6)',
					start: 0,
					end: (monthlyDownloads / totalDownloads) * 100
				},
				{
					label: 'Yearly',
					color: 'rgba(59, 130, 246, 0.3)',
					start: (monthlyDownloads / totalDownloads) * 100,
					end: 100
				}
			];

			animatePieChart();
		} catch (error) {
			console.error('Failed to fetch download data:', error);
		}
	}

	function animatePieChart() {
		const pieChart = document.querySelector('.pie-chart');
		pieChart.style.transition = 'all 1s ease-out';
		pieChart.style.strokeDasharray = `${conicStops[0].end} 100`;
		pieChart.style.strokeDashoffset = '0';
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

	import { page } from '$app/stores';

	let currentRoute = '';

	page.subscribe((p) => {
		currentRoute = p.url.pathname;
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
						<span class="text-sm font-bold absolute bottom-[-4px] right-[63px] text-[#3b82f6]"
							>v{version}</span
						>
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
							onclick="window.open('/docs', '_self')"
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
							onclick="window.open('https://nekods.unstackss.dev', '_blank')"
						>
							Discord
							<div class="heart-icon">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="13.5"
									height="13.5"
									viewBox="0 0 16 16"
									fill="currentColor"
									class="discord-icon"
								>
									<path
										d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"
									/>
								</svg>
							</div>
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

				{#if currentRoute !== '/docs'}
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
				{/if}

				{#if currentRoute !== '/docs'}
					<div
						class="absolute responsive-page-downloads is-home-route"
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
				{/if}

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
				<div class="footer-content">
					<p class="footer-text">
						© <a
							href="https://app.copyrighted.com/website/Wp4Pu4gJh3O2ZRiC"
							target="_blank"
							class="copyright-link">Neko-CLI</a
						>
						. All rights reserved. ❤️
						<span class="footer-id">(ID) <u>MZSFLUH3</u></span>
					</p>

					<p class="footer-time">
						Time: {time.getHours().toString().padStart(2, '0')}h:{time
							.getMinutes()
							.toString()
							.padStart(2, '0')}m:{time.getSeconds().toString().padStart(2, '0')}s {timezone}
						<span style="margin-left: 5px;">
							<img
								src="data:image/png;base64,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"
								alt="iban"
								style="width: 14px; height: 14px; margin-right: 3px; display: inline-block;"
							/>
							<img
								src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAs0lEQVR4nGNgGAWDBtjXvxewavq6yLrp60frpm//ycNfP4LMMO54x49hAcRwcg3+hoKtGr8uxLAA5nLL+h8a5IaCedMPTbAljd8+YLEAYju5hhM0Z1BaYN349Sg0zA/TxoImRMTSxAKrxq+HocnzEE0swAYGjwVWUO9bQSMQF5/sSEYPXyuc/METB1/BRQUou5NruE39Dy2cRQXNCzvjjnf8IAmKiuvGbx9AZmAtrkfBgAEAz8SjXHec7QAAAAAASUVORK5CYII="
								alt="bank-card-back-side"
								style="width: 14px; height: 14px; margin-right: 3px; display: inline-block;"
							/>
							<img
								src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAACPklEQVR4nN1UPWgVQRB+RhRsLBTEQmwUC0UQfx53u6dBRBBtbGwUFLGyFkml+2YuBJtYSCyCpLAQMQRsFB4oKBZip4gIEWIhaCEKCe9mTiVxZe92X87c3uW9WJmFKW5uZr75vpndRmPVHqGSfRLovUTW1UY/JfJriXy+fwCgZ/XFS3at5+KBmt0kgOZNokB6LoBu+EwijQqgTxkA0K+mom09AUjks64zAenRjNEwHRRAH2pZAM9K5KlApTuXk+eeSzgwrtfloPSyZ7mAv4k43eEtfmZSr5XI3/Pu6YHxDapkq0RasJI9XSLTi0LhxxLot5Xsvl+emKNuQosvGF/YSi8uSsbh32z5ofV/aWi9xjTlWFTJM2JXcCFUnS12JlO2yNeG0gMutqn0Rok0Z9netfkTtQAS+G0uBb8y37uVXu+KmHsRIQ8ZE8DX7R2w8qTHMwCkGetrl4sr3r50r0NIjy03VIE8aWLN9hT8V8ryxHTZBRxWyX7L6Ka3KNC8QJo2bAzLvHu+6v4H2NlbZoD8yAZ8NgOzlKet/u9cnCkoWnzOyWUlGxNIqY194/K7JxjVGyQQ2wHdMb5I/dhVkEEVGmlXy0VpBDxY6j6E5JQLipBOZwDIQ4vJnT1ZXMxHam5xOximpnd7BPLtQhdxRhutPEgz3TjgMff2HBqZ2+wt5gUA+lhz9W9lQUoPmAtVuYYrfZ6jODlRkqeVXuoLwAM4URxwvin0ZEXy+AG6UmiP9SeP71Q/z0QCk5P/DPDfnD+Hp79Fq0Hl7gAAAABJRU5ErkJggg=="
								alt="paypal"
								style="width: 14px; height: 14px; margin-right: 3px; display: inline-block;"
							/>
							<img
								src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAACRElEQVR4nN1VTU8UQRBdMXrUf+BXPHklEexa/QsaFP0FBJW7Xkxmq+aCgph4867GCJh458jJq6AgmngFDBDcqkmM7Jjqme5pd2eYifFEJ5VMqjtV9d6rqmm1jvS5FKUnTUfuGOLXgLxmkLtq9lt9JLf1zT8FN8g3DfE3IEkPNeSvQDzWOPD42/S4QZ4NgxiUHUCZB+KngDIHJAuGZPevN8QzrSgdalJ5GHzTdLoTwy/SE8PTO6cNygqQfNRv9UHMkwZlK0DzpJaWoOoViOSMu7sSyzV3p9+B/6whXnV3beIb1YIWnG+64Ab5FRAf9PH+C0g+uEQjUXLOkGxn97xRKrx2i6++050IUP2uElg7qh0lF/J3dz0KlPHBBFnbWUGVX+cH5F4u4rJBnrZG8sz7UR44BgBlL0fxsizBegZf5kM/lCQAlOfeH/O9Aq0s5hSuDSQA5P0c9mxZAiifgd5olFz0b7WNM//+/0lAFvH7Rgk8RSQLpQmQO+EwAvGbnLqkiCHvKinyIpPshm0GhQZLbZKHaoDyCJC/54i/NBJZF5eHHfNkAPvgUIpintJ3beT7fhCJbw0kyCrQxWVbb0sn1CPr1wG5ZynV4Gl67GqcnAeUH27QwjbvQ8FjwfJa1QmtWxVZcP4UDN/10uCBFjNFEtnWCVV0uuB00aldjtJT6rO0+Mpt9Y9btSdKh3Qr9rXinh0iXdUoc7ZbvKBB8Cbr2h3dispn7Q+HeKOWlqqjYuni0rYD4s+G+KeafqtPu6VS0CNz/gCC19RkGX9stgAAAABJRU5ErkJggg=="
								alt="bitcoin"
								style="width: 14px; height: 14px; display: inline-block;"
							/>
						</span>
					</p>
				</div>
			</footer>
			<style>
				.footer-text {
					font-size: 0.8em;
					text-align: center;
				}

				.copyright-link {
					color: #3b82f6;
					text-decoration: none;
				}

				.footer-id {
					font-size: 0.8em;
				}

				.footer-id u {
					text-decoration: underline;
				}
			</style>

			<style>
				.bg-dark-800 {
					background-color: #111827;
					color: #3b82f6;
					user-select: none;
				}
				footer {
					padding: 20px;
					text-align: center;
					user-select: none;
				}
			</style>

			<!--LiveChat-->
			<script src="//code.tidio.co/9bqa6oukoem7oq8upq3sexdguphy0wps.js" async></script>
			<!--GoogleAnalystics-->
			<script async src="https://www.googletagmanager.com/gtag/js?id=G-KPVZX13YJ4"></script>
			<script>
				window.dataLayer = window.dataLayer || [];
				function gtag() {
					dataLayer.push(arguments);
				}
				gtag('js', new Date());

				gtag('config', 'G-KPVZX13YJ4');
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
		max-width: 600px;
		margin: 0 auto;
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
			display: none;
		}
	}

	@media (max-width: 768px) {
		.responsive-footer {
			display: none;
		}
	}
</style>
