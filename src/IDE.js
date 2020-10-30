import React from 'react';

import Layout3Vertical from './Layout3Vertical.js';
import Layout3Horizontal from './Layout3Horizontal.js';
import Layout2x2 from './Layout2x2.js';
import LayoutTabbed from './LayoutTabbed.js';

import * as uiModel from './ui-model.js';

const layoutModes = [
  Layout3Vertical,
  Layout3Horizontal,
  Layout2x2,
  LayoutTabbed,
];

export default class IDE extends React.Component {
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
    const mode = uiModel.get().layout;
    return React.createElement(layoutModes[mode], this.props);
  }
}

