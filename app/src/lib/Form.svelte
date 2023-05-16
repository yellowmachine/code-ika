<script lang="ts">
	import { enhance } from '$app/forms';

    let readme = "";
    let name = "";
    let specification = "";
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
    <button>Save</button>
</form>