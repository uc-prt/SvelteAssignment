import questions from "./store";

let questData;
const unsubscribe = questions.subscribe((items) => {
  questData = items;
});
export let aj;
export let startIndex;
export default function escaped(i) {
  aj = JSON.parse(questData[i].content_text).explanation;
  startIndex = aj.indexOf("<seq");
  while (startIndex > -1) {
    let str2 = aj.substr(startIndex, 14);
    let find = aj.charAt(startIndex + 9);
    aj = aj.replace(str2, find);
    startIndex = aj.indexOf("<seq");
  }

  return aj;
}
