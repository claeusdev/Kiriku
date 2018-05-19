import React from 'react';
import GifForm from '../Gif/Container';

const NewGifForm = (props) => {
	const updatedProps = {
		...props,
		formTitle: 'New Gif',
		mode: 'new'
	};

	return (
		<GifForm {...updatedProps} />
	);
};

export default NewGifForm;