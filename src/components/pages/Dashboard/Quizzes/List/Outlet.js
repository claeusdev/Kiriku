import React from 'react';
import { Link } from 'react-router-dom';
import RecentQuizzes from './Recent/Container';
import MyDraftQuizzes from './MyDrafts/Container';
import QuizzesPublishedByMe from './PublishedByMe/Container';
import classnames from 'classnames';
import './List.css';

const QuizzesListOutlet = ({ filter, match, auth }) => {
  const currentPath = match.path;

  let ActiveList;
  switch (filter) {
    case 'Recent':
      ActiveList = RecentQuizzes;
      break;
    case 'Published By Me':
      ActiveList = QuizzesPublishedByMe;
      break;
    case 'My Drafts':
      ActiveList = MyDraftQuizzes;
      break;
    default:
      ActiveList = () => null
  }

  return (
    <div className="DashboardQuizzesList dashboard-page">
      <div className="header">
        <h4 className="page-title">Quizzes</h4>
        <Link className="primary button solid" to="/dashboard/quizzes/new">Post a new Quiz</Link>
      </div>

      <div className="body">
        <div className="inner">
          <ul className="quizzes-list">
            <div className="list-header">
              <Link to="/dashboard/quizzes" className={
                classnames({ active: currentPath === '/dashboard/quizzes' })
              }>Recent</Link>
            <Link to="/dashboard/quizzes/my-drafts" className={
              classnames({ active: currentPath.includes('my-drafts') })
            }>My Drafts</Link>
          <Link to="/dashboard/quizzes/published-by-me" className={
            classnames({ active: currentPath.includes('published-by-me') })
          }>Published By Me</Link>
        </div>
        <ActiveList auth={auth} /> 
      </ul>
    </div>
  </div>
</div>
);
};

export default QuizzesListOutlet;

