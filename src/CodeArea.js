import React, {useState} from 'react';
import {Resizable} from 're-resizable';
import Code from './Code.js';
import {classNames} from './css-utils.js';

export default function CodeArea(props) {
  const {value, hackKey, heading, extra = [], options = {}, onValueChange} = props;
  const [show, setShow] = useState(props.show === false ? false : true);
  const hideeHide = !show;
  return (
    <div className="code-area">
        <div className="expander">
          <div className="hider" onClick={()=>setShow(!show)}>{show ? '▼' : '◀'}</div>
          {heading}
        </div>
        <div className={classNames("hidee", {hideeHide})}>
          <Resizable
            style={{background: 'red', position: 'relative'}}
            defaultSize={{height: 200}}
            minHeight={20}
            enable={{top:false, right:false, bottom:true, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false}}
          >
            <Code
              hackKey={hackKey}
              value={value}
              options={options}
              onValueChange={onValueChange}
            />
          </Resizable>
          {extra}
        </div>
    </div>
  );
};
