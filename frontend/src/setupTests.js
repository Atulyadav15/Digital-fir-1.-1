import '@testing-library/jest-dom';

// CRA 5's jsdom environment predates globals used by React Router v7.
const { TextDecoder, TextEncoder } = require('util');
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
