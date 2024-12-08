<script>
    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';

    // Store per l'input della ricerca
    let searchInput = writable('');
    let filteredDocs = writable([]);
    let docs = [
      { title: 'Welcome', content: '' },
      { title: 'Commands', content: '' }
      // altri documenti qui
    ];

    // Funzione per filtrare i documenti in base all'input della ricerca
    function filterDocs(query) {
      filteredDocs.set(docs.filter(doc => doc.title.toLowerCase().includes(query.toLowerCase())));
    }

    // Carica i contenuti Markdown al montaggio della pagina
    onMount(async () => {
      try {
        const welcomeResponse = await fetch('/docs/cts/welcome.md');
        const commandsResponse = await fetch('/docs/cts/commands.md');
        const welcomeContent = await welcomeResponse.text();
        const commandsContent = await commandsResponse.text();
        
        docs[0].content = welcomeContent;
        docs[1].content = commandsContent;

        filteredDocs.set(docs);
      } catch (error) {
        console.error('Error loading Markdown files:', error);
      }
    });

    // Gestisce il click su un documento per visualizzare il contenuto
    function handleDocumentClick(doc) {
      filteredDocs.update(docs => docs.map(d => ({
        ...d,
        active: d.title === doc.title
      })));
    }
</script>

<style>
    /* Stile per il layout della pagina */
    .docs-layout {
      display: flex;
      min-height: 100vh;
      background-color: #111827;
      color: #3b82f6;
    }
    .sidebar {
      width: 250px;
      background-color: #111827;
      color: #3b82f6;
      padding: 20px;
      display: flex;
      flex-direction: column;
    }
    .sidebar a {
      color: #3b82f6;
      text-decoration: none;
      margin-bottom: 10px;
    }
    .sidebar a:hover {
      text-decoration: underline;
    }
    .content {
      flex: 1;
      padding: 20px;
      background-color: #111827;
    }
    .search-bar {
      margin-bottom: 20px;
    }
</style>

<div class="docs-layout">
    <!-- Sidebar -->
    <div class="sidebar">
        <input type="text" placeholder="Search..." class="search-bar" bind:value={$searchInput} on:input={() => filterDocs($searchInput)}>
        {#each $filteredDocs as doc}
            <a href="#" on:click={() => handleDocumentClick(doc)}>{doc.title}</a>
        {/each}
    </div>

    <!-- Main content area -->
    <div class="content">
        {#if $filteredDocs.length > 0}
            <h2>{$filteredDocs.find(d => d.active).title}</h2>
            <div innerHTML={$filteredDocs.find(d => d.active).content}></div>
        {:else}
            <p>No documents found.</p>
        {/if}
    </div>
</div>
