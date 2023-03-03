<script lang="ts">
  import type { Seed } from "@app/lib/seed";

  import Clipboard from "@app/components/Clipboard.svelte";
  import { formatSeedAddress, truncateId } from "@app/lib/utils";

  export let seed: Seed;
  export let port: number;
</script>

<style>
  .wrapper {
    display: flex;
    align-items: center;
    gap: 0.2rem;
  }
  .seed-address {
    display: inline-flex;
    font-size: var(--font-size-regular);
    line-height: 2rem;
    color: var(--color-foreground-6);
    vertical-align: middle;
  }
  .seed-address > * {
    vertical-align: middle;
  }
</style>

<div class="wrapper">
  <div class="seed-address">
    <span style="color: var(--color-foreground-5);">did:key:</span>
    {truncateId(seed.id)}@{seed.host}
    <span class="txt-faded">:{port}</span>
  </div>
  <Clipboard small text={formatSeedAddress(seed.id, seed.host, port)} />
</div>
