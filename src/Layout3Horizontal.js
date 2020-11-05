import Ajv from 'ajv';
import React from 'react';
import Split from 'react-split-it';

import Files from './Files.js';
import Log from './Log.js';
import Runner from './Runner.js';
import * as uiModel from './ui-model.js';

const kUIStateKey = 'layout3Horizontal';

const uiStateSchema = {
  "type": "object",
  "properties": {
    "tSizes:": { "type": "array", "items": {"type": "number"}, "minItems": 2},
    "bSizes:": { "type": "array", "items": {"type": "number"}, "minItems": 2},
  },
  "required": ["tSizes", "bSizes"],
};
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
const uiStateValidator = ajv.compile(uiStateSchema);

export default class Layout3Horizontal extends React.Component {
  constructor(props) {
    super(props);
    const state = uiModel.get()[kUIStateKey];
    this.state = uiStateValidator(state) ? state : {
      tSizes: [0.5, 0.5],
      bSizes: [0.9, 0.1],
    };
  }
  onSetTSizes = (sizes) => {
    this.setState({tSizes: sizes});
    uiModel.set(kUIStateKey, this.state);
  }
  onSetBSizes = (sizes) => {
    this.setState({bSizes: sizes});
    uiModel.set(kUIStateKey, this.state);
  }
  registerFilesAPI = (api) => {
    this.filesAPI = api;
  }
  handleGoToLine = (data) => {
    this.filesAPI.goToLine(data);
  }
  render() {
    const {hackKey, data, registerRunnerAPI} = this.props;
    const {tSizes, bSizes} = this.state;
    return (
      <Split direction="vertical" minSize={0} sizes={tSizes} onSetSizes={this.onSetTSizes}>
        <div className="layout-3-horizontal-top">
          <Files uiStateKey={kUIStateKey} direction="horizontal" data={data} hackKey={hackKey} registerAPI={this.registerFilesAPI} />
        </div>
        <div className="layout-3-horizontal-bottom">
          <Split direction="vertical"  sizes={bSizes} onSetSizes={this.onSetBSizes}>
            <Runner registerAPI={registerRunnerAPI} />
            <Log onGoToLine={this.handleGoToLine} />
          </Split>
        </div>
      </Split>
    );
  };
}