import React, { useState, useEffect } from 'react';
import './Progress.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Progress = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/workout-summary')
      .then(res => res.json())
      .then(data => {
        // Create a map to store weekly totals by week start date
        const weeklyTotals = new Map();

        data.forEach(entry => {
          const sessionDate = new Date(entry.date);
          const weekStartDate = getWeekStartDate(sessionDate);

          if (!weeklyTotals.has(weekStartDate)) {
            weeklyTotals.set(weekStartDate, 0);
          }

          weeklyTotals.set(weekStartDate, weeklyTotals.get(weekStartDate) + entry.total_time);
        });

        // Format data for the chart
        const formattedData = Array.from(weeklyTotals.entries()).map(([weekStart, totalTime], index) => ({
          name: index === 0 ? 'This Week' : `Week -${index}`,
          minutes: totalTime
        })); // Reverse to show the most recent week first

        setChartData(formattedData);
      })
      .catch(error => console.error('Error fetching workout summary:', error));
  }, []);

  // Function to get the start date of the week (Monday as start)
  const getWeekStartDate = (date) => {
    const day = date.getDay(); // Sunday - Saturday : 0 - 6
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const weekStartDate = new Date(date.setDate(diff));
    weekStartDate.setHours(0, 0, 0, 0); // Set to the start of the day
    return weekStartDate.toISOString().split('T')[0]; // Return as 'YYYY-MM-DD'
  };

  const customTooltip = (value) => `Percent: ${value} %`;


  return (
    <div className="flex-container-progress">
      <div className="upper-container">
        <div className="goals">
          <div className="goals-title">Goals</div>
          <ul>
            <li>Run 5 miles</li>
            <li>Workout 5 times this week</li>
            <li>Drink 8 glasses of water daily</li>
            <li>Stretch every morning</li>
          </ul>
        </div>
        <div className="graph-container">
          <div className="graph-title">Weekly Workout Progress</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Percent', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={customTooltip} labelFormatter={() => ''} />
              <Bar dataKey="minutes" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Progress;
