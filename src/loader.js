
import {isCompressedBase64, compressedBase64ToJSON} from './compression.js';
import {getAnonGist} from './GitHub.js';

const idRE = /^[a-z0-9]+$/i;
export const isGistId = s => idRE.test(s);

export async function loadGistFromSrc(src) {
  if (isGistId(src)) {
    const data = getAnonGist(src);
    return {data, id: src};
  } else if (isCompressedBase64(src)) {
    return {data: compressedBase64ToJSON(src)};
  } else {
    const res = await fetch(src);
    const data = await res.json();
    return {data};
  }
}
