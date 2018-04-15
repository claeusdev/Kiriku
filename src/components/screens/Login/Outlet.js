import React, { Component } from 'react';
import './style.css';
import { Button, FormControl, FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';
import { MovingEllipsis } from '../../misc/Ellipsis/index';
import ThunderBoltIcon from 'react-icons/lib/ti/flash';

class LoginPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
      email: '',
      emailState: null,
      password: '',
      passwordState: null,
			loginError: '',
			attemptingLogin: false
		}

		this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	handleFormSubmit() {
    const { email, password } = this.state;
    let emailState = null, passwordState = null;
    let isValidSubmission = true;

    if (!email) {
      emailState = 'error';
      isValidSubmission = false;
    }
    if (!password) {
      passwordState = 'error';
      isValidSubmission = false;
    }

    this.setState({ emailState, passwordState });

    if (!isValidSubmission) {
      return;
    }

		const { onLogin } = this.props;
		const { firebase } = this.props;
		const { login } = firebase;
		const credentials = { email, password };
		this.setState({ attemptingLogin: true, loginError: '' });
		login(credentials)
		.then(() => {})
		.catch((e) => {
      let loginError = 'Sorry. We had trouble logging you in';
      if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-email') {
        loginError = 'Please check your credentials';
      }

			this.setState({ attemptingLogin: false });
			this.setState({ loginError });
		});
  }
  
  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }
  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

	render() {
		const { 
			handleFormSubmit
		} = this;
		const { 
      attemptingLogin, 
      loginError, 
      email, 
      password,
      emailState,
      passwordState
    } = this.state;

		return (
			<div className="ApolloLogin">
				<div className="ApolloLogin-FormBox">
          <div className="ApolloLogin-FormBox-Logo">
            <ThunderBoltIcon />
          </div>
					<h1 className="ApolloLogin-FormBox-Brand">Apollo Admin</h1>
					<form className="ApolloLogin-FormBox-Form" onKeyPress={(e) => {
            if (e.which === 13) {
              this.handleFormSubmit();
            }
          }}>
						{loginError &&
              <div className="ApolloLogin-FormBox-Form-LoginError">{loginError}</div>
            }

            <FormGroup className="ApolloLogin-FormBox-Form-InputGroup" validationState={emailState}>
              <FormControl
                className="ApolloLogin-FormBox-Form-Input"
                type="text"
                value={email}
                placeholder="Email Address"
                onChange={this.handleEmailChange}
              />
              {emailState === 'error' && 
                <HelpBlock className="ApolloLogin-FormBox-Form-InputError">Please enter a valid email address</HelpBlock>
              }
            </FormGroup>

            <FormGroup className="ApolloLogin-FormBox-Form-InputGroup" validationState={passwordState}>
              <FormControl
                className="ApolloLogin-FormBox-Form-Input"
                type="password"
                value={password}
                placeholder="Password"
                onChange={this.handlePasswordChange}
              />
              {passwordState === 'error' && 
                <HelpBlock className="ApolloLogin-FormBox-Form-InputError">Please enter a password</HelpBlock>
              }
            </FormGroup>
						
						<Button
							className="ApolloLogin-FormBox-Form-Button"
							onClick={handleFormSubmit}
              disabled={attemptingLogin}
              block
						>
							{attemptingLogin && 
								<span>Hang tight <MovingEllipsis /></span>
							}
							{!attemptingLogin && 
							<span className="login-text">
								<span>Go to Admin 
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
