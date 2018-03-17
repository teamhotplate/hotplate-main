import axios from 'axios';
import React, { Component } from 'react';
import { Container, Row, Col } from 'react-materialize';

// Import pages 
import SearchForm from '../SearchForm';
import SearchResults from '../SearchResults';
import About from '../About';

// Import styles
import './SearchPage.css';
import '../../css/full-width.css';

class SearchPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      isOpen: false
    };
  }

  handleSearch = async (searchQuery) => {
    console.log(`Search page got query: ${searchQuery}`);
    const searchGetUrl = `/api/projects?s=${searchQuery}`;
    try {
      const response = await axios.get(searchGetUrl);
      const searchResults = response.data;
      this.setState({
        searchResults: searchResults
      });
    } catch(error) {
      console.error(error);
    }

    // toggles search results visibility
    this.setState({
      isOpen: !this.state.isOpen
    });
    console.log(this.state);
  }

  render() {
    return (
      <div className="background">
        <Container>
          <div className="full-width-bar search-theme">
            <Row>
              <Col s={12}>
                <SearchForm handleSearch={ this.handleSearch }/>
              </Col>
            </Row>
          <span className="">
            <Row>
              <Col s={12}>
                <SearchResults 
                  searchResults={ this.state.searchResults } 
                  show={ this.state.isOpen }
                />
              </Col>
            </Row>
          </span>
          </div>
          <div>
            <Row>
              <Col s={8}>
                <About />
              </Col>
            </Row>
          </div>
          <div id="search-page-background"></div>
        </Container>
      </div>
    );
  }
}

export default SearchPage;
