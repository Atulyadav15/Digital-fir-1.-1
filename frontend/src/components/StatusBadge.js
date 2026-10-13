import React from 'react';

const STATUS_MAP = {
  'Submitted': 'badge-submitted',
  'Under Review': 'badge-review',
  'Assigned': 'badge-assigned',
  'Investigation in Progress': 'badge-investigation',
  'Resolved': 'badge-resolved',
  'Closed': 'badge-closed',
};

export default function StatusBadge({ status }) {
  return <span className={`badge ${STATUS_MAP[status] || 'badge-submitted'}`}>{status}</span>;
}
