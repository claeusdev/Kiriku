import React from 'react';
import ArticleForm from '../Article/Container';

const NewArticleForm = (props) => {
	const updatedProps = {
		...props,
		formTitle: 'New Article',
		mode: 'new'
	};

	return (
		<ArticleForm {...updatedProps} />
	);
};

export default NewArticleForm;