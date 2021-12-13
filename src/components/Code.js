import React from 'react';
import CodeCodeMirror from './CodeCodeMirror';
import CodeMonaco from './CodeMonaco';

// TODO: Make Monaco lazy load

// This sucks but Monaco doesn't work on mobile
const canMonaco = !(/webOS|iPhone|iPad|Android/.test(navigator.userAgent));

export default function Code(props) {
  return (
    canMonaco
        ? <CodeMonaco {...props}/>
        : <CodeCodeMirror {...props}/>
  );
}
