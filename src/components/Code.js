import React from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/gfm/gfm.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/scroll/simplescrollbars.js';
import 'codemirror/addon/scroll/simplescrollbars.css';
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/jump-to-line.js';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/edit/matchtags.js';
import 'codemirror/addon/fold/xml-fold.js';

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
        refresh: _ => {
          this.editor.refresh();
        },
        focus: _ => {
          this.editor.focus();
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
    const codeMirrorOptions = {
      mode: 'javascript',
      scrollbarStyle: 'overlay',
      theme: isDarkMode ? 'material' : 'eclipse',
      matchBrackets: true,
      lineNumbers: true,
      ...(options.editor && options.editor),
    };
    if (codeMirrorOptions.mode.indexOf('html') >= 0) {
      codeMirrorOptions.matchTags = true;
    }
    return (
      <CodeMirror
        value={value}
        options={codeMirrorOptions}
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
