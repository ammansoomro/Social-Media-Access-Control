import './App.css';
import Login from './Login';
import YourProfile from './YourProfile';
import UserProfile from './UserProfile';
// import react router
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/YourProfile" element={<YourProfile user={localStorage.getItem('token')} />} />
        <Route path="/YourProfile/Searched/:search" element={<UserProfile user={localStorage.getItem('token')} />} />
      </Routes>
    </Router>
  );
}

export default App;
