<script lang="ts">
    import type { WORKSPACE } from "./types";
    import Services from "./Services.svelte";
    
    export let data: WORKSPACE;
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
    <!--<li>    
        <button on:click={() => edit(data)}>Edit</button>
    </li>
    -->
    <li>
        <form
            action={"?/delete"}
            method="post"
        >
            <button>Delete</button>
        </form>        
    </li>
</ul>
