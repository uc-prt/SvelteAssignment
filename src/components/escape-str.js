export default function escapeRex(string) {
  return JSON.parse(string);
}

export function printValues(obj) {
  for (var k in obj) {
    if (obj[k] instanceof Object) {
      printValues(obj[k]);
    } else {
      return obj[k];
    }
  }
}
