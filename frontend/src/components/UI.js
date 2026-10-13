import React from 'react';

export function Loading() {
  return (
    <div className="loading">
      <div className="spinner"></div>
    </div>
  );
}

export function ErrorMessage({ message }) {
  if (!message) return null;
  return <div className="alert alert-error">⚠️ {message}</div>;
}

export function SuccessMessage({ message }) {
  if (!message) return null;
  return <div className="alert alert-success">✅ {message}</div>;
}

export function EmptyState({ message = 'No records found' }) {
  return (
    <div className="empty-state">
      <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
      <p>{message}</p>
    </div>
  );
}
