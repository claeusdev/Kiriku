import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import ListQuizzes from './List/Container';
import CreateQuiz from './Create/Container';
import EditQuiz from './Edit/Container';

const EditQuizWrapper = ({ location, match }) => {
  const editProps = { location, match };
  return <EditQuiz {...editProps} />;
};

class Index extends Component {
  render() {
    return (
      <div className="QuizzesLayout">
        <Switch>
          <Route exact path="/dashboard/quizzes" render={(props) => <ListQuizzes {...props} filter="Recent" />} />
          <Route path="/dashboard/quizzes/my-drafts" render={(props) => <ListQuizzes {...props} filter="My Drafts" />} />
          <Route path="/dashboard/quizzes/published-by-me" render={(props) => <ListQuizzes {...props} filter="Published By Me" />} />
          <Route path="/dashboard/quizzes/new" component={CreateQuiz} />
          <Route path="/dashboard/quizzes/:id/edit" component={EditQuizWrapper} />
        </Switch>
      </div>
    );
  }
}

export default Index;
