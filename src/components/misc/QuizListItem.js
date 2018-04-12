import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Label } from 'react-bootstrap';
import CheckIcon from 'react-icons/lib/fa/check-circle';

const QuizListItem = ({ id, author, image, title, summary, createdAt, postedAt }) => {
	const imageURL = image ? 
		`https://d1n92yndbf3pp5.cloudfront.net/fit-in/80x40/quiz-assets/${image}` :
		'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';

	const createdAtFromNow = moment(createdAt).fromNow();
	const status = postedAt ? 'published' : 'draft';
	return (
		<li className="quiz-item block-link">
			<Link className="block-link__overlay-link"to={`/dashboard/quizzes/${id}/edit?status=${status}`}></Link>
			<div className="quiz-image">
				<img src={imageURL} alt="quiz-thumbnail" />
			</div>
			<div className="quiz-details">
				<div className="top-line">
					<h4 className="quiz-title">{title}</h4>
					{!postedAt &&
						<Label bsStyle="default">Draft</Label>
					}
					{postedAt &&
						<span className="published-icon">
							<CheckIcon />
						</span>
					}
				</div>
				<div className="bottom-line">
					<span className="quiz-summary">{summary}</span>
					<span className="separator">&middot;</span>
					<span className="quiz-author"> {author.displayName || 'OMGVoice'}</span>
					<span className="separator">&middot;</span>
					<span className="quiz-creation-date">{createdAtFromNow}</span>
				</div>
			</div>
		</li>
	);
};

export default QuizListItem;