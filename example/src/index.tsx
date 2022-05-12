import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './app';

const container = document.getElementById('root');

// Create a root.
// @ts-ignore
const root = ReactDOMClient.createRoot(container);

root.render(<App  />);