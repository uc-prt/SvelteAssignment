<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import { dupliatt, allUnattempt } from "./allAttempt";
  let data1 = dupliatt;
  let data2 = allUnattempt;
  console.log(data1, allUnattempt);

  import questions from "./store";
  let questData;
  const unsubscribe = questions.subscribe((items) => {
    questData = items;
  });
  let displayAttempt = false;
  let displayUnattempt = false;
  let dispAttempt = false;
  let dispUnattempt = false;
  let dispAll = false;
  let displayAll = true;
  function showAll() {
    dispAll = true;
    displayAll = true;
    displayAttempt = false;
    displayUnattempt = false;
    dispAttempt = false;
    dispUnattempt = false;
  }
  function showAttempt() {
    displayAttempt = true;
    displayUnattempt = false;
    dispAttempt = true;
    dispUnattempt = false;
    dispAll = false;
    displayAll = false;
  }
  function showUnattempt() {
    displayUnattempt = true;
    displayAttempt = false;
    dispAttempt = false;
    dispUnattempt = true;
    dispAll = false;
    displayAll = false;
  }
  let no = 1;
</script>

<div class="outer">
  <div class="header">
    <div class="inner all" id="all">
      <p on:click={() => showAll()} class={dispAll ? "active" : "disactive"}>
        All
      </p>
    </div>
    <div class="inner attempted" id="attempted">
      <p
        on:click={() => showAttempt()}
        class={dispAttempt ? "active" : "disactive"}
      >
        Attempted
      </p>
    </div>
    <div class="inner unattempted" id="unattempted">
      <p
        on:click={() => showUnattempt()}
        class={dispUnattempt ? "active" : "disactive"}
      >
        Unattempted
      </p>
    </div>
  </div>
  <hr />
  <div class="body">
    <slot name="footer">
      {#if displayAll}
        <div class="all">
          {#each questData as data, i (data)}
            {#if i <= 10}
              <a
                href="/"
                on:click|preventDefault={() =>
                  dispatch("currentquest", (no = i))}
                ><p style="height: 20px;overflow:hidden">
                  {JSON.parse(data.content_text).question}
                </p></a
              >
            {/if}
          {/each}
        </div>
      {:else if displayAttempt && data1 != undefined}
        {#each data1 as datas, i (datas)}
          {#each questData as data, index (data)}
            {#if i === index}
              <div class="attempt">
                <a
                  href="/"
                  on:click|preventDefault={() =>
                    dispatch("currentquest", (no = 0))}
                  ><p style="height: 20px;overflow:hidden">
                    {JSON.parse(data.content_text).question}
                  </p></a
                >
              </div>
            {/if}
          {/each}
        {/each}
      {:else if displayUnattempt && data2 !== []}
        {#each data2 as datas, i (datas)}
          {#each questData as data, index (data)}
            {#if i == index}
              <div class="unattempt">
                <a
                  href="/"
                  on:click|preventDefault={() =>
                    dispatch("currentquest", (no = datas))}
                  ><p style="height: 20px;overflow:hidden">
                    {JSON.parse(data.content_text).question}
                  </p></a
                >
              </div>
            {/if}
          {/each}
        {/each}
      {:else if data1 == undefined}
        <div class="attempt">
          <p style="text-align: center;">No Any Question Attempted</p>
        </div>
      {/if}
    </slot>
  </div>
</div>

<style>
  .outer {
    height: 100vh;
    width: 20rem;
    position: absolute;
    top: 0;
    border-right: 1px solid red;
    overflow: auto;
    background: linear-gradient(
      to top right,
      rgb(235, 235, 241),
      rgb(216, 215, 215)
    );
  }
  .inner {
    cursor: pointer;
    padding: 0.2rem 0.93rem;
    display: inline-block;
    width: 4em;
  }
  .inner p {
    display: block;
    font-size: 18px;
  }
  .unattempt a,
  .attempt a,
  .all a {
    cursor: pointer;
    margin: 1rem 0;
    display: block;
    font-size: 17px;
    color: rgb(101, 13, 151);
  }
  .unattempt a {
    text-align: left;
  }
  .attempt a {
    text-align: center;
  }
  .all a {
    text-align: left;
  }

  .active {
    color: rgb(45, 48, 241);
  }
</style>
