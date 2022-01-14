import React from 'react';
import CodeCodeMirror from './CodeCodeMirror';
import CodeMonaco from './CodeMonaco';
import * as uiModel from '../libs/ui-model.js';

export default class Code extends React.Component {
  componentDidMount() {
    uiModel.subscribe(this.handleChange);
  }
  componentWillUnmount() {
    uiModel.unsubscribe(this.handleChange);
  }
  handleChange = () => {
    this.forceUpdate();
  }
  render() {
    const ui = uiModel.get();
    const monaco = ui.editor === 'monaco';
    
    const {props} = this;
    const newProps = {...props, ui};
    return (
      monaco
          ? <CodeMonaco {...newProps}/>
          : <CodeCodeMirror {...newProps}/>
    );
  }
}
