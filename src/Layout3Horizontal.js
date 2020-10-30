import React from 'react';
import Split from 'react-split-it';

import Files from './Files.js';
import Log from './Log.js';
import Runner from './Runner.js';

export default class Layout3Horizontal extends React.Component {
  registerFilesAPI = (api) => {
    this.filesAPI = api;
  }
  handleGoToLine = (data) => {
    this.filesAPI.goToLine(data);
  }
  render() {
    const {hackKey, data, registerRunnerAPI} = this.props;
    return (
      <Split direction="vertical" minSize={0}>
        <div className="layout-3-horizontal-top">
          <Files direction="horizontal" data={data} hackKey={hackKey} registerAPI={this.registerFilesAPI} />
        </div>
        <div className="layout-3-horizontal-bottom">
          <Split direction="vertical" sizes={[0.9, 0.1]}>
            <Runner registerAPI={registerRunnerAPI} />
            <Log onGoToLine={this.handleGoToLine} />
          </Split>
        </div>
      </Split>
    );
  };
}