import React, { Component } from 'react';
import { S3 } from '../../../../../utils/s3';
import TriviaValidator from '../../../../../utils/validators/quiz/trivia';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Dropdown } from '../../../../form/Dropdown';
import { TextInput } from '../../../../form/TextInput';
import { Textarea } from '../../../../form/Textarea';
import { ImagePicker } from '../../../../form/FilePicker';
import { QuestionInputForms } from '../../../../form/QuestionInputForms';
import { SaveInProgressOverlay } from '../../../../misc/Overlay';
import BackIcon from 'react-icons/lib/fa/arrow-circle-left';
import UploadIcon from 'react-icons/lib/ti/upload';
import BookmarkIcon from 'react-icons/lib/ti/bookmark';
import cloneDeep from 'lodash/cloneDeep';
import slug from 'slug';


import {
  isLoaded,
} from 'react-redux-firebase'

import './Create.css';
import { Link } from 'react-router-dom';

const DEFAULT_QUESTION_TEXT_BACKGROUND_COLOR = '#f0ac01';
const THUMBNAILS_FOLDER_NAME = process.env.REACT_APP_S3_IMAGES_FOLDER_NAME;

const COUNTRIES = [
  {
    code: 'gh',
    name: 'Ghana'
  },
  {
    code: 'ng',
    name: 'Nigeria'
  },
  {
    code: 'ke',
    name: 'Kenya'
  },
  {
    code: 'intl',
    name: 'International'
  }
];

const countries = COUNTRIES.map((country) => { 
  return { 
    label: country.name, 
    value: country.code
  } 
});

const uploadConfig = {
  bucketName: process.env.REACT_APP_S3_BUCKET_NAME,
  albumName: THUMBNAILS_FOLDER_NAME,
  region: process.env.REACT_APP_S3_BUCKET_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
}

const generateNewQuestion = () => {
  return cloneDeep(EMPTY_QUESTION);
}

const generateNewAnswer = () => {
  return cloneDeep(EMPTY_ANSWER);
}

const generateEmptyAnswers = (howMany) => {
  const answers = [];
  for (var i = 1; i <= howMany; i++) {
    answers.push(generateNewAnswer());
  }
  return answers;
}

const EMPTY_ANSWER = {
  content: '',
  formatting: {},
  isCorrect: false
}

const EMPTY_QUESTION = {
  content: '',
  formatting: {
    backgroundColor: DEFAULT_QUESTION_TEXT_BACKGROUND_COLOR
  },
  revealTitle: '',
  revealDescription: '',
  revealImage: '',
  answersLayout: 'tile',
  answers: generateEmptyAnswers(4)
};

class Create extends Component {
  constructor(props) {
    super(props);

    const { auth } = props;
    const author = auth.uid;
    const questions = [];
    questions.push(generateNewQuestion());
    this.state = {
      title: '',
      summary: '',
      description: '',
      image: '',
      category: '',
      author,
      kind: '-Kz4Py8OXyFDjbOph2fJ',
      country: '',
      questions,
      messages: {
        all: '',
        above: '',
        below: '',
        none: ''
      }
    };

    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleSummaryChange = this.handleSummaryChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleImageUrlChange = this.handleImageUrlChange.bind(this);
    this.handleQuestionTextChange = this.handleQuestionTextChange.bind(this);
    this.handleQuestionTextBackgroundColorChange = this.handleQuestionTextBackgroundColorChange.bind(this);
    this.handleQuestionRevealTitleChange = this.handleQuestionRevealTitleChange.bind(this);
    this.handleQuestionRevealDescriptionChange = this.handleQuestionRevealDescriptionChange.bind(this);
    this.handleQuestionRevealImageChange = this.handleQuestionRevealImageChange.bind(this);
    this.handleAnswerTextChange = this.handleAnswerTextChange.bind(this);
    this.handleAnswerMarkedAsCorrect = this.handleAnswerMarkedAsCorrect.bind(this);
    this.handleAddQuestion = this.handleAddQuestion.bind(this);
    this.handleRemoveQuestion = this.handleRemoveQuestion.bind(this);
    this.handleScoresAllMessageChange = this.handleScoresAllMessageChange.bind(this);
    this.handleScoresAboveMessageChange = this.handleScoresAboveMessageChange.bind(this);
    this.handleScoresBelowMessageChange = this.handleScoresBelowMessageChange.bind(this);
    this.handleScoresNoneMessageChange = this.handleScoresNoneMessageChange.bind(this);
    this.uploadImageToS3 = this.uploadImageToS3.bind(this);
    this.saveQuiz = this.saveQuiz.bind(this);
    this.saveAsDraft = this.saveAsDraft.bind(this);
    this.saveAndPublish = this.saveAndPublish.bind(this);
  }

  saveQuiz(status) {
    const { firebase, onSaveQuiz } = this.props;
    const path = `/${status}`;
    const quizData = this.getQuizData();
    const quizSlug = slug(quizData.title).toLowerCase();
    const { country, category, kind } = quizData;
    const now = new Date();

    quizData.slug = quizSlug;
    quizData['country_category'] = `${country}_${category}`;
    quizData['country_kind'] = `${country}_${kind}`;
    quizData['country_category_kind'] = `${country}_${category}_${kind}`;
    quizData.createdAt = now.toISOString();

    if (status === 'quizzes') {
      quizData.postedAt = now.toISOString();
    }

    onSaveQuiz(quizData, path, firebase);
  }

  getQuizData() {
    const {
      title,
      summary,
      description,
      image,
      category,
      country,
      author,
      kind,
      questions,
      messages
    } = this.state;

    return { 
      title, 
      summary, 
      description, 
      image, 
      category, 
      country,
      author, 
      kind, 
      questions,
      messages
    };
  }

  saveAsDraft() {
    const quizData = this.getQuizData();
    var validationResult = TriviaValidator.validateAsDraft(quizData);
    const { onUserFormError } = this.props;

    if (validationResult.isValid) {
      onUserFormError([]);
      this.saveQuiz('drafts');
    } else {
      onUserFormError(validationResult.errors);
    }
  }

  saveAndPublish() {
    const quizData = this.getQuizData();
    var validationResult = TriviaValidator.validate(quizData);
    const { onUserFormError } = this.props;

    if (validationResult.isValid) {
      onUserFormError([]);
      this.saveQuiz('quizzes');
    } else {
      onUserFormError(validationResult.errors);
    }
  }

  handleCategoryChange(e) {
    this.setState({ category: e.target.value });
  }

  handleCountryChange(e) {
    this.setState({ country: e.target.value });
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  handleSummaryChange(e) {
    this.setState({ summary: e.target.value });
  }

  handleImageUrlChange(newImageFile) {
    const updateStateWithPreviewDataUrl = (dataURL) => {
      this.setState({ image: dataURL });
    };

    const updateStateWithPreviewImageUrl = (fileName) => {
      this.setState({ 
        image: fileName
      });
    };

    const { uploadImageToS3 } = this;

    if (newImageFile) {
      var reader = new FileReader();

      reader.onload = (readEvt) => {
        updateStateWithPreviewDataUrl(readEvt.target.result);
        uploadImageToS3(newImageFile)
          .then(updateStateWithPreviewImageUrl)
          .catch((err) => {
            console.error('S3 upload failed', err);
          });
      }

      reader.readAsDataURL(newImageFile);
    }
  }

  handleQuestionTextChange(questionIndex, newText) {
    const { questions } = this.state;
    const copyOfQuestions = cloneDeep(questions);
    const targetQuestion = copyOfQuestions[questionIndex];

    targetQuestion.content = newText;
    this.setState({ questions: copyOfQuestions });
  }

  handleQuestionTextBackgroundColorChange(questionIndex, newColor) {
    const { questions } = this.state;
    const copyOfQuestions = cloneDeep(questions);
    const targetQuestion = copyOfQuestions[questionIndex];

    targetQuestion.formatting.backgroundColor = newColor;
    this.setState({ questions: copyOfQuestions });
  }
  
  handleQuestionRevealTitleChange(questionIndex, newTitle) {
    const { questions } = this.state;
    const copyOfQuestions = cloneDeep(questions);
    const targetQuestion = copyOfQuestions[questionIndex];

    targetQuestion.revealTitle = newTitle;
    this.setState({ questions: copyOfQuestions });
  }

  handleQuestionRevealDescriptionChange(questionIndex, newDescription) {
    const { questions } = this.state;
    const copyOfQuestions = cloneDeep(questions);
    const targetQuestion = copyOfQuestions[questionIndex];

    targetQuestion.revealDescription = newDescription;
    this.setState({ questions: copyOfQuestions });
  }

  handleQuestionRevealImageChange(questionIndex, newImageFile) {
    const updateStateWithPreviewDataUrl = (dataURL) => {
      const { questions } = this.state;
      const copyOfQuestions = cloneDeep(questions);
      const targetQuestion = copyOfQuestions[questionIndex];

      targetQuestion.revealImage = dataURL;
      this.setState({ questions: copyOfQuestions });
    };

    const updateStateWithPreviewImageUrl = (fileName) => {
      const { questions } = this.state;
      const copyOfQuestions = cloneDeep(questions);
      const targetQuestion = copyOfQuestions[questionIndex];

      targetQuestion.revealImage = fileName;
      this.setState({ questions: copyOfQuestions });
    };

    const { uploadImageToS3 } = this;

    if (newImageFile) {
      var reader = new FileReader();

      reader.onload = (readEvt) => {
        updateStateWithPreviewDataUrl(readEvt.target.result);
        uploadImageToS3(newImageFile)
          .then(updateStateWithPreviewImageUrl)
          .catch((err) => {
            console.error('S3 upload failed', err);
          });
      }

      reader.readAsDataURL(newImageFile);
    }
  }

  handleAnswerTextChange(questionIndex, answerIndex, newText) {
    this.setState((prevState, props) => {
      const nextState = cloneDeep(prevState);
      nextState.questions[questionIndex].answers[answerIndex].content = newText;
      return nextState;
    });
  }

  handleAnswerMarkedAsCorrect(questionIndex, answerIndex) {
    this.setState((prevState, props) => {
      const nextState = cloneDeep(prevState);
      const targetQuestion = nextState.questions[questionIndex];
      const targetAnswer = targetQuestion.answers[answerIndex];
      targetAnswer.isCorrect = true;

      const allAnswers = targetQuestion.answers;
      allAnswers.forEach((answer, index) => {
        if (index !== answerIndex) {
          answer.isCorrect = false;
        }
      });

      return nextState;
    });
  }

  handleAddQuestion() {
    const { questions } = this.state;
    questions.push(EMPTY_QUESTION);
    this.setState({ questions });
  }

  handleRemoveQuestion(questionIndex) {
    const { questions } = this.state;
    const questionsBeforeTarget = questions.slice(0, questionIndex);
    const questionsAfterTarget = questions.slice(questionIndex+1);
    this.setState({ questions: [].concat(questionsBeforeTarget, questionsAfterTarget) });
  }

  handleScoresAllMessageChange(e) {
    const { messages } = this.state;
    const copyOfMessages = cloneDeep(messages);

    copyOfMessages.all = e.target.value;
    this.setState({ messages: copyOfMessages });
  }

  handleScoresAboveMessageChange(e) {
    const { messages } = this.state;
    const copyOfMessages = cloneDeep(messages);

    copyOfMessages.above = e.target.value;
    this.setState({ messages: copyOfMessages });
  }

  handleScoresBelowMessageChange(e) {
    const { messages } = this.state;
    const copyOfMessages = cloneDeep(messages);

    copyOfMessages.below = e.target.value;
    this.setState({ messages: copyOfMessages });
  }

  handleScoresNoneMessageChange(e) {
    const { messages } = this.state;
    const copyOfMessages = cloneDeep(messages);

    copyOfMessages.none = e.target.value;
    this.setState({ messages: copyOfMessages });
  }

  uploadImageToS3(image, done) {
    return new Promise(function (resolve, reject) {
      S3.upload(image, uploadConfig)
        .then((data) => {
          resolve(data.fileName);
        })
        .catch((err) => {
          console.error('Error uploading image to s3', err);
          reject(err);
        });
    });
  }

  render() {
    const { 
      title, 
      description, 
      summary, 
      image, 
      questions,
      messages
    } = this.state;
    const { 
      handleCategoryChange, 
      handleCountryChange, 
      handleTitleChange, 
      handleSummaryChange,
      handleDescriptionChange,
      handleImageUrlChange,
      handleQuestionTextChange,
      handleQuestionTextBackgroundColorChange,
      handleQuestionRevealImageChange,
      handleQuestionRevealTitleChange,
      handleQuestionRevealDescriptionChange,
      handleAnswerTextChange,
      handleAnswerMarkedAsCorrect,
      handleAddQuestion,
      handleRemoveQuestion,
      handleScoresAllMessageChange,
      handleScoresAboveMessageChange,
      handleScoresBelowMessageChange,
      handleScoresNoneMessageChange,
      saveAsDraft,
      saveAndPublish
    } = this;

    let { categories, userFormErrors, isSavingQuiz } = this.props;
    let categoryOptions = [];

    if (isLoaded(categories)) {
      for (var categoryId in categories) {
        categoryOptions.push({
          label: categories[categoryId].name,
          value: categoryId
        });
      }
    }

    const formErrorListItems = userFormErrors.map((error, index) => {
      return <li key={index}>{error.message}</li>
    });

    return (
      <div className="DashboardQuizzesCreate dashboard-page">
        {isSavingQuiz && 
            <SaveInProgressOverlay />
        }
        <div className="header">
          <h4 className="page-title">
            <Link className="back-to-quizzes" to="/dashboard/quizzes">
              <BackIcon />
            </Link>
            New Quiz
          </h4>
          <Button 
            className="primary button solid primary-action" 
            onClick={saveAndPublish}
          >
            <span className="icon">
              <UploadIcon />
            </span>
            Save and Publish
          </Button>
        </div>

        <div className="body">
          <div className="inner">
            <form>
              <FormGroup className="quiz-category">
                <Dropdown 
                  placeholder="Select a category" 
                  options={categoryOptions}
                  label="Category"
                  onChange={handleCategoryChange}
                />
              </FormGroup>

              <FormGroup className="quiz-country">
                <Dropdown 
                  placeholder="Which country should this quiz show for?" 
                  options={countries}
                  label="Country"
                  onChange={handleCountryChange}
                />
              </FormGroup>

              <FormGroup className="quiz-title">
                <TextInput 
                  placeholder="Add a title" 
                  value={title}
                  label="Title"
                  onChange={handleTitleChange}
                />
              </FormGroup>

              <FormGroup className="quiz-description">
                <Textarea 
                  placeholder="Add a description. Feel free to elaborate" 
                  label="Description"
                  value={description}
                  onChange={handleDescriptionChange}
                  rows={8}
                />
              </FormGroup>

              <FormGroup className="quiz-summary">
                <Textarea 
                  placeholder="Enter a short summary. This will be used when sharing the post on social media..." 
                  label="Short Summary"
                  value={summary}
                  onChange={handleSummaryChange}
                  rows={3}
                />
              </FormGroup>


              <FormGroup className="quiz-thumbnail-image">
                <div className="label-area">
                  <ControlLabel>Thumbnail Image</ControlLabel>
                </div>
                <div className="picker-area">
                  <ImagePicker 
                    onChange={handleImageUrlChange}
                    previewImage={image}
                  />
                </div>
              </FormGroup>

              <FormGroup className="quiz-content">
                <div className="quiz-content-header">
                  <h4>Quiz Content</h4>
                </div>
                <div className="quiz-content-body">
                  <QuestionInputForms 
                    questions={questions}
                    onAddQuestion={handleAddQuestion}
                    onRemoveQuestion={handleRemoveQuestion}
                    onQuestionTextChange={handleQuestionTextChange}
                    onQuestionTextBackgroundColorChange={handleQuestionTextBackgroundColorChange}
                    onQuestionRevealImageChange={handleQuestionRevealImageChange}
                    onQuestionRevealTitleChange={handleQuestionRevealTitleChange}
                    onQuestionRevealDescriptionChange={handleQuestionRevealDescriptionChange}
                    onAnswerTextChange={handleAnswerTextChange}
                    onAnswerMarkedAsCorrect={handleAnswerMarkedAsCorrect}
                  />
                </div>
              </FormGroup>

              <FormGroup className="quiz-footer">
                <div className="quiz-footer-header">
                  <h4 className="text">Quiz Results</h4>
                </div>
                <div className="quiz-footer-body">
                  <div className="messages">
                    <div className="messages-header">
                      <h4 className="text">Messages to show depending on score</h4>
                    </div>

                    <div className="messages-body">
                      <FormGroup className="scored-everything-message">
                        <Textarea
                          placeholder="Write some text to show..."
                          label="Scores 100%"
                          value={messages.all}
                          onChange={handleScoresAllMessageChange}
                          rows={4}
                        />
                      </FormGroup>

                      <FormGroup className="scored-above-average-message">
                        <Textarea
                          placeholder="Write some text to show..."
                          label="Score is above average"
                          value={messages.above}
                          onChange={handleScoresAboveMessageChange}
                          rows={4}
                        />
                      </FormGroup>

                      <FormGroup className="scored-below-average-message">
                        <Textarea
                          placeholder="Write some text to show..."
                          label="Score is below average"
                          value={messages.below}
                          onChange={handleScoresBelowMessageChange}
                          rows={4}
                        />
                      </FormGroup>

                      <FormGroup className="scored-nothing-message">
                        <Textarea
                          placeholder="Write some text to show..."
                          label="Scores zero"
                          value={messages.none}
                          onChange={handleScoresNoneMessageChange}
                          rows={4}
                        />
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </FormGroup>

            </form>

            <div className="floating-right-panel">
              <div className="save-as-draft-button">
                <div className="head-section">
                  <h5 className="heading">Not ready to publish yet?</h5> 
                </div>
                <Button 
                  className="primary button hollow block primary-action" 
                  onClick={saveAsDraft}
                >
                  <span className="icon">
                    <BookmarkIcon />
                  </span>
                  Save as Draft
                </Button>
              </div>

              {userFormErrors.length > 0 && 
                  <div className="form-errors">
                    <div className="header">
                      <h4 className="heading">Please fix the following errors</h4>
                    </div>
                    <div className="body">
                      <ul className="errors-list">
                        {formErrorListItems}
                      </ul>
                    </div>
                  </div>
              }
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Create;

