<script lang="ts">
  import { createIcon } from "@app/lib/blockies";
  import { isNodeId } from "@app/lib/utils";

  export let title: string;
  export let source: string;
  export let inline = false;

  function handleMissingFile() {
    console.warn("Not able to locate", source);
    source = createContainer(title);
  }

  function createContainer(source: string) {
    source = source.replace("did:key:", "");
    const seed = source.toLowerCase();
    const avatar = createIcon({
      seed,
      size: 8,
      scale: 16,
    });
    return avatar.toDataURL();
  }

  if (isNodeId(source)) {
    source = createContainer(source);
  }
</script>

<style>
  .avatar {
    display: block;
    border-radius: var(--border-radius-round);
    min-width: 1rem;
    min-height: 1rem;
    height: 100%;
    width: inherit;
    object-fit: cover;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .inline {
    display: inline-block !important;
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
</style>

<img
  {title}
  src={source}
  class="avatar"
  alt="avatar"
  on:error={handleMissingFile}
  class:inline />
