import React from 'react';

export default ( props ) => {
	const {
		      loading,
		      showNextLink,
		      handleNextClick,
	      } = props;
	return (
		<div className="nav-link-container">
			<a
				href="#"
				className={
					`nav-link 
					${ showNextLink ? 'show' : 'hide'}
					${ loading ? 'greyed-out' : '' }
					`}
				onClick={ handleNextClick }
			>
				Load More
			</a>
		</div>
	)
}