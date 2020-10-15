import React from 'react';

export default function Embed(props) {
  const {gistId} = props;
  return (
    <div>
      <div>
        <p>
        You can embed a jsGist by creating an iframe pointing to
        {' '}<code>https://jsgist.org/embed.html?src=&lt;src&gt;</code>{' '} where
        {' '}<code>&lt;src&gt;</code>{' '} is one of the forms above. Either
        {' '}<code>?src=&lt;gist_id&gt;</code>{' '}or
        {' '}<code>?src=&lt;base64url&gt;</code>{' '}or
        {' '}<code>?src=&lt;url_to_json&gt;</code>{' '}.
        You can also add {' '}<code>noheader=true</code>{' '} if you don't want the header
        to appear. You can also just run them directly rather
        than put in an iframe. <a target="_blank" rel="noopener noreferrer" href="https://jsgist.org/embed.html?src=bad0a8491bd6614e729ff01cc14089c9">[example]</a>{' '}
        <a target="_blank" rel="noopener noreferrer" href={'https://jsgist.org/embed.html?src=bad0a8491bd6614e729ff01cc14089c9&noheader=true'}>[example no header]</a>
        </p>
        { gistId
          ? (
            <React.Fragment>
              <p>
              For example:
              </p>
              <pre><code>
      &lt;iframe src="https://jsgist.org/embed.html?src={gistId}" &gt;&lt;/iframe&gt;
              </code></pre>
            </React.Fragment>
          )
          : []
        }
        <p>
        </p>
      </div>
    </div>
  );
}