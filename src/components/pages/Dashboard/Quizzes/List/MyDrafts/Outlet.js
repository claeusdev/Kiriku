import React from 'react';
import { isLoaded } from 'react-redux-firebase'
import orderBy from 'lodash/orderBy';
import { MovingEllipsis } from '../../../../../misc/Ellipsis/index';
import QuizListItems from '../../../../../misc/QuizListItems';

import './style.css';

const MyDrafts = ({ drafts }) => {
  let ordered = [];

  const quizzesLoaded = isLoaded(drafts);
  if (quizzesLoaded) {
    drafts = drafts || {};

    drafts = Object.keys(drafts).map(key => {
      let quiz = drafts[key];
      quiz.id = key;
      return quiz;
    });

    ordered = orderBy(drafts, (q) => {
      return new Date(q.createdAt)
    }, 'desc');
  }

  const loadingStyle = {
    marginTop: 20,
    color: '#627282'
  };

  return (
    <div className="MyDraftQuizzes">
      {quizzesLoaded && 
        <QuizListItems quizzes={ordered} />
      }

      {!quizzesLoaded && 
        <p style={loadingStyle}>Loading<MovingEllipsis /></p>
      }
    </div>
  );
}

export default MyDrafts;
