
import {isCompressedBase64, compressedBase64ToJSON} from './compression.js';

const idRE = /^[a-z0-9]+$/i;
export const isGistId = s => idRE.test(s);

export async function loadGistFromSrc(src, github) {
  if (isGistId(src)) {
    const {data, rawData} = await github.getGist(src);
    return {data, id: src, rawData};
  } else if (isCompressedBase64(src)) {
    return {data: compressedBase64ToJSON(src)};
  } else {
    const res = await fetch(src);
    const data = await res.json();
    return {data};
  }
}
