<script lang="ts">
    import type { WORKSPACE } from "./types";
    import Services from "./Services.svelte";
	import Actions from './Actions.svelte';
    import { onMount } from 'svelte';

    let MyComponent;

    onMount(async () => {
        const module = await import('./H.svelte');
        MyComponent = module.default;
    });

    export let data: WORKSPACE;

</script>

<h3>{data.workspace}</h3>
<div>{data.readme}</div>
<svelte:component this={MyComponent} code={data.specification} />
<Services data={data.services} />
<Actions {data} on:edit />
