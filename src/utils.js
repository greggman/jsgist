export const noop = () => {};
export const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
