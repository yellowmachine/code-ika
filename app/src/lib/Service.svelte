<script lang="ts">
	import type { WORKSPACE } from "./types";

    export let data: WORKSPACE["services"][number];
</script>

<ul>
{JSON.stringify(data)}
{#each data.ports as port}
    <li><a target="_blank" href={`${document.location}:${port.mapped?.port}`}>Open {port.exposed.port}</a></li>
{/each}
</ul>