let indexes = new Array();
export let ans = new Array(0);
export let dupliindex = [0];
let prevIndex = null;
export let abs = [];
export default function ansStore(i, index) {
  if (i === prevIndex) {
    ans[i] = index;
  } else {
    ans.push(index);
    indexes.push(i);

    dupliindex = [...new Set(indexes)];
  }
  prevIndex = i;
}
