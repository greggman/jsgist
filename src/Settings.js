import React from 'react';
import Dialog from './Dialog.js';

import verticalIcon from './icons/vertical-layout.svg';
import horizontalIcon from './icons/horizontal-layout.svg';
import twoByTwoIcon from './icons/two-by-two-layout.svg';
import {classNames} from './css-utils.js';

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
    <div class="radio">
      {newChildren}
    </div>
  );
}

export default function Save(props) {
  const {onClose} = props;

  return (
    <Dialog title="Settings" onClose={onClose}>
      <Radio selectedNdx={0} onChange={(v) => {console.log(v)}}>
        <RadioOption><img style={{height: '2em'}} src={verticalIcon} alt="vertical"/></RadioOption>
        <RadioOption><img style={{height: '2em'}} src={horizontalIcon} alt="horizontal"/></RadioOption>
        <RadioOption><img style={{height: '2em'}} src={twoByTwoIcon} alt="2x2" /></RadioOption>
      </Radio>
    </Dialog>
  )
}
