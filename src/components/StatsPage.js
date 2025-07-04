import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StatsPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(
    Object.keys(localStorage)
      .map((key) => {
        try {
          return JSON.parse(localStorage.getItem(key));
        } catch (e) {
          return null;
        }
      })
      .filter((item) => item && item.shortcode)
  );

  const handleDelete = (shortcode) => {
    localStorage.removeItem(shortcode);
    setData(data.filter((item) => item.shortcode !== shortcode));
  };

  return (
    <div className="container">
      <h2>Statistics</h2>
      <button onClick={() => navigate(-1)}>Back</button>
      {data.map((item, idx) => (
        <div key={idx} className="stat-box">
          <p>Short URL: <a href={`/${item.shortcode}`}>{window.location.origin}/{item.shortcode}</a></p>
          <p>Created: {item.createdAt}</p>
          <p>Expires: {item.expiresAt}</p>
          <p>Total Clicks: {item.clickCount}</p>
          <button onClick={() => handleDelete(item.shortcode)}>Delete</button>
          <h4>Click Details:</h4>
          <ul>
            {item.clicks.map((click, i) => (
              <li key={i}>{click.timestamp} | {click.source} | {click.location}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default StatsPage;
