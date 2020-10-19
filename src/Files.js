import React from 'react';

import * as model from './model.js';
import Split from './Split.js';
import File from './File.js';

export default class Files extends React.Component {
  constructor(props) {
    super(props);
    this.files = new Map();
  }
  handleRegister = (file, api) => {
    this.files.set(file, api);
  }
  handleUnregister = (file) => {
    this.files.delete(file);
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
    const {hackKey, data, extra} = this.props;
    return (
      <div className="codes">
        <Split
          direction="vertical"
          minSize={0}
        >
        {
          data.files.map((file, ndx) => {
            return (
              <File
                key={`ca${ndx}`}
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
