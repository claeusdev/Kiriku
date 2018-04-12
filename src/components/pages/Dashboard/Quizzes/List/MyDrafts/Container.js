import Outlet from './Outlet';
import { connect } from 'react-redux';
import { compose } from 'redux'
import {
  firebaseConnect,
  populatedDataToJS
} from 'react-redux-firebase'

const populates = [
  { child: 'author', root: 'users' }
]

const mapStateToProps = (state) => {
  return {
    drafts: populatedDataToJS(state.firebase, 'allDraftQuizzesByCurrentUser', populates)
  };
};

const mapDispatchToProps = (dispatch) => ({
});

const Container = compose(
  firebaseConnect(({ auth }) => {
    return [
      {
        path: 'drafts',
        storeAs: 'allDraftQuizzesByCurrentUser',
        queryParams: ['orderByChild=author', `equalTo=${auth.uid}`],
        populates
      }
    ]
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Outlet)

export default Container;
