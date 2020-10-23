import React from 'react';
import Dialog from './Dialog.js';
import LoadGist from './LoadGist.js';
import LoadJSON from './LoadJSON.js';
import LoadURL from './LoadURL.js';
import Section from './Section.js';

export default function Load(props) {
  const {data, onLoad, onClose} = props;
  return (
    <Dialog title="Load" onClose={onClose}>
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
