import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logEvent } from '../logger';
import shortid from 'shortid';
import './UrlShortener.css';

const UrlShortener = () => {
  const [inputs, setInputs] = useState([{ longUrl: '', validity: '', shortcode: '', error: '' }]);
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const navigate = useNavigate();

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const handleAdd = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { longUrl: '', validity: '', shortcode: '', error: '' }]);
    }
  };

  const handleShorten = () => {
    const validated = inputs.map((entry) => {
      const error = !isValidUrl(entry.longUrl)
        ? 'Invalid URL'
        : entry.validity && isNaN(parseInt(entry.validity))
        ? 'Invalid validity'
        : '';
      return { ...entry, error };
    });

    setInputs(validated);
    if (validated.some((v) => v.error)) return;

    const result = validated.map((entry) => {
      const code = entry.shortcode || shortid.generate();
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + (parseInt(entry.validity || '30') * 60000));

      const data = {
        ...entry,
        shortcode: code,
        createdAt,
        expiresAt,
        clickCount: 0,
        clicks: [],
      };

      logEvent({ action: 'SHORTEN_URL', data });
      localStorage.setItem(code, JSON.stringify(data));

      return data;
    });

    setShortenedUrls(result);
  };

  return (
    <div className="container">
      <h2>URL Shortener</h2>
      {inputs.map((entry, idx) => (
        <div key={idx} className="form-group">
          <input
            type="text"
            placeholder="Enter long URL"
            value={entry.longUrl}
            onChange={(e) => handleChange(idx, 'longUrl', e.target.value)}
          />
          <input
            type="text"
            placeholder="Validity in mins (optional)"
            value={entry.validity}
            onChange={(e) => handleChange(idx, 'validity', e.target.value)}
          />
          <input
            type="text"
            placeholder="Custom shortcode (optional)"
            value={entry.shortcode}
            onChange={(e) => handleChange(idx, 'shortcode', e.target.value)}
          />
          {entry.error && <p className="error">{entry.error}</p>}
        </div>
      ))}
      <button onClick={handleShorten}>Shorten URLs</button>
      <button onClick={handleAdd}>Add more</button>
      <button onClick={() => navigate('/stats')}>View Stats</button>

      <div className="result-box">
        {shortenedUrls.map((item, idx) => (
          <div key={idx} className="form-group">
            <p>Original: {item.longUrl}</p>
            <p>Short: <a href={`/${item.shortcode}`}>{window.location.origin}/{item.shortcode}</a></p>
            <p>Expires: {item.expiresAt.toString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UrlShortener;
