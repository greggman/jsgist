import React from 'react';
import Dialog from './Dialog.js';

export default function Save(props) {
  const {onClose} = props;
  return (
    <Dialog title="Settings" onClose={onClose}>
    </Dialog>
  )
}
