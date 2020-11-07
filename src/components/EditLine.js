import React from 'react';

export default function EditLine(props) {
  return (
    <input
      type="text"
      onChange={(e) => {props.onChange(e.target.value)}}
      placeholder={props.placeholder}
      value={props.value} />
  );
}