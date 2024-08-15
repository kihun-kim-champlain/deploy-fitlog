import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import Progress from './Progress';
import History from './History';
import './App.css';
import logo from './logo.png'
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  const [userData, setUserData] = useState(null);
  const [sessData, setSessData] = useState();
  const [goalData, SetGoalData] = useState(null);


  useEffect(() => {
    fetch('http://localhost:8081/user')
    .then(res => res.json())
    .then(data => setUserData(data))
    .catch((error) => {
      console.error('Error fetching user data:', error);
    })
  }, []);

  useEffect(() => {
    fetch('http://localhost:8081/session')
    .then(res => res.json())
    .then(data => setSessData(data))
    .catch((error) => {
      console.error('Error fetching user data:', error);
    })
  }, []);

  useEffect(() => {
    fetch('http://localhost:8081/goal')
    .then(res => res.json())
    .then(data => SetGoalData(data))
    .catch((error) => {
      console.error('Error fetching user data:', error);
    })
  }, []);

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/" className='logo-link'>
                <img src={logo} alt="FitLog Logo" className="logo" /> 
              </Link>
            </li>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/progress">Progress</Link></li>
            <li><Link to="/history">History</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home userData={userData} sessData={sessData} />} />
          <Route path="/progress" element={<Progress goalData={goalData} />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;