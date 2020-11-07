import React from 'react';

export default function Section(props) {
  const {heading, children} = props;
  return (
    <div className="section">
      <div className="section-heading">{heading}</div>
      <div className="section-content">
        {children}
      </div>
    </div>
  );
}