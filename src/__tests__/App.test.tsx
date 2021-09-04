import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../renderer/components/App';

describe('App', () => {
  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
