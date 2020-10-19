import React from 'react';
import {classNames} from './css-utils';

function isMsgSame(oldMsg, newMsg) {
  if (!!oldMsg !== !!newMsg) {
    return false;
  }
  const keys = Object.keys(oldMsg).filter(key => key !== 'count');
  if (keys.length !== Object.keys(newMsg).length) {
    return false;
  }
  for (const key of keys) {
    if (oldMsg[key] !== newMsg[key]) {
      return false;
    }
  }
  return true;
}

export class LogManager extends EventTarget {
  constructor() {
    super();
    this._msgs = [];
  }
  _notify() {
    this.dispatchEvent(new Event('change'));
  }
  clear = () => {
    this._msgs = [];
    this._notify();
  }
  addMsg = (data) => {
    const lastData = this._msgs[this._msgs.length - 1];
    if (isMsgSame(lastData, data)) {
      lastData.count = (lastData.count || 0) + 1;
    } else {
      this._msgs.push(data);
    }
    this._notify();
  }
  getMsgs() {
    return this._msgs
  }
}

export default class Log extends React.Component {
  constructor(props) {
    super(props);
    const {logManager} = props;
    this.logManager = logManager;
    this.logMessagesRef = React.createRef();
  }
  handleChange = () => {
    this.forceUpdate();
  }
  componentDidMount() {
    this.logManager.addEventListener('change', this.handleChange);
  }
  componentWillUnmount() {
    this.logManager.removeEventListener('change', this.handleChange);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot !== null) {
      // if we were at the bottom of the log then
      // stay at the bottom of the log
      if (snapshot < 1) {
        const elem = this.logMessagesRef.current;
        elem.scrollTop = elem.scrollHeight - elem.parentElement.clientHeight;
      }
    }
  }
  getSnapshotBeforeUpdate(prevProps, prevState) {
    const elem = this.logMessagesRef.current;
    return elem.scrollHeight - (elem.scrollTop + elem.parentElement.clientHeight);
  }
  render() {
    const {onGoToLine} = this.props;
    return (
      <div className="logger">
        <div className="log-messages layout-scrollbar" ref={this.logMessagesRef}>
          { this.logManager.getMsgs().map((msg, ndx) => (
            <div className={classNames('log-line',{[msg.type]: true})} key={`l${ndx}`}>
              <div className={msg.count ? "count" : "no-count"}>{msg.count ? msg.count : ''}</div>
              <div className="msg">
                {msg.msg}
                <div
                  className={classNames('file', {fileLink: msg.section})}
                  onClick={() => onGoToLine(msg)}
                >
                  {msg.section || msg.url}:{msg.lineNo}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}