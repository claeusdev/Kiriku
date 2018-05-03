import React from 'react';
import MemeForm from '../Meme/Container';

const NewMemeForm = (props) => {
	const updatedProps = {
		...props,
		formTitle: 'New Meme'
	};

	return (
		<MemeForm {...updatedProps} />
	);
};

export default NewMemeForm;