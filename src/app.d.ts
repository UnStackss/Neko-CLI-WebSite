declare namespace App {
	interface Locals {}
	interface PageData {}
	interface Error {}
	interface Platform {}
  
	interface Window {
	  clipboard: {
		writeText: (text: string) => Promise<void>;
	  };
	}
  }
  