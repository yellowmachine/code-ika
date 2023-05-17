<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import type { WORKSPACE } from "./types";
    import Services from "./Services.svelte";
    
    export let data: WORKSPACE;

    const dispatch = createEventDispatcher<{edit:{workspace:string}}>()

    function edit(workspace: string){
        dispatch('edit', {
			workspace
		});
    }
</script>


<h3>{data.workspace}</h3>
<Services data={data.services} />

<form
    action={"?/up"}
    method="post"
>
    <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Up
    </button>
</form>

{#if data.services.length > 0}
<form
    action={"?/down"}
    method="post"
>
    <button class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
        Down
    </button>
</form>
{/if}

<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={() => edit(data.workspace)}>Edit</button>

{#if data.services.length === 0}
<form
    action={"?/delete"}
    method="post"
>
    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Delete
    </button>
</form>        
{/if}