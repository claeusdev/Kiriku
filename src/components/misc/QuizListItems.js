import React from 'react';
import QuizListItem from './QuizListItem';

const QuizListItems = ({ quizzes }) => {
	if (!quizzes.length) {
		return <p style={{
			marginTop: 25
		}}>You have no quizzes in this list</p>
	}
	const listItems = quizzes.map((quiz, index) => {
		return <QuizListItem key={index} {...quiz} />;
	});

	return listItems;
};

export default QuizListItems;