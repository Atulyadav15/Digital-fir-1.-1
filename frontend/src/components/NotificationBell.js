import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function NotificationBell() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  useEffect(() => {
    api.get('/users/notifications').then(response => setItems(response.data)).catch(() => {});
  }, []);
  const unread = items.filter(item => !item.readAt).length;
  const openItem = async (item) => {
    if (!item.readAt) {
      try { await api.patch(`/users/notifications/${item.id}/read`); setItems(current => current.map(row => row.id === item.id ? { ...row, readAt: new Date().toISOString() } : row)); } catch { /* keep the item unread if saving fails */ }
    }
    setOpen(false);
  };
  return <div className="notification-control">
    <button className="notification-trigger" aria-label={`${t('notification.title')}${unread ? `, ${unread} unread` : ''}`} aria-expanded={open} onClick={() => setOpen(value => !value)}><FiBell /><span>{t('notification.title')}</span>{unread > 0 && <b>{unread}</b>}</button>
    {open && <div className="notification-panel"><strong>{t('notification.title')}</strong>{items.length === 0 ? <p className="notification-empty">{t('notification.empty')}</p> : <ul>{items.slice(0, 12).map(item => <li key={item.id} className={!item.readAt ? 'unread' : ''}><Link to={`/fir/${item.complaintId}`} onClick={() => openItem(item)}><span>{t(item.kind) || item.message}</span><small>{item.referenceNumber} · {t(`status.${item.status}`)} · {new Date(item.createdAt).toLocaleString()}</small></Link></li>)}</ul>}</div>}
  </div>;
}
