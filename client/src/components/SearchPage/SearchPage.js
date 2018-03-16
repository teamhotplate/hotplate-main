import axios from 'axios';
import React, { Component } from 'react';
import { Container, Row, Col } from 'react-materialize';

import SearchForm from '../SearchForm';
import SearchResults from '../SearchResults';
import './SearchPage.css';

class SearchPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: []
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
  }

  render() {
    return (
      <div className="search-page theme">
        <Container>
          <Row>
            <Col s={12}>
              <SearchForm handleSearch={ this.handleSearch }/>
            </Col>
          </Row>
          <Row>
            <Col s={12}>
              <SearchResults searchResults={ this.state.searchResults } />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default SearchPage;