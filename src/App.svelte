<script>
  import SidePanel from "./components/SidePanel.svelte";
  import Header from "./components/Header.svelte";
  import Footer from "./components/Footer.svelte";
  import Result from "./components/Result.svelte";
  import questions from "./components/store";
  import markAttempt from "./components/allAttempt";
  import ansStore, { dupliindex, ans } from "./components/ansStore";

  import checkScore, { correct } from "./components/checkScore";
  let questData;
  const unsubscribe = questions.subscribe((items) => {
    questData = items;
  });
  let openresult = false;
  function Openresult() {
    openresult = true;
  }

  let showlist = true;
  let marked = false;
  let currentQuestion = 0;
  let index1 = 0;
  let displayStartbtn = true;
  let displayQuiz = false;
  function DisplayQuiz() {
    displayQuiz = true;
    displayStartbtn = false;
  }
  function currentquestChange(event) {
    currentQuestion = event;
    jump(currentQuestion);
  }

  async function jump(i) {
    let myradio = await document.getElementsByClassName("answerradio");
    await getcheck();
    for (let j = 0; j < dupliindex.length; j++) {
      if (i == dupliindex[j]) {
        console.log(ans[i]);
        for (let k = 0; k < myradio.length; k++) {
          if (k == ans[i]) {
            myradio[k].checked = true;
            console.log(`${ans[i]}=>${myradio[k].checked}`);
          } else {
            console.log("No");
          }
        }
      }
    }
  }

  async function nextQuest(i) {
    currentQuestion += 1;
    let myradio = await document.getElementsByClassName("answerradio");
    await getcheck();
    for (let j = 0; j < dupliindex.length; j++) {
      if (i == dupliindex[j]) {
        console.log(ans[i]);
        for (let k = 0; k < myradio.length; k++) {
          if (k == ans[i]) {
            myradio[k].checked = true;
            console.log(`${ans[i]}=>${myradio[k].checked}`);
          } else {
            console.log("No");
          }
        }
      }
    }
  }
  async function getcheck() {
    let myradio = await document.getElementsByClassName("answerradio");
    for (let i = 0; i < myradio.length; i++) {
      myradio[i].checked = false;
    }
  }
  async function prevQuest(i) {
    currentQuestion -= 1;
    let myradio = await document.getElementsByClassName("answerradio");
    for (let j = 0; j < dupliindex.length; j++) {
      if (i == dupliindex[j]) {
        console.log(ans[i]);
        for (let k = 0; k < myradio.length; k++) {
          if (k == ans[i]) {
            myradio[k].checked = true;
            console.log(`${ans[i]}=>${myradio[k].checked}`);
          } else {
            console.log("No");
          }
        }
      }
    }
  }
  function AnsStore(i, index) {
    ansStore(i, index);
  }

  function markAttempted(index) {
    markAttempt(index);
    index1 = index + 1;
    marked = true;
  }
  function checkAnswer(event, index) {
    checkScore(event, index);
  }
</script>

{#if openresult}
  <Result {correct} {currentQuestion} />
{:else}
  <Header />
  {#if displayStartbtn}
    <div class="startbutton">
      <button class="startbtn" on:click={() => DisplayQuiz()}>Start</button>
    </div>
    .
  {/if}
  {#if displayQuiz}
    <div id="anschecker">
      {#each questData as data, i (data)}
        {#if currentQuestion == i}
          <p>{JSON.parse(data.content_text).question}</p>
          {#each JSON.parse(data.content_text).answers as ans, index (ans)}
            <div class="ansblk">
              <input
                type="radio"
                name="ans"
                id="ans{index}"
                class="answerradio"
                style="margin-left: -70em;margin-top:3rem"
                on:click={() => markAttempted(i)}
                on:click={() => AnsStore(i, index)}
                on:click={() => checkAnswer(ans.is_correct, i)}
                value={ans.answer}
              /><button class="answer">{@html ans.answer}</button>
            </div>
          {/each}
        {/if}
      {/each}
    </div>

    <Footer
      {currentQuestion}
      on:showlist={() => (showlist = !showlist)}
      on:openresult={() => Openresult()}
      on:nextquest={() => nextQuest(currentQuestion + 1)}
      on:prevquest={() => prevQuest(currentQuestion - 1)}
    />
  {/if}
  {#if !showlist}
    {#if marked}
      <SidePanel on:currentquest={(no) => currentquestChange(no.detail)} />
    {/if}
    {#if !marked}
      {#each questData as data, i (data)}
        {#if currentQuestion == i}
          <SidePanel on:currentquest={(no) => currentquestChange(no.detail)} />
        {/if}
      {/each}
    {/if}
  {/if}
{/if}

<style>
  *{
    text-align: center;
  }
  .answer {
    text-align: center;
    margin: -1.88rem 8rem;
    display: block;
  }
  .startbutton {
    margin: 10em 41em;
  }
  .startbtn {
    cursor: pointer;
    border: 3px solid crimson;
    background-color: white;
    color: crimson;
    font-weight: bold;
    padding: 0.5rem 2rem;
  }
  /* #anschecker {
    margin-left: 0.5em;
  } */
</style>
