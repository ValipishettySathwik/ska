import React from 'react';

const Home = () => {
  const username = localStorage.getItem('username');

  return (
    <div className="container">
      <h1>Welcome, {username}!</h1>
      <p>This is the home page content.</p>
    </div>
  );
};

export default Home;
