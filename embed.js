!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);function r(e,t,...n){return e.find(e=>e.name.toLowerCase()===t.toLowerCase)||function(e,t){for(const n of t){const t=e.find(e=>e.name.toLowerCase().endsWith(n.toLowerCase()));if(t)return t}return""}(e,n)}function o(e,t){const n=new URL(e),r=new URLSearchParams(n.search);for(const[e,n]of Object.entries(t))void 0===n?r.delete(e):r.set(e,n);return n.search=r.toString(),n.href}!async function(){const e=Object.fromEntries(new URLSearchParams(window.location.search).entries()),t=await fetch("https://api.github.com/gists/"+e.src),n=function(e){const t=JSON.parse(e.files["jsGist.json"].content);return t.files=Object.entries(e.files).filter(([e])=>"jsGist.json"!==e).map(([e,t])=>({name:e,content:t.content})).concat(t.files||[]),t}(await t.json()),c=document.querySelector(".head a");c.textContent="jsGist - "+n.name,c.href=o(window.location.origin,{src:e.src}),e.noheader&&(document.querySelector(".head").style.display="none");const i=n.files,s=r(i,"index.html","html"),a=r(i,"index.js","js","js","javascript"),u=r(i,"index.css","css"),l=`\n<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="utf-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n    <title>${f=n.name,f.replace(/</g,"&lt;")}</title>\n    <style>\n    ${u.content}\n    </style>\n  </head>\n  <body>\n  ${s.content}\n  </body>\n  <script type="module">\n  ${a.content}\n  <\/script>\n</html>\n  `;var f;const d=new Blob([l],{type:"text/html"});document.querySelector("iframe").src=URL.createObjectURL(d)}()}]);