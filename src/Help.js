import React from 'react';
import Dialog from './Dialog.js';

export default function Help(props) {
  const {onClose} = props;
  return (
    <Dialog title="jsBenchIt" onClose={onClose}>
      <p>Add your test cases, click --Run--.</p>
      <h2>Contribute, Fix, Enhance!</h2>
      <p>
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/greggman/jsbenchit">https://github.com/greggman/jsbenchit</a>
      </p>
      <p>Also see <a target="_blank" rel="noopener noreferrer" href="https://jsgist.org">jsgist.org</a></p>
      <h2>Saving</h2>
      <p>You can save your tests in multiple ways.</p>
      <ol>
        <li>To a github gist using a <a target="_blank" rel="noopener noreferrer" href="https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token">Personal Access Token</a>
          <p>
           Be sure to give the token <b>ONLY GIST</b> permissions. Paste it into the
           save as UI click <code>Save to new gist</code>. Be sure to keep a copy of it
           somewhere so you can use if you clear your browser's storage or switch
           machines or browser. This site is a static site. The token is saved
           in the browser only.
          </p>
        </li>
        <li>Save it manually into github
          <p>
           Copy the JSON. Go to github. Create a new gist. Name the file
           <code>jsBenchIt.json</code> Paste the JSON in. Pick "Create public gist".
          </p>
          <p>
           Note the id in the URL after you create the gist.
          </p>
          <p>
           Create a url in the form <code>https://jsbenchit.org/?src=&lt;gist_id&gt;--</code>.
          </p>
          <p>
           Example: <a target="_blank" rel="noopener noreferrer" href="https://jsbenchit.org/?src=524016d2dd0fb3de37c8c8dac8e1c35b">https://jsbenchit.org/?src=524016d2dd0fb3de37c8c8dac8e1c35b</a>
          </p>
        </li>
        <li>Save it manually somewhere else.
          <p>
           If there's some other service that will provide a string via
           http get then copy and save the JSON there then create a URL
           in the form of <code>https://jsbenchit.org/?src=&lt;url&gt;</code>. Note: you
           will have to escape the URL although if just paste it into your
           browser it will likely do the conversion for you.
          </p>
        </li>
        <li>Save it as a bookmark or link
          <p>
           In the SaveAs dialog there's a link that contains all the data
           for your benchmark.
          </p>
        </li>
      </ol>
    <h2>Comparing across browsers</h2>
    <p>
      Saving saves the results of the benchmark so if you want to compare
      across browsers:
    </p>
    <h3>With Personal Access Token</h3>
    <ol>
      <li>Create your benchmark</li>
      <li>Run it</li>
      <li>Save a new gist using Personal Access Token</li>
      <li>Copy URL to another browser</li>
      <li>Run it</li>
      <li>Save over old gist using Personal Access Token</li>
    </ol>
    <p>Repeat steps 4, 5, 6 on other browsers.</p>
    <h3>With URL</h3>
    <ol>
      <li>Create your benchmark</li>
      <li>Run it</li>
      <li>Pick Save and copy the URL</li>
      <li>Copy URL to another browser</li>
      <li>Run it</li>
      <li>Pick Save and copy the URL</li>
    </ol>
    <p>Repeat steps 4, 5, 6 on other browsers.</p>
    <p>Note: In general it only makes sense to compare results of browsers
       on the same machine.</p>
    </Dialog>
  );
}