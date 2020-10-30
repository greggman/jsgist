import React from 'react';

import Dialog from './Dialog.js';
import Section from './Section.js';

import verticalIcon from './icons/vertical-layout.svg';
import horizontalIcon from './icons/horizontal-layout.svg';
import twoByTwoIcon from './icons/two-by-two-layout.svg';
import tabbedIcon from './icons/tabbed-layout.svg';

import {classNames} from './css-utils.js';
import * as uiModel from './ui-model.js';

function RadioOption(props) {
  const {children, onChange, selected} = props;
  return (
    <div className={classNames({radioSelected: selected})} onClick={onChange}>
      {children}
    </div>
  );
}

function Radio(props) {
  const {selectedNdx, onChange, children} = props;

  let childNdx = 0;
  const newChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return null;
    }

    const selected = childNdx === selectedNdx;

    const id = childNdx;
    childNdx += 1;
    return React.cloneElement(child, {
      //...child.props,
      selected,
      onChange: () => onChange(id),
    });
  });


  return (
    <div className="radio">
      {newChildren}
    </div>
  );
}

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
  render() {
    const {onClose} = this.props;
    return (
      <Dialog title="Settings" onClose={onClose}>
        <Section heading="Layout">
          <div className="layout">
            <Radio selectedNdx={uiModel.get().layout} onChange={this.handleLayoutChange}>
              <RadioOption><img src={verticalIcon} alt="vertical"/></RadioOption>
              <RadioOption><img src={horizontalIcon} alt="horizontal"/></RadioOption>
              <RadioOption><img src={twoByTwoIcon} alt="2x2" /></RadioOption>
              <RadioOption><img src={tabbedIcon} alt="tabbed" /></RadioOption>
            </Radio>
          </div>
        </Section>
      </Dialog>
    );
  }
}
