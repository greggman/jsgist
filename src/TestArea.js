import React from 'react';
import EditLine from './EditLine.js';
import CodeArea from './CodeArea.js';

export default function TestArea(props) {
  const {desc, title, onTitleChange, hackKey} = props;
  const heading = (
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