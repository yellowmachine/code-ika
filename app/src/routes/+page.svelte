<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { PageData } from './$types';
    import Workspaces from '../lib/Workspaces.svelte';
    import type { WORKSPACE } from '../lib/types';
    import Form from '../lib/Form.svelte';
    import { page } from '$app/stores';
    import { trpc } from '$lib/trpc/client';

    let loading = false;
    export let data: PageData;

    let state: WORKSPACE[] = data.ps;

	function subscribe() {
		const sse = new EventSource('/');
		sse.onmessage = (ev) => {
            console.log(ev)
            state = ev.data.ps;
        }
		return () => sse.close();
	}

	onMount(subscribe);

    function edit(event: CustomEvent<{workspace:string}>){
        workspace = event.detail.workspace
    }

    async function up(event: CustomEvent<{workspace:string}>){
        workspace = event.detail.workspace
        loading = true;
        const response = await trpc($page).up.query({workspace});
        state = response.data;
        loading = false;
    }

    async function down(event: CustomEvent<{workspace:string}>){
        workspace = event.detail.workspace
        loading = true;
        const response = await trpc($page).down.query({workspace});
        state = response.data;
        loading = false;
    }

    async function delete_(event: CustomEvent<{workspace:string}>){
        workspace = event.detail.workspace
        loading = true;
        const response = await trpc($page).delete.query({workspace});
        state = response.data;
        loading = false;
    }

    //const interval = setInterval(invalidateAll, 5000);
	//onDestroy(() => {
	//	clearInterval(interval);
	//});

    let workspace: string|null = null
    $: editWorkspace = workspace === null ? null : state.filter(x => x.workspace === workspace)[0]

</script>

<main>
      <div class="grid grid-cols-3 gap-4">
        <Workspaces on:edit={edit} data={state} on:up={up} on:down={down} on:delete={delete_} />
        <Form workspace={editWorkspace} />
      </div>
</main>

<style>

</style>