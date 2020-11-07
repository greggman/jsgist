import React from 'react';
import Dialog from './Dialog.js';
import Embed from './Embed.js';
import Export from './Export.js';
import SaveAsGist from './SaveAsGist.js';
import SaveAsJSON from './SaveAsJSON.js';
import SaveAsURL from './SaveAsURL.js';
import Section from './Section.js';

export default function Save(props) {
  const {data, gistId, gistOwnerId, onSave, onClose} = props;
  return (
    <Dialog title="Save" onClose={onClose}>
      <Section heading="Save As Gist">
        <SaveAsGist gistId={gistId} gistOwnerId={gistOwnerId} data={data} onClose={onClose} onSave={onSave} />
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
      <Section heading="Export To">
        <Export data={data} />
      </Section>
    </Dialog>
  )
}
