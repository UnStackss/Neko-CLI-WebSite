// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// Interface per dichiarare la tipizzazione di clipboard (per il contesto globale)
	interface Locals {}
	interface PageData {}
	interface Error {}
	interface Platform {}
  
	// Aggiungi il supporto per clipboard API nel contesto globale
	interface Window {
	  clipboard: {
		writeText: (text: string) => Promise<void>;
	  };
	}
  }
  