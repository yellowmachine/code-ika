<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

    export let data: PageData;

    type S = any

    type W = {
        readme: string,
        specification: string,
        services: S[]
    }

    let state: Record<string, W> = data.ps;

	function subscribe() {
		const sse = new EventSource('/');
		sse.onmessage = (ev) => {
            console.log(ev)
            state = ev.data.ps;
        }
		return () => sse.close();
	}

	onMount(subscribe);

    let readme = "";
    let name = "";
    let specification = "";

    function edit(k: string, w: W){
        readme = w.readme;
        name = k;
        specification = w.specification;
    }

</script>

<main>
    <ul>
        {#each Object.keys(state) as k}
        <li>
            <h3>{k}</h3>
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
            <button on:click={() => edit(k, state[k])}>Edit</button>
            <form
                action={"?/delete"}
                method="post"
            >
                <button>Delete</button>
            </form>        
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