export let correct = 0;

export let scoreans = new Array();
export let dupliindex;
let prevIndex = null;
export default function checkScore(event, index) {
  if (event === "1") {
    if (index === prevIndex) {
      // correct = correct + 1;
    } else {
      correct += 1;
    }
  }

  if (event !== "1") {
    if (index === prevIndex) {
      correct = correct - 1;
    } else {
      correct = correct;
    }
    if (index == prevIndex) {
      if (event == "0") {
        correct = correct + 1;
      }
    }
  }
  if (correct === -1) {
    correct = 0;
  }

  prevIndex = index;
}
