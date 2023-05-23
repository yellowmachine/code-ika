<script lang="ts">
    import yaml from "svelte-highlight/languages/yaml";
    import md from "svelte-highlight/languages/markdown";
    import type { WORKSPACE } from "./types";
    import Services from "./Services.svelte";
	import Actions from './Actions.svelte';
    import H from "./H.svelte";
    import { page } from '$app/stores';
    import { trpc } from '$lib/trpc/client';

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher<{ 
        state:{state:WORKSPACE[]}
    }>()


    export let data: WORKSPACE;
    let loading = false;
    let error = ""

    async function onUp(event: CustomEvent<{workspace:string}>){
        try{
            const workspace = event.detail.workspace
            loading = true;
            const state = await trpc($page).up.mutate({workspace});
            dispatch('state', {
                state
            });
            error = ""
        }catch(err){
            error = JSON.stringify(err)
        }
        finally{
            loading = false;
        }
    }

    async function onDown(event: CustomEvent<{workspace:string}>){
        try{    
            const workspace = event.detail.workspace
            loading = true;
            const state = await trpc($page).down.mutate({workspace});
            dispatch('state', {
                state
            });
            error = ""
        }catch(err){
            error = JSON.stringify(err)
        }
            finally{
                loading = false;
        }
    }

    async function onDelete(event: CustomEvent<{workspace:string}>){
        try{
            const workspace = event.detail.workspace
            loading = true;
            const state = await trpc($page).delete.mutate({workspace});
            dispatch('state', {
                state
            });
            error = ""
        }catch(err){
            error = JSON.stringify(err)
        }
        finally{
            loading = false;
        }
    }

</script>

<h3>{data.workspace}</h3>
<H code={data.readme} language={md} />
<H code={data.specification} language={yaml} />
<Services data={data.services} />
<Actions on:edit on:up={onUp} on:down={onDown} on:delete={onDelete} {loading} {data} />
<div class="bg-red-500 text-white">{error}</div>