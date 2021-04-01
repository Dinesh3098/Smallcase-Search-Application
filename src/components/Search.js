import React from 'react';
import './Search.css'
import axios from 'axios';
import Loader from '../loader.gif'
import PageNavigation from './Navigation';
class Search extends  React.Component {
    
    constructor( props ) {
        super(props);
        this.state = {
            query:'',
            results:{},
            loading:false,
            message:'',
            totalResults: 0,
		    totalPages: 0,
		    currentPageNo: 0,
        };
        this.cancel ='';
    }

    
    getPagesCount = (total, denominator) => {
        const divisible = total % denominator === 0;
        const valueToBeAdded = divisible ? 0 : 1;
        return Math.floor(total / denominator) + valueToBeAdded;
    };

    fetchSearchResults = (updatedPageNo ='',query) => {
        const pageNumber = updatedPageNo ? `&page=${updatedPageNo}` : '';
        const per_page = 5;
        const searchUrl = `https://pixabay.com/api/?key=20960700-bcbf096c55fa7f24bcacd22d7&per_page=${per_page}&q=${query}${pageNumber}`;

        if (this.cancel) {
		// Cancel the previous request before making a new request
		this.cancel.cancel();
	}
	// Create a new CancelToken
	this.cancel = axios.CancelToken.source();	
    axios
		.get(searchUrl, {
			cancelToken: this.cancel.token,
		})
		.then((res) => {
            const total = res.data.total;
            const totalPagesCount = this.getPagesCount( total, 5 );
			const resultNotFoundMsg = !res.data.hits.length
				? 'There are no more search results. Please try a new search.' : '';			
                this.setState({
				results: res.data.hits,
				message: resultNotFoundMsg,
				loading: false,
                totalResults: res.data.total,
			    currentPageNo: updatedPageNo,
			    totalPages: totalPagesCount,
			});
		})
		.catch((error) => {
			if (axios.isCancel(error) || error) {
				this.setState({
					loading: false,
					message: 'Failed to fetch results.Please check network',
				});
			}
		});

    }

    HandleOnChange = (event) => {
        const query = event.target.value;

        if(!query){
            this.setState({ query, results: {}, message: '' } );
        } else{
            this.setState({query:query,loading:true,message:''},() =>{
                this.fetchSearchResults(1,query);
            });
        }
        
        
    };

    handlePageClick = ( type,event ) => {
		event.preventDefault();
		const updatePageNo = this.state.currentPageNo + 1;

		if( ! this.state.loading  ) {
			this.setState( { loading: true, message: '' }, () => {
				this.fetchSearchResults( updatePageNo, this.state.query );
			} );
		}
	};

    renderSearchResults = () => {
        const {results} = this.state;
        if (Object.keys(results).length && results.length) {
            return (
                <div className="results-container">
                    {results.map((result) => {
                        return (
                            <a key={result.id} href={result.previewURL} className="result-items">
                                <h6 className="image-username">{result.user}</h6>
                                <div className="image-wrapper">
                                    <img className="image" src={result.previewURL} alt={result.user}/>
                                </div>
                            </a>
                        );
                    })}
                </div>
            );
        }
    }
    
    render() {
        const {query,loading, message,totalPages,currentPageNo} = this.state;
        const showNextLink = totalPages > currentPageNo;
        return (
            <div className="container">
                {/*search*/}
                <label className="search">
                    <input 
                        type="text"
                        name = "query"
                        value={query}
                        id = "search-input"
                        placeholder = "Search...."
                        onChange = {this.HandleOnChange}
                    />
                    <i className="fa fa-search search-icon" aria-hidden="true" />

                </label>

                { message && <p className="message">{message}</p> }

                <img  src={Loader} className={`search-loading ${loading ? 'show' : 'hide' }`}  alt="loader"/>

                { this.renderSearchResults() }

                <PageNavigation
                    loading={loading}
                    showNextLink={showNextLink}
                    handleNextClick={ (event) => this.handlePageClick('next', event )}
                />
            </div>
            )
    }
}
export default Search;