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
            <button>Start</button>
        </form>
    </li>
    <li>
        <form
            action={"?/down"}
            method="post"
        >
            <button>Stop</button>
        </form>
    </li>
    <li>    
        <button on:click={() => edit(data.workspace)}>Edit</button>
    </li>
    <li>
        <form
            action={"?/delete"}
            method="post"
        >
            <button>Delete</button>
        </form>        
    </li>
</ul>
