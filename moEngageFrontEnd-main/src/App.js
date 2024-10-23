import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Search from './components/Search';
import Lists from './components/Lists';
import ListDetail from './components/ListDetail';
import Home from './components/Home'; // Import Home component
import './App.css'; // Import App.css

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div>
        <nav>
          {token ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/search">Search</Link>
              <Link to="/lists">Lists</Link>
              <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('username'); window.location.href = '/login'; }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
        <Routes>
          <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
          <Route path="/search" element={token ? <Search /> : <Navigate to="/login" />} />
          <Route path="/lists" element={token ? <Lists /> : <Navigate to="/login" />} />
          <Route path="/lists/:id" element={token ? <ListDetail /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/lists/:id/edit" element={<ListDetail />} />
          <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
