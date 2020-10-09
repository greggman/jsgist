import React from 'react';

export default function SaveAsJSON(props) {
  const {data} = props;
  return (
    <div>
      <div>
        Copy the text below, paste into the load ui or put somewhere on the net
        and make your own URL with <code>{window.location.origin}?src=url-to-json</code>.
      </div>
      <pre style={{userSelect: 'all'}}>{JSON.stringify(data)}</pre>
      <div><a href={`${window.location.origin}?src=${encodeURIComponent(`${window.location.origin}/example.json`)}`}>Example</a></div>
    </div>
  );
}