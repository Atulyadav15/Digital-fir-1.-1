import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const STATUS_MAP = {
  'Submitted': 'badge-submitted',
  'Under Review': 'badge-review',
  'Assigned': 'badge-assigned',
  'Investigation in Progress': 'badge-investigation',
  'Resolved': 'badge-resolved',
  'Closed': 'badge-closed',
  'Rejected': 'badge-rejected',
  'Withdrawn': 'badge-closed',
};

export default function StatusBadge({ status }) {
  const { t } = useLanguage();
  return <span className={`badge ${STATUS_MAP[status] || 'badge-submitted'}`}>{t(`status.${status}`)}</span>;
}
