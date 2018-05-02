// collections/gif/show

import React, { Component } from 'react';
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
import { UpdateGifForm } from '../../../../../forms';

import {
  isLoaded
} from 'react-redux-firebase'

import './style.css';

class CollectionsGifNew extends Component {
	constructor(props) {
		super(props);

		this.state = {
			saving: false
		};

		this.handleSave = this.handleSave.bind(this);
		this.saveGif = this.saveGif.bind(this);
		this.linkGifWithTags = this.linkGifWithTags.bind(this);
	}
	
	saveGif(gif) {
		const { firestore } = this.props;
		return firestore.add('gifs', gif)
	} linkGifWithTags(gifId, tags) {
		return new Promise((resolve, reject) => {
			const { firestore } = this.props;

			const linkTagRequests = tags.map(tag => {
				return firestore.set(`/gifs_tags/${gifId}_${tag}`, {
					gifId,
					tagId: tag
				});
			});

			Promise.all(linkTagRequests)
				.then(() => {
					resolve(gifId);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	linkGifWithCountries(gifId, countries) {
		const { firestore } = this.props;

		const linkCountryRequests = countries.map(country => {
			return firestore.set(`/gifs_countries/${gifId}_${country}`, {
				gifId,
				countryId: country
			});
		});

		return Promise.all(linkCountryRequests)
	}

	handleSave(gif) {
		const { firestore, onSave } = this.props;

		gif.tags = gif.tags.map(tag => tag.value);
		gif.countries = gif.countries.map(countrie => countrie.value);

		const { tags, countries } = gif;

		this.setState({ saving: true });
		this.saveGif(gif)
		.then((savedGif) => {
			const savedGifId = savedGif._key.path.segments[1]
			return this.linkGifWithTags(savedGifId, tags);
		})
		.then((savedGifId) => {
			return this.linkGifWithCountries(savedGifId, countries);
		})
		.then((result) => {
			this.setState({ saving: false });
			onSave();
		})
		.catch((error) => {
			this.setState({ saving: false });
			console.log('error saving gif:', error);
		});
	}

	render() {
		const { saving } = this.state;
		const { gif } = this.props;
		console.log('>>>>>??', gif);

		if (!isLoaded(gif)) {
			return (
				<div className="LunaAdmin-Content-Collections-Gif-New">
					<p>Loading </p>
				</div>
			);
		}

		return (
			<div className="LunaAdmin-Content-Collections-Gif-New">
				<UpdateGifForm 
					gif={gif}
					backLinkUrl="/admin/collections/gif"
					saving={saving}
					onSave={this.handleSave}
					editable={true}
				/>
			</div>
		);
	}
}

export default CollectionsGifNew;