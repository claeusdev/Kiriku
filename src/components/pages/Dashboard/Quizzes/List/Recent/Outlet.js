import React from 'react';
import { isLoaded } from 'react-redux-firebase'
import orderBy from 'lodash/orderBy';

import QuizListItems from '../../../../../misc/QuizListItems';

import './style.css';
import { MovingEllipsis } from '../../../../../misc/Ellipsis/index';

const Recent = ({ drafts, quizzes }) => {
  let all = [];
  let ordered = [];

  const quizzesLoaded = isLoaded(quizzes) && isLoaded(drafts);
  if (quizzesLoaded) {
    drafts = drafts || {};
    quizzes = quizzes || {};

    drafts = Object.keys(drafts).map(key => {
      let quiz = drafts[key];
      quiz.id = key;
      return quiz;
    });

    quizzes = Object.keys(quizzes).map(key => {
      let quiz = quizzes[key];
      quiz.id = key;
      return quiz;
    });

    all = drafts.concat(quizzes);
    ordered = orderBy(all, (q) => {
      return new Date(q.createdAt)
    }, 'desc');
  }

  const loadingStyle = {
    marginTop: 20,
    color: '#627282'
  };

  return (
    <div className="RecentQuizzes">
      {quizzesLoaded && 
        <QuizListItems quizzes={ordered} />
      }

      {!quizzesLoaded && 
        <p style={loadingStyle}>Loading<MovingEllipsis /></p>
      }
    </div>
  );
}

export default Recent;
