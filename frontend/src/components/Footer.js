import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return <footer className="site-footer">
    <div className="container footer-content">
      <div className="footer-brand"><div className="footer-logo">CD</div><div><strong>Civic Desk</strong><small>{t('footer.tagline')}</small></div><p>{t('footer.description')}</p></div>
      <div className="footer-links"><strong>{t('footer.explore')}</strong><Link to="/file-fir">{t('nav.file')}</Link><Link to="/track-fir">{t('nav.track')}</Link><Link to="/about">{t('footer.about')}</Link><Link to="/contact">{t('nav.contact')}</Link></div>
      <div className="footer-notice"><strong>{t('footer.notice')}</strong><p>{t('footer.disclaimer')}</p></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} Civic Desk · {t('footer.copyright')}</span><span>{t('footer.storage')}</span></div>
  </footer>;
}
