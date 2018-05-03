// collections/meme/new

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
import { NewMemeForm } from '../../../../../forms';

import './style.css';

class CollectionsMemeNew extends Component {
	constructor(props) {
		super(props);

		this.state = {
			saving: false
		};

		this.handleSave = this.handleSave.bind(this);
		this.saveMeme = this.saveMeme.bind(this);
		this.linkMemeWithTags = this.linkMemeWithTags.bind(this);
	}
	
	saveMeme(meme) {
		const { firestore } = this.props;
		return firestore.add('memes', meme)
	} 

	linkMemeWithTags(memeId, tags) {
		return new Promise((resolve, reject) => {
			const { firestore } = this.props;

			const linkTagRequests = tags.map(tag => {
				return firestore.set(`/memes_tags/${memeId}_${tag}`, {
					memeId,
					tagId: tag
				});
			});

			Promise.all(linkTagRequests)
				.then(() => {
					resolve(memeId);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	linkMemeWithCountries(memeId, countries) {
		const { firestore } = this.props;

		const linkCountryRequests = countries.map(country => {
			return firestore.set(`/memes_countries/${memeId}_${country}`, {
				memeId,
				countryId: country
			});
		});

		return Promise.all(linkCountryRequests)
	}

	handleSave(meme) {
		console.log('>>>> here', meme);
		const { firestore, onSave } = this.props;

		meme.tags = meme.tags.map(tag => tag.value);
		meme.countries = meme.countries.map(countrie => countrie.value);

		const { tags, countries } = meme;

		this.setState({ saving: true });
		this.saveMeme(meme)
		.then((savedMeme) => {
			const savedMemeId = savedMeme._key.path.segments[1]
			return this.linkMemeWithTags(savedMemeId, tags);
		})
		.then((savedMemeId) => {
			return this.linkMemeWithCountries(savedMemeId, countries);
		})
		.then((result) => {
			this.setState({ saving: false });
			onSave();
		})
		.catch((error) => {
			this.setState({ saving: false });
			console.log('error saving meme:', error);
		});
	}

	render() {
		const { saving } = this.state;

		return (
			<div className="LunaAdmin-Content-Collections-Meme-New">
				<NewMemeForm 
					backLinkUrl="/admin/collections/meme"
					saving={saving}
					onSave={this.handleSave}
				/>
			</div>
		);
	}
}

export default CollectionsMemeNew;