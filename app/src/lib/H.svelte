<script lang="ts">
    import Highlight from "svelte-highlight";
    import yaml from "svelte-highlight/languages/yaml";
    import atomOneDark from "svelte-highlight/styles/atom-one-dark";

    //import Prism from '@magidoc/plugin-svelte-prismjs'

    export let code: string;
</script>
  
<svelte:head>
  {@html atomOneDark}
</svelte:head>

<Highlight language={yaml} {code} />

<!--
    <Prism
    language={'yaml'}
    source={code}
    showLineNumbers
    showCopyButton
    />
-->