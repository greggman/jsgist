import React from 'react';
import Dialog from './Dialog.js';

export default function Help(props) {
  const {onClose} = props;
  return (
    <Dialog title="jsGist" onClose={onClose}>
      <div className="markdown">
      <p>Add your test cases, click <code>Run</code>.</p>
      <h2>Contribute, Fix, Enhance!</h2>
      <p>
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/greggman/jsgist">https://github.com/greggman/jsgist</a>
      </p>
      <p>Also see <a target="_blank" rel="noopener noreferrer" href="https://jsbenchit.org">jsbenchit.org</a></p>
      <h2>Saving</h2>
      <p>You can save your tests in multiple ways.</p>
      <ol>
        <li>Save to a github gist by logging in</li>
        <li>Save it manually into github
          <p>
           Copy the JSON. Go to github. Create a new gist. Name the file
           <code>jsGist.json</code> Paste the JSON in. Pick "Create public gist".
          </p>
          <p>
           Note the id in the URL after you create the gist.
          </p>
          <p>
           Create a url in the form <code>https://jsgist.org/?src=&lt;gist_id&gt;--</code>.
          </p>
          <p>
           Example: <a target="_blank" rel="noopener noreferrer" href="https://jsgist.org/?src=bad0a8491bd6614e729ff01cc14089c9">https://jsgist.org/?src=bad0a8491bd6614e729ff01cc14089c9</a>
          </p>
        </li>
        <li>Save it manually somewhere else.
          <p>
           If there's some other service that will provide a string via
           http get then copy and save the JSON there then create a URL
           in the form of <code>https://jsgist.org/?src=&lt;url&gt;</code>. Note: you
           may have to escape the URL.
          </p>
        </li>
        <li>Save it as a bookmark or link
          <p>
           In the SaveAs dialog there's a link that contains all the data
           for your benchmark.
          </p>
        </li>
      </ol>
      </div>
    </Dialog>
  );
}