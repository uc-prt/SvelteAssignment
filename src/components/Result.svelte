<script>
  import questions from "./store";
  import { correct } from "./checkScore";
  import { count, allUnattempt } from "./allAttempt";
  import { createEventDispatcher } from "svelte";
  import { dupliindex, ans } from "./ansStore";
  import escaped from "./escaped";
  const dispatch = createEventDispatcher();
  let questData;
  let total = 11;
  const unsubscribe = questions.subscribe((items) => {
    questData = items;
  });
  export let answ;
  export let dupli;
  dupli = dupliindex;
  answ = ans;
  let incorrect = count - correct;
  let un = allUnattempt.length;
  let indexno1 = null;
  let show = false;
  function showReview(indexno) {
    indexno1 = indexno;
    show = true;
  }
  function previous() {
    if (indexno1 < 1) {
      indexno1 = 0;
    } else {
      indexno1--;
    }
  }
  function next() {
    if (indexno1 > 9) {
      indexno1 = 10;
    } else {
      indexno1++;
    }
  }
  let ajl = null;
  function escapedExplanation(i) {
    ajl = escaped(i);
    return ajl;
  }
</script>

<header>
  <img
    class="img-fluid"
    src="data:image/png;base64,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"
    alt="Svelte logo"
  />
  <h1>uCertify Result</h1>
</header>
{#if !show}
  <div class="bodycorrect">
    <div class="incorrectAns">
      <h2>All Items</h2>
      <h4>{total}</h4>
    </div>
    <div class="incorrectAns">
      <h2>Attempted</h2>
      <h4>{total-un}</h4>
    </div>
    <div class="incorrectAns">
      <h2>Unattempted</h2>
      <h4>{un}</h4>
    </div>
    <div class="correctAns">
      <h2>Correct Answer</h2>
      <h4>{correct}</h4>
    </div>
    <div class="incorrectAns">
      <h2>Incorrect Answer</h2>
      <h4>{incorrect}</h4>
    </div>
  </div>

  <h2 class="total">Total Result {correct * 8.5}%</h2>

  <table border="1">
    <tr>
      <th>Index No.</th>
      <th class="questArea">Question</th>
      <th class="ansArea">Answers</th>
      <hr />
    </tr>

    {#each questData as data, i (data)}
      <tr>
        <td>
          <p>{i + 1}</p>
        </td>
        <td class="questArea">
          <a
            href="/"
            on:click|preventDefault={() => showReview(i)}
            style="text-decoration: none;"
            >{JSON.parse(data.content_text).question}</a
          >
        </td>
        <td class="ansArea">
          {#each JSON.parse(data.content_text).answers as ansno, index (ansno)}
          {#if ansno.is_correct === "1"}
            <span class="activeans">{index + 1}</span>
          {/if}
              
              {#if answ[ansindex] != index}
                <span class="disactiveans">{index + 1}</span>
              {/if}
              
          {/each}
        </td>
      </tr>
    {/each}
  </table>
  <div style="margin-top:3rem;height:1rem" />
{:else}
  <div class="body">
    {#each questData as data, i (data)}
      {#if i === indexno1}
        <a href="/" style="text-decoration: none;color:red"
          ><h3>Question :</h3>
          {JSON.parse(data.content_text).question}</a
        >
      {/if}
        {#if i === indexno1}
            {#each JSON.parse(data.content_text).answers as ansno, index (ansno)}
            
                    <br/>{index + 1} . {@html ansno.answer}
                  
            {/each}
        {/if}

      {#if i == indexno1}
        <hr />
        <p class="explanation">
          <i
            ><h3>Explanation :</h3>
            {@html escapedExplanation(i)}</i
          >
        </p>
      {/if}
    {/each}
  </div>
  <div class="footer">
    <p>{indexno1 + 1}/11</p>
    {#if indexno1 >= 1}
      <button on:click={() => previous()} style="margin-left :30rem"
        >Previous</button
      >
    {:else}
      <button
        on:click={() => previous()}
        disabled
        style="background-color:  rgba(230, 221, 220,0.8) !important;cursor:text; color:black !important;margin-left :30rem"
        >Previous</button
      >
    {/if}
    {#if indexno1 <= 9}
      <button on:click={() => next()}>Next</button>
    {:else}
      <button
        on:click={() => next()}
        disabled
        style="background-color:  rgba(230, 221, 220,0.8) !important;cursor:text; color:black !important;"
        >Next</button
      >
    {/if}
    <button
      ><a href="/" style="color: white;text-decoration:none">Go to Dashboard</a
      ></button
    >
  </div>
{/if}

<style>
  header {
    padding: 0.19em 0.1rem;
    display: flex;
    align-items: center;
    border-bottom: 2px solid crimson;
  }

  header h1 {
    margin: auto;
    font-family: "Overpass", sans-serif;
    font-size: 2.5rem;
    line-height: 20px;
    margin-top: 8px;
    color: crimson;
  }
  .img-fluid {
    width: 8rem;
    height: 3rem;
  }
  .bodycorrect {
    margin: 5rem 10rem;
    border: 3px solid crimson;
  }
  .bodycorrect div {
    font-size: 14px;
    display: inline-block;
    width: 12.26rem;
    text-align: center;
  }
  .total {
    border-bottom: none;
    text-align: center;
    color: red;
  }

  span {
    display: inline-block;
    width: 17px;
    height: 20px;
    font-weight: bold;
    border: 2px solid rgb(145, 136, 136);
    color: rgb(121, 109, 109);
    border-radius: 50%;
    margin: 0 0.2rem;
  }
  .activeans {
    border: 2px solid green;
    color: green;
  }
  .actives {
    border: 2px solid red;
    color: red;
  }
  /* .actives1{
        color:red;
    } */
  .disactiveans {
    border: 2px solid black !important;
    color: black !important;
  }
  .questArea {
    width: 50rem;
    margin: 0 3rem;
  }
  .ansArea {
    padding-left: 1rem;
    margin: 0 1.2rem;
    width: 8rem;
    text-align: center;
  }
  table {
    margin: auto;
    text-align: center;
  }
  tr {
    padding: 1rem 0;
  }
  p {
    color: blue;
    cursor: pointer;
  }
  .footer {
    position: relative;
    bottom: 2px;
    left: 0px;
    background-color: rgba(41, 36, 36, 0.788);
    height: 5rem;
    width: 100vw;
    margin-top: 10em;
  }
  .footer button {
    font-size: 20px;
    padding: 0.3rem 1rem;
    float: left;
    cursor: pointer;
    position: relative;
    margin-left: 2rem;
    border: none;
    background-color: crimson;
    color: white;
    outline: none;
    padding: 0.3rem 1rem;
    right: 0px;
  }
  .explanation {
    color: rgb(42, 154, 206);
  }
  .body {
    margin: auto;
    width: 60rem;
    border: 1px solid red;
    margin-top: 2rem;
    padding: 0rem 1.4rem;
  }
  .footer p {
    text-align: center;
    color: white;
  }
</style>
