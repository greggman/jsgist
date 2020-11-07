import React, {useContext, useState} from 'react';
import EditLine from './EditLine';
import * as model from '../libs/model.js';
import ServiceContext from '../ServiceContext.js';

export default function LoadURL(props) {
  const [url, setUrl] = useState('');
  const {addError} = useContext(ServiceContext);
  async function loadUrl() {
    const {onLoad} = props;
    try {
      const req = await fetch(url);
      const data = await req.json();
      model.setData(data);
      onLoad()
    } catch(e) {
      addError(`could not load url: ${e}`);
    }
  } 
  return (
    <div>
      <EditLine value={url} onChange={setUrl} placeholder="url-to-json" />
      <p>
        <button onClick={loadUrl}>Load URL</button>
      </p>
    </div>
  )
}