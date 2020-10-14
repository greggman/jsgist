
import React from 'react';
import Disqus from './Disqus.js';

export default function Footer(props) {
  return (
    <div className="comments">
      <hr/>
      {/*
      <div className="links">
         <a target="_blank" href="https://github.com/greggman/jsgist/issues/new?assignees=&labels=suggested+topic&template=suggest-topic.md&title=%5BSUGGESTION%5D">Suggestion</a>?<span> </span>
         <a target="_blank" href="https://github.com/greggman/jsgist/issues/new?assignees=&labels=&template=request.md&title=">Request</a>?<span> </span>
         <a target="_blank" href="https://github.com/greggman/jsgist/issues/new?assignees=&labels=bug+%2F+issue&template=bug-issue-report.md&title=">Issue</a>?<span> </span>
         <a target="_blank" href="https://github.com/greggman/jsgist/issues/new?assignees=&labels=bug+%2F+issue&template=bug-issue-report.md&title=">Bug</a>?
      </div>
      */}
      {
        props.disqusId ? (
          <React.Fragment>
            <div className="comment-notes">
               Use <b>&lt;pre&gt;&lt;code&gt;</b>code goes here<b>&lt;/code&gt;&lt;/pre&gt;</b> for code blocks
            </div>
            <Disqus disqusId={props.disqusId} title={props.title} />
          </React.Fragment>
        ) : []
      }
    </div>
  );
}