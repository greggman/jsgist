import React from 'react';
import CodeArea from './CodeArea.js';

export default function NamedCodeArea(props) {
  const {title, hackKey} = props;
  const heading = (
    <div className="named">{title}</div>
  );

  return (
    <CodeArea hackKey={hackKey} heading={heading} {...props} />
  );
}