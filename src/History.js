import React from 'react';
import './History.css';
import { useEffect, useState } from 'react';

const History = () => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/history')
      .then(res => res.json())
      .then(data => {
        // Sort the data by date in descending order (most recent first)
        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistoryData(sortedData);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const formatDate = (dateString) => {
    // Convert the date string to a Date object and extract only the date portion
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Split data into three parts for three columns
  const third = Math.ceil(historyData.length / 3);
  const firstColumnData = historyData.slice(0, third);
  const secondColumnData = historyData.slice(third, 2 * third);
  const thirdColumnData = historyData.slice(2 * third);

  return (
    <div className="flex-container-history">
      <div className="history-column">
        <ul>
          {firstColumnData.map((v, index) => (
            <li key={index}>{formatDate(v.date)} || {v.type} || {v.time} minutes</li>
          ))}
        </ul>
      </div>
      <div className="history-column">
        <ul>
          {secondColumnData.map((v, index) => (
            <li key={index}>{formatDate(v.date)} || {v.type} || {v.time} minutes</li>
          ))}
        </ul>
      </div>
      <div className="history-column">
        <ul>
          {thirdColumnData.map((v, index) => (
            <li key={index}>{formatDate(v.date)} || {v.type} || {v.time} minutes</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default History;
