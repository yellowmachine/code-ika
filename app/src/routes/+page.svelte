<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

    type S = any[]

    type W = {
        name: string,
        readme: string,
        specification: string,
        services: S
    }

    let state: W[] = []

	function subscribe() {
		const sse = new EventSource('/');
		sse.onmessage = (ev) => state = ev.data;
		return () => sse.close();
	}

	onMount(subscribe);

    let readme = "";
    let name = "";
    let specification = "";

    function edit(w: W){
        readme = w.readme;
        name = w.name;
        specification = w.specification;
    }

</script>

<main>
    <ul>
        {#each state as workspace}
        <li>
            {workspace.name}
            <form
                action={"?/up"}
                method="post"
            >
                <button>Start</button>
            </form>
            <form
                action={"?/down"}
                method="post"
            >
                <button>Stop</button>
            </form>    
            <button on:click={() => edit(workspace)}>Edit</button>    
        </li>
        {/each}
    </ul>

    <form
        action={"?/update"}
        method="post"
        use:enhance={() =>
            ({ form, result, update }) => {
                if (result.type === 'success') {
                    name = ""
                    readme = ""
                    specification = ""
                }
                update();
            }}
    >
        <input type="text" name="workspace" value={name} placeholder="Workspace name" required />
        <input type="text" name="readme" value={readme} placeholder="Description" required />
        <input type="text" name="specification" value={specification} placeholder="docker-compose.yml content" required />
        <button>Send</button>
    </form>
</main>

<style>

</style>