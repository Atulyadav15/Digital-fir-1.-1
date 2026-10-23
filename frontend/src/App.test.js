import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('shows the complaint landing page, primary actions, and no FAQ section', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /report\. track\. resolve\./i })).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /file a complaint/i }).some(link => link.getAttribute('href') === '/file-fir')).toBe(true);
  expect(screen.getAllByRole('link', { name: /track complaint/i }).some(link => link.getAttribute('href') === '/track-fir')).toBe(true);
  expect(screen.queryByRole('link', { name: /faqs/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /frequently asked questions/i })).not.toBeInTheDocument();
  fireEvent.click(document.querySelector('summary[aria-label="Language"]'));
  fireEvent.click(screen.getByRole('button', { name: /हिन्दी/ }));
  expect(screen.getByRole('heading', { name: /शिकायत करें।/ })).toBeInTheDocument();
  expect(window.localStorage.getItem('civic-desk-language')).toBe('hi');
});
