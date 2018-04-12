import Outlet from './Outlet';
import { connect } from 'react-redux';
import { compose } from 'redux'
import { push } from 'react-router-redux/actions';
import {
    firebaseConnect,
    pathToJS,
} from 'react-redux-firebase'

const mapStateToProps = (state) => {
    return {
        auth: pathToJS(state.firebase, 'auth'),
    };
};

const mapDispatchToProps = (dispatch) => ({
    onLogin() {
        dispatch(push('/dashboard'));
    }
});

const Container = compose(
    firebaseConnect([
    ]),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Outlet)

export default Container;