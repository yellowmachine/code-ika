<script lang="ts">
    import yaml from "svelte-highlight/languages/yaml";
    import md from "svelte-highlight/languages/markdown";
    import type { WORKSPACE } from "./types";
    import Services from "./Services.svelte";
	import Actions from './Actions.svelte';
    import H from "./H.svelte";

    export let data: WORKSPACE;

</script>

<h3>{data.workspace}</h3>
<H code={data.readme} language={md} />
<H code={data.specification} language={yaml} />
<Services data={data.services} />
<Actions {data} />
