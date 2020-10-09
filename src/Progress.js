import React from 'react';
import {hsl} from './color-utils.js';

export default function Progress(props) {
  const {max, value, text} = props;
  const zeroToOne = value / max;

  return (
    <div className="result-result">
        <span 
          style={{
            width: `${zeroToOne * 100 | 0}%`,
            backgroundColor: hsl(1 / 7 - zeroToOne / 7, 1, 0.4),
          }}
        >{text}</span>
    </div>
  );
}
