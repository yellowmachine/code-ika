<script lang="ts">
    import type { WORKSPACE } from './types';
    import Workspace from './Workspace.svelte'
    export let data: WORKSPACE[] = []

    let filter = ""
    $: filtered = data.filter(x => x.workspace.startsWith(filter)).sort()

</script>

<div>
    <input type="text" bind:value={filter} />
    {#each filtered as workspace}
        <Workspace on:edit data={workspace} />
    {/each}
</div>