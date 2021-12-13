import React from 'react';
import Editor from "@monaco-editor/react";

const darkMatcher = window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : {};
// darkMatcher.addListener(render);

const noop = () => {};

export default class CodeMonaco extends React.Component {
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
  handleEditorDidMount = (editor, monaco) => {
    this.editor = editor;
    const {registerAPI} = this.props;
    if (registerAPI) {
      registerAPI({
        goToLine: (lineNo, colNo) => {
          this.editor.focus();
          this.editor.setPosition({lineNumber: lineNo, column: colNo});
        },
        refresh: _ => {
          // this.editor.refresh();
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

    // Monaco options
    // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IEditorConstructionOptions.html

    // we pass in mime-type (eg. 'text/css' but monaco wants just 'css')
    const language = (options.editor?.mode || 'javascript').split('/').pop();
    return (
      <Editor
        theme={isDarkMode ? "vs-dark" : "light"}
        language={language}
        value={value}
        onChange={onValueChange}
        onMount={this.handleEditorDidMount}
        options={{
          minimap: {enabled: false},
          lineNumbers: "off",
          glyphMargin: false,
          folding: false,
        }}
      />
    );
  }
};
