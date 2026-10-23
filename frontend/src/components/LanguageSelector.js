import React, { useState } from 'react';
import { FiGlobe, FiSearch } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const languages = [
  ['en', 'English', 'English', true], ['hi', 'हिन्दी', 'Hindi', true],
  ['bn', 'বাংলা', 'Bengali', false], ['te', 'తెలుగు', 'Telugu', false], ['mr', 'मराठी', 'Marathi', false],
  ['ta', 'தமிழ்', 'Tamil', false], ['ur', 'اُردُو', 'Urdu', false], ['gu', 'ગુજરાતી', 'Gujarati', false],
  ['kn', 'ಕನ್ನಡ', 'Kannada', false], ['ml', 'മലയാളം', 'Malayalam', false], ['or', 'ଓଡ଼ିଆ', 'Odia', false],
  ['pa', 'ਪੰਜਾਬੀ', 'Punjabi', false], ['as', 'অসমীয়া', 'Assamese', false], ['mai', 'मैथिली', 'Maithili', false],
  ['sa', 'संस्कृतम्', 'Sanskrit', false], ['ne', 'नेपाली', 'Nepali', false], ['kok', 'कोंकणी', 'Konkani', false],
  ['mni', 'ꯃꯤꯇꯩꯂꯣꯟ', 'Manipuri (Meitei)', false], ['brx', 'बड़ो', 'Bodo', false], ['doi', 'डोगरी', 'Dogri', false],
  ['ks', 'کٲشُر', 'Kashmiri', false], ['sat', 'ᱥᱟᱱᱛᱟᱲᱤ', 'Santali', false]
];

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const visible = languages.filter(([, nativeName, englishName]) => `${nativeName} ${englishName}`.toLowerCase().includes(query.toLowerCase()));
  return <details className="language-selector" open={open} onToggle={event => setOpen(event.currentTarget.open)}>
    <summary aria-label={t('nav.language')}><FiGlobe aria-hidden="true" /><span>{languages.find(([code]) => code === language)?.[1] || 'English'}</span><span className="language-caret">⌄</span></summary>
    <div className="language-popover">
      <label className="language-search"><FiSearch aria-hidden="true" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder={t('language.search')} aria-label={t('language.search')} /></label>
      <ul>{visible.map(([code, nativeName, englishName, supported]) => <li key={code}><button disabled={!supported} aria-current={language === code ? 'true' : undefined} onClick={() => { setLanguage(code); setQuery(''); setOpen(false); }}><span lang={code}>{nativeName}</span><small>{supported ? englishName : `${englishName} · ${t('language.comingSoon')}`}</small></button></li>)}</ul>
      <p>{t('language.available')}</p>
    </div>
  </details>;
}
