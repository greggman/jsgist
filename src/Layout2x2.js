import Ajv from 'ajv';
import React from 'react';
import Split from 'react-split-it';

import File from './File.js';
import Log from './Log.js';
import * as model from './model.js';
import Runner from './Runner.js';
import * as uiModel from './ui-model.js';
import {getOrFindNdx} from './utils.js';

const kUIStateKey = 'layout2x2';

const uiStateSchema = {
  "type": "object",
  "properties": {
    "hSizes:": { "type": "array", "items": {"type": "number"}, "minItems": 2},
    "v1Sizes:": { "type": "array", "items": {"type": "number"}, "minItems": 2},
    "v2Sizes:": { "type": "array", "items": {"type": "number"}, "minItems": 2},
  },
  "required": ["hSizes", "v1Sizes", "v2Sizes"],
};
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
const uiStateValidator = ajv.compile(uiStateSchema);

function NamedFile(props) {
  const {data, ndx, hackKey, register, unregister} = props;
  const file = data.files[ndx];
  return (
    <File
      //key={`ca${this.getFileKey(file)}`}
      hackKey={hackKey}
      desc="filename"
      title={file.name}
      value={file.content}
      onTitleChange={name => model.setFileName(ndx, name)}
      onValueChange={value => model.setFileContent(ndx, value)}
      register={register}
      unregister={unregister}
    />
  );
}


export default class Layout2x2 extends React.Component {
  constructor(props) {
    super(props);
    this.files = new Map();
    const state = uiModel.get()[kUIStateKey];
    this.state = uiStateValidator(state) ? state : {
      hSizes: [0.5, 0.5],
      v1Sizes: [0.4, 0.6],
      v2Sizes: [0.4, 0.5, 0.1],
    };
  }
  onSetHSizes = (sizes) => {
    this.setState({hSizes: sizes});
    uiModel.set(kUIStateKey, this.state);
  }
  onSetV1Sizes = (sizes) => {
    this.setState({v1Sizes: sizes});
    uiModel.set(kUIStateKey, this.state);
  }
  onSetV2Sizes = (sizes) => {
    this.setState({v2Sizes: sizes});
    uiModel.set(kUIStateKey, this.state);
  }
  handleRegister = (file, api) => {
    this.files.set(file, api);
  }
  handleUnregister = (file) => {
    this.files.delete(file);
  }
  handleGoToLine = (data) => {
    this.files.forEach(api => {
      api.goToLine(data);
    });
  }
  render() {
    const {hackKey, data, registerRunnerAPI} = this.props;
    const files = data.files;
    const mainHTMLNdx = getOrFindNdx(files, 'index.html', 'html');
    const mainJSNdx = getOrFindNdx(files, 'index.js', 'js', 'js', 'javascript');
    const mainCSSNdx = getOrFindNdx(files, 'index.css', 'css');
    const {hSizes, v1Sizes, v2Sizes} = this.state;

    return (
      <Split direction="horizontal" minSize={0} sizes={hSizes} onSetSizes={this.onSetHSizes}>
        <div className="left">
          <Split direction="vertical" minSize={0} sizes={v1Sizes} onSetSizes={this.onSetV1Sizes}>
            <NamedFile hackKey={hackKey} register={this.handleRegister} unregister={this.handleUnregister} data={data} ndx={mainHTMLNdx} />
            <NamedFile hackKey={hackKey} register={this.handleRegister} unregister={this.handleUnregister} data={data} ndx={mainJSNdx} />
          </Split>
        </div>
        <div className="right">
          <Split direction="vertical" minSize={0} sizes={v2Sizes} onSetSizes={this.onSetV2Sizes}>
            <NamedFile hackKey={hackKey} register={this.handleRegister} unregister={this.handleUnregister} data={data} ndx={mainCSSNdx} />
            <Runner registerAPI={registerRunnerAPI} />
            <Log onGoToLine={this.handleGoToLine} />
          </Split>
        </div>
      </Split>
    );
  };
}