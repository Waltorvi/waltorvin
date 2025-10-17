<script lang="ts">
	import favicon from '$lib/assets/favicon.ico';
    import { focusTerminal } from "$lib/stores";

    let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="terminal-window" on:click={() => $focusTerminal?.()}>
    {@render children?.()}
</div>

<style>
    :root {
        --background: #231f2c;
        --foreground: #f2f2f2;
        --accent: #d2aef7;
        --prompt: #7e57c2;
        --font: 'Fira Code', 'Consolas', monospace;
    }

    :global(body) {
        margin: 0;
        background-color: var(--background);
        color: var(--foreground);
        font-family: var(--font);
        font-size: 16px;
    }

    .terminal-window {
        box-sizing: border-box;
        padding: 20px;
        width: 100vw;
        min-height: 100vh;
        cursor: text;
    }
</style>