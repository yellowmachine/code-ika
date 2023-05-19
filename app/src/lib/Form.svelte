<script lang="ts">
	import { enhance } from '$app/forms';
    import type { WORKSPACE } from './types';
    export let workspace: WORKSPACE|null;

    let readme = "";
    let name = "";
    let specification = "";

    $: if(workspace !== null){
        name = workspace.workspace
        readme = workspace.readme
        specification = workspace.specification
    }
</script>

<form
    action={"?/save"}
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
    <input 
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type="text" name="workspace" value={name} placeholder="Workspace name" required />
    <textarea 
        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        rows="3" name="readme" value={readme} placeholder="Description" required />
    <textarea 
        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        rows="5" name="specification" value={specification} placeholder="docker-compose.yml content" required />
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Save
    </button>
</form>