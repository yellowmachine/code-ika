<script lang="ts">
    import type { WORKSPACE } from "./types";
    import Services from "./Services.svelte";
	import Actions from './Actions.svelte';
    import Highlight from "svelte-highlight";
    import yaml from "svelte-highlight/languages/yaml";
    import atomOneDark from "svelte-highlight/styles/atom-one-dark";
    
    export let data: WORKSPACE;

</script>

<svelte:head>
  {@html atomOneDark}
</svelte:head>

<h3>{data.workspace}</h3>
<div>{data.readme}</div>
<Highlight language={yaml} code={data.specification} />
<Services data={data.services} />
<Actions {data} on:edit />
