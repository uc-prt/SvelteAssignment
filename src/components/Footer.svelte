<script>
  export let currentQuestion;
  import Countdown from "svelte-countdown";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import Modal from "./Modal.svelte";
  let date = new Date();
  let showmodal = false;
  let total = 11;
  function showModal() {
    showmodal = true;
  }
  function closeModal() {
    showmodal = false;
  }
  $: minutes = date.getMinutes();
  $: seconds = date.getSeconds();
  //  let showlist=false;
</script>

<footer>
  <Countdown
    from="2022-09-30 30:00"
    format=" H:m:s"
    zone="Indian"
    let:remaining
  >
    <div class="whatever">
      {#if remaining.done === false}
        <span>{remaining.minutes} minutes</span>
        <span>{remaining.seconds} seconds</span>
      {/if}
    </div>
  </Countdown>
  <button on:click={() => dispatch("showlist")}>List</button>

  {#if currentQuestion >= 1}
    <button on:click={() => dispatch("prevquest")}>Previous</button>
  {:else}
    <button
      on:click={() => dispatch("prevquest")}
      disabled
      style="background-color: rgba(230, 221, 220,0.8);cursor:text; color:black"
      >Previous</button
    >
  {/if}

  {#if currentQuestion >= 0 && currentQuestion <= 10}
    <b> {currentQuestion + 1}/{total}</b>
  {:else}
    <b> 11/11</b>
    <Modal on:cancel={() => closeModal()} on:openresult />
  {/if}
  {#if currentQuestion <= 9}
    <button on:click={() => dispatch("nextquest")}>Next</button>
  {:else}
    <button
      on:click={() => dispatch("nextquest")}
      disabled
      style="background-color:  rgba(230, 221, 220,0.8);cursor:text; color:black"
      >Next</button
    >
  {/if}
  <button on:click={() => showModal()}>End Test</button>
  {#if showmodal}
    <Modal on:cancel={() => closeModal()} on:openresult />
  {/if}
</footer>

<style>
  footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 0.6em 1em;
    text-align: center;
    background: rgb(219, 212, 212);
    border-top: 1px solid rgb(66, 65, 65);
  }

  button {
    padding: 0.6rem 1.6rem;
    cursor: pointer;
    border-radius: 6px;
  }
</style>
