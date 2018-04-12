const validator = {
  validate(quiz) {
    const errors = [
    ]; 
    if (!quiz.title) {
      errors.push({
        message: 'Please add a title for the quiz',
        attribute: 'title'
      });
    }

    if (!quiz.summary) {
      errors.push({
        message: 'Please add a summary for the quiz',
        attribute: 'summary'
      });
    }

    if (!quiz.description) {
      errors.push({
        message: 'Please add a description for the quiz',
        attribute: 'description'
      });
    }

    if (!quiz.image) {
      errors.push({
        message: 'Please add a thumbnail image for the quiz',
        attribute: 'image'
      });
    }

    if (!quiz.category) {
      errors.push({
        message: 'Please add a category for the quiz',
        attribute: 'category'
      });
    }

    if (!quiz.author) {
      errors.push({
        message: 'Please add an author for the quiz',
        attribute: 'author'
      });
    }

    if (!quiz.kind) {
      errors.push({
        message: 'Please add a kind for the quiz',
        attribute: 'kind'
      });
    }

    if (!quiz.messages.all) {
      errors.push({
        message: 'Please add a message for when a person scores 100%',
        attribute: 'messages.all'
      });
    }

    if (!quiz.messages.above) {
      errors.push({
        message: 'Please add a message for when a person above average',
        attribute: 'messages.above'
      });
    }

    if (!quiz.messages.below) {
      errors.push({
        message: 'Please add a message for when a person below average',
        attribute: 'messages.below'
      });
    }

    if (!quiz.messages.none) {
      errors.push({
        message: 'Please add a message for when a person zero',
        attribute: 'messages.none'
      });
    }

    const validateQuestion = (question, index) => {
      const questionNumber = index + 1;

      if (!question.content) {
        errors.push({
          message: `Please add a title for Question ${questionNumber}`,
          attribute: `quiz.questions[${index}].content`
        });
      }

      if (!question.formatting.backgroundColor) {
        errors.push({
          message: `Please choose a background color for Question ${questionNumber}`,
          attribute: `quiz.questions[${index}].formatting.backgroundColor`
        });
      }

      const hasCorrectAnswer = question.answers.some(answer => answer.isCorrect);
      if (!hasCorrectAnswer) {
        errors.push({
          message: `Please choose a correct answer for Question ${questionNumber}`,
          attribute: `quiz.questions[${index}]`
        });
      }

      if (!question.revealTitle) {
        errors.push({
          message: `Please add a reveal title for Question ${questionNumber}`,
          attribute: `quiz.questions[${index}].revealTitle`
        });
      }

      if (!question.answersLayout) {
        errors.push({
          message: `Please choose a layout for Question ${questionNumber}'s answers`,
          attribute: `quiz.questions[${index}].answersLayout`
        });
      }

      const validateQuestionAnswers = (answers) => {
        answers.forEach((answer, answerIndex) => {
          validateAnswer(answer, answerIndex);
        });
      }

      const validateAnswer = (answer, answerIndex) => {
        const answerNumber = answerIndex + 1;

        if (!answer.content) {
          errors.push({
            message: `Please add content for Question ${questionNumber}, Answer ${answerNumber}`,
            attribute: `quiz.questions[${index}].answers[${answerIndex}]`
          });
        }
      }

      validateQuestionAnswers(question.answers);

    };

    const validateQuestions = (questions) => {
      questions.forEach((question, index) => {
        validateQuestion(question, index);
      });
    };

    validateQuestions(quiz.questions);
    
    return {
      isValid: errors.length === 0,
      errors
    }
  },
  validateAsDraft(quiz) {
    const errors = [
    ]; 
    if (!quiz.title) {
      errors.push({
        message: 'Please add a title for the quiz',
        attribute: 'title'
      });
    }

    if (!quiz.category) {
      errors.push({
        message: 'Please choose a category for the quiz',
        attribute: 'category'
      });
    }

    if (!quiz.country) {
      errors.push({
        message: 'Please choose a country for the quiz',
        attribute: 'country'
      });
    }

    if (!quiz.author) {
      errors.push({
        message: 'Please add an author for the quiz',
        attribute: 'author'
      });
    }

    if (!quiz.kind) {
      errors.push({
        message: 'Please add a kind for the quiz',
        attribute: 'kind'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
};

export default validator;
