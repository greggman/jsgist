import React from 'react';

import {jsonToCompressedBase64} from '../libs/compression.js';

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
