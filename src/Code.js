import React from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/addon/scroll/simplescrollbars.js';
import 'codemirror/addon/scroll/simplescrollbars.css';

const darkMatcher = window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : {};
// darkMatcher.addListener(render);

const noop = () => {};

export default class Code extends React.Component {
  constructor(props) {
    super(props);
    const {value, hackKey} = props;
    this.state = {value, hackKey}
  }
  static getDerivedStateFromProps(props, state) {
    const needNewData = state.hackKey !== props.hackKey;
    return (needNewData)
       ? {hackKey: props.hackKey, value: props.value}
       : null;
  }
  componentDidMount() {
    const {registerAPI} = this.props;
    if (registerAPI) {
      registerAPI({
        goToLine: (lineNo, colNo) => {
          this.editor.focus();
          this.editor.doc.setCursor(lineNo - 1, colNo - 1);
        },
      });
    }
  }
  registerEditor = (editor) => {
    this.editor = editor;
  }
  render() {
    const {options = {}, onValueChange = noop} = this.props;
    const {value} =  this.state;
    const isDarkMode = darkMatcher.matches;
    return (
      <CodeMirror
        value={value}
        options={{
          mode: 'javascript',
          scrollbarStyle: 'overlay',
          theme: isDarkMode ? 'material' : 'eclipse',
          ...(options.editor && options.editor),
          lineNumbers: true,
        }}
        onBeforeChange={(editor, data, value) => {
          this.setState({value});
        }}
        onChange={(editor, data, value) => {
          onValueChange(value);
        }}
        editorDidMount={this.registerEditor}
      />
    );
  }
};
