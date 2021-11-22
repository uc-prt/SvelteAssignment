export let allAttempt = new Array();
export let dupliatt;
export let dupliUnatt;
export let allUnattempt = new Array();
export let count = 0;
export let attlength = 0;
export let unattlength = 11;
allUnattempt = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export let allUnattempts = new Array();
export default function markAttempt(i) {
  count++;
  allAttempt.push(i);
  dupliatt = [...new Set(allAttempt)];
  allUnattempt = allUnattempt.filter((val) => {
    return !allAttempt.includes(val);
  });
  attlength = allAttempt.length;
  unattlength = allUnattempt.length;
}
