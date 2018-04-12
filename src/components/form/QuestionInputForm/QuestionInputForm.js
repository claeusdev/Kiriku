import React from 'react';
import { TextInput } from '../TextInput';
import './style.css';

const QuestionInputForm = ({ 
  question, 
  questionIndex, 
  totalQuestions,
  onQuestionTextChange 
}) => {
  const handleQuestionTextChange = (evt) => {
    onQuestionTextChange(questionIndex, evt.target.value);
  };

  return (
    <div className="QuestionInputForm">
      <TextInput 
        placeholder="Choose a title for this quiz" 
        value=''
        onChange={handleQuestionTextChange}
        label="Question"
      />
      <div className="question-preview">
        Preview
      </div>
    </div>
  );
};

export default QuestionInputForm;
