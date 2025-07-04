import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { logEvent } from '../logger';

const RedirectPage = () => {
  const { shortcode } = useParams();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(shortcode));
    if (!data) return window.location.href = '/';

    const now = new Date();
    if (now > new Date(data.expiresAt)) return alert('Link expired');

    data.clickCount++;
    data.clicks.push({
      timestamp: now.toISOString(),
      source: document.referrer || 'direct',
      location: 'unknown'
    });

    logEvent({ action: 'CLICK_SHORT_URL', data });
    localStorage.setItem(shortcode, JSON.stringify(data));

    window.location.href = data.longUrl;
  }, [shortcode]);

  return <div>Redirecting...</div>;
};

export default RedirectPage;