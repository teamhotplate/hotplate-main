import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';

import './SearchForm.css';

class SearchForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchQuery: ""
    };
  }

  handleFormChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleFormSubmit = (event) => {
    event.preventDefault();
    const { searchQuery } = this.state;
    this.props.handleSearch(searchQuery);
  }

  render() {
    return (
      <div className="search-form">
        <form onSubmit={this.handleFormSubmit}>
          {/* <Row className="FormInputRow"> */}
            <Col s={12} className="input-field">
              <input 
                id="search-query"
                name="searchQuery"
                type="text"
                className="validate white-text specific"
                value={this.state.searchQuery}
                onChange={this.handleFormChange}
              />
              <label htmlFor="searchQuery specific">Find Templates</label>

              <button className="btn waves-effect waves-light" id="search-button" type="submit" name="action">Search
              <i className="material-icons right" />
              </button>
            </Col>
          {/* </Row> */}
        </form>
      </div>
    );
  }
}

export default SearchForm;