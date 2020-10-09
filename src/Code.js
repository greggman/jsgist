import React, {useState} from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/addon/scroll/simplescrollbars.js';
import 'codemirror/addon/scroll/simplescrollbars.css';

const darkMatcher = window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : {};
// darkMatcher.addListener(render);

const noop = () => {};

export default function Code(props) {
  const {value, hackKey, options = {}, onValueChange = noop} = props;
  const [localValue, setLocalValue] = useState(value);
  const isDarkMode = darkMatcher.matches;
  return (
    <CodeMirror
      key={hackKey}
      value={localValue}
      options={{
        mode: 'javascript',
        scrollbarStyle: 'overlay',
        theme: isDarkMode ? 'material' : 'eclipse',
        ...(options.editor && options.editor),
      }}
      onBeforeChange={(editor, data, value) => {
        setLocalValue(value);
      }}
      onChange={(editor, data, value) => {
        onValueChange(value);
      }}
    />
  );
};
