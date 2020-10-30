import React from 'react';
import Split from 'react-split-it';

import File from './File.js';
import Log from './Log.js';
import * as model from './model.js';
import Runner from './Runner.js';

const makeId = _ => `${Date.now()}-${Math.random()}`;

function fixSizes(sizes, lastSizes, ndx, show) {
  if (show) {
    // we're adding a size back in.
    const oldSize = lastSizes[ndx];
    const availableSpace = 1 - oldSize;
    const s = sizes.filter((_, i) => ndx !== i);
    const len = s.reduce((sum, size) => sum + size, 0);
    const newSizes = s.map(size => size / len * availableSpace);
    newSizes.splice(ndx, 0, oldSize);
    return newSizes;
  } else {
    // we're removing a size
    const s = sizes.map((size, i) => ndx === i ? 0 : size);
    const len = s.reduce((sum, size) => sum + size, 0);
    const newSizes = s.map(size => size / len);
    return newSizes;
  }
}

export default class Layout3Horizontal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showResult: true,
      showLog: true,
      sizes: [0.45, 0.45, 0.1],
      currentNdx: 2,
    };
    this.lastSizes = this.state.sizes.slice();
    this.files = new Map();
    this.fileToKeyMap = new Map();
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
  setSizes = (sizes) => {
    if (this.state.currentNdx >= 0) { this.lastSizes[0] = sizes[0] }
    if (this.state.showResult) { this.lastSizes[1] = sizes[1]; }
    if (this.state.showLow) { this.lastSizes[2] = sizes[2]; }
    this.setState({sizes});
  }
  handleGoToLine = (data) => {
    // this.files is Map of File components
    this.files.forEach((api, file) => {
      if (api.goToLine(data)) {
        const {files} = this.props.data;
        // this is gross (T_T)
        const ndx = files.findIndex(file => file.name === data.section);
        if (ndx !== this.state.currentNdx) {
          this.handleOnChange(ndx);
        }
      }
    });
  }
  handleOnChange = (ndx) => {
    const currentNdx = this.state.currentNdx === ndx ? -1 : ndx;
    this.setState({
      currentNdx,
      sizes: fixSizes(this.state.sizes, this.lastSizes, 0, currentNdx >= 0),
    });
  }
  toggleShowLog = () => {
    const showLog = !this.state.showLog;
    this.setState({
      showLog,
      sizes: fixSizes(this.state.sizes, this.lastSizes, 2, showLog),
    });
  }
  toggleShowResult = () => {
    const showResult = !this.state.showResult;
    this.setState({
      showResult,
      sizes: fixSizes(this.state.sizes, this.lastSizes, 1, showResult),
    });
  }
  componentDidUpdate() {
    if (this.previousNdx !== this.state.currentNdx) {
      this.previousNdx = this.state.currentNdx;
      this.files.forEach(api => {
        api.refresh();
        api.focus();
      });
    }
  }
  render() {
    const {hackKey, data, registerRunnerAPI} = this.props;
    const {showResult, showLog, sizes, currentNdx} = this.state;
    const resultStyle = {...(!showResult && {display: 'none'})}
    const logStyle = {...(!showLog && {display: 'none'})}
    return (
      <div className="layout-tabbed">
        <div className="layout-tabbed-top">
          <div className="tab-tabs">
            {
              data.files.map((file, ndx) => {
                const key = `ca${this.getFileKey(file)}`;
                return (
                  <React.Fragment key={key}>
                    <input
                      type="radio"
                      name="tabbed-files"
                      id={key}
                      checked={ndx === currentNdx}
                      onClick={_ => this.handleOnChange(ndx)}
                      onChange={_ => _} /* this is to shut up react */
                    />
                    <label htmlFor={key}>{file.name}</label>
                  </React.Fragment>
                );
              })
            }
            <input
              type="checkbox"
              checked={showResult}
              onChange={this.toggleShowResult}
              id="result"
            />
            <label htmlFor="result">result</label>
            <input
              type="checkbox"
              checked={showLog}
              onChange={this.toggleShowLog}
              id="log"
            />
            <label htmlFor="log">log</label>
          </div>
        </div>
        <Split direction="vertical" minSize={0} sizes={sizes} onSetSizes={this.setSizes}>
          <div className="tab-content">
          {
            data.files.map((file, ndx) => {
              const key = `ca${this.getFileKey(file)}`;
              return (
                <div key={key} style={{...(ndx !== currentNdx && {display: 'none'})}}>
                  <File
                    hackKey={hackKey}
                    desc="filename"
                    title={file.name}
                    value={file.content}
                    onTitleChange={name => model.setFileName(ndx, name)}
                    onValueChange={value => model.setFileContent(ndx, value)}
                    register={this.handleRegister}
                    unregister={this.handleUnregister}
                  />
                </div>
              );
            })
          }
          </div>
          <div className="layout-tabbed-result" style={resultStyle}><Runner registerAPI={registerRunnerAPI} /></div>
          <div className="layout-tabbed-log" style={logStyle}><Log onGoToLine={this.handleGoToLine} /></div>
        </Split>
      </div>
    );
  };
}