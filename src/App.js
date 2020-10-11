import React from 'react';
import Split from 'react-split';

import EditLine from './EditLine.js';
import Footer from './Footer.js';
import GitHub from './GitHub.js';
import Help from './Help.js';
import Load from './Load.js';
import * as model from './model.js';
import Save from './Save.js';
import Settings from './Settings.js';
import TestArea from './TestArea.js';
import Runner from './Runner.js';
import {isCompressedBase64, compressedBase64ToJSON} from './SaveAsURL.js';

import './App.css';

const idRE = /^[a-z0-9]+$/i;
const isGistId = s => idRE.test(s);

if (process.env.NODE_ENV === 'development') {
  window.d = model.data;
}

const noJSX = () => [];
const darkMatcher = window.matchMedia('(prefers-color-scheme: dark)');
const makeDisqusId = () => {
  const loc = window.location;
  const query = Object.fromEntries(new URLSearchParams(loc.search).entries());
  const src = query.src;
  return src
      ? `${loc.origin}${loc.pathname}?src=${encodeURIComponent(src)}`
      : '';
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      path: window.location.pathname,
      disqusId: makeDisqusId(),
      dark: darkMatcher.matches,
      loading: false,
      dialog: noJSX,
      dataVersion: 0,
      gistId: '',
      pat: localStorage.getItem('pat'),
      runningData: JSON.stringify(model.getBlankData()),
      blank: true,
      messages: [],
    };
    this.github = new GitHub();
  }
  componentDidMount() {
    model.add('path', window.location.pathname);
    model.subscribe('path', (newValue) => {
      window.history.pushState({}, '', newValue);
      this.setState({
        path: newValue,
        disqusId: makeDisqusId(),
      });
    });
    // I still am not sure how I'm supposed to handle this.
    // Putting my model in the state itself seems wrong
    // and doesn't actually help since I'd have to 
    // generate an entirely new state object to change any
    // nested property.
    //
    // Storing the data outside I see no way to tell
    // components to re-render except to call forceUpdate
    // which all the documentation says "if you call this
    // you're doing it wrong".
    //
    // Redux is a joke. 50 lines code needed to set
    // a single field. Repeat those 50 lines for every field.
    // Things like redux-tools make it less to type those
    // 50 lines but they still execute 50 to 500 lines of code
    // just to set a single value.
    model.subscribe('dataVersion', (dataVersion) => {
      this.setState({dataVersion})
    });
    // this is a hack because I can't figure out how to
    // update the CodeMirror areas
    model.subscribe('updateVersion', (updateVersion) => {
      this.setState({updateVersion})
    });

    darkMatcher.addEventListener('change', () => {
      this.setState({dark: darkMatcher.matches});
    });

    const query = Object.fromEntries(new URLSearchParams(window.location.search).entries());
    const backup = localStorage.getItem('backup');
    let loaded = false;
    if (backup) {
      try {
        const data = JSON.parse(backup);
        if (data.href === window.location.href) {
          model.setData(data.data);
          loaded = true;
          this.addInfo('loaded backup from local storage')
        }
      } catch (e) {
        //
      }
      localStorage.removeItem('backup');
    }
    if (!loaded && query.src) {
      this.loadData(query.src);
    }
  }
  async loadData(src) {
    this.setState({loading: true});
    try {
      if (isGistId(src)) {
        const data = await this.github.getAnonGist(src);
        model.setData(data);
        this.setState({gistId: src})
      } else if (isCompressedBase64(src)) {
        const data = compressedBase64ToJSON(src);
        model.setData(data);
      } else {
        const res = await fetch(src);
        const data = await res.json();
        model.setData(data);
      }
    } catch (e) {
      console.warn(e);
      this.addError(`could not load jsGist: src=${src} ${e}`);
    }
    this.setState({loading: false});
  }
  addMsg = (msg, className) => {
    this.setState({messages: [{msg, className}, ...this.state.messages]});
    setTimeout(() => {
      this.setState({messages: this.state.messages.slice(0, this.state.messages.length - 1)});
    }, 5000);
  }
  addInfo = (msg) => this.addMsg(msg, 'info');
  addError = (msg) => this.addMsg(msg, 'error');
  closeDialog = () => {
    this.setState({dialog: noJSX});
  }
  handleNew = async() => {
    model.setData(model.getNewData());
  }
  handleRun = async () => {
    localStorage.setItem('backup', JSON.stringify({
      href: window.location.href,
      data: model.data,
    }));
    this.setState({
      // We pass in JSON because we need to check if anything changed
      // If we passed in an object we'd have to do a deep compare.
      // We need to check if it changed because since we're generating
      // a blob we'll end up with a new random number every time
      // which means our virtual dom changes which means we'll get
      // re-rendered, even though we aren't actually different.
      runningData: JSON.stringify(model.data),
      blank: false,
    })
  }
  handleStop = async () => {
    this.setState({
      runningData: JSON.stringify(model.getBlankData()),
      blank: true,
    })
  }
  handleSave = async () => {
    this.setState({dialog: this.renderSave});
  }
  handleSettings = () => {
    this.setState({dialog: this.renderSettings});
  }
  handleHelp = () => {
    this.setState({dialog: this.renderHelp});
  }
  handleLoad = () => {
    this.setState({dialog: this.renderLoad});
  }
  handleOnLoad = async() => {
    this.setState({dialog: noJSX});
  }
  handleOnSave = (gistId) => {
    window.history.pushState({}, '', `${window.location.origin}?src=${gistId}`);
    this.setState({dialog: noJSX, gistId});
  }
  handleAbort = () => {
    this.abort();
  };
  renderHelp = () => {
    return (<Help onClose={this.closeDialog} />);
  }
  renderSettings = () => {
    return (
      <Settings onClose={this.closeDialog} />
    );
  }
  renderLoad = () => {
    return (
      <Load
        onLoad={this.handleOnLoad}
        onClose={this.closeDialog}
        addError={this.addError}
        github={this.github}
      />
    );
  }
  renderSave = () => {
    const data = model.data;
    return (
      <Save
        onSave={this.handleOnSave}
        onClose={this.closeDialog}
        addError={this.addError}
        github={this.github}
        gistId={this.state.gistId}
        data={data} />
    );
  }
  render() {
    const data = model.data;
    const {loading, blank, dialog, disqusId, runningData, updateVersion: hackKey} = this.state;
    const extra = [];
    return (
      <div className="App">
        <div className="content">
          <div className="head">
            <div>
              <img src="/resources/images/logo.svg" alt="logo"/>
            jsGist.org<span className="beta">(beta)</span>
            </div>
            <div>
            <a href="https://github.com/greggman/jsgist/">
              <img alt="github" src="/resources/images/octocat-icon.svg"/>
            </a>
            </div>
          </div>
          <div className="top">
            <div className="left">
              <EditLine value={data.name} onChange={v => model.setName(v)} />
            </div>
            <div className="right">
              <button tabIndex="1" onClick={this.handleRun}>Run</button>
              <button tabIndex="1" onClick={this.handleStop}>Stop</button>
              <button tabIndex="1" onClick={this.handleSave}>Save</button>
              <button tabIndex="1" onClick={this.handleNew}>New</button>
              <button tabIndex="1" onClick={this.handleLoad}>Load</button>
              <button tabIndex="1" onClick={this.handleSettings} title="settings"><img src={`${window.location.origin}/resources/images/gear.svg`} alt="settings"></img></button>
              <button tabIndex="1" onClick={this.handleHelp} title="help">?</button>
            </div>
          </div>
          {
            loading ? [] : (
              <div className="bottom">
                <Split sizes={[50, 50]} direction="horizontal">
                  <div className="left">
                    <div className="codes">
                    <Split
                      direction="vertical"
                      sizes={data.files.map((_, __, a) => 100 / a.length )}
                      minSize={0}
                    >
                    {
                      data.files.map((file, ndx) => {
                        return (
                          <TestArea
                            key={`ca${ndx}`}
                            hackKey={hackKey}
                            desc="filename"
                            title={file.name}
                            value={file.content}
                            onTitleChange={name => model.setFileName(ndx, name)}
                            onValueChange={value => model.setFileContent(ndx, value)}
                            extra={extra}
                          />
                        );
                      })
                    }
                    </Split>
                    </div>
                      {/*<button onClick={() => model.addFile()}>+</button>*/}
                  </div>
                  <div className="right">
                    <Runner data={runningData} blank={blank} />
                  </div>
                </Split>
              </div>
            )
          }
        </div>
        <Footer
          disqusId={disqusId}
          disqusShortName="jsgist"
          title={data.name}
        />
        {dialog()}
        <div className="messages">
          {
            this.state.messages.map(({msg, className}, i) => (<div className={className} key={`err${i}`}>{msg}</div>))
          }
        </div>
      </div>
    );
  }
}

export default App;
