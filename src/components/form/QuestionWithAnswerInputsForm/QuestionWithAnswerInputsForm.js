import React from 'react';
import { QuestionTextInputForm } from '../QuestionTextInputForm';
import { AnswerTextInputs } from '../AnswerTextInputs';
import { QuestionRevealInputForm } from '../QuestionRevealInputForm';
import TrashIcon from 'react-icons/lib/ti/trash';
import './style.css';

const QuestionWithAnswerInputsForm = ({ 
  question,
  questionIndex,
  totalQuestions,
  onQuestionTextChange,
  onQuestionTextBackgroundColorChange,
  onQuestionRevealImageChange,
  onQuestionRevealTitleChange,
  onQuestionRevealDescriptionChange,
  onAnswerTextChange,
  onAnswerMarkedAsCorrect,
  onDelete,
  onAddQuestion,
  editingDisabled
}) => {

  const questionTextInputFormProps = { 
    question, 
    questionIndex, 
    onQuestionTextChange,
    onQuestionTextBackgroundColorChange,
    disabled: editingDisabled
  };

  const questionNumber = questionIndex + 1;
  const isFirstQuestion = questionNumber === 1;

  const deleteIcon = (
    <span className="delete-question-icon" onClick={() => { onDelete(questionIndex) }}>
      <TrashIcon />
    </span>
  );

  return (
    <div className="QuestionWithAnswerInputsForm">

      <div className="question-header">
        <h4 className="question-heading">
          Question {questionNumber} of {totalQuestions} 
          {!isFirstQuestion && deleteIcon }
        </h4>
      </div>

      <div className="question-body">
        <QuestionTextInputForm {...questionTextInputFormProps} />
        <AnswerTextInputs 
          question={question} 
          questionIndex={questionIndex} 
          answers={question.answers} 
          onAnswerTextChange={onAnswerTextChange}
          onAnswerMarkedAsCorrect={onAnswerMarkedAsCorrect}
          editingDisabled={editingDisabled}
        />
        <QuestionRevealInputForm 
          caption="Reveal When Answered" 
          question={question} 
          questionIndex={questionIndex} 
          onQuestionRevealImageChange={onQuestionRevealImageChange}
          onQuestionRevealTitleChange={onQuestionRevealTitleChange}
          onQuestionRevealDescriptionChange={onQuestionRevealDescriptionChange}
          editingDisabled={editingDisabled}
        />
      </div>

    </div>

  );
};

export default QuestionWithAnswerInputsForm;
