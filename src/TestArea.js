import mime from 'mime-types';
import React from 'react';
// import EditLine from './EditLine.js';
import CodeArea from './CodeArea.js';

export default function TestArea(props) {
  const {title, hackKey} = props;
  const heading = (
    <div style={{width: '100%'}}>{title}</div>
  );
  const mimeType = mime.lookup(title) || (title.toLowerCase() === 'javascript' ? 'application/javascript' : 'application/octet-stream');
  const options = {
    ...props.options,
    editor: {
      ...(props.options?.editor && props.options.editor),
      mode: mimeType,
    },
  };
  return (
    <CodeArea key={hackKey} {...props} options={options} heading={heading} />
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
