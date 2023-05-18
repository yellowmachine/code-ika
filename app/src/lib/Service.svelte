<script lang="ts">
	import type { WORKSPACE } from "./types";
    import { page } from '$app/stores';

    export let data: WORKSPACE["services"][number];

    const base = $page.path
</script>

<ul>
{JSON.stringify(data)}
{#each data.ports as port}
    <li><a target="_blank" href={`${base}:${port.mapped?.port}`}>Open {port.exposed.port}</a></li>
{/each}
</ul>