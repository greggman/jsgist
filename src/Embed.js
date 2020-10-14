import React from 'react';

export default function Embed(props) {
  const {gistId} = props;
  return (
    <div>
      <div>
        <p>
        You can embed a jsGist by creating an iframe pointing to
        {' '}<code>jsgist.org/embed.html?src=&lt;src&gt;</code>{' '} where
        {' '}<code>&lt;src&gt;</code>{' '} is one of the forms above.
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