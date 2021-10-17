import React from 'react';

export default class Dialog extends React.Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }
  handleKeyDown = (e) => {
    if (e.keyCode === 27) {
      this.props.onClose();
    }
  }
  render() {
    const {title, children, onClose, className = ''} = this.props;
    return (
      <div onClick={onClose} className={`${className} dialog`}>
        <div
          tabIndex="-1"
          onClick={(e) =>{e.stopPropagation()}}
        >
          <div className="dialog-heading">
            <div className="dialog-title">{title}</div>
            <div className="dialog-close">
              <button onClick={onClose}>X</button>
            </div>
          </div>
          <div className="dialog-content">
            {children}
          </div>
        </div>
      </div>
    );
  }
}
