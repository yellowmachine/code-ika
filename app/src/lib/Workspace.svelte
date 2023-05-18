<script lang="ts">
    import type { WORKSPACE } from "./types";
    import Services from "./Services.svelte";
	import Actions from './Actions.svelte';
    
    export let data: WORKSPACE;

</script>


<h3>{data.workspace}</h3>
<div>{data.readme}</div>
<pre>{data.specification}</pre>
<Services data={data.services} />
<Actions {data} on:edit />
