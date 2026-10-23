import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBell, FiClipboard, FiLock, FiSearch, FiShield } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const features = [
    [FiClipboard, 'home.feature.submit', 'home.feature.submitText'], [FiSearch, 'home.feature.track', 'home.feature.trackText'],
    [FiLock, 'home.feature.private', 'home.feature.privateText'], [FiBell, 'home.feature.updates', 'home.feature.updatesText']
  ];
  const steps = [['01', 'home.register', 'home.registerText'], ['02', 'home.details', 'home.detailsText'], ['03', 'home.saveRef', 'home.saveRefText'], ['04', 'home.follow', 'home.followText']];
  return <div className="page-wrapper">
    <Navbar />
    <main className="main-content">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="eyebrow"><FiShield aria-hidden="true" /> {t('home.eyebrow')}</div>
            <h1>{t('home.title1')}<br />{t('home.title2')}</h1>
            <p>{t('home.intro')}</p>
            <div className="hero-actions">
              <Link to="/file-fir" className="btn btn-primary btn-lg">{t('home.file')} <FiArrowRight /></Link>
              <Link to="/track-fir" className="btn btn-outline-light btn-lg">{t('home.track')}</Link>
            </div>
            <div className="hero-note">{t('home.notice')}</div>
          </div>
          <div className="hero-panel" aria-label="Complaint workflow preview">
            <div className="panel-top"><span className="panel-icon"><FiClipboard /></span><span className="panel-kicker">{t('home.workflow')}</span><span className="sample-pill">{t('home.sample')}</span></div>
            <h2>{t('home.previewTitle')}</h2>
            <div className="preview-row"><span className="preview-dot done">✓</span><span><strong>{t('home.submitted')}</strong><small>{t('home.reference')}</small></span><span className="preview-date">{t('home.step1')}</span></div>
            <div className="preview-row"><span className="preview-dot active">2</span><span><strong>{t('home.review')}</strong><small>{t('home.timeline')}</small></span><span className="preview-date">{t('home.step2')}</span></div>
            <div className="preview-row muted"><span className="preview-dot">3</span><span><strong>{t('home.progress')}</strong><small>{t('home.admin')}</small></span><span className="preview-date">{t('home.next')}</span></div>
            <div className="panel-foot"><FiLock /> {t('home.private')}</div>
          </div>
        </div>
      </section>

      <section className="trust-strip"><div className="container"><span><FiShield /> {t('home.secure')}</span><span><FiSearch /> {t('home.tracking')}</span><span><FiBell /> {t('home.timestamps')}</span><span className="service-disclaimer">{t('home.noPolice')}</span></div></section>

      <section className="section-pad"><div className="container">
        <div className="section-heading"><span className="eyebrow blue">{t('home.processEyebrow')}</span><h2>{t('home.processTitle')}</h2><p>{t('home.processIntro')}</p></div>
        <div className="feature-grid">{features.map(([Icon, title, desc]) => <article className="feature-card" key={title}><span className="feature-icon"><Icon /></span><h3>{t(title)}</h3><p>{t(desc)}</p></article>)}</div>
      </div></section>

      <section className="process-section section-pad"><div className="container">
        <div className="section-heading"><span className="eyebrow blue">{t('home.how')}</span><h2>{t('home.workflowTitle')}</h2><p>{t('home.workflowIntro')}</p></div>
        <div className="steps-grid">{steps.map(([num, title, desc]) => <article className="step-card" key={num}><span>{num}</span><h3>{t(title)}</h3><p>{t(desc)}</p></article>)}</div>
      </div></section>

      <section className="home-cta"><div className="container cta-inner"><div><span className="eyebrow">{t('home.start')}</span><h2>{t('home.startTitle')}</h2><p>{t('home.startText')}</p></div><Link to="/register" className="btn cta-button">{t('home.createAccount')} <FiArrowRight /></Link></div></section>
      <div className="container privacy-note"><strong>{t('home.privacy')}</strong> {t('home.privacyText')}</div>
    </main>
    <Footer />
  </div>;
}
