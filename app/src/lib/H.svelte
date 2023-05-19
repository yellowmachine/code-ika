<script lang="ts">
    import yaml from "svelte-highlight/languages/yaml";
    import atomOneDark from "svelte-highlight/styles/atom-one-dark";

    import { onMount } from 'svelte';

    let H;

    onMount(async () => {
        const module = await import("svelte-highlight");
        H = module.default;
    });

    export let code: string;
</script>
  
<svelte:head>
  {@html atomOneDark}
</svelte:head>

<svelte:component this={H} language={yaml} {code}  />
