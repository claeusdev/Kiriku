import React from 'react';
import PropTypes from 'prop-types';
import { ControlLabel } from 'react-bootstrap';
import { TextInput } from '../TextInput';
import { Textarea } from '../Textarea';
import { ImagePicker } from '../FilePicker';
import './style.css';

const QuestionRevealInputForm = ({ 
  caption, 
  question, 
  questionIndex,
  onQuestionRevealImageChange,
  onQuestionRevealTitleChange,
  onQuestionRevealDescriptionChange,
  editingDisabled
}) => {

  const handleRevealImageChange = (newImage) => {
    onQuestionRevealImageChange(questionIndex, newImage);
  }

  const handleRevealTitleChange = (evt) => {
    const newTitle = evt.target.value;
    onQuestionRevealTitleChange(questionIndex, newTitle);
  }

  const handleRevealDescriptionChange = (evt) => {
    const newDescription = evt.target.value;
    onQuestionRevealDescriptionChange(questionIndex, newDescription);
  }

  return (
    <div className="QuestionRevealInputForm">
      <div className="head-section">
        {caption && <ControlLabel>{caption}</ControlLabel>}
      </div>
      <div className="body-section">
        <div className="reveal-image">
          <ImagePicker 
            onChange={handleRevealImageChange}
            previewImage={question.revealImage}
            disabled={editingDisabled}
          />
        </div>
        <div className="reveal-text">
          <TextInput 
            placeholder="Reveal Title"
            value={question.revealTitle}
            onChange={handleRevealTitleChange}
            disabled={editingDisabled}
          />
          <Textarea 
            placeholder="Reveal Description" 
            value={question.revealDescription}
            onChange={handleRevealDescriptionChange}
            disabled={editingDisabled}
          />
        </div>
      </div>
    </div>
  );
};

QuestionRevealInputForm.propTypes = {
  caption: PropTypes.string,
  question: PropTypes.object, 
  questionIndex: PropTypes.number,
  onQuestionRevealImageChange: PropTypes.func,
  onQuestionRevealTitleChange: PropTypes.func,
  onQuestionRevealDescriptionChange: PropTypes.func
};

export default QuestionRevealInputForm;
