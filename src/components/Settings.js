import React from 'react';

import Dialog from './Dialog.js';
import Section from './Section.js';
import ServiceContext from '../ServiceContext.js';

import verticalIcon from '../icons/vertical-layout.svg';
import horizontalIcon from '../icons/horizontal-layout.svg';
import twoByTwoIcon from '../icons/two-by-two-layout.svg';
import tabbedIcon from '../icons/tabbed-layout.svg';

import {classNames} from '../libs/css-utils.js';
import * as uiModel from '../libs/ui-model.js';

function RadioOption(props) {
  const {children, onChange, selected} = props;
  return (
    <div className={classNames({radioSelected: selected})} onClick={onChange}>
      {children}
    </div>
  );
}

function Radio(props) {
  const {selected, onChange, children} = props;

  const newChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return null;
    }

    const {result} = child.props;
    const isSelected = result === selected;

    //const id = childNdx;
    //childNdx += 1;
    return React.cloneElement(child, {
      //...child.props,
      selected: isSelected,
      onChange: () => onChange(result),
    });
  });

  return (
    <div className="radio">
      {newChildren}
    </div>
  );
}

function Checkbox(props) {
  const {id, label, checked, onChange} = props;
  const elemId = `checkbox-${id}`;
  return (
    <div>
      <input 
        id={elemId} 
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={elemId}>{label}</label>
    </div>
  );
}

class Logout extends React.Component {
  componentDidMount() {
    const {userManager} = this.context;
    userManager.subscribe(this.handleChange);
  }
  componentWillUnmount() {
    const {userManager} = this.context;
    userManager.unsubscribe(this.handleChange);
  }
  handleChange = () => {
    this.forceUpdate();
  }
  handleLogout = () => {
    const {userManager} = this.context;
    userManager.logout();
  }
  render() {
    const {userManager} = this.context;
    const userData = userManager.getUserData();
    return (!!userData &&
      <Section heading="Logout">
        <div className="logout">Logged in as:&nbsp;
          {!!userData.login && <div className="username"><a target="_blank" rel="noopener noreferrer" href={`https://github.com/${userData.login}`}>{userData.login}</a></div>}
          {!!userData.avatar_url && <a className="user-avatar" target="_blank" rel="noopener noreferrer" href={`https://github.com/${userData.login}`}><img className="avatar" src={userData.avatar_url} alt="avatar"/></a>}
        </div>
        <button onClick={this.handleLogout}>Logout</button>
      </Section>
    );
  }
}

Logout.contextType = ServiceContext;

export default class Settings extends React.Component {
  //constructor(props) {
  //  super(props);
  //}
  componentDidMount() {
    uiModel.subscribe(this.handleChange);
  }
  componentWillUnmount() {
    uiModel.unsubscribe(this.handleChange);
  }
  handleChange = () => {
    this.forceUpdate();
  }
  handleLayoutChange = (v) => {
    uiModel.set('layout', v);
  }
  handleEditorChange = (v) => {
    uiModel.set('editor', v);
  }
  handleLineNumbersChange = (v) => {
    uiModel.set('lineNumbers', v);
  }
  handleTabsChange = (v) => {
    uiModel.set('tabs', v);
  }
  handleShowWhitespaceChange = (v) => {
    uiModel.set('showWhitespace', v);
  }
  render() {
    const {onClose} = this.props;
    const {userManager} = this.context;
    const userData = userManager.getUserData();
    return (
      <Dialog title="Settings" onClose={onClose}>
        { !!userData && <Logout /> }
        <Section heading="Layout">
          <div className="layout">
            <Radio selected={uiModel.get().layout} onChange={this.handleLayoutChange}>
              <RadioOption result={0}><img src={verticalIcon} alt="vertical"/></RadioOption>
              <RadioOption result={1}><img src={horizontalIcon} alt="horizontal"/></RadioOption>
              <RadioOption result={2}><img src={twoByTwoIcon} alt="2x2" /></RadioOption>
              <RadioOption result={3}><img src={tabbedIcon} alt="tabbed" /></RadioOption>
            </Radio>
          </div>
        </Section>
        <Section heading="Editor">
          <div className="settings">
            <Radio selected={uiModel.get().editor} onChange={this.handleEditorChange}>
              <RadioOption result="monaco"><div>Monaco</div></RadioOption>
              <RadioOption result="codemirror"><div>CodeMirror</div></RadioOption>
            </Radio>
            <Checkbox id="lineno" label="Line Numbers" checked={uiModel.get().lineNumbers} onChange={this.handleLineNumbersChange} />
            <Checkbox id="tabs" label="Indent with tabs" checked={uiModel.get().tabs} onChange={this.handleTabsChange} />
            <Checkbox id="whitespace" label="Show Whitespace" checked={uiModel.get().showWhitespace} onChange={this.handleShowWhitespaceChange} />
          </div>
        </Section>
      </Dialog>
    );
  }
}

Settings.contextType = ServiceContext;
