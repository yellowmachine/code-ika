<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
    import Services from '../lib/Services.svelte';

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
            <Services data={state[k].services} />
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
                <button on:click={() => edit(k, state[k])}>Edit</button>
            </li>
            <li>
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
        <textarea rows="3" name="readme" value={readme} placeholder="Description" required />
        <textarea rows="5" name="specification" value={specification} placeholder="docker-compose.yml content" required />
        <button>Save</button>
    </form>
</main>

<style>

</style>