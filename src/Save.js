import React from 'react';
import Dialog from './Dialog.js';
import SaveAsGist from './SaveAsGist.js';
import SaveAsJSON from './SaveAsJSON.js';
import SaveAsURL from './SaveAsURL.js';
import Section from './Section.js';
import Embed from './Embed.js';

export default function Save(props) {
  const {data, github, gistId, onSave, onClose, addError} = props;
  return (
    <Dialog title="Save As" onClose={onClose}>
      <Section heading="Save As Gist">
        <SaveAsGist gistId={gistId} github={github} data={data} onClose={onClose} onSave={onSave} addError={addError} />
      </Section>
      <Section heading="Save As URL">
        <SaveAsURL data={data} />
      </Section>
      <Section heading="Save As JSON">
        <SaveAsJSON data={data} />
      </Section>
      <Section heading="Embedding">
        <Embed gistId={gistId} />
      </Section>
    </Dialog>
  )
}
