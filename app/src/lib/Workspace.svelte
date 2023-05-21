<script lang="ts">
    import type { WORKSPACE } from "./types";
    import Services from "./Services.svelte";
	import Actions from './Actions.svelte';
    import H from "./H.svelte";

    export let data: WORKSPACE;

</script>

<h3>{data.workspace}</h3>
<div>{data.readme}</div>
<H code={data.specification} />
<Services data={data.services} />
<Actions {data} on:edit on:state />
