import React from 'react';
import {decode, encode} from 'base64-arraybuffer';
import {inflate, deflate} from 'uzip-module';

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();
const compressedPrefix = 'cb64,';
const uncompressedPrefix = 'b64,';

export const isCompressedBase64 = s => s.startsWith(compressedPrefix) || s.startsWith(uncompressedPrefix);
export function compressedBase64ToJSON(src) {
  const isCompressed = src.startsWith(compressedPrefix);
  const prefix = isCompressed ? compressedPrefix : uncompressedPrefix;
  const base64 = src.substr(prefix.length)
     .replace(/-/g, '+')
     .replace(/_/g, '/');
  const raw = new Uint8Array(decode(base64));
  const bin = isCompressed 
     ? inflate(raw)
     : raw;
  const json = utf8Decoder.decode(bin);
  return JSON.parse(json);
}

export function jsonToCompressedBase64(data) {
  const json = JSON.stringify(data);
  const bin = utf8Encoder.encode(json);
  const compressed = deflate(bin);
  const useCompressed = compressed.length < bin.length;
  const base64 = encode(useCompressed ? compressed : bin)
      .replace(/\+/g, '-')    // better for URLs because + and / have to be escaped
      .replace(/\//g, '_');
  const prefix = useCompressed ? compressedPrefix : uncompressedPrefix;
  return `${prefix}${base64}`;
}

export default function SaveAsURL(props) {
  const {data} = props;
  const src = jsonToCompressedBase64(data);
  const url = `${window.location.origin}?src=${encodeURIComponent(src)}`;
  return (
    <div>
      <div>Copy / bookmark the link below</div>
      <a className="bookmark" href={url} target="_blank" rel="noopener noreferrer">{url}</a>
    </div>
  );
}
