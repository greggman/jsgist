import React from 'react';
import Editor from "@monaco-editor/react";
import { once } from '../libs/utils.ts';

const darkMatcher = window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : {};
// darkMatcher.addListener(render);

const noop = () => {};

async function getText(url) {
  const req = await fetch(url);
  return await req.text();
}

const addTypes = once(async function addTypes(monaco) {
  const basePath = '/types/webgpu/dist/index.d.ts';
  const text = await getText(basePath);
  monaco.languages.typescript.javascriptDefaults.addExtraLib(text, '');
});

function codeMirrorModeToLanguage(editor) {
  const language = (editor?.mode || 'javascript').split('/').pop();
  return language === 'gfm' ? 'markdown' : language;
}

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
    addTypes(monaco);
    editor.getModel().updateOptions({tabSize: 2});
    const {registerAPI} = this.props;
    if (registerAPI) {
      registerAPI({
        goToLine: (lineNo, colNo) => {
          this.editor.focus();
          this.editor.setPosition({lineNumber: lineNo, column: colNo});
          this.editor.revealPosition({lineNumber: lineNo, column: colNo})
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
    const {options = {}, onValueChange = noop, ui} = this.props;
    const {value} =  this.state;
    const isDarkMode = darkMatcher.matches;

    // Monaco options
    // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IEditorConstructionOptions.html

    // we pass in mime-type (eg. 'text/css' but monaco wants just 'css')
    const language = codeMirrorModeToLanguage(options.editor).split('/').pop();
    return (
      <Editor
        theme={isDarkMode ? "vs-dark" : "light"}
        language={language}
        value={value}
        onChange={onValueChange}
        onMount={this.handleEditorDidMount}
        options={{
          minimap: {enabled: false},
          lineNumbers: ui.lineNumbers ? "on" : "off",
          glyphMargin: false,
          folding: false,
          insertSpaces: !ui.tabs,
          renderWhitespace: ui.showWhitespace,
        }}
      />
    );
  }
};
