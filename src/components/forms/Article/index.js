import React, { Component } from 'react';
import { isLoaded } from 'react-redux-firebase'
import { Link } from 'react-router-dom';
import { Card } from '../../content';
import {
	Breadcrumb,
	Row,
	Col,
	FormGroup,
	FormControl,
	HelpBlock,
	ControlLabel,
	DropdownButton,
	MenuItem,
	Button
} from 'react-bootstrap';

import LockIcon from 'react-icons/lib/ti/lock-closed';
import FlashIcon from 'react-icons/lib/ti/flash';
import EyeIcon from 'react-icons/lib/ti/eye';
import EditIcon from 'react-icons/lib/ti/edit';
import ArchiveIcon from 'react-icons/lib/ti/archive';
import BackIcon from 'react-icons/lib/ti/chevron-left';
import CheckMarkIcon from 'react-icons/lib/ti/input-checked';
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
import FroalaEditorView from 'react-froala-wysiwyg';

import ReactFilestack from 'filestack-react';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import './style.css';

const articleDefaults = {
	title: '',
	content: '',
	coverImageUrl: '',
	tags: [],
	countries: [],
	status: ''
};

const capitalizeFirstLetter = (word) => {
	return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`;
};

export default class ArticleForm extends Component {
	constructor(props) {
		super(props);

		const { article = articleDefaults } = props;

		let { tags, countries } = article;
		const {
			title,
			content,
			coverImageUrl,
			status
		} = article;

		countries = countries.map(country => {
			return {
				label: capitalizeFirstLetter(country),
				value: country
			};
		});

		tags = tags.map(tag => {
			return {
				label: capitalizeFirstLetter(tag),
				value: tag
			};
		});

		this.state = {
			title,
			titleState: null,
			content,
			contentState: null,
			coverImageUrl,
			coverImageUrlState: null,
			tags,
			tagsState: null,
			countries,
			countriesState: null,
			status,
			showStatusChangeForm: false
		};

		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleContentChange = this.handleContentChange.bind(this);
		this.handleCoverImageUrlChange = this.handleCoverImageUrlChange.bind(this);
		this.handleTagsChange = this.handleTagsChange.bind(this);
		this.handleCountriesChange = this.handleCountriesChange.bind(this);
		this.handleStatusChange = this.handleStatusChange.bind(this);
		this.showStatusChangeForm = this.showStatusChangeForm.bind(this);
		this.hideStatusChangeForm = this.hideStatusChangeForm.bind(this);
		this.discardStatusChanges = this.discardStatusChanges.bind(this);
		this.validateForm = this.validateForm.bind(this);
		this.saveAs = this.saveAs.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const { article = articleDefaults } = nextProps;

		let { tags, countries } = article;
		const {
			title,
			content,
			coverImageUrl,
			status
		} = article;

		countries = countries.map(country => {
			return {
				label: capitalizeFirstLetter(country),
				value: country
			};
		});

		tags = tags.map(tag => {
			return {
				label: capitalizeFirstLetter(tag),
				value: tag
			};
		});

		this.setState({
			title,
			content,
			coverImageUrl,
			tags,
			countries,
			status
		});
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
		// countries = countries.map(country => country.value);
		this.setState({ countries });
	}

	handleStatusChange(status) {
		let value = "";
		if (status) {
			value = status.value;
		}

		this.setState({ status: value });
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
			countriesState,
			status,
			statusState
		} = this.state;

		const formHasErrors = (
			titleState === 'error' ||
			contentState === 'error' ||
			coverImageUrlState === 'error' ||
			tagsState === 'error' ||
			countriesState === 'error' ||
			statusState === 'error'
		);

		if (formHasErrors) {
			return;
		}

		const now = new Date();

		const { onSave, auth, mode, article } = this.props;
		const articleData = {
			tags,
			title,
			content,
			coverImageUrl,
			countries,
			status,
			lastUpdatedAt: now
		};
		
		if (mode === 'edit') {
			articleData['id'] = article.id;
			articleData['author'] = article.author;
			articleData['createdAt'] = article.createdAt;
		}

		if (mode === 'new') {
			articleData['createdAt'] = now;
			articleData['author'] = auth.uid;
			articleData['status'] = type;
		}

		onSave(articleData);
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

	showStatusChangeForm() {
		this.setState({ showStatusChangeForm: true });
	}

	hideStatusChangeForm() {
		this.setState({ showStatusChangeForm: false });
	}

	discardStatusChanges() {
		const { article = articleDefaults } = this.props;
		const { status } = article;
		this.setState({ status });
		this.hideStatusChangeForm();
	}

	render() {
		const { formTitle, onSave, saving, backLinkUrl, editable = true, mode } = this.props;
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
			status,
			showStatusChangeForm
		} = this.state;

		const newArticleSaveMessage = (
			<span> <FlashIcon /> Save Article</span>
		);

		const editArticleSaveMessage = (
			<span> <CheckMarkIcon /> Save Changes</span>
		);

		const saveMessage = mode === "edit" ? editArticleSaveMessage : newArticleSaveMessage;

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
									disabled={!editable}
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
									disabled={!editable}
									config={{
										events: {
											'froalaEditor.initialized': function (e, editor) {
												if (!editable) {
													editor.edit.off();
												}
											}
										}
									}}
								/>
								{contentState === 'error' &&
									<HelpBlock className="ApolloLogin-FormBox-Form-InputError">Please enter some content</HelpBlock>
								}
							</FormGroup>

							<FormGroup className="Form-InputGroup" validationState={coverImageUrlState}>
								<ControlLabel>Choose a dope cover image</ControlLabel>
								<SingleImagePicker previewUrl={coverImageUrl} onFileUpload={this.handleCoverImageUrlChange} editable={editable} />
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
									disabled={!editable}
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
									disabled={!editable}
								/>
								{countriesState === 'error' &&
									<HelpBlock className="ApolloLogin-FormBox-Form-InputError">Please select at least one</HelpBlock>
								}
							</FormGroup>

							{mode === "edit" && 
							<Card HeaderContent={() => <p>Publish</p>} BodyContent={() => {
								return (
									<div className="PublishSectionContent">
										<p className="PublishSectionContent-Status">
											<div className="PublishSectionContent-StatusIcon">
												{status === 'published' && 
												<EyeIcon />
												}
												{status === 'draft' && 
												<EditIcon />
												}
												{status === 'unpublished' && 
												<ArchiveIcon />
												}
											</div>
											<span className="PublishSectionContent-StatusLabel">Status: </span>
											<span className="PublishSectionContent-StatusValue">{`${status.charAt(0).toUpperCase()}${status.slice(1)}`}</span>
											{!showStatusChangeForm && 
											<a className="PublishSectionContent-StatusChangeLink" href="" onClick={(e) => {e.preventDefault(); this.showStatusChangeForm()}}>Change</a>
											}
										</p>
										{showStatusChangeForm && 
										<div className="PublishSectionContent-StatusUpdate">
											<FormGroup className="Form-InputGroup" validationState={titleState}>
												<Select
													name="form-field-name"
													placeholder="Select status"
													value={status}
													onChange={this.handleStatusChange}
													options={[
														{
															label: 'Published',
															value: 'published'
														},
														{
															label: 'Unpublished',
															value: 'unpublished'
														},
														{
															label: 'Draft',
															value: 'draft'
														},
													]}
													disabled={!editable}
												/>
												{titleState === 'error' &&
													<HelpBlock className="ApolloLogin-FormBox-Form-InputError">Please add a title</HelpBlock>
												}
												<Button onClick={this.hideStatusChangeForm}>Okay</Button>
												<Button bsStyle="link" onClick={this.discardStatusChanges}>Cancel</Button>
											</FormGroup>
										</div>
										}
									</div>
								);
							}} />
							}

							{mode === "edit" && 
							<FormGroup className="Form-InputGroup" validationState={null}>
								<ControlLabel>Review and Save.</ControlLabel>
								<Button className="SaveChanges" block bsSize="large" bsStyle="success" onClick={this.validateForm} disabled={saving}>{saveButtonContent}</Button>
							</FormGroup>
							}
							{mode === "new" && 
							<FormGroup className="Form-InputGroup" validationState={null}>
								<ControlLabel>Ready. Set. Go.</ControlLabel>
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
							}
						</Col>
					</Row>
				</form>
			</div>
		);
	}
};
