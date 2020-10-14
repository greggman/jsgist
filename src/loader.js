
import {isCompressedBase64, compressedBase64ToJSON} from './compression.js';
import {getAnonGist} from './GitHub.js';

const idRE = /^[a-z0-9]+$/i;
export const isGistId = s => idRE.test(s);

// passing it github here is a bad hack!
// just wanted things to work again. Have to fix later
export async function loadGistFromSrc(src, github) {
  if (isGistId(src)) {
    const {data, rawData} = await (github ? github.getAnonGist(src) : getAnonGist(src));
    return {data, id: src, rawData};
  } else if (isCompressedBase64(src)) {
    return {data: compressedBase64ToJSON(src)};
  } else {
    const res = await fetch(src);
    const data = await res.json();
    return {data};
  }
}
