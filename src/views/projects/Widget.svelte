<script lang="ts">
  import type * as proj from "@app/lib/project";
  import Diagram from "@app/views/projects/Diagram.svelte";
  import { groupCommitsByWeek } from "@app/lib/commit";
  import type { Host } from "@app/lib/api";
  import { Project } from "@app/lib/project";
  import { formatCommit, twemoji } from "@app/lib/utils";

  export let project: proj.ProjectInfo;
  export let seed: { addr: Host };
  export let faded = false;
  export let compact = false;

  const loadCommits = async () => {
    const commits = await Project.getActivity(project.id, seed.addr);

    return groupCommitsByWeek(commits.activity);
  };
</script>

<style>
  article {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 1rem;
    border: 1px solid var(--color-secondary-5);
    border-radius: var(--border-radius-small);
    min-width: 36rem;
    cursor: pointer;
    background: var(--color-background-1);
  }
  article .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
  }
  article .left {
    width: 50%;
  }
  div .description {
    overflow-x: hidden;
    overflow-y: hidden;
    text-overflow: ellipsis;
  }
  article.compact {
    min-width: 16rem;
    height: 9rem;
  }
  article.compact .left {
    width: 100%;
  }
  article.compact .right {
    display: none;
  }
  article.compact .description {
    white-space: nowrap;
  }
  article.project-faded {
    border: 1px dashed var(--color-foreground-4);
    cursor: not-allowed;
  }
  .activity {
    width: 100%;
    max-width: 14rem;
  }
  article:hover {
    border-color: var(--color-secondary);
    background-color: var(--color-secondary-1);
  }
  article.project-faded:hover {
    border-color: var(--color-foreground-5);
  }
  article .id {
    font-size: var(--font-size-regular);
    font-weight: var(--font-weight-medium);
    margin-bottom: 0.5rem;
  }
  article .description {
    margin-bottom: 0.25rem;
    font-size: var(--font-size-tiny);
  }
  article .stateHash {
    color: var(--color-secondary);
    font-size: var(--font-size-tiny);
    font-family: var(--font-family-monospace);
    min-height: 2rem;
    display: flex;
    align-items: center;
  }
  article .id {
    display: flex;
    justify-content: space-between;
  }
  article .id .rid {
    visibility: hidden;
    color: var(--color-foreground-5);
    font-weight: var(--font-weight-normal);
    font-family: var(--font-family-monospace);
    font-size: var(--font-size-tiny);
  }
  article:hover .id .rid {
    visibility: visible;
  }
  @media (max-width: 720px) {
    article {
      min-width: 0;
    }
  }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<article on:click class:project-faded={faded} class:compact>
  <div class="left">
    <div class="id">
      <span class="name">{project.name}</span>
    </div>
    {#if project.description}
      <div class="description" use:twemoji>{project.description}</div>
    {:else}
      <div class="description txt-missing">No description</div>
    {/if}
    <div class="stateHash">
      {#if project.head}
        {#if compact}
          {formatCommit(project.head)}
        {:else}
          {project.head}
        {/if}
      {:else}
        <span class="txt-missing">✗ No head</span>
      {/if}
    </div>
    {#if compact}
      {#await loadCommits() then points}
        <div class="activity">
          <Diagram
            {points}
            strokeWidth={3}
            viewBoxHeight={70}
            viewBoxWidth={600} />
        </div>
      {/await}
    {/if}
  </div>

  {#if !compact}
    <div class="right">
      <div class="id">
        <span class="rid layout-desktop">{project.id}</span>
      </div>
      {#await loadCommits() then points}
        <div class="layout-desktop activity">
          <Diagram
            {points}
            strokeWidth={3}
            viewBoxHeight={100}
            viewBoxWidth={600} />
        </div>
      {/await}
    </div>
  {/if}
</article>
