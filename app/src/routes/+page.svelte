<script>
	import { enhance } from '$app/forms';
	//import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	function subscribe() {
		const sse = new EventSource('/');
		sse.onmessage = (data) => console.log(data) //invalidate('chats');
		return () => sse.close();
	}

	onMount(subscribe);

    let readme = "";
    let workspace = "";
    let specification = "";
</script>

<main>
    <form
        action={workspace !== "" ? "?/update" : "?/create"}
        method="post"
        on:reset={() => console.log('reset')}
        use:enhance={() =>
            /* prevent `form` prop being auto updated  */
            ({ form, result, update }) => {
                if (result.type === 'success') {
                    const message_input = form.elements.namedItem('readme');
                    if (message_input instanceof HTMLInputElement) {
                        message_input.value = '';
                        return;
                    }
                }
                update();
            }}
    >
        <input type="text" name="workspace" value={workspace} placeholder="Workspace name" required />
        <input type="text" name="readme" value={readme} placeholder="Description" required />
        <input type="text" name="specification" value={specification} placeholder="docker-compose.yml content" required />
        <button>Send</button>
    </form>
</main>

<style>

</style>