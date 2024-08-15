import React, { useEffect, useState } from 'react';
import './Home.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

const Home = ({ userData, sessData }) => {
  console.log(userData, "1");
  const startDate = new Date(userData?.JoinDate);
  const endDate = new Date();
  const timeDifferenceMS = endDate - startDate;
  const timeDifferenceDay = Math.round(timeDifferenceMS / 86400000);
  const [historyData, setHistoryData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const year = endDate.getFullYear(); 
  const month = String(endDate.getMonth() + 1).padStart(2, '0'); 
  const day = String(endDate.getDate()).padStart(2, '0'); 
  const formattedDateNow = `${year}-${month}-${day}`;

  useEffect(() => {
    fetch('http://localhost:8081/history')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched history data:', data); // Debugging line
        setHistoryData(data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const [recoData, setRecoData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/recommend')
      .then(res => res.json())
      .then(data => setRecoData(data))
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const handleExerciseSelect = (e) => {
    setSelectedExercise(e);
  };

  const handleTimeSelect = (t) => {
    setSelectedTime(t * 10);
  };

  const handleRecordSession = () => {
    console.log('Session Input:', selectedExercise, selectedTime, formattedDateNow);

    fetch('http://localhost:8081/record-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        exerciseType: selectedExercise,
        duration: selectedTime,
        formattedDateNow: formattedDateNow
      })
    })

      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        console.log('Success:', data);
        fetch('http://localhost:8081/history')
          .then(res => res.json())
          .then(data => setHistoryData(data))
          .catch((error) => {
            console.error('Error fetching updated user data:', error);
          });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  // Convert date from historyData to match the formattedDateNow
  const todaysSessions = historyData?.filter(v => {
    const sessionDate = new Date(v.date);
    const localDate = new Date(sessionDate.getTime() - sessionDate.getTimezoneOffset() * 60000)
                          .toISOString().split('T')[0];
    return localDate === formattedDateNow;
  });

  // Calculate total workout time
  const totalWorkoutTime = historyData.reduce((total, session) => total + session.time, 0);
  const progressValue = Math.min((totalWorkoutTime / 4500) * 100, 100); // Ensure it doesn't exceed 100%

  console.log('Today\'s Sessions:', todaysSessions); // Debugging line
  console.log('Total Workout Time:', totalWorkoutTime); // Debugging line
  
  return (
    <div className="flex-container-home">
    <div className="intro">Welcome back to FitLog! You're on your {timeDifferenceDay}th day of your fitness journey. Keep up the great work!</div>
    <div className="session-container">
        <div className="today_session">
          <div className="session-title">Today's Session:</div>
          <ul>
            {
              todaysSessions && todaysSessions.length > 0 ? 
              todaysSessions.map((v, index) => <li key={index}>{v.type}: {v.time} minutes</li>)
              :
              <li>No sessions recorded for today.</li>
            }
          </ul>
          <DropdownButton id="dropdown-basic-button" className="dropdown-button" title="Type of Session" onSelect={handleExerciseSelect}>
            <Dropdown.Item eventKey="1">Jogging</Dropdown.Item>
            <Dropdown.Item eventKey="2">Swimming</Dropdown.Item>
            <Dropdown.Item eventKey="3">Cycling</Dropdown.Item>
            <Dropdown.Item eventKey="4">Weightlifting</Dropdown.Item>
            <Dropdown.Item eventKey="5">Yoga</Dropdown.Item>
            <Dropdown.Item eventKey="6">Pilates</Dropdown.Item>
            <Dropdown.Item eventKey="7">Boxing</Dropdown.Item>
            <Dropdown.Item eventKey="8">Rowing</Dropdown.Item>
            <Dropdown.Item eventKey="9">Jump Rope</Dropdown.Item>
          </DropdownButton>
          <DropdownButton id="dropdown-basic-button" className="dropdown-button" title="Duration" onSelect={handleTimeSelect}>
            <Dropdown.Item eventKey="1">10 minutes</Dropdown.Item>
            <Dropdown.Item eventKey="2">20 minutes</Dropdown.Item>
            <Dropdown.Item eventKey="3">30 minutes</Dropdown.Item>
            <Dropdown.Item eventKey="4">40 minutes</Dropdown.Item>
            <Dropdown.Item eventKey="5">50 minutes</Dropdown.Item>
            <Dropdown.Item eventKey="6">60 minutes</Dropdown.Item>
          </DropdownButton>
          <Button variant="info" className="btn-info" onClick={handleRecordSession}>Record a Session!</Button>
        </div>
        <div className="recommendation">
          <div className="session-title">Fitlog's Recommendation Session:</div>
          <ul>
            {
              recoData && recoData.map(d => <li key={d.id}>{d.type}: {d.time} minutes</li>)
            }
          </ul>
        </div>
      </div>
      <div className="progress_bar">
      <div className="bar">This Month's Total Workout Time: {totalWorkoutTime} / 4,500 minutes</div>
        <ProgressBar className='bar' animated now={progressValue} label={`${Math.round(progressValue)}%`} />
        
      </div>
    </div>
  );
};

export default Home;
