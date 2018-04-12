import React from 'react';
import { isLoaded } from 'react-redux-firebase'
import orderBy from 'lodash/orderBy';
import { MovingEllipsis } from '../../../../../misc/Ellipsis/index';
import QuizListItems from '../../../../../misc/QuizListItems';

import './style.css';

const PublishedByMe = ({ quizzes }) => {
  let ordered = [];

  const quizzesLoaded = isLoaded(quizzes);
  if (quizzesLoaded) {
    quizzes = quizzes || {};

    quizzes = Object.keys(quizzes).map(key => {
      let quiz = quizzes[key];
      quiz.id = key;
      return quiz;
    });

    ordered = orderBy(quizzes, (q) => {
      return new Date(q.createdAt)
    }, 'desc');
  }

  const loadingStyle = {
    marginTop: 20,
    color: '#627282'
  };

  return (
    <div className="QuizzesPublishedByMe">
      {quizzesLoaded && 
        <QuizListItems quizzes={ordered} />
      }

      {!quizzesLoaded && 
        <p style={loadingStyle}>Loading<MovingEllipsis /></p>
      }
    </div>
  );
}

export default PublishedByMe;