<script lang="ts">
    import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
    import type { WORKSPACE } from "./types";
    import { createEventDispatcher } from 'svelte';
    
    export let data: WORKSPACE;

    const dispatch = createEventDispatcher<{ up:{workspace:string}, state:{ps:WORKSPACE[]}, edit:{workspace:string}}>()

    function edit(workspace: string){
        dispatch('edit', {
			workspace
		});
    }

    function up(){
        dispatch('up', {
			workspace: data.workspace
		});
    }
</script>

<div class="grid grid-rows-1 grid-flow-col gap-4">
    {#if data.isValid}
        <button on:click={up} class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Up
        </button>
    {:else}
        <div class="text-red font-bold">Errors in config file</div>
    {/if}
    
    {#if data.services.length > 0}
    <form
        action={"?/down"}
        method="post"
        use:enhance={() =>
            ({ result, update }) => {
                if (result.type === 'success') {
                    //dispatch('state', result.data)
                    console.log(result)
                    invalidateAll()
                }
                update();
        }}
    >
        <input type="hidden" name="workspace" value={data.workspace} />
        <button class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
            Down
        </button>
    </form>
    {/if}
    
    {#if data.services.length === 0}
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={() => edit(data.workspace)}>Edit</button>
    {/if}
    
    {#if data.services.length === 0}
    <form
        action={"?/delete"}
        method="post"
        use:enhance={() =>
            ({ result, update }) => {
                if (result.type === 'success') {
                    //dispatch('state', result.data)
                    console.log(result)
                    invalidateAll()
                }
                update();
        }}
    >
        <input type="hidden" name="workspace" value={data.workspace} />
        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Delete
        </button>
    </form>        
    {/if}
</div>


