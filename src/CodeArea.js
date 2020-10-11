import React, {useState} from 'react';
//import {Resizable} from 're-resizable';
import Code from './Code.js';
import {classNames} from './css-utils.js';

export default function CodeArea(props) {
  const {value, hackKey, heading, extra = [], options = {}, onValueChange} = props;
  const [show, setShow] = useState(props.show === false ? false : true);
  const hideeHide = !show;
  return (
    <div className="code-area">
        <div className="expander">
          {heading}
        </div>
        <div className={classNames("hidee", {hideeHide})}>
            <Code
              hackKey={hackKey}
              value={value}
              options={options}
              onValueChange={onValueChange}
            />
          {extra}
        </div>
    </div>
  );
};
