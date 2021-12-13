import React from 'react';
import Code from './Code.js';
import {classNames} from '../libs/css-utils.js';

export default function CodeArea(props) {
  const {
    value,
    hackKey,
    heading,
    extra = [],
    options = {},
    onValueChange,
    registerAPI,
  } = props;
  return (
    <div className="code-area" style={props.style}>
        <div className="expander">
          {heading}
        </div>
        <div className={classNames("hidee")}>
            <Code
              hackKey={hackKey}
              value={value}
              options={options}
              onValueChange={onValueChange}
              registerAPI={registerAPI}
            />
          {extra}
        </div>
    </div>
  );
};
