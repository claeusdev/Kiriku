import React, { Component } from 'react';
import { S3 } from '../../../../../utils/s3';
import TriviaValidator from '../../../../../utils/validators/quiz/trivia';
import { FormGroup, ControlLabel, Button, Alert } from 'react-bootstrap';
import { Dropdown } from '../../../../form/Dropdown';
import { TextInput } from '../../../../form/TextInput';
import { Textarea } from '../../../../form/Textarea';
import { ImagePicker } from '../../../../form/FilePicker';
import { QuestionInputForms } from '../../../../form/QuestionInputForms';
import { PleaseWaitOverlay } from '../../../../misc/Overlay';
import UploadIcon from 'react-icons/lib/ti/input-checked';
import PublishIcon from 'react-icons/lib/ti/upload';
import ArrowBackIcon from 'react-icons/lib/ti/arrow-back';
import BackIcon from 'react-icons/lib/fa/arrow-circle-left';
import cloneDeep from 'lodash/cloneDeep';
import has from 'lodash/has';


import {
  isLoaded,
} from 'react-redux-firebase'
import { push } from 'react-router-redux'

import './style.css';
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

const EMPTY_MESSAGES = {
  all: '',
  above: '',
  below: '',
  none: ''
};

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

const EMPTY_QUIZ = {
  title: '',
  summary: '',
  description: '',
  image: '',
  category: '',
  author: '',
  kind: '-Kz4Py8OXyFDjbOph2fJ',
  country: '',
  questions: [],
  messages: {
    all: '',
    above: '',
    below: '',
    none: ''
  }
};

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

class Edit extends Component {
  constructor(props) {
    super(props);
    let { quiz } = props;
    if (isLoaded(quiz) && quiz) {
      quiz = Object.keys(quiz).map((key) => {
        return quiz[key];
      })[0];
      quiz.messages = quiz.messages || EMPTY_MESSAGES;
      this.state = quiz;
    } else {
      this.state = EMPTY_QUIZ;
    }

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
    this.updateQuiz = this.updateQuiz.bind(this);
    this.publishQuiz = this.publishQuiz.bind(this);
    this.saveAsDraft = this.saveAsDraft.bind(this);
    this.saveAndPublish = this.saveAndPublish.bind(this);
    this.unpublish = this.unpublish.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let currentQuiz = this.props.quiz;
    let quizDataInNewProps = nextProps.quiz;
    let quizDataForState = {};

    if (!currentQuiz) {
      if (isLoaded(quizDataInNewProps)) {
        if (quizDataInNewProps) {
          quizDataForState = Object.keys(quizDataInNewProps).map((key) => {
            return quizDataInNewProps[key];
          })[0];

        }
      }
    } else {
      quizDataForState = this.state;
      if (!has(quizDataForState, 'title')) {
        quizDataForState = Object.keys(quizDataForState).map((key) => {
          return quizDataForState[key];
        })[0];
      }
    }

    quizDataForState.messages = quizDataForState.messages || EMPTY_MESSAGES;
    const newState = cloneDeep(quizDataForState);
    this.setState(newState);
  }

  updateQuiz() {
    this.setState({ updating: true });
    const { id } = this.props.match.params;
    const quizData = this.getQuizData();
    const quizPath = `/drafts/${id}`;

    const { firebase, dispatch } = this.props;

    const goBackToRecentQuizzes = () => {
      return new Promise((resolve, reject) => {
        this.setState({ updating: false });
        dispatch(push(`/dashboard/quizzes`));
        resolve();
      })
    }
    
    firebase.update(quizPath, quizData)
      .then(goBackToRecentQuizzes)
      .catch((err) => {
        this.setState({ updating: false });
        console.log('error saving draft');
      })
  }

  publishQuiz() {
    this.setState({ updating: true });
    const { id } = this.props.match.params;
    const quizData = this.getQuizData();
    const quizPath = `/drafts/${id}`;
    const publishedPath = `/quizzes`;
    const now = new Date();

    const { firebase, dispatch } = this.props;

    const removeQuizAsDraft = (movedQuizSnapshot) => {
      return new Promise((resolve, reject) => {
        firebase.remove(quizPath)
          .then((removeResult) => {
            this.setState({ updating: false });
            dispatch(push(`/dashboard/quizzes`));
            resolve(removeResult);
          })
          .catch((err) => {
            this.setState({ updating: false });
            reject(err);
          });
      })
    }

    quizData.postedAt = now.toISOString();
    firebase.push(publishedPath, quizData)
      .then(removeQuizAsDraft)
      .catch((err) => {
        this.setState({ updating: false });
        console.log('error saving draft');
      })
  }

  unpublish() {
    this.setState({ updating: true });
    const { id } = this.props.match.params;
    const quizData = this.getQuizData();
    const quizPath = `/quizzes/${id}`;
    const draftsPath = `/drafts`;

    const { firebase, dispatch } = this.props;

    const removeQuizAsPublished = (movedQuizSnapshot) => {
      return new Promise((resolve, reject) => {
        const newDraftId = movedQuizSnapshot.key;
        firebase.remove(quizPath)
          .then((removeResult) => {
            this.setState({ updating: false });
            dispatch(push(`/dashboard/quizzes/${newDraftId}/edit?status=draft`));
            resolve(removeResult);
          })
          .catch((err) => {
            this.setState({ updating: false });
            reject(err);
          });
      })
    }
    
    quizData.postedAt = '';
    firebase.push(draftsPath, quizData)
      .then(removeQuizAsPublished)
      .catch((err) => {
        console.log('error saving draft');
      })
  }

  getQuizData() {
    const {
      title,
      slug,
      summary,
      description,
      image,
      category,
      country,
      country_category,
      country_category_kind,
      country_kind,
      author,
      kind,
      questions,
      messages,
      createdAt,
      postedAt = ''
    } = this.state;

    return { 
      title, 
      slug,
      summary, 
      description, 
      image, 
      category, 
      country,
      country_category,
      country_category_kind,
      country_kind,
      author, 
      kind, 
      questions,
      messages,
      createdAt,
      postedAt
    };
  }

  saveAsDraft() {
    const quizData = this.getQuizData();
    var validationResult = TriviaValidator.validateAsDraft(quizData);
    const { onUserFormError } = this.props;

    if (validationResult.isValid) {
      onUserFormError([]);
      this.updateQuiz();
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
      this.publishQuiz();
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
    const { quiz } = this.props;
    const quizLoaded = isLoaded(quiz);

    if (!quizLoaded) {
      return <PleaseWaitOverlay />;
    } else {
      if (!quiz) {
        return <p style={
          {
            padding: 30
          }
        }>The quiz you are looking for may have has been moved.</p>
      }
    }

    const { 
      title, 
      country,
      category,
      description, 
      summary, 
      image, 
      questions,
      messages,
      author
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
      saveAndPublish,
      unpublish
    } = this;

    let { quizStatus, categories, userFormErrors } = this.props;
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

    const editingDisabled = quizStatus === 'published';
    const SaveChangesButton = () => {
      return (
        <Button
          className="primary button hollow primary-action save-changes" 
          onClick={saveAsDraft}
          disabled={editingDisabled}
        >
          <span className="icon">
            <UploadIcon />
          </span>
          Save Changes
          </Button>
      );
    }
    const SaveAndPublishButton = () => {
      return (
        <Button
          className="primary button solid primary-action save-and-publish"
          onClick={saveAndPublish}
          disabled={editingDisabled}
        >
          <span className="icon">
            <PublishIcon />
          </span>
          Save and Publish
          </Button>
      );
    }

    const UnpublishButton = () => {
      return (
        <Button
          className="destructive button solid destructive-action"
          onClick={unpublish}
        >
          <span className="icon">
            <ArrowBackIcon />
          </span>
          Unpublish Quiz
          </Button>
      );
    }

    const { updating } = this.state;
    const { auth } = this.props;
    const currentUserId = auth.uid;
    const currentUserIsOwnerOfQuiz = author === currentUserId;

    return (
      <div className="DashboardQuizzesEdit dashboard-page">
        {updating && 
            <PleaseWaitOverlay />
        }
        <div className="header">
          <h4 className="page-title">
            <Link className="back-to-quizzes" to="/dashboard/quizzes">
              <BackIcon />
            </Link>
            {title}
          </h4>
          {!editingDisabled && currentUserIsOwnerOfQuiz && 
            <div>
            <SaveChangesButton /> { ' ' }
            <SaveAndPublishButton />
            </div>
          }
          {editingDisabled && currentUserIsOwnerOfQuiz &&
            <UnpublishButton />
          }
        </div>

        <div className="body">
          <div className="inner">
            <form>
              <FormGroup className="quiz-category">
                <Dropdown 
                  placeholder="Select a category" 
                  value={category}
                  options={categoryOptions}
                  label="Category"
                  onChange={handleCategoryChange}
                  disabled={editingDisabled}
                />
              </FormGroup>

              <FormGroup className="quiz-country">
                <Dropdown 
                  placeholder="Which country should this quiz show for?" 
                  value={country}
                  options={countries}
                  label="Country"
                  onChange={handleCountryChange}
                  disabled={editingDisabled}
                />
              </FormGroup>

              <FormGroup className="quiz-title">
                <TextInput 
                  placeholder="Add a title" 
                  value={title}
                  label="Title"
                  onChange={handleTitleChange}
                  disabled={editingDisabled}
                />
              </FormGroup>

              <FormGroup className="quiz-description">
                <Textarea 
                  placeholder="Add a description. Feel free to elaborate" 
                  label="Description"
                  value={description}
                  onChange={handleDescriptionChange}
                  rows={8}
                  disabled={editingDisabled}
                />
              </FormGroup>

              <FormGroup className="quiz-summary">
                <Textarea 
                  placeholder="Enter a short summary. This will be used when sharing the post on social media..." 
                  label="Short Summary"
                  value={summary}
                  onChange={handleSummaryChange}
                  rows={3}
                  disabled={editingDisabled}
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
                    disabled={editingDisabled}
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
                    editingDisabled={editingDisabled}
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
                          disabled={editingDisabled}
                        />
                      </FormGroup>

                      <FormGroup className="scored-above-average-message">
                        <Textarea
                          placeholder="Write some text to show..."
                          label="Score is above average"
                          value={messages.above}
                          onChange={handleScoresAboveMessageChange}
                          rows={4}
                          disabled={editingDisabled}
                        />
                      </FormGroup>

                      <FormGroup className="scored-below-average-message">
                        <Textarea
                          placeholder="Write some text to show..."
                          label="Score is below average"
                          value={messages.below}
                          onChange={handleScoresBelowMessageChange}
                          rows={4}
                          disabled={editingDisabled}
                        />
                      </FormGroup>

                      <FormGroup className="scored-nothing-message">
                        <Textarea
                          placeholder="Write some text to show..."
                          label="Scores zero"
                          value={messages.none}
                          onChange={handleScoresNoneMessageChange}
                          rows={4}
                          disabled={editingDisabled}
                        />
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </FormGroup>

            </form>

            <div className="floating-right-panel">
              {quizStatus === 'published' && currentUserIsOwnerOfQuiz &&
              <div className="cannot-edit-published-quizzes-notice">
                <Alert bsStyle="warning" onDismiss={this.handleAlertDismiss}>
                  <h4 className="heading">Can't Edit?</h4>
                  <p className="body">Editing is disabled for published quizzes. If you still want to edit this quiz, you will first have to unpublish it, make your changes, and then republish the quiz.</p>
                </Alert>
              </div>
              }

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

export default Edit;

