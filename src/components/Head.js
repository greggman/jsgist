import React from 'react';

export default function Head() {
  return (
    <div className="head">
      <div>
        <a target="_blank" rel="noopener noreferrer" href={window.location.origin}>
        <img src="/resources/images/logo-small.svg" alt="logo"/>
      {window.location.hostname}<span className="beta">(beta)</span></a>
      </div>
      <div className="fix-help-contribute">
        <div className="three-words">
          <div><a target="_blank" rel="noopener noreferrer" href="https://github.com/greggman/jsgist/">Fix</a></div>
          <div><a target="_blank" rel="noopener noreferrer" href="https://github.com/greggman/jsgist/">Help</a></div>
          <div><a target="_blank" rel="noopener noreferrer" href="https://github.com/greggman/jsgist/">Contribute</a></div>
        </div>
        <div className="octocat">
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/greggman/jsgist/">
            <img alt="github" src="/resources/images/octocat-icon.svg"/>
          </a>
        </div>
      </div>
    </div>
  );
}