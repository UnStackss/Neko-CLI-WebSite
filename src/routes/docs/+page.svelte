<script>
	import { onMount } from 'svelte';
	import { marked } from 'marked';

	let docs = [
		{
			name: '👋 Welcome',
			url: 'https://raw.githubusercontent.com/UnStackss/Neko-CLI-WebSite/refs/heads/main/src/routes/docs/cts/welcome.md'
		},
		{
			name: '📜 Commands',
			url: 'https://raw.githubusercontent.com/UnStackss/Neko-CLI-WebSite/refs/heads/main/src/routes/docs/cts/commands.md'
		}
	];

	let currentDoc = null;
	let currentDocContent = '';

	async function fetchMarkdown(url) {
		const response = await fetch(url);
		const text = await response.text();
		return marked(text);
	}

	function selectDoc(doc) {
		currentDoc = doc;
		fetchMarkdown(doc.url).then((html) => {
			currentDocContent = html;
		});
	}

	onMount(() => {
		if (docs.length > 0) {
			selectDoc(docs[0]);
		}
	});
</script>

<div class="container">
	<div class="sidebar">
		{#each docs as doc}
			<button on:click={() => selectDoc(doc)}>{doc.name}</button>
		{/each}
	</div>
	<div class="content-panel">
		<div class="markdown-content">
			{@html currentDocContent}
		</div>
	</div>
</div>

<style>
	.container {
		display: flex;
		background-color: #111827;
		color: #3b82f6;
		padding: 1rem;
		height: 100vh;
		box-sizing: border-box;
	}

	.sidebar {
		position: fixed;
		width: 18%;
		max-width: 200px;
		min-width: 180px;
		height: 700px;
		padding: 1rem;
		background-color: #111827;
		overflow-y: auto;
		border-radius: 8px;
		right: 0.5%;
		overflow: hidden;
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

	.content-panel {
		flex-grow: 1;
		margin-left: 0.2rem;
		padding: 1.5rem;
		background-color: #111827;
		color: #e5e7eb;
		height: 700px;
		border-radius: 8px;
		max-width: 1490px;
		overflow-y: auto;
	}

	.markdown-content {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		line-height: 1.6;
		font-size: 1rem;
		color: #e5e7eb;
	}
</style>
