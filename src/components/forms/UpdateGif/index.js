import React from 'react';
import GifForm from '../Gif/Container';

const UpdateGifForm = (props) => {
	const updatedProps = {
		...props,
		formTitle: 'Edit Gif'
	};

	return (
		<GifForm {...updatedProps} />
	);
};

export default UpdateGifForm;