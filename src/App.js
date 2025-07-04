import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UrlShortener from './components/UrlShortener';
import RedirectPage from './components/RedirectPage';
import StatsPage from './components/StatsPage';

const App = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>URL Shortener App</h1>
      <Routes>
        <Route path="/" element={<UrlShortener />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/:shortcode" element={<RedirectPage />} />
      </Routes>
    </div>
  );
};

export default App;
