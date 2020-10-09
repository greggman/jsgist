import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

jest.mock('./CodeArea.js', () => () => 'CodeArea');

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/jsGist/i);
  expect(linkElement).toBeInTheDocument();
});
