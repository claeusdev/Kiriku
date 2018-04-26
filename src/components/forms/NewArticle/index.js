import React from 'react';
import ArticleForm from '../Article/Container';

const NewArticleForm = (props) => {
	const updatedProps = {
		...props,
		formTitle: 'New Article'
	};

	return (
		<ArticleForm {...updatedProps} />
	);
};

export default NewArticleForm;