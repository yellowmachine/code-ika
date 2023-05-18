<script lang="ts">
	import { onMount } from 'svelte';
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

    let workspace: string|null = null
    $: editWorkspace = workspace === null ? null : state.filter(x => x.workspace === workspace)[0]

</script>

<main>
    <div class="columns-2">
        <div class="w-full">
            <Workspaces on:edit={edit} data={state} />
        </div>
        <div class="w-full">
            <Form workspace={editWorkspace} />
        </div>
      </div>
</main>

<style>

</style>