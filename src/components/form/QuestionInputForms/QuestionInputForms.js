import React from 'react';
import { QuestionWithAnswerInputsForm } from '../QuestionWithAnswerInputsForm';
import { Button } from 'react-bootstrap';
import './style.css';

const QuestionInputForms = ({ 
  questions, 
  onAddQuestion,
  onRemoveQuestion,
  onQuestionTextChange,
  onQuestionTextBackgroundColorChange,
  onQuestionRevealImageChange,
  onQuestionRevealTitleChange,
  onQuestionRevealDescriptionChange,
  onAnswerTextChange,
  onAnswerMarkedAsCorrect,
  editingDisabled
}) => {

  const questionsMarkup = questions.map((question, index) => {
    return (
      <QuestionWithAnswerInputsForm 
        question={question}
        questionIndex={index}
        totalQuestions={questions.length}
        onQuestionTextChange={onQuestionTextChange}
        onQuestionTextBackgroundColorChange={onQuestionTextBackgroundColorChange}
        onQuestionRevealImageChange={onQuestionRevealImageChange}
        onQuestionRevealTitleChange={onQuestionRevealTitleChange}
        onQuestionRevealDescriptionChange={onQuestionRevealDescriptionChange}
        onAnswerTextChange={onAnswerTextChange}
        onAnswerMarkedAsCorrect={onAnswerMarkedAsCorrect}
        onDelete={onRemoveQuestion}
        key={index}
        editingDisabled={editingDisabled}
      />
    );
  });

  return (
    <div className="QuestionInputForms">
      {questionsMarkup}
      <Button 
        onClick={onAddQuestion}
        className="add-question-button button hollow primary"
        block={true}
        disabled={editingDisabled}
      >Add Question</Button>
    </div>
  );
};

export default QuestionInputForms;
