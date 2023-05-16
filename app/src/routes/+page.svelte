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

</script>

<main>
    <Workspaces data={state} />
    <Form />
</main>

<style>

</style>