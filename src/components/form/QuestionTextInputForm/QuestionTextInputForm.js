import React, { Component } from 'react';
import { TextInput } from '../TextInput';
import { ColorPicker } from '../ColorPicker';
import classnames from 'classnames';
import fitty from 'fitty';
import './style.css';

class QuestionTextInputForm extends Component {
  constructor(props) {
    super(props);

    this.handleQuestionTextChange = this.handleQuestionTextChange.bind(this);
    this.handleQuestionTextBackgroundColorChange = this.handleQuestionTextBackgroundColorChange.bind(this);
  }

  handleQuestionTextChange(evt) {
    const { onQuestionTextChange, questionIndex } = this.props;
    fitty(`#question-${questionIndex}-preview-text`);
    onQuestionTextChange(questionIndex, evt.target.value);
  };

  handleQuestionTextBackgroundColorChange(newBackground) {
    const { onQuestionTextBackgroundColorChange, questionIndex } = this.props;
    onQuestionTextBackgroundColorChange(questionIndex, newBackground);
  }

  render() {
    const { 
      question, 
      questionIndex,
      disabled
    } = this.props;

    const { 
      handleQuestionTextChange,
      handleQuestionTextBackgroundColorChange
    } = this;
    const questionPreviewText = question.content || 'Question';
    const textPresent = !!question.content;

    const previewTextStyle = {
      backgroundColor: question.formatting.backgroundColor
    };

    return (
      <div className="QuestionTextInputForm">
        <TextInput 
          placeholder="Question text" 
          value={question.content}
          onChange={handleQuestionTextChange}
          disabled={disabled}
          label="Question"
        />
        <div className="question-preview" style={previewTextStyle}>
          <div className="inner">
            <h1 
              id={`question-${questionIndex}-preview-text`} 
              className={classnames('preview-text', { empty: !textPresent, 'has-text': textPresent })}
            >{questionPreviewText}</h1>
          </div>
        </div>
        <ColorPicker 
          label="Background" 
          uniqueIdentier={questionIndex} 
          selected={question.formatting.backgroundColor}
          onChange={handleQuestionTextBackgroundColorChange}
          disabled={disabled}
        />
      </div>
    );
  }
}

export default QuestionTextInputForm;
