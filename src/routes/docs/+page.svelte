<script>
	import { onMount } from 'svelte';
	import commandsHtml from './cts/commands.html?raw';
	import welcomeHtml from './cts/welcome.html?raw';
	import integrationsHtml from './cts/integrations.html?raw';

	let docs = [
		{ name: '👋 Welcome', content: welcomeHtml },
		{ name: '📜 Commands', content: commandsHtml },
		{ name: '🔌 Integrations', content: integrationsHtml }
	];

	let currentDoc = null;
	let currentDocContent = '';

	function selectDoc(doc) {
		currentDoc = doc;
		currentDocContent = doc.content;
	}

	onMount(() => {
		if (docs.length > 0) {
			selectDoc(docs[0]);
		}
	});
</script>

<div class="container">
	<article class="prose prose-invert">
		{@html currentDocContent}
	</article>
	<div class="sidebar">
		{#each docs as doc}
			<button on:click={() => selectDoc(doc)}>{doc.name}</button>
		{/each}
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		background-color: #111827;
		color: #3b82f6;
		padding: 1rem;
		height: 100vh;
		box-sizing: border-box;
	}

	.sidebar {
		position: sticky;
		width: 200px;
		height: fit-content;
		padding: 1rem;
		background-color: #111827;
		overflow-y: auto;
		border-radius: 8px;
		overflow: hidden;
		top: 0;
	}

	.sidebar button {
		display: block;
		width: 100%;
		max-width: 280px;
		padding: 0.5rem 1rem;
		margin-bottom: 0.5rem;
		background: #111827;
		color: #3b82f6;
		border: none;
		cursor: pointer;
		text-align: left;
		border-radius: 4px;
		font-size: 1rem;
		transition:
			background 0.3s,
			color 0.3s;
	}

	.sidebar button:hover {
		background: #1f2937;
		color: #ffffff;
	}

	.sidebar button:active {
		background: #2d3748;
	}

	.prose {
		width: 100%;
		max-width: none;
		overflow: auto;
		max-height: calc(100vh - 12rem);
	}
</style>
