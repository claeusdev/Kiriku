import React, { Component } from 'react';
import { isLoaded } from 'react-redux-firebase'
import { Link } from 'react-router-dom';
import {
	Breadcrumb,
	Row,
	Col,
	FormGroup,
	FormControl,
	HelpBlock,
	ControlLabel,
	DropdownButton,
	MenuItem
} from 'react-bootstrap';

import LockIcon from 'react-icons/lib/ti/lock-closed';
import FlashIcon from 'react-icons/lib/ti/flash';
import EyeIcon from 'react-icons/lib/ti/eye';
import BackIcon from 'react-icons/lib/ti/chevron-left';
import { MovingEllipsis } from '../../misc/Ellipsis';

import { SingleImagePicker } from '../../misc/ImagePicker';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';

import FroalaEditor from 'react-froala-wysiwyg';

import ReactFilestack from 'filestack-react';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import './style.css';

export default class ArticleForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: '',
			titleState: null,
			content: '',
			contentState: null,
			coverImageUrl: '',
			coverImageUrlState: null,
			tags: [],
			tagsState: null,
			countries: [],
			countriesState: null,
			status: ''
		};

		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleContentChange = this.handleContentChange.bind(this);
		this.handleCoverImageUrlChange = this.handleCoverImageUrlChange.bind(this);
		this.handleTagsChange = this.handleTagsChange.bind(this);
		this.handleCountriesChange = this.handleCountriesChange.bind(this);
		this.saveAs = this.saveAs.bind(this);
	}

	handleTitleChange(e) {
		this.setState({ title: e.target.value });
	}

	handleContentChange(content) {
		this.setState({ content });
	}

	handleCoverImageUrlChange(coverImageUrl) {
		this.setState({ coverImageUrl });
	}

	handleTagsChange(tags) {
		this.setState({ tags });
	}

	handleCountriesChange(countries) {
		this.setState({ countries });
	}

	saveAs(type) {
		const { 
			title,
			titleState,
			content,
			contentState,
			coverImageUrl,
			coverImageUrlState,
			tags,
			tagsState,
			countries,
			countriesState
		} = this.state;

		const formHasErrors = (
			titleState === 'error' ||
			contentState === 'error' ||
			coverImageUrlState === 'error' ||
			tagsState === 'error' ||
			countriesState === 'error'
		);

		if (formHasErrors) {
			return;
		}


		const now = new Date();

		const { onSave, auth } = this.props;
		onSave({
			title,
			content,
			coverImageUrl,
			tags,
			countries,
			status: type,
			author: auth.uid,
			createdAt: now,
			lastUpdatedAt: now
		});
	}

	validateForm(articleStatus) {
		const {
			title,
			content,
			coverImageUrl,
			tags,
			countries
		} = this.state;

		const newState = {
			titleState: null,
			contentState: null,
			coverImageUrlState: null,
			tagsState: null,
			countriesState: null
		};

		
		if (!title) {
			newState.titleState = 'error';
		}

		if (!content) {
			newState.contentState = 'error';
		}

		if (!coverImageUrl) {
			newState.coverImageUrlState = 'error';
		}

		if (tags.length === 0) {
			newState.tagsState = 'error';
		}

		if (countries.length === 0) {
			newState.countriesState = 'error';
		}

		this.setState(newState, () => {
			this.saveAs(articleStatus);
		});
	}

	render() {
		const { formTitle, onSave, saving, backLinkUrl } = this.props;
		let { tags: availableTags } = this.props;
		availableTags = isLoaded(availableTags) ? availableTags : [];
		availableTags = availableTags.map(tag => ({ label: tag.name, value: tag.id }));

		const {
			title,
			titleState,
			content,
			contentState,
			coverImageUrl,
			coverImageUrlState,
			tags,
			tagsState,
			countries,
			countriesState,
			status
		} = this.state;

		const saveMessage = (
			<span> <FlashIcon /> Save Article</span>
		);

		const savingMessage = (
			<span> One Moment Please <MovingEllipsis /></span>
		);

		const saveButtonContent = saving ? savingMessage : saveMessage;
		return (
			<div className="Apollo-ArticleForm">
				<div className="FormHeader">
					<h4 className="FormHeading">{formTitle}</h4>
					<Link className="FormBackLink" to={backLinkUrl}><BackIcon /> Back</Link>
				</div>
				<form className="NewArticleForm">
					<Row className="show-grid">
						<Col xs={12} md={8} className="NewArticleForm-Main">
							<FormGroup className="Form-InputGroup" validationState={titleState}>
								<ControlLabel>Add a Title</ControlLabel>
								<FormControl
									className="ApolloLogin-FormBox-Form-Input"
									type="text"
									value={title}
									placeholder="Add a title here"
									onChange={this.handleTitleChange}
								/>
								{titleState === 'error' &&
									<HelpBlock className="ApolloLogin-FormBox-Form-InputError">Please add a title</HelpBlock>
								}
							</FormGroup>

							<FormGroup className="Form-InputGroup" validationState={contentState}>
								<ControlLabel>What's an article without some content?</ControlLabel>
								<FroalaEditor 
									tag='textarea'
									model={content}
									onModelChange={this.handleContentChange}
								/>
								{contentState === 'error' &&
									<HelpBlock className="ApolloLogin-FormBox-Form-InputError">Please enter some content</HelpBlock>
								}
							</FormGroup>

							<FormGroup className="Form-InputGroup" validationState={coverImageUrlState}>
								<ControlLabel>Choose a dope cover image</ControlLabel>
								<SingleImagePicker previewUrl={coverImageUrl} onFileUpload={this.handleCoverImageUrlChange} />
								{coverImageUrlState === 'error' &&
									<HelpBlock className="ApolloLogin-FormBox-Form-InputError">Please add a cover image</HelpBlock>
								}
							</FormGroup>
						</Col>
						<Col xs={6} md={4} className="NewArticleForm-Side">
							<FormGroup className="Form-InputGroup" validationState={tagsState}>
								<ControlLabel>Tag this article</ControlLabel>
								<Select
									multi={true}
									name="form-field-name"
									placeholder="Select at least one tag"
									value={tags}
									onChange={this.handleTagsChange}
									options={availableTags}
								/>
								{tagsState === 'error' &&
									<HelpBlock className="ApolloLogin-FormBox-Form-InputError">Please select at least one</HelpBlock>
								}
							</FormGroup>

							<FormGroup className="Form-InputGroup" validationState={countriesState}>
								<ControlLabel>Which country should this show for?</ControlLabel>
								<Select
									multi={true}
									name="form-field-name"
									placeholder="Select at least one country"
									value={countries}
									onChange={this.handleCountriesChange}
									options={[
										{
											label: 'Ghana',
											value: 'ghana'
										},
										{
											label: 'Nigeria',
											value: 'nigeria'
										},
										{
											label: 'Kenya',
											value: 'kenya'
										}
									]}
								/>
								{countriesState === 'error' &&
									<HelpBlock className="ApolloLogin-FormBox-Form-InputError">Please select at least one</HelpBlock>
								}
							</FormGroup>

							<FormGroup className="Form-InputGroup" validationState={null}>
								<ControlLabel>Ready. Set. Go</ControlLabel>
								<div className="button-group-box">
									<DropdownButton
										bsStyle="success btn-block"
										title={saveButtonContent}
										disabled={saving}
									>
										<MenuItem eventKey="1" onSelect={() => this.validateForm('draft')}><LockIcon /> Save As Draft</MenuItem>
										<MenuItem eventKey="2" onSelect={() => this.validateForm('published')}><EyeIcon /> Save and Publish</MenuItem>
									</DropdownButton>
								</div>
							</FormGroup>
						</Col>
					</Row>
				</form>
			</div>
		);
	}
};
