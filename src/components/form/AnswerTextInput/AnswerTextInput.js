import React from 'react';
import { TextInput } from '../TextInput';
import { Radio } from 'react-bootstrap';
import classnames from 'classnames';
import fitty from 'fitty';
import './style.css';

const AnswerTextInput = ({ 
  answer,
  answerIndex, 
  questionIndex, 
  onAnswerTextChange,
  onMarkAsCorrect,
  disabled
}) => {

  const answerPreviewText = answer.content || 'Answer';
  const textPresent = !!answer.content;
  const previewTextStyle = {
    backgroundColor: answer.backgroundColor,
    borderColor: answer.backgroundColor === '#ffffff' ? '#dfdfdf' : 'transparent',
    borderStyle: answer.backgroundColor === '#ffffff' ? 'solid' : 'none',
    borderWidth: answer.backgroundColor === '#ffffff' ? '1px' : '0',
    borderLeftWidth: '0',
    borderRightWidth: '0',
    borderBottomWidth: '0',
  };


  const handleAnswerTextChange = (evt) => {
    fitty(`#answer-${answerIndex}-preview-text`);
    onAnswerTextChange(questionIndex, answerIndex, evt.target.value);
  };

  return (
    <div className="AnswerTextInput">
      <div className="correctness-radio-button">
        <Radio name={`question-${questionIndex}-correct-answer-radio-group`} inline
          checked={answer.isCorrect}
          disabled={disabled}
          onChange={(e) => { 
            onMarkAsCorrect(questionIndex, answerIndex);
          }}
        >
          Correct
        </Radio>
      </div>
      <TextInput 
        placeholder="Answer text" 
        value={answer.content}
        onChange={handleAnswerTextChange}
        disabled={disabled}
      />

        <div className="answer-preview" style={previewTextStyle}>
          <div className="inner">
            <h1 
              id={`answer-${answerIndex}-preview-text`} 
              className={classnames('preview-text', { empty: !textPresent, 'has-text': textPresent })}
            >{answerPreviewText}</h1>
          </div>
        </div>
    </div>
  );
};

export default AnswerTextInput;
