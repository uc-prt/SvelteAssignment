<script>
  import { createEventDispatcher } from "svelte";
  import { unattlength, attlength } from "./allAttempt";

  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch("cancel");
  }
</script>

<div class="modal-backdrop" on:click={closeModal}>
  <div class="modal">
    <h1>End Test</h1>
    <div class="content">
      <div class="attempt">
        <h2>Attempted</h2>
        <h3>{11-unattlength}</h3>
      </div>
      <div class="unattempt">
        <h2>Unattempted</h2>
        <h3>{unattlength}</h3>
      </div>
    </div>
    <footer>
      <p><b>Are You Sure To End The Test ?</b></p>
      <hr />
      <slot name="footer">
        <button on:click={closeModal}>Close</button>
        <button on:click={() => dispatch("openresult")} class="outbtn"
          >Show Result</button
        >
      </slot>
    </footer>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.555);
  }
  .modal {
    background-color: white;
    margin: auto;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
    height: 300px;
    border-radius: 6px;
    overflow: auto;
    margin-top: 5em;
  }
  h1 {
    padding: 1rem;
    margin: 0;
    border-bottom: 1px solid rgba(204, 204, 204, 0.356);
    font-family: serif;
    font-weight: bold;
  }
  .content {
    padding: 1rem;
    /* text-align: left; */
    /* padding-left: 3rem; */
    height: 3.6rem;
  }
  .content div {
    display: inline-block;
    margin-left: 2rem;
    text-decoration: none;
  }
  footer {
    padding: 1rem;
    text-align: right;
  }
  footer p {
    text-align: left;
    margin-left: 2rem;
    color: rgb(20, 220, 153);
  }
  .outbtn {
    color: white;
    background-color: crimson;
  }
  footer button {
    border: 2px solid crimson;
    background-color: white;
    color: crimson;
    border-radius: 5px;
    margin: 0 0.4rem;
    padding: 0.5rem 2rem;
    cursor: pointer;
  }
  @media (min-width: 768px) {
    .modal {
      width: 55rem;
      left: calc(50%-20rem);
    }
  }
</style>
