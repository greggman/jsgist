import React from 'react';
import Split from 'react-split-it';

import File from './File.js';
import Log from './Log.js';
import * as model from './model.js';
import Runner from './Runner.js';
import {getOrFindNdx} from './utils.js';

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

    return (
      <Split direction="horizontal" minSize={0}>
        <div className="left">
          <Split direction="vertical" minSize={0} sizes={[0.4, 0.6]}>
            <NamedFile hackKey={hackKey} register={this.handleRegister} unregister={this.handleUnregister} data={data} ndx={mainHTMLNdx} />
            <NamedFile hackKey={hackKey} register={this.handleRegister} unregister={this.handleUnregister} data={data} ndx={mainJSNdx} />
          </Split>
        </div>
        <div className="right">
          <Split direction="vertical" sizes={[0.4, 0.5, 0.1]}>
            <NamedFile hackKey={hackKey} register={this.handleRegister} unregister={this.handleUnregister} data={data} ndx={mainCSSNdx} />
            <Runner registerAPI={registerRunnerAPI} />
            <Log onGoToLine={this.handleGoToLine} />
          </Split>
        </div>
      </Split>
    );
  };
}