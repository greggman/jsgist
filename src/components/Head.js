import React from 'react';

export default function Head() {
  return (
    <div className="head">
      <div>
        <a target="_blank" rel="noopener noreferrer" href={window.location.origin}>
        <img src="/resources/images/logo-small.svg" alt="logo"/>
      {window.location.hostname}</a>
      </div>
      <div className="fix-help-contribute">
        <div className="octocat">
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/greggman/jsgist/">
            <img alt="github" src="/resources/images/octocat-icon.svg"/>
          </a>
        </div>
      </div>
    </div>
  );
}