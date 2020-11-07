const camelCaseRE = /([a-z])([A-Z])/g;
const toDash = (_, left, right) => `${left}-${right}`;
const camelCaseToDash = s => s.replace(camelCaseRE, toDash).toLowerCase();

export function classNames(...args) {
  const names = [];
  for (const arg of args) {
    if (typeof arg === 'string') {
      names.push(arg);
    } else {
      for (const [key, value] of Object.entries(arg)) {
        if (value) {
          names.push(camelCaseToDash(key));
        }
      }
    }
  }
  return names.join(' ');
}