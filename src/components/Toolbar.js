import React from 'react';

export default function Toolbar(props) {
  const {
    toolbarFns,
    fullscreen,
  } = props;
  const {
    handleRun,
    handleStop,
    handleSave,
    handleNew,
    handleLoad,
    handleFullscreen,
    handleSettings,
    handleHelp,
  } = toolbarFns;
  return (
    <div className="toolbar">
      <button tabIndex="1" onClick={handleRun}>Run</button>
      <button tabIndex="1" onClick={handleStop}>Stop</button>
      <button tabIndex="1" onClick={handleSave}>Save</button>
      <button tabIndex="1" onClick={handleNew}>New</button>
      <button tabIndex="1" onClick={handleLoad}>Load</button>
      <button tabIndex="1" onClick={handleSettings} title="settings"><img src={`${window.location.origin}/resources/images/gear.svg`} alt="settings"></img></button>
      <button tabIndex="1" onClick={handleFullscreen} title="fullscreen"><img src={`${window.location.origin}/resources/images/${fullscreen ? 'un-' : ''}fullscreen.svg`} alt="fullscreen"></img></button>
      <button tabIndex="1" onClick={handleHelp} title="help">?</button>
    </div>
  );
}