import React from 'react';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="DashboardHomePage dashboard-page">
      <div className="header">
        <h4 className="page-title">Welcome Home</h4>
      </div>

      <div className="body">
        <div className="inner">
          <p>You can view, edit and create quizzes here</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

