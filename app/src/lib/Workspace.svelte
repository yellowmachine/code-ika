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
<ul>
    <li>    
        <form
            action={"?/up"}
            method="post"
        >
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Up
        </button>
        </form>
    </li>
    <li>
        <form
            action={"?/down"}
            method="post"
        >
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Down
        </button>
        </form>
    </li>
    <li>    
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={() => edit(data.workspace)}>Edit</button>
    </li>
    <li>
        <form
            action={"?/delete"}
            method="post"
        >
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Delete
        </button>
        </form>        
    </li>
</ul>
