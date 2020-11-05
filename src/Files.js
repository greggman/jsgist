import Ajv from 'ajv';
import React from 'react';
import Split, {moveGuttersComputeNewSizes} from 'react-split-it';

import * as model from './model.js';
import File from './File.js';
import * as uiModel from './ui-model.js';

const makeId = _ => `${Date.now()}+${Math.random()}`;

const uiStateSchema = {
  "type": "object",
  "properties": {
    "sizes:": { "type": "array", "items": {"type": "number"}},
  },
  "required": ["sizes"],
};
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
const uiStateValidator = ajv.compile(uiStateSchema);

export default class Files extends React.Component {
  constructor(props) {
    super(props);
    this.files = new Map();
    this.fileToKeyMap = new Map();
    this.kUIStateKey = `${props.uiStateKey}-files`;
    const state = uiModel.get()[this.kUIStateKey];
    this.state = uiStateValidator(state) ? state : {
      sizes: [],
    };
    if (this.state.sizes.length !== props.data.files.length) {
      this.state.sizes = props.data.files.map((_, i) => 1 / props.data.files.length);
    }
  }
  onSetSizes = (sizes) => {
    this.setState({sizes});
    uiModel.set(this.kUIStateKey, this.state);
  }
  handleRegister = (file, api) => {
    this.files.set(file, api);
  }
  handleUnregister = (file) => {
    this.files.delete(file);
  }
  getFileKey(test) {
    let key = this.fileToKeyMap.get(test);
    if (!key) {
      key = makeId();
      this.fileToKeyMap.set(test, key);
    }
    return key;
  }
  componentDidMount() {
    const {registerAPI} = this.props;
    registerAPI({
      goToLine: (data) => {
        this.files.forEach(api => {
          api.goToLine(data);
        });
      },
    });
  }
  render() {
    const {hackKey, data, extra, direction} = this.props;
    const {sizes} = this.state;
    return (
      <div className="codes">
        <Split
          direction={direction}
          minSize={0}
          sizes={sizes}
          onSetSizes={this.onSetSizes}
          computeNewSizesFn={moveGuttersComputeNewSizes}
        >
        {
          data.files.map((file, ndx) => {
            return (
              <File
                key={`ca${this.getFileKey(file)}`}
                hackKey={hackKey}
                desc="filename"
                title={file.name}
                value={file.content}
                onTitleChange={name => model.setFileName(ndx, name)}
                onValueChange={value => model.setFileContent(ndx, value)}
                register={this.handleRegister}
                unregister={this.handleUnregister}
                extra={extra}
              />
            );
          })
        }
        </Split>
      </div>
    );
  }
}

//         {/*<button onClick={() => model.addFile()}>+</button>*/}
