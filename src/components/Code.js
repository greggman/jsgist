import React from 'react';
import CodeMirrorEditor from './CodeMirrorEditor';
import MonacoEditor from './MonacoEditor';
import {isDevelopment} from '../libs/flags.js';
import * as uiModel from '../libs/ui-model.js';

const monacoUrl = isDevelopment
    ? 'http://localhost:8080/monaco-editor/vs/loader.js'
    : `${window.location.origin}/monaco-editor/vs/loader.js`;

let loading;

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const elem = document.createElement('script');
    elem.addEventListener('load', resolve);
    elem.addEventListener('error', reject);
    elem.type = 'application/javascript';
    elem.src = url;
    document.body.appendChild(elem);
  });
}

function loadMonaco() {
  return new Promise(resolve => {
    const r = window.require; // to shut up CRA
    r.config({ paths: { 'vs': 'monaco-editor/vs' }});
    r(['vs/editor/editor.main'], resolve);
  });
}

function canRunMonaco() {
  return !(/iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent));
}

function getEditor() {
  switch( uiModel.get().editor) {
    case 0:
      return canRunMonaco() ? MonacoEditor : CodeMirrorEditor;
    case 1:
      return CodeMirrorEditor;
    case 2:
      return MonacoEditor;
    default:
      return CodeMirrorEditor;
  }
}

export default class Code extends React.Component {
  constructor(props) {
    super(props);
    this.state = {Editor: window.monaco ? getEditor() : CodeMirrorEditor};
  }
  componentDidMount() {
    uiModel.subscribe(this.handleChange);
    this.load();
  }
  componentDidUpdate() {
    this.load();
  }
  componentWillUnmount() {
    uiModel.subscribe(this.handleChange);
  }
  handleChange = () => {
    this.setState({Editor: getEditor()});
    this.forceUpdate();
  }
  async loadMonaco() {
    await loadScript(monacoUrl);
    await loadMonaco();
  }
  async load() {
    if (!window.monaco && getEditor() === MonacoEditor) {
      if (!loading) {
        loading = this.loadMonaco();
      }
      await loading;
      this.setState({Editor: getEditor()});
    }
  }

  render() {
    const props = this.props;
    const {Editor} = this.state;
    return (<Editor {...props} />);
  }
};
