<script lang="ts">
    import Service from './Service.svelte'
    export let data: {name: string}[] = []
</script>

<div>
    {#each data as service}
        <Service data={service} />
    {/each}
</div>