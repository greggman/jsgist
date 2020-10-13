import React from 'react';
// import EditLine from './EditLine.js';
import CodeArea from './CodeArea.js';

export default function TestArea(props) {
  const {title, hackKey} = props;
  const heading = (
    <div style={{width: '100%'}}>{title}</div>
  );

  return (
    <CodeArea key={hackKey} {...props} heading={heading} />
  );
}

/*
export default function TestArea(props) {
  const {desc, title, onTitleChange, hackKey} = props;
  const heading = (
    <div>{title}</div>
    <EditLine
      placeholder={desc}
      value={title}
      onChange={onTitleChange}
    />
  );

  return (
    <CodeArea key={hackKey} {...props} heading={heading} />
  );
}
*/