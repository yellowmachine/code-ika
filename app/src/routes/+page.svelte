<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
    import {invalidateAll} from '$app/navigation';
	import type { PageData } from './$types';
    import Workspaces from '../lib/Workspaces.svelte';
    import type { WORKSPACE } from '../lib/types';
    import Form from '../lib/Form.svelte';

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

    //const interval = setInterval(invalidateAll, 5000);
	//onDestroy(() => {
	//	clearInterval(interval);
	//});

    let workspace: string|null = null
    $: editWorkspace = workspace === null ? null : state.filter(x => x.workspace === workspace)[0]

</script>

<main>
      <div class="grid grid-cols-3 gap-4">
        <Workspaces on:edit={edit} data={state} />
        <Form workspace={editWorkspace} />
      </div>
</main>

<style>

</style>