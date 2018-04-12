import React from 'react';
import { ControlLabel } from 'react-bootstrap';
import { AnswerTextInput } from '../AnswerTextInput';
import './style.css';

const AnswerTextInputs = ({ 
  question,
  questionIndex, 
  answers, 
  onAnswerTextChange,
  onAnswerMarkedAsCorrect,
  editingDisabled
}) => {
  const answerTextInputsMarkup = answers.map((answer, answerIndex) => {
    return (
      <AnswerTextInput 
        key={answerIndex} 
        answer={answer} 
        answerIndex={answerIndex} 
        questionIndex={questionIndex}
        onAnswerTextChange={onAnswerTextChange}
        onMarkAsCorrect={onAnswerMarkedAsCorrect}
        disabled={editingDisabled}
      />
    );
  });
  return (
    <div className="AnswerTextInputs">
      <ControlLabel className="heading">Answsers</ControlLabel>
      <div className="content">
        {answerTextInputsMarkup}
      </div>
    </div>
  );
};

export default AnswerTextInputs;
