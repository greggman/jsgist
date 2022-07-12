import Ajv from 'ajv';
import React from 'react';
import Split from 'react-split-it';
import Log from './Log.js';
import Runner from './Runner.js';
import * as uiModel from '../libs/ui-model.js';

const kUIStateKey = 'layout1';

const uiStateSchema = {
  "type": "object",
  "properties": {
    "vSizes:": { "type": "array", "items": {"type": "number"}, "minItems": 2},
  },
  "required": ["vSizes"],
};
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
const uiStateValidator = ajv.compile(uiStateSchema);

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    const state = uiModel.get()[kUIStateKey];
    this.state = uiStateValidator(state) ? state : {
      vSizes: [0.95, 0.05],
    };
  }
  onSetVSizes = (sizes) => {
    this.setState({vSizes: sizes});
    uiModel.set(kUIStateKey, this.state);
  }
  render() {
    const {registerRunnerAPI} = this.props;
    const {vSizes} = this.state;
    return (
      <Split direction="vertical" minSize={0} sizes={vSizes} onSetSizes={this.onSetVSizes}>
        <Runner registerAPI={registerRunnerAPI} />
        <Log onGoToLine={this.handleGoToLine} />
      </Split>
    );
  };
}