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

import ReactFilestack from 'filestack-react';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import './style.css';

const gifDefaults = {
	description: '',
	imageUrl: '',
	tags: [],
	countries: [],
	status: ''
};


export default class GifForm extends Component {
	constructor(props) {
		super(props);

		const { gif = gifDefaults } = props;

		const { 
			description,
			imageUrl,
			tags,
			countries,
			status
		} = gif;

		this.state = {
			description,
			descriptionState: null,
			imageUrl,
			imageUrlState: null,
			tags,
			tagsState: null,
			countries,
			countriesState: null,
			status
		};

		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.handleImageUrlChange = this.handleImageUrlChange.bind(this);
		this.handleTagsChange = this.handleTagsChange.bind(this);
		this.handleCountriesChange = this.handleCountriesChange.bind(this);
		this.saveAs = this.saveAs.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const { gif = gifDefaults } = nextProps;

		const { 
			description,
			imageUrl,
			tags,
			countries,
			status
		} = gif;

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

	saveAs(type) {
		const { 
			description,
			descriptionState,
			imageUrl,
			imageUrlState,
			tags,
			tagsState,
			countries,
			countriesState
		} = this.state;

		const formHasErrors = (
			descriptionState === 'error' ||
			imageUrlState === 'error' ||
			tagsState === 'error' ||
			countriesState === 'error'
		);

		if (formHasErrors) {
			console.log('vavoom');
			return;
		}


		const now = new Date();

		const { onSave, auth } = this.props;
		onSave({
			description,
			imageUrl,
			tags,
			countries,
			status: type,
			author: auth.uid,
			createdAt: now,
			lastUpdatedAt: now
		});
	}

	validateForm(gifStatus) {
		const {
			description,
			imageUrl,
			tags,
			countries
		} = this.state;

		const newState = {
			descriptionState: null,
			imageUrlState: null,
			tagsState: null,
			countriesState: null
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

		this.setState(newState, () => {
			this.saveAs(gifStatus);
		});
	}

	render() {
		const { formTitle, onSave, saving, backLinkUrl, editable = true } = this.props;
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
			status
		} = this.state;

		const saveMessage = (
			<span> <FlashIcon /> Save Gif</span>
		);

		const savingMessage = (
			<span> One Moment Please <MovingEllipsis /></span>
		);

		const saveButtonContent = saving ? savingMessage : saveMessage;
		return (
			<div className="Apollo-GifForm">
				<div className="FormHeader">
					<h4 className="FormHeading">{formTitle}</h4>
					<Link className="FormBackLink" to={backLinkUrl}><BackIcon /> Back</Link>
				</div>
				<form className="NewGifForm">
					<Row className="show-grid">
						<Col xs={12} md={8} className="NewGifForm-Main">
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
								<ControlLabel>Add your gif image</ControlLabel>
								<SingleImagePicker previewUrl={imageUrl} onFileUpload={this.handleImageUrlChange} editable={editable} />
								{imageUrlState === 'error' &&
									<HelpBlock className="ApolloLogin-FormBox-Form-InputError">Please add a gif image</HelpBlock>
								}
							</FormGroup>
						</Col>
						<Col xs={6} md={4} className="NewGifForm-Side">
							<FormGroup className="Form-InputGroup" validationState={tagsState}>
								<ControlLabel>Tag this gif</ControlLabel>
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
