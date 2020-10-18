import React from 'react';

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
  addMsg = (type, msg) => {
    this._msgs.push({type, msg});
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
    return (
      <div className="logger">
        <div className="log-messages layout-scrollbar" ref={this.logMessagesRef}>
          { this.logManager.getMsgs().map((msg, ndx) => (
            <div key={`l${ndx}`} className={msg.type}>{msg.msg}</div>
          ))}
        </div>
      </div>
    );
  }
}