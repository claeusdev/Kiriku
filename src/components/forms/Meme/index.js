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
import BackIcon from 'react-icons/lib/ti/chevron-left';
import EditIcon from 'react-icons/lib/ti/edit';
import ArchiveIcon from 'react-icons/lib/ti/archive';
import { MovingEllipsis } from '../../misc/Ellipsis';

import { SingleImagePicker } from '../../misc/ImagePicker';

import ReactFilestack from 'filestack-react';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import './style.css';

const memeDefaults = {
	description: '',
	imageUrl: '',
	tags: [],
	countries: [],
	status: ''
};

const capitalizeFirstLetter = (word) => {
	return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`;
};

export default class MemeForm extends Component {
	constructor(props) {
		super(props);

		const { meme = memeDefaults } = props;

		const { 
			description,
			imageUrl,
			tags,
			countries,
			status
		} = meme;

		this.state = {
			description,
			descriptionState: null,
			imageUrl,
			imageUrlState: null,
			tags,
			tagsState: null,
			countries,
			countriesState: null,
			status,
			statusState: null,
			showStatusChangeForm: false
		};

		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.handleImageUrlChange = this.handleImageUrlChange.bind(this);
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
		const { meme = memeDefaults } = nextProps;

		let { tags, countries } = meme;
		const { 
			description,
			imageUrl,
			status
		} = meme;

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
			description,
			imageUrl,
			tags,
			countries,
			status
		});
	}

	handleDescriptionChange(e) {
		this.setState({ description: e.target.value });
	}

	handleImageUrlChange(imageUrl) {
		this.setState({ imageUrl });
	}

	handleTagsChange(tags) {
		this.setState({ tags });
	}

	handleCountriesChange(countries) {
		this.setState({ countries });
	}

	handleStatusChange(status) {
		let value = "";
		if (status) {
			value = status.value;
		}

		this.setState({ status: value });
	}

	showStatusChangeForm() {
		this.setState({ showStatusChangeForm: true });
	}

	hideStatusChangeForm() {
		this.setState({ showStatusChangeForm: false });
	}

	discardStatusChanges() {
		const { meme = memeDefaults } = this.props;
		const { status } = meme;
		this.setState({ status });
		this.hideStatusChangeForm();
	}

	saveAs(type) {
		const { 
			description,
			descriptionState,
			imageUrl,
			imageUrlState,
			tags,
			tagsState,
			countries,
			countriesState,
			status,
			statusState
		} = this.state;

		const formHasErrors = (
			descriptionState === 'error' ||
			imageUrlState === 'error' ||
			tagsState === 'error' ||
			countriesState === 'error' ||
			statusState === 'error'
		);

		if (formHasErrors) {
			return;
		}

		const now = new Date();

		const { onSave, auth, mode, meme } = this.props;
		const memeData = {
			description,
			imageUrl,
			tags,
			countries,
			status,
			lastUpdatedAt: now
		};

		if (mode === 'edit') {
			memeData['id'] = meme.id;
			memeData['author'] = meme.author;
			memeData['createdAt'] = meme.createdAt;
		}

		if (mode === 'new') {
			memeData['createdAt'] = now;
			memeData['author'] = auth.uid;
			memeData['status'] = type;
		}

		onSave(memeData);
	}

	validateForm(memeStatus) {
		const {
			description,
			imageUrl,
			tags,
			countries,
			status
		} = this.state;

		const newState = {
			descriptionState: null,
			imageUrlState: null,
			tagsState: null,
			countriesState: null,
			statusState: null
		};

		
		if (!description) {
			newState.descriptionState = 'error';
		}

		if (!imageUrl) {
			newState.imageUrlState = 'error';
		}

		if (tags.length === 0) {
			newState.tagsState = 'error';
		}

		if (countries.length === 0) {
			newState.countriesState = 'error';
		}

		if (!status) {
			newState.statusState = 'error';
		}

		this.setState(newState, () => {
			this.saveAs(memeStatus);
		});
	}

	render() {
		const { formTitle, onSave, saving, backLinkUrl, mode, editable = true } = this.props;
		let { tags: availableTags } = this.props;
		availableTags = isLoaded(availableTags) ? availableTags : [];
		availableTags = availableTags.map(tag => ({ label: tag.name, value: tag.id }));

		const {
			description,
			descriptionState,
			imageUrl,
			imageUrlState,
			tags,
			tagsState,
			countries,
			countriesState,
			status,
			statusState,
			showStatusChangeForm
		} = this.state;

		const saveMessage = (
			<span> <FlashIcon /> Save Meme</span>
		);

		const savingMessage = (
			<span> One Moment Please <MovingEllipsis /></span>
		);

		const saveButtonContent = saving ? savingMessage : saveMessage;
		return (
			<div className="Apollo-MemeForm">
				<div className="FormHeader">
					<h4 className="FormHeading">{formTitle}</h4>
					<Link className="FormBackLink" to={backLinkUrl}><BackIcon /> Back</Link>
				</div>
				<form className="NewMemeForm">
					<Row className="show-grid">
						<Col xs={12} md={8} className="NewMemeForm-Main">
							<FormGroup className="Form-InputGroup" validationState={descriptionState}>
								<ControlLabel>Add a Description</ControlLabel>
								<FormControl
									className="ApolloLogin-FormBox-Form-Input"
									type="text"
									value={description}
									placeholder="Add a description here"
									onChange={this.handleDescriptionChange}
									disabled={!editable}
								/>
								{descriptionState === 'error' &&
									<HelpBlock className="ApolloLogin-FormBox-Form-InputError">Please add a description</HelpBlock>
								}
							</FormGroup>

							<FormGroup className="Form-InputGroup" validationState={imageUrlState}>
								<ControlLabel>Add your meme image</ControlLabel>
								<SingleImagePicker previewUrl={imageUrl} onFileUpload={this.handleImageUrlChange} editable={editable} />
								{imageUrlState === 'error' &&
									<HelpBlock className="ApolloLogin-FormBox-Form-InputError">Please add a meme image</HelpBlock>
								}
							</FormGroup>
						</Col>
						<Col xs={6} md={4} className="NewMemeForm-Side">
							<FormGroup className="Form-InputGroup" validationState={tagsState}>
								<ControlLabel>Tag this meme</ControlLabel>
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
											<FormGroup className="Form-InputGroup" validationState={statusState}>
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
												{statusState === 'error' &&
													<HelpBlock className="ApolloLogin-FormBox-Form-InputError">Please select a status</HelpBlock>
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
