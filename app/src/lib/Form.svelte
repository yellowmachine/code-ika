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
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Save
    </button>
</form>