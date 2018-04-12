import React, { Component } from 'react';
import './style.css';
import { Button } from 'react-bootstrap';
import { MovingEllipsis } from '../../misc/Ellipsis/index';
import FacebookIcon from 'react-icons/lib/fa/facebook-square';

const ERRORS = {
	'general': 'We had trouble logging you in'
};

class LoginPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loginError: '',
			attemptingLogin: false
		}

		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	handleFormSubmit() {
		const { onLogin } = this.props;
		const { firebase } = this.props;
		const { login } = firebase;
		const credentials = { provider: 'facebook', type: 'popup' };
		this.setState({ attemptingLogin: true, loginError: '' });
		login(credentials)
		.then((o) => {
			onLogin();
		})
		.catch((e) => {
			this.setState({ attemptingLogin: false });
			this.setState({ loginError: ERRORS['general'] });
		})
	}

	render() {
		const { 
			handleFormSubmit
		} = this;
		const { attemptingLogin, loginError } = this.state;

		return (
			<div className="LoginPage">
				<div className="form-wrapper">
					<div className="brand">Quizzes <small>By OMG</small></div>
					<form>
						{loginError &&
							<div className="error">{loginError}</div>
						}
						
						<Button
							className="primary button block solid primary-action"
							onClick={handleFormSubmit}
							disabled={attemptingLogin}
						>
							{attemptingLogin && 
								<span>Loading<MovingEllipsis /></span>
							}
							{!attemptingLogin && 
							<span className="login-text">
								<FacebookIcon />
								<span>Login with Facebook 
								</span>
							</span>
							}
						</Button>
					</form>
				</div>
			</div>
		);
	}
}

export default LoginPage;