<script lang="ts">
    import type { WORKSPACE } from './types';
    import { page } from '$app/stores';
    import { trpc } from '$lib/trpc/client';

    export let workspace: WORKSPACE|null;

    let loading = false;

    let data = {
        workspace: "",
        readme: "",
        specification: ""
    }

    async function onSave(){
        loading = true;
        const response = await trpc().save.mutate(data);
        loading = false;
    }

    $: if(workspace !== null){
        data = workspace
    }
</script>

{#if loading}
Saving...
{:else}
<input 
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    type="text" name="workspace" value={data.workspace} placeholder="Workspace name" required />
<textarea 
    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    rows="3" name="readme" value={data.readme} placeholder="Description" required />
<textarea 
    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    rows="5" name="specification" value={data.specification} placeholder="docker-compose.yml content" required />
<button on:click={onSave} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Save
</button>
{/if}