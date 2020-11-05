import Ajv from 'ajv';
import React from 'react';
import Split from 'react-split-it';

import Files from './Files.js';
import Log from './Log.js';
import Runner from './Runner.js';
import * as uiModel from './ui-model.js';

const kUIStateKey = 'layout3Vertical';

const uiStateSchema = {
  "type": "object",
  "properties": {
    "hSizes:": { "type": "array", "items": {"type": "number"}, "minItems": 2},
    "vSizes:": { "type": "array", "items": {"type": "number"}, "minItems": 2},
  },
  "required": ["hSizes", "vSizes"],
};
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
const uiStateValidator = ajv.compile(uiStateSchema);

export default class Layout3Vertical extends React.Component {
  constructor(props) {
    super(props);
    const state = uiModel.get()[kUIStateKey];
    this.state = uiStateValidator(state) ? state : {
      hSizes: [0.5, 0.5],
      vSizes: [0.9, 0.1],
    };
  }
  onSetVSizes = (sizes) => {
    this.setState({vSizes: sizes});
    uiModel.set(kUIStateKey, this.state);
  }
  onSetHSizes = (sizes) => {
    this.setState({hSizes: sizes});
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
    const {vSizes, hSizes} = this.state;
    return (
      <Split direction="horizontal" minSize={0} sizes={hSizes} onSetSizes={this.onSetHSizes}>
        <div className="left">
          <Files
            direction="vertical"
            uiStateKey={kUIStateKey}
            data={data}
            hackKey={hackKey}
            registerAPI={this.registerFilesAPI}
          />
        </div>
        <div className="right">
          <Split direction="vertical" minSize={0} sizes={vSizes} onSetSizes={this.onSetVSizes}>
            <Runner registerAPI={registerRunnerAPI} />
            <Log onGoToLine={this.handleGoToLine} />
          </Split>
        </div>
      </Split>
    );
  };
}