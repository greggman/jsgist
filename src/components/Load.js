import React from 'react';
import Dialog from './Dialog.js';
import LoadGist from './LoadGist';
import LoadJSON from './LoadJSON.js';
import LoadURL from './LoadURL.js';
import Section from './Section.js';

export default function Load(props) {
  const {data, onLoad, onClose} = props;
  return (
    <Dialog title="Load" className="fixed-size-dialog" onClose={onClose}>
      <Section heading="Load Gist">
        <LoadGist data={data} onLoad={onLoad} />
      </Section>
      <Section heading="Load URL">
        <LoadURL data={data} onLoad={onLoad} />
      </Section>
      <Section heading="Load JSON">
        <LoadJSON data={data} onLoad={onLoad} />
      </Section>
    </Dialog>
  )
}
